import { NextResponse } from "next/server";
import { z } from "zod";
import { findBySlug, updateDream } from "@/lib/db/dreams";
import { computeSignature } from "@/lib/signature/score";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  slug: z.string().min(1).max(32),
});

/**
 * Manual recompute endpoint — useful for seed entries and debugging.
 * The /api/generate route already kicks off signature compute in the
 * background; this is the synchronous override.
 */
export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
  }

  const dream = await findBySlug(parsed.data.slug);
  if (!dream) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const snippets = dream.search_snippets ?? [];
  if (snippets.length === 0) {
    return NextResponse.json(
      { error: "no_snippets", message: "No reality data to compare against." },
      { status: 422 },
    );
  }

  const signature = await computeSignature(dream.confabulation, snippets);

  const updated = await updateDream(dream.id, {
    signature: signature.score,
    signature_explanation: signature.interpretation,
  });

  return NextResponse.json({
    slug: updated.slug,
    signature: updated.signature,
    interpretation: updated.signature_explanation,
    grounded_claims: signature.groundedClaims,
    total_claims: signature.totalClaims,
  });
}
