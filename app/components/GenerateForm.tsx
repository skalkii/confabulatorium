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
      // brief beat so the staged copy lands before nav
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
      <label className="block">
        <span className="meta mb-2 block">Fragment</span>
        <textarea
          value={fragment}
          onChange={(e) => setFragment(e.target.value)}
          placeholder={placeholder}
          rows={3}
          maxLength={280}
          disabled={busy}
          required
          minLength={3}
          className="w-full resize-none border-b-2 border-[color:var(--color-rule)] bg-transparent px-0 py-3 font-serif text-2xl leading-snug placeholder:italic placeholder:text-[color:var(--color-faded)]/60 focus:border-[color:var(--color-rust)] focus:outline-none"
        />
      </label>

      <div className="flex items-center justify-between">
        <p className="meta">
          {fragment.length} / 280
        </p>
        <button
          type="submit"
          disabled={busy || fragment.trim().length < 3}
          className="meta border border-[color:var(--color-ink)] bg-[color:var(--color-ink)] px-6 py-3 text-[color:var(--color-parchment)] transition hover:bg-[color:var(--color-rust)] hover:border-[color:var(--color-rust)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? PHASE_COPY[phase as Exclude<Phase, "idle">] : "Generate dream"}
        </button>
      </div>

      {error ? (
        <p className="border-l-2 border-[color:var(--color-rust)] pl-3 text-sm italic text-[color:var(--color-rust)]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
