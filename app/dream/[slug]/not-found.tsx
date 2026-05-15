import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <p className="meta mb-6">Confabulatorium · 404</p>
      <h1 className="font-serif text-4xl tracking-tight">
        No such dream is in the archive.
      </h1>
      <p className="mt-4 text-lg italic text-[color:var(--color-faded)]">
        The catalogue card you sought is either filed elsewhere, awaiting
        review, or was never written.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/dream/new"
          className="meta border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] px-5 py-3 text-[color:var(--color-parchment)] hover:bg-[color:var(--color-rust)] hover:border-[color:var(--color-rust)]"
        >
          Submit a fragment
        </Link>
        <Link
          href="/archive"
          className="meta border border-[color:var(--color-rule)] px-5 py-3 hover:border-[color:var(--color-ink)]"
        >
          Browse the archive
        </Link>
      </div>
    </main>
  );
}
