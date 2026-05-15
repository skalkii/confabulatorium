import { Link } from "next-view-transitions";
import { SignatureBadge } from "./SignatureBadge";

interface Props {
  slug: string;
  fragment: string;
  preview: string;
  signature: number | null;
  createdAt: string;
  catalogueNo?: number;
}

function bandColor(score: number | null): string {
  if (score === null) return "var(--color-rule)";
  if (score <= 0.2) return "var(--band-0)";
  if (score <= 0.5) return "var(--band-1)";
  if (score <= 0.8) return "var(--band-2)";
  return "var(--band-3)";
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
      className="museum-card group relative flex flex-col gap-3 px-5 py-5 transition-colors duration-200 hover:border-rust md:px-6 md:py-6"
      style={
        {
          ["--card-band" as string]: bandColor(signature),
        } as React.CSSProperties
      }
    >
      {/* Colored band tab on left edge */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: "var(--card-band)" }}
      />

      <div className="flex items-center justify-between gap-3">
        <span className="meta tnum">
          Cat. {String(catalogueNo ?? 0).padStart(4, "0")}
        </span>
        <SignatureBadge score={signature} size="sm" />
      </div>

      <h3 className="font-serif text-h3 tracking-tight text-ink group-hover:text-rust">
        {fragment}
      </h3>

      <p className="line-clamp-2 text-[15px] leading-relaxed text-faded md:line-clamp-3">
        {preview}
      </p>

      <span className="meta mt-auto pt-2">{fmtDate(createdAt)}</span>
    </Link>
  );
}
