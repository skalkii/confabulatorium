/**
 * Recompute signatures and retry safety review for dreams that didn't
 * finish their pipeline cleanly the first time.
 *
 * Sweeps three failure modes:
 *   1. signature is null  -> recompute against stored snippets
 *   2. is_reviewed = false -> rerun safety review
 *   3. search_snippets is empty AND --refresh-search passed -> retry
 *      DuckDuckGo (the original call likely hit DDG anti-bot) and,
 *      on success, replace stored snippets + recompute signature
 *
 * Usage:
 *   pnpm seed:backfill                   # signature + safety only
 *   pnpm seed:backfill --refresh-search  # also retry DDG for empty snippets
 *
 * Spacing 4s per dream when refreshing search to avoid re-tripping
 * DDG's rate limit.
 */
import { supabaseServer } from "@/lib/db/client";
import { updateDream } from "@/lib/db/dreams";
import { computeSignature } from "@/lib/signature/score";
import { reviewSafety } from "@/lib/safety";
import { webSearch } from "@/lib/search/duckduckgo";
import type { Dream } from "@/lib/db/types";

const REFRESH_SEARCH = process.argv.includes("--refresh-search");
const SEARCH_SPACING_MS = 4000;

async function listPending(): Promise<Dream[]> {
  const orFilter = REFRESH_SEARCH
    ? "signature.is.null,is_reviewed.eq.false,search_snippets.eq.[]"
    : "signature.is.null,is_reviewed.eq.false";

  const { data, error } = await supabaseServer()
    .from("dreams")
    .select("*")
    .or(orFilter)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as Dream[]) ?? [];
}

async function main(): Promise<void> {
  const dreams = await listPending();
  console.log(
    `Found ${dreams.length} dreams needing backfill.` +
      (REFRESH_SEARCH ? " [refresh-search enabled]" : "") +
      "\n",
  );

  for (let i = 0; i < dreams.length; i++) {
    const d = dreams[i]!;
    process.stdout.write(`[${i + 1}/${dreams.length}] ${d.fragment}\n`);

    const patch: Partial<Dream> = {};
    let snippets = d.search_snippets ?? [];

    if (REFRESH_SEARCH && snippets.length === 0) {
      const search = await webSearch(d.fragment, { count: 5 });
      if (search.ok && search.snippets.length > 0) {
        snippets = search.snippets;
        patch.search_snippets = snippets;
        console.log(`  search refresh -> ${snippets.length} snippets`);
        // Force signature recompute now that snippets are fresh
        if (d.signature !== null) {
          (d as Dream).signature = null;
        }
      } else {
        console.log(
          `  search refresh -> ${search.ok ? "no results" : `error: ${search.error}`}`,
        );
      }
    }

    if (d.signature === null) {
      try {
        const sig = await computeSignature(d.confabulation, snippets);
        patch.signature = sig.score;
        patch.signature_explanation = sig.interpretation;
        console.log(
          `  signature -> ${sig.score.toFixed(2)} (${sig.groundedClaims}/${sig.totalClaims} grounded)`,
        );
      } catch (err) {
        console.error(
          `  signature ERROR: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    if (!d.is_reviewed) {
      try {
        const safety = await reviewSafety(d.fragment, d.confabulation);
        patch.is_reviewed = safety.approved;
        patch.safety_score = safety.score;
        console.log(
          `  safety -> score=${safety.score} approved=${safety.approved}`,
        );
      } catch (err) {
        console.error(
          `  safety ERROR: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    if (Object.keys(patch).length > 0) {
      await updateDream(d.id, patch);
    }

    if (REFRESH_SEARCH && i < dreams.length - 1) {
      await new Promise((r) => setTimeout(r, SEARCH_SPACING_MS));
    }
  }

  console.log("\nDone.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
