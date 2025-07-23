import { notFound } from "next/navigation";
import { VALID_SLUGS, fetchNewsFor } from "@/lib/newsApi";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  if (!VALID_SLUGS.includes(slug)) notFound();

  const articles = await fetchNewsFor(slug);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold capitalize">{slug} News</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((a) => (
          <a
            key={a.url}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border bg-surface p-4 hover:shadow transition"
          >
            {a.urlToImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={a.urlToImage}
                alt={a.title}
                className="mb-3 h-40 w-full rounded object-cover group-hover:opacity-90"
              />
            )}
            <h3 className="text-lg font-semibold group-hover:underline">{a.title}</h3>
            {a.description && (
              <p className="mt-1 text-sm text-fg-secondary line-clamp-3">{a.description}</p>
            )}
            <span className="mt-2 block text-xs text-fg-quaternary">
              {new Date(a.publishedAt).toLocaleString()} — {a.source?.name ?? "Unknown"}
            </span>
          </a>
        ))}
      </div>
    </main>
  );
}
