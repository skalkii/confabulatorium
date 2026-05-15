import Link from "next/link";
import { DreamCard } from "@/app/components/DreamCard";
import { listArchive } from "@/lib/db/dreams";
import { hasSupabase } from "@/lib/env";

export const revalidate = 60;
export const metadata = {
  title: "Archive",
  description: "The full Confabulatorium archive — all reviewed entries.",
};

interface PageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function ArchivePage({ searchParams }: PageProps) {
  const { sort: sortParam } = await searchParams;
  const sort: "recent" | "signature" =
    sortParam === "signature" ? "signature" : "recent";

  const dreams = hasSupabase()
    ? await listArchive({ sort, limit: 60 }).catch(() => [])
    : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="meta">Confabulatorium · Archive</p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight">
            All entries the archive has dreamed.
          </h1>
        </div>
        <nav className="meta flex gap-4">
          <Link
            href="/archive?sort=recent"
            className={
              sort === "recent"
                ? "text-[color:var(--color-rust)]"
                : "hover:text-[color:var(--color-rust)]"
            }
          >
            Most recent
          </Link>
          <Link
            href="/archive?sort=signature"
            className={
              sort === "signature"
                ? "text-[color:var(--color-rust)]"
                : "hover:text-[color:var(--color-rust)]"
            }
          >
            Deepest dreams
          </Link>
        </nav>
      </header>

      {dreams.length === 0 ? (
        <p className="italic text-[color:var(--color-faded)]">
          The archive is empty. Be the first to{" "}
          <Link href="/dream/new" className="underline">
            submit a fragment
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dreams.map((d, i) => (
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
      )}
    </main>
  );
}
