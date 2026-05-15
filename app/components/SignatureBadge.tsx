interface Props {
  score: number | null;
  interpretation?: string | null;
  size?: "sm" | "lg";
}

function bandColor(score: number): string {
  if (score <= 0.2) return "var(--color-faded)";
  if (score <= 0.5) return "#8a7a44";
  if (score <= 0.8) return "var(--color-rust)";
  return "#5b1a0a";
}

export function SignatureBadge({ score, interpretation, size = "sm" }: Props) {
  if (score === null || score === undefined) {
    return (
      <span className="meta inline-flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block size-1.5 animate-pulse rounded-full bg-[color:var(--color-faded)]"
        />
        Computing signature…
      </span>
    );
  }

  const label = score.toFixed(2);
  const color = bandColor(score);

  if (size === "lg") {
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="meta">Dream Signature</span>
        <span
          className="font-serif text-6xl leading-none tracking-tight"
          style={{ color }}
        >
          {label}
        </span>
        {interpretation ? (
          <span className="mt-2 max-w-sm text-sm italic text-[color:var(--color-faded)]">
            {interpretation}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <span
      className="meta inline-flex items-center gap-2"
      title={interpretation ?? undefined}
    >
      <span
        aria-hidden
        className="inline-block size-2 rounded-full"
        style={{ background: color }}
      />
      Sig · {label}
    </span>
  );
}
