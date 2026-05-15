import Link from "next/link";
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
    <main className="mx-auto max-w-5xl px-6 py-20">
      <section className="max-w-3xl">
        <p className="meta mb-6">Confabulatorium · est. 2026</p>
        <h1 className="font-serif text-5xl leading-[1.1] tracking-tight md:text-6xl">
          An archive of what the machine remembers that never happened.
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-[color:var(--color-faded)]">
          The standard framing of LLM hallucination is a bug. This is a different
          framing. Hallucination is the closest functional analog to dreaming any
          AI system currently has — coherent narrative, generated from internal
          patterns, untethered from reality-tracking. Submit a fragment. The
          archive will dream around it, and show you what the waking world
          remembers in its place.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/dream/new"
            className="meta border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] px-6 py-3 text-[color:var(--color-parchment)] hover:bg-[color:var(--color-rust)] hover:border-[color:var(--color-rust)]"
          >
            Submit a fragment
          </Link>
          <Link
            href="/archive"
            className="meta border border-[color:var(--color-rule)] px-6 py-3 hover:border-[color:var(--color-ink)]"
          >
            Browse the archive
          </Link>
        </div>
      </section>

      {hero.length > 0 ? (
        <section className="mt-24">
          <h2 className="meta mb-6">From the archive</h2>
          <div className="grid gap-6 md:grid-cols-3">
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
