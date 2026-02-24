export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
}

export async function searchWeb(
  query: string,
  options: { maxResults?: number; searchDepth?: "basic" | "advanced" } = {}
): Promise<SearchResponse> {
  const { maxResults = 5, searchDepth = "basic" } = options;
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error("TAVILY_API_KEY not configured");
  }

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults,
      search_depth: searchDepth,
      include_answer: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tavily search failed: ${text}`);
  }

  const data = await res.json();

  const results: SearchResult[] = (data.results ?? []).map(
    (r: { title: string; url: string; content: string; score: number }) => ({
      title: r.title,
      url: r.url,
      content: r.content,
      score: r.score,
    })
  );

  return { results, query };
}
