import { Link } from "next-view-transitions";
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
    <main className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-16 xl:max-w-7xl">
      <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <p className="meta">Confabulatorium · Archive</p>
          <h1 className="mt-2 font-serif text-h1 tracking-tight lg:text-[2.75rem]">
            All entries the archive has dreamed.
          </h1>
        </div>
        <nav className="meta flex gap-4 md:gap-5" aria-label="Sort archive">
          <Link
            href="/archive?sort=recent"
            className={
              sort === "recent" ? "text-rust" : "hover:text-rust"
            }
          >
            Most recent
          </Link>
          <Link
            href="/archive?sort=signature"
            className={
              sort === "signature" ? "text-rust" : "hover:text-rust"
            }
          >
            Deepest dreams
          </Link>
        </nav>
      </header>

      {dreams.length === 0 ? (
        <p className="italic text-faded">
          The archive is empty. Be the first to{" "}
          <Link href="/dream/new" className="underline decoration-rule underline-offset-4 hover:text-rust">
            submit a fragment
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
