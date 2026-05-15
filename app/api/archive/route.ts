import { NextResponse } from "next/server";
import { listArchive } from "@/lib/db/dreams";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sort = (url.searchParams.get("sort") ?? "recent") as
    | "recent"
    | "signature";
  const limit = Math.min(60, Number(url.searchParams.get("limit") ?? 30));
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));

  const dreams = await listArchive({ sort, limit, offset });

  return NextResponse.json({
    sort,
    limit,
    offset,
    count: dreams.length,
    items: dreams.map((d) => ({
      slug: d.slug,
      fragment: d.fragment,
      signature: d.signature,
      created_at: d.created_at,
      preview: d.confabulation.slice(0, 220),
    })),
  });
}
