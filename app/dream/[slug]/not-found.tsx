import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-20 md:px-6 md:py-24">
      <p className="meta mb-6">Confabulatorium · 404</p>
      <h1 className="font-serif text-h1 tracking-tight lg:text-[2.75rem]">
        No such dream is in the archive.
      </h1>
      <p className="mt-4 text-body italic text-faded">
        The catalogue card you sought is either filed elsewhere, awaiting
        review, or was never written.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/dream/new"
          className="meta border border-ink bg-ink px-5 py-3 text-center text-parchment hover:border-rust hover:bg-rust"
        >
          Submit a fragment
        </Link>
        <Link
          href="/archive"
          className="meta border border-rule px-5 py-3 text-center hover:border-ink"
        >
          Browse the archive
        </Link>
      </div>
    </main>
  );
}
