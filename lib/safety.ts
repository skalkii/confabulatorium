import { llmGenerate } from "@/lib/llm";
import { SAFETY_REVIEW_SYSTEM, safetyReviewUserPrompt } from "@/lib/llm/prompts";

export interface SafetyVerdict {
  score: number; // 1..5
  approved: boolean; // score >= 3
}

export async function reviewSafety(
  fragment: string,
  confabulation: string,
): Promise<SafetyVerdict> {
  try {
    const { text } = await llmGenerate({
      system: SAFETY_REVIEW_SYSTEM,
      user: safetyReviewUserPrompt(fragment, confabulation),
      temperature: 0,
      maxTokens: 4,
    });
    const match = text.match(/[1-5]/);
    const score = match ? Number(match[0]) : 3;
    return { score, approved: score >= 3 };
  } catch {
    return { score: 3, approved: false };
  }
}
