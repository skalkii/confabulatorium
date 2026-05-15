"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ORDER: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];

function Glyph({ kind }: { kind: "light" | "dark" | "system" }) {
  if (kind === "light") {
    return (
      <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden fill="currentColor">
        <circle cx="10" cy="10" r="3.5" />
        <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <line x1="10" y1="1.5" x2="10" y2="4" />
          <line x1="10" y1="16" x2="10" y2="18.5" />
          <line x1="1.5" y1="10" x2="4" y2="10" />
          <line x1="16" y1="10" x2="18.5" y2="10" />
          <line x1="3.8" y1="3.8" x2="5.6" y2="5.6" />
          <line x1="14.4" y1="14.4" x2="16.2" y2="16.2" />
          <line x1="3.8" y1="16.2" x2="5.6" y2="14.4" />
          <line x1="14.4" y1="5.6" x2="16.2" y2="3.8" />
        </g>
      </svg>
    );
  }
  if (kind === "dark") {
    return (
      <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden fill="currentColor">
        <path d="M14.5 11.5A6.2 6.2 0 0 1 8.5 5a6 6 0 0 0 1.5 11.8 6 6 0 0 0 5.7-4.6 6.3 6.3 0 0 1-1.2.3z" />
      </svg>
    );
  }
  // system
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2.5" y="3.5" width="15" height="10" rx="1.5" />
      <line x1="7" y1="17" x2="13" y2="17" strokeLinecap="round" />
      <line x1="10" y1="13.5" x2="10" y2="17" strokeLinecap="round" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function cycle() {
    const current = (theme ?? "system") as (typeof ORDER)[number];
    const idx = ORDER.indexOf(current);
    const next = ORDER[(idx + 1) % ORDER.length]!;
    setTheme(next);
  }

  const current = (mounted ? theme ?? "system" : "system") as (typeof ORDER)[number];
  const label = `Theme: ${current}. Click to cycle.`;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className="meta inline-flex items-center gap-1.5 border border-rule px-2.5 py-1.5 transition-colors hover:border-ink hover:text-ink"
      suppressHydrationWarning
    >
      <Glyph kind={current} />
      <span className="hidden sm:inline">{current}</span>
    </button>
  );
}
