/**
 * Recompute signatures for dreams currently stored with signature=null.
 *
 * Common cause: an earlier version of the pipeline skipped signature
 * compute when search returned zero snippets. With the fix in place,
 * zero snippets correctly resolves to signature 1.0 (no echo).
 *
 * Usage:
 *   pnpm seed:backfill
 */
import { supabaseServer } from "@/lib/db/client";
import { updateDream } from "@/lib/db/dreams";
import { computeSignature } from "@/lib/signature/score";
import { reviewSafety } from "@/lib/safety";
import type { Dream } from "@/lib/db/types";

async function listPending(): Promise<Dream[]> {
  // signature=null OR is_reviewed=false — both are recovery cases.
  const { data, error } = await supabaseServer()
    .from("dreams")
    .select("*")
    .or("signature.is.null,is_reviewed.eq.false")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as Dream[]) ?? [];
}

async function main(): Promise<void> {
  const dreams = await listPending();
  console.log(`Found ${dreams.length} dreams needing backfill.\n`);

  for (let i = 0; i < dreams.length; i++) {
    const d = dreams[i]!;
    process.stdout.write(`[${i + 1}/${dreams.length}] ${d.fragment}\n`);

    const patch: Partial<Dream> = {};

    if (d.signature === null) {
      try {
        const sig = await computeSignature(d.confabulation, d.search_snippets ?? []);
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
  }

  console.log("\nDone.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
