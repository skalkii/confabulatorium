import type { MetadataRoute } from "next";
import { env, hasSupabase } from "@/lib/env";
import { listArchive } from "@/lib/db/dreams";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/archive`, priority: 0.9, changeFrequency: "daily" },
    { url: `${base}/about`, priority: 0.6, changeFrequency: "monthly" },
  ];

  if (!hasSupabase()) return staticRoutes;

  const dreams = await listArchive({ limit: 500 }).catch(() => []);
  const dreamRoutes: MetadataRoute.Sitemap = dreams.map((d) => ({
    url: `${base}/dream/${d.slug}`,
    lastModified: d.created_at,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...dreamRoutes];
}
