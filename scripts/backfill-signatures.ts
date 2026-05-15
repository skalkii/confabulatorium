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
import type { Dream } from "@/lib/db/types";

async function listNullSignatures(): Promise<Dream[]> {
  const { data, error } = await supabaseServer()
    .from("dreams")
    .select("*")
    .is("signature", null)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as Dream[]) ?? [];
}

async function main(): Promise<void> {
  const dreams = await listNullSignatures();
  console.log(`Found ${dreams.length} dreams with signature=null.\n`);

  for (let i = 0; i < dreams.length; i++) {
    const d = dreams[i]!;
    const snippets = d.search_snippets ?? [];
    process.stdout.write(`[${i + 1}/${dreams.length}] ${d.fragment}\n`);
    try {
      const sig = await computeSignature(d.confabulation, snippets);
      await updateDream(d.id, {
        signature: sig.score,
        signature_explanation: sig.interpretation,
      });
      console.log(
        `  -> sig=${sig.score.toFixed(2)} (${sig.groundedClaims}/${sig.totalClaims} grounded)`,
      );
    } catch (err) {
      console.error(
        `  ERROR: ${err instanceof Error ? err.message : String(err)}`,
      );
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
