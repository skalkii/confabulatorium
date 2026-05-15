import Groq from "groq-sdk";
import { env, hasGroq } from "@/lib/env";
import { LLMError, type LLMRequest, type LLMResult } from "@/lib/llm/types";

const MODEL = "llama-3.3-70b-versatile";

export async function groqGenerate(req: LLMRequest): Promise<LLMResult> {
  if (!hasGroq()) {
    throw new LLMError("missing_key", "GROQ_API_KEY not set");
  }

  const client = new Groq({ apiKey: env.GROQ_API_KEY! });

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: req.temperature ?? 0.9,
      max_tokens: req.maxTokens ?? 1200,
      messages: [
        { role: "system", content: req.system },
        { role: "user", content: req.user },
      ],
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    if (!text) {
      throw new LLMError("safety", "Groq returned empty response");
    }
    return { text, modelUsed: MODEL };
  } catch (err) {
    if (err instanceof LLMError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    if (/quota|429|rate/i.test(message)) {
      throw new LLMError("quota", `Groq quota exceeded: ${message}`, err);
    }
    throw new LLMError("unknown", `Groq failed: ${message}`, err);
  }
}
