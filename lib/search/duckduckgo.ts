import { search, SafeSearchType } from "duck-duck-scrape";
import type { SearchSnippet } from "@/lib/db/types";

export interface WebSearchResult {
  snippets: SearchSnippet[];
  /** True if call succeeded (even with 0 results). False on failure. */
  ok: boolean;
  error?: string;
}

/**
 * DuckDuckGo HTML search via duck-duck-scrape.
 *
 * No API key, no per-month quota. The library hits DDG's HTML endpoint
 * and parses results — fragile to upstream layout changes but free.
 * Failures are swallowed and returned as {ok: false} so the generate
 * route can still render the confabulation with signature unavailable.
 */
export async function webSearch(
  query: string,
  { count = 5 }: { count?: number } = {},
): Promise<WebSearchResult> {
  try {
    const result = await search(query, {
      safeSearch: SafeSearchType.STRICT,
    });

    if (result.noResults) {
      return { snippets: [], ok: true };
    }

    const snippets: SearchSnippet[] = result.results
      .slice(0, count)
      .filter((r) => r.title && r.url)
      .map((r) => ({
        title: r.title,
        url: r.url,
        description: r.description ?? "",
      }));

    return { snippets, ok: true };
  } catch (err) {
    return {
      snippets: [],
      ok: false,
      error: err instanceof Error ? err.message : "ddg_unknown",
    };
  }
}
