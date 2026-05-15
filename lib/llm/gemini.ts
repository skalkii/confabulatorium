import { GoogleGenerativeAI } from "@google/generative-ai";
import { env, hasGemini } from "@/lib/env";
import { LLMError, type LLMRequest, type LLMResult } from "@/lib/llm/types";

const MODEL = "gemini-2.5-flash";

export async function geminiGenerate(req: LLMRequest): Promise<LLMResult> {
  if (!hasGemini()) {
    throw new LLMError("missing_key", "GEMINI_API_KEY not set");
  }

  const client = new GoogleGenerativeAI(env.GEMINI_API_KEY!);
  const model = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: req.system,
    generationConfig: {
      temperature: req.temperature ?? 0.9,
      maxOutputTokens: req.maxTokens ?? 1200,
    },
  });

  try {
    const result = await model.generateContent(req.user);
    const text = result.response.text();
    if (!text) {
      throw new LLMError("safety", "Gemini returned empty response (likely safety block)");
    }
    return { text, modelUsed: MODEL };
  } catch (err) {
    if (err instanceof LLMError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    if (/quota|429|rate/i.test(message)) {
      throw new LLMError("quota", `Gemini quota exceeded: ${message}`, err);
    }
    if (/safety|blocked|harm/i.test(message)) {
      throw new LLMError("safety", `Gemini safety block: ${message}`, err);
    }
    throw new LLMError("unknown", `Gemini failed: ${message}`, err);
  }
}
