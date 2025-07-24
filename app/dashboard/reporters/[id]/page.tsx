import { getReporterById, getArticlesByReporter } from "@/lib/reporters";
import ReporterStats from "@/components/reporters/ReporterStats";
import { ArticleList } from "@/components/articles/ArticleList";

interface Props {
  params: { id: string };
  searchParams: { page?: string };
}

export default async function ReporterPage({ params, searchParams }: Props) {
  const page = parseInt(searchParams.page || "1", 10);
  const take = 10;
  const reporter = await getReporterById(params.id);
  if (!reporter) return <div>Reporter not found.</div>;
  const articles = await getArticlesByReporter(params.id, (page - 1) * take, take);

  return (
    <div className="space-y-8">
      <ReporterStats reporter={reporter} />
      <ArticleList articles={articles} emptyMessage="No articles yet." />
      <div className="flex gap-4">
        {page > 1 && (
          <a href={`?page=${page - 1}`} className="underline text-sm">
            Previous
          </a>
        )}
        {articles.length === take && (
          <a href={`?page=${page + 1}`} className="underline text-sm">
            Next
          </a>
        )}
      </div>
    </div>
  );
}