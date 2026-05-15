# Confabulatorium

> An archive of what the machine remembers that never happened.

A generative web app that treats LLM hallucinations as the closest functional analog to dreaming any AI currently has. Submit a fragment — a name, a place, a half-remembered event — and the site generates a confident museum-catalogue entry alongside the parallel reality web search. A **Dream Signature** score (0.00–1.00) quantifies how far the confabulation drifts from anything findable.

Build status: scaffolding. Full setup and run instructions land at the end of build (see [`docs/SPEC.md`](docs/SPEC.md) for the working spec).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Supabase (Postgres) · Gemini 2.5 Flash (primary) · Groq Llama 3.3 70B (fallback) · Brave Search · Upstash Redis · Transformers.js (MiniLM embeddings)

Target: Vercel + Supabase free tier, $0 at ≤1K dreams/mo.
