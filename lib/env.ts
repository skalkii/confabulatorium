import { z } from "zod";

/**
 * Accept either a bare hostname ("confabulatorium.vercel.app") or a
 * full URL — Vercel's env-var UI silently drops the protocol when
 * users copy-paste the assigned domain. Normalize before validating.
 */
const siteUrlSchema = z
  .string()
  .default("http://localhost:3000")
  .transform((v) => {
    const t = v.trim();
    const withProto = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    return withProto.replace(/\/+$/, "");
  })
  .pipe(z.string().url());

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: siteUrlSchema,

  GEMINI_API_KEY: z.string().min(1).optional(),
  GROQ_API_KEY: z.string().min(1).optional(),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  DISABLE_RATE_LIMIT: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  DISABLE_RATE_LIMIT: process.env.DISABLE_RATE_LIMIT,
});

if (!parsed.success) {
  console.error("[env] invalid environment", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

export const hasGemini = () => Boolean(env.GEMINI_API_KEY);
export const hasGroq = () => Boolean(env.GROQ_API_KEY);
export const hasSupabase = () =>
  Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
export const hasUpstash = () =>
  Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
