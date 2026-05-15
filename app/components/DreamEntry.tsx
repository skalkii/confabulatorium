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
    <article className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10 border-b border-[color:var(--color-rule)] pb-8">
        <p className="meta">
          Catalogue · {String(catalogueNo ?? 0).padStart(4, "0")} · Accessioned{" "}
          {fmtDate(dream.created_at)}
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
          {dream.fragment}
        </h1>
      </header>

      <div className="grid gap-12 md:grid-cols-[3fr_2fr]">
        <section aria-label="The Confabulation">
          <h2 className="meta mb-4">The Confabulation</h2>
          <div className="prose-confab space-y-5 font-serif text-lg leading-[1.7]">
            {paragraphs(dream.confabulation).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <footer className="mt-8 border-t border-[color:var(--color-rule)] pt-4">
            <p className="meta">
              Model · {dream.model_used ?? "unknown"}
            </p>
          </footer>
        </section>

        <aside aria-label="Reality">
          <h2 className="meta mb-4">Reality</h2>
          {snippets.length === 0 ? (
            <p className="italic text-[color:var(--color-faded)]">
              No echo found in the waking record.
            </p>
          ) : (
            <ul className="space-y-5">
              {snippets.map((s, i) => (
                <li key={i} className="border-b border-[color:var(--color-rule)] pb-4 last:border-b-0">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-serif text-base font-medium text-[color:var(--color-ink)] underline decoration-[color:var(--color-rule)] underline-offset-4 hover:text-[color:var(--color-rust)]"
                  >
                    {s.title}
                  </a>
                  <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-faded)]">
                    {s.description}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <footer className="mt-16 rule pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SignatureBadge
            score={dream.signature}
            interpretation={dream.signature_explanation}
            size="lg"
          />
          <p className="max-w-md text-sm leading-relaxed text-[color:var(--color-faded)]">
            The Dream Signature is the proportion of claims in this entry that
            find no semantic echo in the waking-record search results.
            1.00 means pure confabulation; 0.00 means the model was retrieving.
          </p>
        </div>
      </footer>
    </article>
  );
}
