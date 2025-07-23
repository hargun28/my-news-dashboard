// components/articles/ArticleList.tsx
export function ArticleList({
  articles,
  emptyMessage = "No articles."
}: { articles: any[]; emptyMessage?: string }) {
  if (!articles?.length) return <p className="text-sm text-gray-500">{emptyMessage}</p>;
  return (
    <ul className="space-y-4">
      {articles.map(a => (
        <li key={a.id} className="rounded border bg-white p-4">
          <h3 className="font-medium">{a.title}</h3>
          <p className="text-sm text-gray-600">{a.summary}</p>
        </li>
      ))}
    </ul>
  );
}
