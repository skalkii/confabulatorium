import { llmGenerate } from "@/lib/llm";
import {
  CLAIM_EXTRACTION_SYSTEM,
  claimExtractionUserPrompt,
} from "@/lib/llm/prompts";

/**
 * Strip a leading ```json fence or any surrounding non-array text.
 */
function stripFences(raw: string): string {
  const trimmed = raw.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence?.[1]) return fence[1].trim();
  return trimmed;
}

/**
 * Parse the LLM output as a JSON array of strings. Tolerant to:
 * - trailing prose
 * - markdown fences
 * - mixed array of objects (extracts the first string-valued field)
 */
function parseClaims(raw: string): string[] {
  const text = stripFences(raw);

  const first = text.indexOf("[");
  const last = text.lastIndexOf("]");
  if (first === -1 || last === -1 || last <= first) return [];

  try {
    const parsed = JSON.parse(text.slice(first, last + 1));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          const firstString = Object.values(item).find(
            (v) => typeof v === "string",
          );
          return typeof firstString === "string" ? firstString.trim() : "";
        }
        return "";
      })
      .filter((s) => s.length > 0);
  } catch {
    return [];
  }
}

export async function extractClaims(confabulation: string): Promise<string[]> {
  const result = await llmGenerate({
    system: CLAIM_EXTRACTION_SYSTEM,
    user: claimExtractionUserPrompt(confabulation),
    temperature: 0.1,
    maxTokens: 800,
  });
  return parseClaims(result.text);
}
