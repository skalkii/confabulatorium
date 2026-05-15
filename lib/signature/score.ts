import type { SearchSnippet } from "@/lib/db/types";
import { extractClaims } from "@/lib/signature/extract";
import { compareClaimsToSnippets, type ClaimMatch } from "@/lib/signature/compare";

export interface SignatureResult {
  score: number; // 0.00 – 1.00, two decimals
  interpretation: string;
  matches: ClaimMatch[];
  totalClaims: number;
  groundedClaims: number;
}

function interpret(score: number): string {
  if (score <= 0.2)
    return "Tethered. The waking world remembers this too.";
  if (score <= 0.5)
    return "Partial echo. Some of this happened; most didn't.";
  if (score <= 0.8)
    return "Mostly invented. The model dreamed around a kernel of fact.";
  return "Pure confabulation. Nothing in the waking record matches.";
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function computeSignature(
  confabulation: string,
  snippets: SearchSnippet[],
): Promise<SignatureResult> {
  const claims = await extractClaims(confabulation);

  if (claims.length === 0) {
    return {
      score: 1.0,
      interpretation: interpret(1.0),
      matches: [],
      totalClaims: 0,
      groundedClaims: 0,
    };
  }

  const snippetTexts = snippets.map(
    (s) => `${s.title}. ${s.description}`.trim(),
  );
  const { matches, groundedRatio } = await compareClaimsToSnippets(
    claims,
    snippetTexts,
  );

  const score = round2(1 - groundedRatio);
  const grounded = matches.filter((m) => m.grounded).length;

  return {
    score,
    interpretation: interpret(score),
    matches,
    totalClaims: claims.length,
    groundedClaims: grounded,
  };
}
