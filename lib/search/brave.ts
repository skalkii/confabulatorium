import { env, hasBrave } from "@/lib/env";
import type { SearchSnippet } from "@/lib/db/types";

const ENDPOINT = "https://api.search.brave.com/res/v1/web/search";

export interface BraveSearchResult {
  snippets: SearchSnippet[];
  /** True if call succeeded (even with 0 results). False on failure or missing key. */
  ok: boolean;
  error?: string;
}

interface BraveApiResponse {
  web?: {
    results?: Array<{
      title?: string;
      url?: string;
      description?: string;
    }>;
  };
}

export async function braveSearch(
  query: string,
  { count = 5 }: { count?: number } = {},
): Promise<BraveSearchResult> {
  if (!hasBrave()) {
    return { snippets: [], ok: false, error: "missing_key" };
  }

  const url = new URL(ENDPOINT);
  url.searchParams.set("q", query);
  url.searchParams.set("count", String(count));
  url.searchParams.set("safesearch", "strict");

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": env.BRAVE_SEARCH_API_KEY!,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        snippets: [],
        ok: false,
        error: `brave_http_${res.status}`,
      };
    }

    const data = (await res.json()) as BraveApiResponse;
    const snippets: SearchSnippet[] =
      data.web?.results
        ?.filter((r) => r.title && r.url)
        .map((r) => ({
          title: r.title ?? "",
          url: r.url ?? "",
          description: r.description ?? "",
        })) ?? [];

    return { snippets, ok: true };
  } catch (err) {
    return {
      snippets: [],
      ok: false,
      error: err instanceof Error ? err.message : "brave_unknown",
    };
  }
}
