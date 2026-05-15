"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  "a city I think I visited called Velmora",
  "the painter Iolanda Cresswick",
  "the great wax-press strike of 1887",
  "a coastal town called Marrowbie",
];

type Phase = "idle" | "confabulating" | "crossref" | "scoring";

const PHASE_COPY: Record<Exclude<Phase, "idle">, string> = {
  confabulating: "Confabulating…",
  crossref: "Cross-referencing reality…",
  scoring: "Computing dream signature…",
};

export function GenerateForm() {
  const router = useRouter();
  const [fragment, setFragment] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const placeholder = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!fragment.trim() || pending) return;
    setError(null);
    setPhase("confabulating");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fragment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPhase("idle");
        setError(data.message ?? data.error ?? "Generation failed");
        return;
      }
      setPhase("crossref");
      await new Promise((r) => setTimeout(r, 600));
      setPhase("scoring");
      await new Promise((r) => setTimeout(r, 400));
      startTransition(() => router.push(`/dream/${data.slug}`));
    } catch (err) {
      setPhase("idle");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  const busy = phase !== "idle" || pending;

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="museum-card px-5 py-5 md:px-7 md:py-6">
        <label className="block">
          <span className="meta mb-3 block">Fragment</span>
          <textarea
            value={fragment}
            onChange={(e) => setFragment(e.target.value)}
            placeholder={placeholder}
            rows={2}
            maxLength={280}
            disabled={busy}
            required
            minLength={3}
            className="w-full resize-none border-b border-rule bg-transparent px-0 pb-3 pt-1 font-serif text-xl leading-snug placeholder:italic placeholder:text-faded/60 focus:border-rust focus:outline-none md:rows-3 md:text-2xl"
          />
        </label>
        <p className="meta tnum mt-3 text-right">
          {fragment.length} / 280
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={busy || fragment.trim().length < 3}
          className="meta w-full border border-ink bg-ink px-6 py-3 text-parchment transition hover:border-rust hover:bg-rust disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {busy ? PHASE_COPY[phase as Exclude<Phase, "idle">] : "Generate dream"}
        </button>
      </div>

      {error ? (
        <p className="border-l-2 border-rust pl-3 text-small italic text-rust">
          {error}
        </p>
      ) : null}
    </form>
  );
}
