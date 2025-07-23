// app/(dashboard)/reporters/[id]/page.tsx
import { getReporterById, getArticlesByReporter } from "@/lib/reporters";
import ReporterStats from "@/components/reporters/ReporterStats";
import { ArticleList } from "@/components/articles/ArticleList";

interface Props { params: { id: string } }

export default async function ReporterPage({ params }: Props) {
  const reporter = await getReporterById(params.id);
  if (!reporter) return <div>Reporter not found.</div>;
  const articles = await getArticlesByReporter(params.id);

  return (
    <div className="space-y-8">
      <ReporterStats reporter={reporter} />
      <ArticleList articles={articles} emptyMessage="No articles yet." />
    </div>
  );
}
