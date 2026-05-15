import { geminiGenerate } from "@/lib/llm/gemini";
import { groqGenerate } from "@/lib/llm/groq";
import { hasGemini, hasGroq } from "@/lib/env";
import { LLMError, type LLMRequest, type LLMResult } from "@/lib/llm/types";

export { LLMError } from "@/lib/llm/types";
export type { LLMRequest, LLMResult } from "@/lib/llm/types";

/**
 * Try Gemini first; fall back to Groq on quota or unknown errors.
 * Safety blocks are NOT retried — they bubble so the caller can show a
 * curated refusal message instead of swapping models endlessly.
 */
export async function llmGenerate(req: LLMRequest): Promise<LLMResult> {
  const providers: Array<{ name: string; available: boolean; fn: (r: LLMRequest) => Promise<LLMResult> }> = [
    { name: "gemini", available: hasGemini(), fn: geminiGenerate },
    { name: "groq", available: hasGroq(), fn: groqGenerate },
  ];

  const tried: string[] = [];
  let lastErr: LLMError | undefined;

  for (const p of providers) {
    if (!p.available) continue;
    try {
      return await p.fn(req);
    } catch (err) {
      const e = err instanceof LLMError ? err : new LLMError("unknown", String(err), err);
      tried.push(`${p.name}:${e.code}`);
      lastErr = e;
      if (e.code === "safety") throw e;
    }
  }

  if (!lastErr) {
    throw new LLMError("missing_key", "No LLM provider configured");
  }
  throw new LLMError(lastErr.code, `All providers failed [${tried.join(", ")}]`, lastErr);
}
