// @huggingface/transformers's pipeline() type is a deep tagged union that
// blows up TS inference (TS2590) when referenced from a wrapper module.
// We require it dynamically and treat it as a loose callable — the runtime
// behavior is unchanged and the function shape is stable across 3.x.
type Tensor = { tolist(): number[][] };
type Extractor = (
  texts: string[],
  opts: { pooling: "mean"; normalize: boolean },
) => Promise<Tensor>;

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";

let extractorPromise: Promise<Extractor> | null = null;

async function getExtractor(): Promise<Extractor> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const mod = await import("@huggingface/transformers");
      return (await mod.pipeline("feature-extraction", MODEL_ID, {
        dtype: "fp32",
      })) as unknown as Extractor;
    })();
  }
  return extractorPromise;
}

async function embed(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const extractor = await getExtractor();
  const output = await extractor(texts, { pooling: "mean", normalize: true });
  return output.tolist();
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot; // vectors are pre-normalized → cosine = dot product
}

export interface ClaimMatch {
  claim: string;
  bestScore: number;
  grounded: boolean;
}

export interface CompareResult {
  matches: ClaimMatch[];
  /** Proportion of claims with at least one snippet match above threshold */
  groundedRatio: number;
}

/**
 * For each claim, find the highest cosine similarity against any snippet.
 * threshold default 0.7 per spec section 5.
 */
export async function compareClaimsToSnippets(
  claims: string[],
  snippets: string[],
  { threshold = 0.7 }: { threshold?: number } = {},
): Promise<CompareResult> {
  if (claims.length === 0) {
    return { matches: [], groundedRatio: 0 };
  }
  if (snippets.length === 0) {
    return {
      matches: claims.map((c) => ({ claim: c, bestScore: 0, grounded: false })),
      groundedRatio: 0,
    };
  }

  const [claimEmbs, snippetEmbs] = await Promise.all([
    embed(claims),
    embed(snippets),
  ]);

  const matches: ClaimMatch[] = claimEmbs.map((ce, i) => {
    let best = 0;
    for (const se of snippetEmbs) {
      const score = cosine(ce, se);
      if (score > best) best = score;
    }
    return { claim: claims[i], bestScore: best, grounded: best >= threshold };
  });

  const groundedCount = matches.filter((m) => m.grounded).length;
  return { matches, groundedRatio: groundedCount / matches.length };
}
