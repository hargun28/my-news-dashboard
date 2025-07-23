// app/(dashboard)/following/page.tsx
import ReporterSearchBar from "@/components/search/ReporterSearchBar";
import { ArticleList } from "@/components/articles/ArticleList";
import { auth } from "@clerk/nextjs/server";
import { getFollowedArticles } from "@/lib/reporters";

export default async function FollowingPage() {
  const { userId } = await auth();
  const articles = userId ? await getFollowedArticles(userId) : [];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Following</h1>
      <ReporterSearchBar />
      <ArticleList articles={articles} emptyMessage="No articles from followed reporters yet." />
    </div>
  );
}
