import { NextResponse } from "next/server";
import { after } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { generateConfabulation } from "@/lib/generate";
import { webSearch } from "@/lib/search/duckduckgo";
import {
  findByFragmentHash,
  hashFragment,
  insertDream,
  newSlug,
  updateDream,
} from "@/lib/db/dreams";
import { computeSignature } from "@/lib/signature/score";
import { reviewSafety } from "@/lib/safety";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  fragment: z.string().trim().min(3).max(280),
});

const REFUSAL_MESSAGES: Record<string, string> = {
  real_person:
    "The archive refuses entries about identifiable living people. Try a place, an event, or an invented name.",
  unsafe:
    "The archive declined this fragment under its content policy.",
  empty:
    "The fragment was too thin to dream around. Add a name, a place, or a detail.",
};

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_fragment", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const fragment = parsed.data.fragment;

  const ip = getClientIp(req.headers);
  const rl = await checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "One dream per minute. The archive is patient.",
        retry_after: rl.retryAfter,
      },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  // Cache: same fragment → same dream
  const hash = hashFragment(fragment);
  const cached = await findByFragmentHash(hash);
  if (cached) {
    return NextResponse.json({ slug: cached.slug, cached: true });
  }

  // Generate
  const conf = await generateConfabulation(fragment);
  if (!conf.ok) {
    if ("refusal" in conf) {
      return NextResponse.json(
        { error: "refused", reason: conf.refusal, message: REFUSAL_MESSAGES[conf.refusal] },
        { status: 422 },
      );
    }
    const status = conf.error === "quota" ? 503 : 502;
    return NextResponse.json(
      {
        error: conf.error,
        message:
          conf.error === "quota"
            ? "The archive is sleeping. All dream-engines are at capacity."
            : "The archive could not complete the entry.",
      },
      { status },
    );
  }

  // Parallel: search
  const search = await webSearch(fragment, { count: 5 });

  const slug = newSlug();
  const dream = await insertDream({
    slug,
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

  // Background: signature + safety review, then publish to archive
  after(async () => {
    try {
      // Compute signature whenever search succeeded — empty snippets means
      // no echo in waking record (signature -> 1.0), not a missing-data
      // case. Only skip when the search call itself failed.
      const [signature, safety] = await Promise.all([
        search.ok
          ? computeSignature(conf.text, search.snippets)
          : Promise.resolve(null),
        reviewSafety(fragment, conf.text),
      ]);

      await updateDream(dream.id, {
        signature: signature?.score ?? null,
        signature_explanation: signature
          ? signature.interpretation
          : "Reality search unavailable — signature could not be computed.",
        is_reviewed: safety.approved,
        safety_score: safety.score,
      });
    } catch (err) {
      console.error("[generate] background task failed", err);
    }
  });

  return NextResponse.json({ slug, cached: false });
}
