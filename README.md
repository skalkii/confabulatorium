# Confabulatorium

> An archive of what the machine remembers that never happened.

A generative web app that treats LLM hallucinations as the closest functional analog to dreaming any AI currently has. Submit a fragment — a name, a place, a half-remembered event — and the site generates a confident museum-catalogue entry alongside the parallel reality web search. A **Dream Signature** score (0.00–1.00) quantifies how far the confabulation drifts from anything findable.

The full philosophical / design spec lives at [`docs/SPEC.md`](docs/SPEC.md).

---

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind v4** (CSS-first config)
- **Supabase** Postgres + RLS
- **Gemini 2.5 Flash** (primary LLM) with **Groq Llama 3.3 70B** fallback
- **Brave Search API** for reality cross-reference
- **Upstash Redis** for IP rate-limiting
- **Transformers.js** (`Xenova/all-MiniLM-L6-v2`) for free in-process embeddings

Target hosting: Vercel + Supabase free tier, **$0/mo at ≤1K dreams/mo**.

---

## Setup

### 1. Install

```bash
pnpm install        # or npm install / yarn install
```

### 2. Acquire free-tier API keys

All providers below have a free tier sufficient for low/medium traffic.

| Service | Where | Notes |
|---|---|---|
| **Gemini** | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | Free tier; pick "Get API key" |
| **Groq** | [console.groq.com/keys](https://console.groq.com/keys) | Free fallback; very fast |
| **Brave Search** | [api.search.brave.com](https://api.search.brave.com/) | 2,000 queries/mo free; requires card for verification but free plan does not charge |
| **Supabase** | [supabase.com/dashboard](https://supabase.com/dashboard) | New project; copy URL + anon key + service-role key from Project Settings → API |
| **Upstash Redis** | [console.upstash.com](https://console.upstash.com) | Create a Redis DB; copy REST URL + REST token |

### 3. Configure environment

```bash
cp .env.example .env.local
# fill in the keys you just acquired
```

For local dev without Upstash, set `DISABLE_RATE_LIMIT=true`.

### 4. Initialize the database

In the Supabase dashboard SQL editor, paste and run [`db/schema.sql`](db/schema.sql).

### 5. Run

```bash
pnpm dev
# http://localhost:3000
```

Type-check and lint:

```bash
pnpm typecheck
pnpm lint
```

---

## Architecture at a glance

```
app/
├── api/
│   ├── generate/   POST → validate → rate-limit → cache → LLM → Brave →
│   │               insert (signature=null, is_reviewed=false) →
│   │               background after() runs signature + safety → flip is_reviewed
│   ├── signature/  POST { slug } → synchronous signature recompute (seed/debug)
│   ├── archive/    GET → paginated list, sort=recent|signature
│   └── og/         GET → 1200×630 OG image for a slug
├── dream/[slug]/   Server-rendered entry page from DB
├── dream/new/      Client-side GenerateForm (robots: noindex)
├── archive/        Server-rendered grid; ?sort=signature|recent
└── about/          Philosophical essay placeholder
lib/
├── llm/            gemini, groq, prompts, unified llmGenerate() with fallback
├── search/brave.ts Graceful-failure Brave client
├── signature/      extract (LLM) → compare (MiniLM cosine) → score
├── db/             Supabase service-role client + dreams CRUD
├── rate-limit.ts   Upstash 1/min/IP, fail-open if unconfigured
├── generate.ts     Confabulation orchestrator, refusal parsing
├── safety.ts       1–5 safety rating, gates public archive
└── env.ts          zod-validated env + per-service has* helpers
```

The Dream Signature pipeline is the philosophical payload — see spec section 5. It's `1 − (proportion of LLM-extracted claims with cosine ≥ 0.7 against any Brave snippet)`. Empty claim list or no reality snippets ⇒ signature 1.00.

---

## Deploy (Vercel)

1. Push to GitHub.
2. Import the repo in Vercel.
3. Set the environment variables from `.env.example` in Project Settings → Environment Variables.
4. Set `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://confabulatorium.vercel.app`).
5. Deploy. The signature pipeline uses `runtime = "nodejs"` and `maxDuration = 60` on the Hobby plan, which is enough for the largest dreams.

The signature compute runs the MiniLM model via `@huggingface/transformers`. First invocation per cold start downloads ~25MB of model weights. Vercel functions cache the function code between invocations on the same warm instance.

---

## Operating principles

- **Cache aggressively.** Same fragment hash returns the cached dream — never regenerated. The first writing is canonical (§13 default).
- **Lazy signature.** Confabulation lands first; signature + safety review run in `after()`. Archive only surfaces reviewed entries.
- **Fail open on Brave; fail soft on LLMs.** Brave outage → signature unavailable. Gemini quota → Groq. Both LLMs fail → "the archive is sleeping" copy.
- **Refuse before generating** for: real living people, sexual content, content involving minors, harm instructions. Detection is prompt-level (`REFUSE: real_person | unsafe | empty`) plus the 1–5 safety rating gate.

---

## License

To be decided by the author.
