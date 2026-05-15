import type { Dream } from "@/lib/db/types";
import { SignatureBadge } from "./SignatureBadge";

interface Props {
  dream: Dream;
  catalogueNo?: number;
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function DreamEntry({ dream, catalogueNo }: Props) {
  const snippets = dream.search_snippets ?? [];

  return (
    <article className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-14 lg:py-20 xl:max-w-7xl">
      <header className="mb-10 border-b border-rule pb-8 md:mb-14">
        <p className="meta tnum">
          Catalogue · {String(catalogueNo ?? 0).padStart(4, "0")} · Accessioned{" "}
          {fmtDate(dream.created_at)}
        </p>
        <h1 className="mt-4 font-serif text-h1 tracking-tight lg:text-[2.75rem]">
          {dream.fragment}
        </h1>
      </header>

      <div className="grid gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <section aria-label="The Confabulation">
          <h2 className="meta mb-5">The Confabulation</h2>
          <div className="prose-confab font-serif text-body leading-[1.7] lg:text-[1.1875rem]">
            {paragraphs(dream.confabulation).map((p, i) => (
              <p key={i} className="mb-5 last:mb-0">
                {p}
              </p>
            ))}
          </div>
          <footer className="mt-8 border-t border-rule-soft pt-4">
            <p className="meta">Model · {dream.model_used ?? "unknown"}</p>
          </footer>
        </section>

        <aside aria-label="Reality" className="lg:pl-6 lg:border-l lg:border-rule-soft">
          <h2 className="meta mb-5">Reality</h2>
          {snippets.length === 0 ? (
            <p className="italic text-faded">
              No echo found in the waking record.
            </p>
          ) : (
            <ul className="space-y-5">
              {snippets.map((s, i) => (
                <li
                  key={i}
                  className="border-b border-rule-soft pb-4 last:border-b-0"
                >
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-serif text-[1.0625rem] font-medium text-ink underline decoration-rule underline-offset-4 hover:text-rust"
                  >
                    {s.title}
                  </a>
                  <p className="mt-1 text-small leading-relaxed text-faded">
                    {s.description}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <footer className="mt-16 rule pt-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <SignatureBadge
            score={dream.signature}
            interpretation={dream.signature_explanation}
            size="lg"
          />
          <p className="max-w-md text-small leading-relaxed text-faded lg:text-right">
            The Dream Signature is the proportion of claims in this entry that
            find no semantic echo in the waking-record search results.{" "}
            <span className="onum">1.00</span> means pure confabulation;{" "}
            <span className="onum">0.00</span> means the model was retrieving.
          </p>
        </div>
      </footer>
    </article>
  );
}
