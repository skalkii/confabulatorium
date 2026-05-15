import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env, hasUpstash } from "@/lib/env";

let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  if (env.DISABLE_RATE_LIMIT) return null;
  if (!hasUpstash()) return null;
  if (!limiter) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    });
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(1, "60 s"),
      prefix: "confab:generate",
      analytics: false,
    });
  }
  return limiter;
}

export interface RateLimitVerdict {
  allowed: boolean;
  /** Seconds until reset; 0 if allowed or limiter disabled */
  retryAfter: number;
  reason?: "disabled" | "no_upstash" | "ok" | "blocked";
}

export async function checkRateLimit(ip: string): Promise<RateLimitVerdict> {
  if (env.DISABLE_RATE_LIMIT) {
    return { allowed: true, retryAfter: 0, reason: "disabled" };
  }

  const rl = getLimiter();
  if (!rl) {
    // Fail open when not configured — log so prod misconfig is visible.
    console.warn("[rate-limit] Upstash not configured; allowing request");
    return { allowed: true, retryAfter: 0, reason: "no_upstash" };
  }

  const { success, reset } = await rl.limit(ip);
  if (success) return { allowed: true, retryAfter: 0, reason: "ok" };

  const retryAfter = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
  return { allowed: false, retryAfter, reason: "blocked" };
}

export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
