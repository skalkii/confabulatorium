-- Confabulatorium: dreams table
-- Run in Supabase SQL editor.

create table if not exists dreams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,                  -- short readable URL slug
  fragment text not null,                     -- user's original input
  fragment_hash text not null,                -- sha256 of normalized fragment, for cache lookup
  confabulation text not null,                -- LLM-generated body
  metadata jsonb,                             -- invented dates / sources / witnesses
  search_snippets jsonb,                      -- raw web search results (DuckDuckGo)
  signature numeric(3, 2),                    -- 0.00 to 1.00, null while computing
  signature_explanation text,
  model_used text,
  is_public boolean default true,
  is_reviewed boolean default false,          -- safety filter pass
  safety_score smallint,                      -- 1..5 from review pass
  created_at timestamptz default now()
);

create unique index if not exists dreams_fragment_hash_idx on dreams (fragment_hash);
create index if not exists dreams_signature_idx on dreams (signature desc);
create index if not exists dreams_created_idx on dreams (created_at desc);
create index if not exists dreams_archive_idx on dreams (is_public, is_reviewed, created_at desc);

-- Row level security: anonymous read of public + reviewed dreams only.
alter table dreams enable row level security;

drop policy if exists "public read reviewed" on dreams;
create policy "public read reviewed" on dreams
  for select using (is_public = true and is_reviewed = true);

-- Writes go through service-role server-side only (bypasses RLS automatically).
