"use client";

import { useState } from "react";

interface Props {
  slug: string;
}

export function CopyPermalink({ slug }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      const url = `${window.location.origin}/dream/${slug}`;
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 1800);
    }
  }

  const label =
    state === "copied"
      ? "Copied"
      : state === "error"
        ? "Copy failed"
        : "Copy permalink";

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy permanent link to this dream"
      className="meta inline-flex items-center gap-1.5 border border-rule px-2.5 py-1.5 transition-colors hover:border-ink hover:text-ink"
    >
      <svg
        viewBox="0 0 20 20"
        width="13"
        height="13"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      >
        <rect x="6.5" y="6.5" width="9" height="11" rx="1" />
        <path d="M11 6.5V4.5a1 1 0 0 0-1-1H4.5a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h2" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
