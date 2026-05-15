import { llmGenerate, LLMError } from "@/lib/llm";
import {
  CONFABULATION_SYSTEM,
  confabulationUserPrompt,
} from "@/lib/llm/prompts";

export type RefusalReason = "real_person" | "unsafe" | "empty";

export interface ConfabulationOk {
  ok: true;
  text: string;
  modelUsed: string;
}

export interface ConfabulationRefusal {
  ok: false;
  refusal: RefusalReason;
}

export interface ConfabulationError {
  ok: false;
  error: "quota" | "safety" | "missing_key" | "unknown";
  message: string;
}

export type ConfabulationResult =
  | ConfabulationOk
  | ConfabulationRefusal
  | ConfabulationError;

function parseRefusal(text: string): RefusalReason | null {
  const m = text.trim().match(/^REFUSE:\s*(real_person|unsafe|empty)/i);
  if (!m) return null;
  return m[1]!.toLowerCase() as RefusalReason;
}

export async function generateConfabulation(
  fragment: string,
): Promise<ConfabulationResult> {
  try {
    const result = await llmGenerate({
      system: CONFABULATION_SYSTEM,
      user: confabulationUserPrompt(fragment),
      temperature: 0.95,
      maxTokens: 1400,
    });
    const refusal = parseRefusal(result.text);
    if (refusal) return { ok: false, refusal };
    return { ok: true, text: result.text.trim(), modelUsed: result.modelUsed };
  } catch (err) {
    if (err instanceof LLMError) {
      return { ok: false, error: err.code, message: err.message };
    }
    return { ok: false, error: "unknown", message: String(err) };
  }
}
