# Confabulatorium

An archive of what the machine remembers that never happened.

## What is this?

Confabulatorium is a small website you can run on your own laptop. Type in a fragment — a name, a place, a half-remembered event — and it produces a confident-sounding museum catalogue entry for that fragment, paired with what an actual web search turned up. Every entry gets a **Dream Signature** score between `0.00` and `1.00` that measures how far the machine's invented version drifts from anything findable on the real web. A score near `1.00` means the machine dreamed it up from nothing.

This README only covers how to run it locally. The full philosophical and design spec — what a Dream Signature actually means, why this exists, how the pipeline works — lives in [`docs/SPEC.md`](docs/SPEC.md).

## Before you start

You need four things on your machine before any of the steps below will work:

| Requirement | Notes | Where |
|---|---|---|
| **Node.js 22 or newer** | The runtime that executes the app | [nodejs.org](https://nodejs.org) — download the LTS installer |
| **pnpm** | A package manager — installs and updates the code's dependencies | [pnpm.io/installation](https://pnpm.io/installation) |
| **A free Google account** | Used to get one of the AI keys | [google.com](https://google.com) |
| **A free GitHub account (recommended)** | Optional, only needed if you eventually want to put this online | [github.com](https://github.com) |

Set aside about 15 minutes. Most of that is waiting for sign-up emails.

> **Tip.** To check that Node and pnpm installed correctly, open a terminal (on Mac: Terminal app; on Windows: PowerShell) and type `node --version` then `pnpm --version`. Both should print a version number. If either says "command not found", reinstall and restart the terminal.

## Step-by-step setup

You will be collecting a handful of **API keys** — long strings of letters and numbers that prove you're allowed to use a paid service. All four services below have free tiers that are plenty for running this on your laptop.

Open a plain text file (TextEdit on Mac, Notepad on Windows) and keep it open. You'll paste each key into it as you collect them. Do not share this file or commit it to GitHub.

### 1. Download the code

Download or clone this repository, then open a terminal inside the project folder.

```
cd path/to/Confabulatorium
```

### 2. Get a Gemini key (the AI that writes the dreams)

Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey), sign in with Google, and click **Create API key**. Copy the key it shows you.

> The key looks like `AIzaSy...` followed by about 30 more characters. If yours doesn't start with `AIza`, something went wrong — try again.

Paste it into your notes file, labelled `GEMINI_API_KEY`.

### 3. Get a Groq key (the backup AI)

Go to [console.groq.com/keys](https://console.groq.com/keys), sign up (free, no credit card), and click **Create API Key**. Copy it immediately — Groq only shows the key once.

> The key looks like `gsk_` followed by a long random string. Save it as `GROQ_API_KEY`.

### 4. Set up Supabase (the database that stores the dreams)

Supabase is a free hosted database. The app uses it to remember every dream you generate.

1. Sign up at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Click **New project**. Pick any name and any region near you. Set a strong database password and save it somewhere — you won't need it for this README, but losing it is annoying later.
3. Wait about 90 seconds for the project to finish setting up.
4. In the left sidebar, click the gear icon (**Project Settings**) → **API**. You'll see three things to copy:
   - **Project URL** — looks like `https://abcdefghijk.supabase.co`. Save as `NEXT_PUBLIC_SUPABASE_URL`.
   - **anon public** key — a very long string starting with `eyJ`. Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - **service_role** key — another very long `eyJ...` string. Save as `SUPABASE_SERVICE_ROLE_KEY`. **Treat this one like a password** — it has full access to your database.

> **Warning.** The Project URL must be the bare domain — `https://abcdefghijk.supabase.co`. Do not include `/rest/v1/` or any path after `.co`. Copying the wrong URL is the #1 cause of "404 Not Found" errors later.

5. Now create the database table. In the Supabase sidebar, click the **SQL Editor** icon. Click **New query**. Open the file [`db/schema.sql`](db/schema.sql) from this project on your computer, copy the entire contents, paste it into the Supabase SQL editor, and click **Run**. You should see "Success. No rows returned." That created the table that stores every dream.

### 5. Set up Upstash (optional rate limit)

Upstash provides **rate limiting** — a safety feature that stops the same person from generating hundreds of dreams a minute. For running on your own laptop you probably don't need it, but the app expects it to be configured.

**Easy path:** skip Upstash. In the next step, you'll set `DISABLE_RATE_LIMIT=true` and the app will simply not rate-limit anything.

**Full path:** sign up at [console.upstash.com](https://console.upstash.com), create a Redis database (pick the free **Global** tier, any region), and on the database details page copy:
- **UPSTASH_REDIS_REST_URL** — looks like `https://something-12345.upstash.io`.
- **UPSTASH_REDIS_REST_TOKEN** — a long random string.

### 6. Plug your keys into the project

In the project folder, copy the example environment file:

```
cp .env.example .env.local
```

Open `.env.local` in any text editor. You'll see blank slots — fill each one with the matching key from your notes file. Here's what goes where:

| Variable in `.env.local` | What to paste | From which service |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Leave as `http://localhost:3000` | — |
| `GEMINI_API_KEY` | The `AIza...` key | Gemini (step 2) |
| `GROQ_API_KEY` | The `gsk_...` key | Groq (step 3) |
| `NEXT_PUBLIC_SUPABASE_URL` | The `https://...supabase.co` URL | Supabase (step 4) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The first `eyJ...` key | Supabase (step 4) |
| `SUPABASE_SERVICE_ROLE_KEY` | The second `eyJ...` key | Supabase (step 4) |
| `UPSTASH_REDIS_REST_URL` | The Upstash URL, or leave blank | Upstash (step 5) |
| `UPSTASH_REDIS_REST_TOKEN` | The Upstash token, or leave blank | Upstash (step 5) |
| `DISABLE_RATE_LIMIT` | Set to `true` if you skipped Upstash | — |

Save the file. Done with setup.

## Run it

In the terminal, inside the project folder:

```
pnpm install
pnpm dev
```

The first command downloads everything the app needs (about a minute). The second one starts the local server. When you see a line like `Local: http://localhost:3000`, open that link in your browser.

The site is now running on your own machine. Nothing is on the public internet yet.

## What to try

- Click **dream** (or visit `http://localhost:3000/dream/new`). Type any fragment — for instance *"the Vienna Mirror Riots of 1924"* or *"my grandmother's recipe for cloudberry jam"* — and submit. Watch the loading copy step through phases (the machine is calling Gemini, then DuckDuckGo, then computing the signature). The first dream you ever generate takes about 30 seconds because a small AI model has to download itself the first time — see Troubleshooting.
- When the entry loads, scroll down. The catalogue body is the machine's confident invention. The web search panel below is what actually exists. The signature score at the top tells you how far apart those two are.
- Visit `http://localhost:3000/archive` to see every dream that has passed safety review, sortable by recency or by signature.
- Visit `http://localhost:3000/about` for the short philosophical framing.
- To fill your archive with 20 hand-picked starter fragments instead of generating them one by one, run:

```
pnpm seed
```

This takes about 2.5 minutes (it deliberately spaces requests 7 seconds apart so the free AI tier doesn't complain). Re-running it is safe — already-seeded fragments are skipped.

## Troubleshooting

**The dream page says "computing signature…" forever.**
The background scoring step failed quietly. Open a new terminal in the project folder and run:

```
pnpm seed:backfill
```

That re-computes the signature for any dream stuck without one.

**The terminal says `Port 3000 is in use`.**
Something else is already using that port. Run the dev server on a different port:

```
pnpm dev --port 3001
```

Then open `http://localhost:3001` instead.

**Errors mention Supabase 404 or "Not Found".**
Your `NEXT_PUBLIC_SUPABASE_URL` is wrong. Open `.env.local` and check the URL ends in `.co` with nothing after it. If you copied `https://abcdefghijk.supabase.co/rest/v1/` from somewhere, strip everything from `/rest/v1/` onwards. Save and restart `pnpm dev`.

**The terminal says Gemini is "rate limited" or "quota exceeded".**
Gemini's free tier caps requests per minute. The app will automatically retry with Groq instead, so the page should still load — just slower. To check your Gemini usage, visit [aistudio.google.com/apikey](https://aistudio.google.com/apikey). If Groq is also failing, wait a few minutes and try again.

**The very first dream takes around 30 seconds.**
This is normal. The app uses a small AI model (called MiniLM) to compare the machine's invention against the real web results, and the first time it runs, that model downloads itself (about 25 MB) into a cache folder. Every dream after the first will be much faster.

**The page says "the archive is sleeping".**
Both Gemini and Groq failed at the same time. Check that both keys in `.env.local` are pasted correctly with no extra spaces, then restart `pnpm dev`. Restarting the dev server is required any time you change `.env.local`.

## Deploy

To put your version on the public internet:

1. Push the project to a new GitHub repository.
2. Sign in to [vercel.com](https://vercel.com) with that GitHub account and click **Import Project**.
3. Pick the repo. On the configuration screen, paste every variable from your `.env.local` into the **Environment Variables** section. Change `NEXT_PUBLIC_SITE_URL` to whatever URL Vercel assigns you (for example `https://confabulatorium-yourname.vercel.app`).
4. Click **Deploy**.

If anything goes wrong during the Vercel step, their own guide is the right place to look: [vercel.com/docs/deployments](https://vercel.com/docs/deployments). The app is built to run on Vercel's free Hobby tier.

## License

MIT — see [LICENSE](LICENSE). The code is open; the seeded archive content is the project's own.
