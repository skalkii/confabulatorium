import Link from "next/link";
import { SignatureBadge } from "./SignatureBadge";

interface Props {
  slug: string;
  fragment: string;
  preview: string;
  signature: number | null;
  createdAt: string;
  catalogueNo?: number;
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export function DreamCard({
  slug,
  fragment,
  preview,
  signature,
  createdAt,
  catalogueNo,
}: Props) {
  return (
    <Link
      href={`/dream/${slug}`}
      className="museum-card group flex flex-col gap-3 px-6 py-5 transition hover:border-[color:var(--color-rust)]"
    >
      <div className="flex items-center justify-between">
        <span className="meta">
          Cat. {String(catalogueNo ?? 0).padStart(4, "0")}
        </span>
        <SignatureBadge score={signature} size="sm" />
      </div>
      <h3 className="font-serif text-xl leading-snug text-[color:var(--color-ink)] group-hover:text-[color:var(--color-rust)]">
        {fragment}
      </h3>
      <p className="line-clamp-3 text-sm leading-relaxed text-[color:var(--color-faded)]">
        {preview}
      </p>
      <span className="meta mt-auto">{fmtDate(createdAt)}</span>
    </Link>
  );
}
