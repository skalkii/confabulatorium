interface Props {
  score: number | null;
  interpretation?: string | null;
  size?: "sm" | "lg";
}

function bandColor(score: number): string {
  if (score <= 0.2) return "var(--band-0)";
  if (score <= 0.5) return "var(--band-1)";
  if (score <= 0.8) return "var(--band-2)";
  return "var(--band-3)";
}

export function SignatureBadge({ score, interpretation, size = "sm" }: Props) {
  if (score === null || score === undefined) {
    return (
      <span className="meta inline-flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block size-1.5 animate-pulse rounded-full bg-faded"
        />
        Computing signature…
      </span>
    );
  }

  const label = score.toFixed(2);
  const color = bandColor(score);
  const plotX = Math.min(100, Math.max(0, score * 100));

  if (size === "lg") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline gap-4">
          <span className="meta">Dream Signature</span>
          <span
            className="onum font-serif text-[3rem] leading-none tracking-tight md:text-[3.75rem]"
            style={{ color }}
          >
            {label}
          </span>
        </div>

        {/* 0..1 axis */}
        <div className="max-w-sm">
          <div className="relative h-px w-full bg-rule" role="img" aria-label={`Signature ${label} on 0–1 scale`}>
            {[0.25, 0.5, 0.75].map((t) => (
              <span
                key={t}
                aria-hidden
                className="absolute -top-1 h-2 w-px bg-rule"
                style={{ left: `${t * 100}%` }}
              />
            ))}
            <span
              aria-hidden
              className="absolute -top-[5px] block size-[11px] -translate-x-1/2 rounded-full ring-2 ring-parchment"
              style={{ left: `${plotX}%`, background: color }}
            />
          </div>
          <div className="meta mt-2 flex justify-between">
            <span>0.00</span>
            <span>1.00</span>
          </div>
        </div>

        {interpretation ? (
          <p className="max-w-sm text-small italic text-faded">
            {interpretation}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <span
      className="meta inline-flex items-center gap-2 tnum"
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
