import { Link } from "next-view-transitions";
import { DreamCard } from "./components/DreamCard";
import { listArchive } from "@/lib/db/dreams";
import { hasSupabase } from "@/lib/env";
import type { Dream } from "@/lib/db/types";

export const revalidate = 120;

async function getHeroDreams(): Promise<Dream[]> {
  if (!hasSupabase()) return [];
  try {
    return await listArchive({ sort: "signature", limit: 3 });
  } catch (err) {
    console.error("[landing] listArchive failed", err);
    return [];
  }
}

export default async function LandingPage() {
  const hero = await getHeroDreams();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-20 lg:py-24 xl:max-w-7xl">
      <section className="max-w-3xl">
        <p className="meta mb-6">Confabulatorium · est. 2026</p>
        <h1 className="text-display font-serif">
          An archive of what the machine remembers that never happened.
        </h1>
        <p className="mt-8 text-body leading-relaxed text-faded md:mt-10">
          The standard framing of LLM hallucination is a bug. This is a
          different framing. Hallucination is the closest functional analog to
          dreaming any AI system currently has &mdash; coherent narrative,
          generated from internal patterns, untethered from reality-tracking.
          Submit a fragment. The archive will dream around it, and show you
          what the waking world remembers in its place.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link
            href="/dream/new"
            className="meta border border-ink bg-ink px-6 py-3 text-center text-parchment hover:border-rust hover:bg-rust"
          >
            Submit a fragment
          </Link>
          <Link
            href="/archive"
            className="meta border border-rule px-6 py-3 text-center hover:border-ink"
          >
            Browse the archive
          </Link>
        </div>
      </section>

      {hero.length > 0 ? (
        <section className="mt-20 md:mt-28">
          <h2 className="meta mb-6">From the archive</h2>
          <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {hero.map((d, i) => (
              <DreamCard
                key={d.slug}
                slug={d.slug}
                fragment={d.fragment}
                preview={d.confabulation.slice(0, 220)}
                signature={d.signature}
                createdAt={d.created_at}
                catalogueNo={i + 1}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
