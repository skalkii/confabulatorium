/**
 * Normalize NEXT_PUBLIC_SITE_URL for use in places where importing
 * env.ts would fail (e.g. root layout's metadata, which evaluates at
 * build time before the env validator). Accepts bare hostname OR
 * full URL; prepends https:// when missing; strips trailing slash.
 *
 * env.ts applies the same normalization via siteUrlSchema for
 * everything that imports env.
 */
export function siteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}
