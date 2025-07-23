// // lib/newsApi.ts
// import "server-only";

// type Article = {
//   title: string;
//   description: string | null;
//   url: string;
//   urlToImage: string | null;
//   author: string | null;
//   publishedAt: string;
//   source: { name: string | null };
// };

// const CATEGORY_MAP: Record<string, { category?: string; q?: string }> = {
//   technology: { category: "technology" },
//   sports:     { category: "sports" },
//   business:   { category: "business" },
//   politics:   { q: "politics" }, // NewsAPI has no dedicated category, so use a query
// };

// export const VALID_SLUGS = Object.keys(CATEGORY_MAP);

// export async function fetchNewsFor(slug: string): Promise<Article[]> {
//   const cfg = CATEGORY_MAP[slug];
//   if (!cfg) return [];

//   const params = new URLSearchParams({
//     country: "us",
//     language: "en",
//     pageSize: "20",
//     ...("category" in cfg ? { category: cfg.category! } : {}),
//     ...("q" in cfg ? { q: cfg.q! } : {}),
//   });

//   const res = await fetch(`https://newsapi.org/v2/top-headlines?${params}`, {
//     headers: { "X-Api-Key": process.env.NEWS_API_KEY! },
//     next: { revalidate: 3600, tags: [`news-${slug}`] }, // optional caching
//   });

//   if (!res.ok) throw new Error("NewsAPI request failed");
//   const json = await res.json() as { articles: Article[] };
//   return json.articles ?? [];
// }
// lib/newsApi.ts
import "server-only";

type Article = {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  author: string | null;
  publishedAt: string;
  source: { name: string | null };
};

/**
 * For most slugs we hit /top-headlines.
 * For "politics" we’ll return WORLD news instead (via q=world or the /everything endpoint).
 */
export const CATEGORY_MAP: Record<
  string,
  { endpoint: "top" | "everything"; category?: string; q?: string }
> = {
  technology: { endpoint: "top", category: "technology" },
  sports:     { endpoint: "top", category: "sports" },
  business:   { endpoint: "top", category: "business" },
  politics:   { endpoint: "everything", q: "world" }, // 👈 click 'politics' => world news
};

export const VALID_SLUGS = Object.keys(CATEGORY_MAP);

export async function fetchNewsFor(slug: string) {
  const cfg = CATEGORY_MAP[slug];
  if (!cfg) return [];

  const base =
    cfg.endpoint === "everything"
      ? "https://newsapi.org/v2/everything"
      : "https://newsapi.org/v2/top-headlines";

  const params = new URLSearchParams({
    language: "en",
    pageSize: "20",
  });

  if (cfg.endpoint === "top") {
    // top-headlines requires either country or sources; we'll use US
    params.set("country", "us");
    if (cfg.category) params.set("category", cfg.category);
  } else {
    // everything endpoint supports q, sortBy, etc.
    params.set("q", cfg.q ?? "world");
    params.set("sortBy", "publishedAt");
  }

  const res = await fetch(`${base}?${params}`, {
    headers: { "X-Api-Key": process.env.NEWS_API_KEY! },
    next: { revalidate: 3600, tags: [`news-${slug}`] },
  });

  if (!res.ok) throw new Error("NewsAPI request failed");
  const json = (await res.json()) as { articles?: Article[] };
  return json.articles ?? [];
}
