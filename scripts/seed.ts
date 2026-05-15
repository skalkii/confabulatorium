/**
 * Seed the public archive by running the full generation pipeline
 * directly against Supabase — no dev server, no rate limit.
 *
 * Usage:
 *   pnpm seed
 *   # or:
 *   node --env-file=.env.local --import tsx scripts/seed.ts
 *
 * Same-fragment cache means rerunning is idempotent.
 */
import { FRAGMENTS } from "./seed-fragments";
import { generateConfabulation } from "@/lib/generate";
import { webSearch } from "@/lib/search/duckduckgo";
import { computeSignature } from "@/lib/signature/score";
import { reviewSafety } from "@/lib/safety";
import {
  findByFragmentHash,
  hashFragment,
  insertDream,
  newSlug,
  updateDream,
} from "@/lib/db/dreams";

const SPACING_MS = 7000;

interface Summary {
  fragment: string;
  status: "cached" | "seeded" | "skipped" | "error";
  slug?: string;
  signature?: number | null;
  safety?: number;
  detail?: string;
}

async function seedOne(fragment: string): Promise<Summary> {
  const hash = hashFragment(fragment);
  const cached = await findByFragmentHash(hash);
  if (cached) {
    return {
      fragment,
      status: "cached",
      slug: cached.slug,
      signature: cached.signature,
      safety: cached.safety_score ?? undefined,
    };
  }

  const conf = await generateConfabulation(fragment);
  if (!conf.ok) {
    return {
      fragment,
      status: "skipped",
      detail:
        "refusal" in conf ? `refused:${conf.refusal}` : `error:${conf.error}`,
    };
  }

  const search = await webSearch(fragment, { count: 5 });

  const inserted = await insertDream({
    slug: newSlug(),
    fragment,
    fragment_hash: hash,
    confabulation: conf.text,
    metadata: null,
    search_snippets: search.snippets,
    signature: null,
    signature_explanation: search.ok ? null : "Reality search unavailable.",
    model_used: conf.modelUsed,
    is_public: true,
    is_reviewed: false,
    safety_score: null,
  });

  // Compute signature whenever search succeeded — empty snippets means
  // no echo in waking record, which is a real signal (signature -> 1.0),
  // not a missing-data case. Only skip when the search itself failed.
  const [sig, safety] = await Promise.all([
    search.ok
      ? computeSignature(conf.text, search.snippets).catch(() => null)
      : Promise.resolve(null),
    reviewSafety(fragment, conf.text),
  ]);

  await updateDream(inserted.id, {
    signature: sig?.score ?? null,
    signature_explanation: sig
      ? sig.interpretation
      : "Reality search unavailable — signature could not be computed.",
    is_reviewed: safety.approved,
    safety_score: safety.score,
  });

  return {
    fragment,
    status: "seeded",
    slug: inserted.slug,
    signature: sig?.score ?? null,
    safety: safety.score,
  };
}

async function main(): Promise<void> {
  console.log(`Seeding ${FRAGMENTS.length} fragments...\n`);

  const results: Summary[] = [];
  for (let i = 0; i < FRAGMENTS.length; i++) {
    const fragment = FRAGMENTS[i]!;
    process.stdout.write(`[${i + 1}/${FRAGMENTS.length}] ${fragment}\n`);
    try {
      const r = await seedOne(fragment);
      results.push(r);
      const sig = r.signature === null || r.signature === undefined
        ? "n/a"
        : r.signature.toFixed(2);
      console.log(
        `  -> ${r.status}` +
          (r.slug ? ` slug=${r.slug}` : "") +
          ` sig=${sig}` +
          (r.safety ? ` safety=${r.safety}` : "") +
          (r.detail ? ` ${r.detail}` : ""),
      );
    } catch (err) {
      console.error(`  ERROR: ${err instanceof Error ? err.message : err}`);
      results.push({
        fragment,
        status: "error",
        detail: err instanceof Error ? err.message : String(err),
      });
    }

    if (i < FRAGMENTS.length - 1) {
      await new Promise((r) => setTimeout(r, SPACING_MS));
    }
  }

  console.log("\n=== Summary ===");
  const counts = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  for (const [k, v] of Object.entries(counts)) {
    console.log(`${k}: ${v}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
