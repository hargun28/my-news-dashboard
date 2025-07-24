// import { getReporterById, getArticlesByReporter } from "@/lib/reporters";
// import ReporterStats from "@/components/reporters/ReporterStats";
// import { ArticleList } from "@/components/articles/ArticleList";

// interface Props {
//   params: { id: string };
//   searchParams: { page?: string };
// }

// export default async function ReporterPage({ params, searchParams }: Props) {
//   const page = parseInt(searchParams.page || "1", 10);
//   const take = 10;
//   const reporter = await getReporterById(params.id);
//   if (!reporter) return <div>Reporter not found.</div>;
//   const articles = await getArticlesByReporter(params.id, (page - 1) * take, take);

//   return (
//     <div className="space-y-8">
//       <ReporterStats reporter={reporter} />
//       <ArticleList articles={articles} emptyMessage="No articles yet." />
//       <div className="flex gap-4">
//         {page > 1 && (
//           <a href={`?page=${page - 1}`} className="underline text-sm">
//             Previous
//           </a>
//         )}
//         {articles.length === take && (
//           <a href={`?page=${page + 1}`} className="underline text-sm">
//             Next
//           </a>
//         )}
//       </div>
//     </div>
//   );
// }

// app/reporters/[id]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import FormContainer from "@/components//FormContainer";
import Table from "@//components/Table";
import TableSearch from "@///components/TableSearch";
import Pagination from "@//components/Pagination";
import { NewsArticle, User, Organization } from "@prisma/client";
import { ITEM_PER_PAGE } from "../../../lib/settings";

interface Props {
  params: { id: string };
  searchParams?: { [key: string]: string | undefined };
}

export default async function SingleReporterPage({
  params,
  searchParams = {},
}: Props) {
  // 1) Auth & role
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // 2) Load reporter + counts
  const reporter = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      organization: { select: { id: true, name: true } },
      _count: { select: { followers: true, articles: true } },
    },
  });
  if (!reporter) return notFound();

  // 3) Pagination & fetch articles
  const page = parseInt(searchParams.page ?? "1", 10);
  const skip = ITEM_PER_PAGE * (page - 1);

  const [articles, count] = await prisma.$transaction([
    prisma.newsArticle.findMany({
      where: { authorId: params.id },
      skip,
      take: ITEM_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsArticle.count({ where: { authorId: params.id } }),
  ]);

  // 4) Columns + row renderer
  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Published", accessor: "publishedAt", className: "hidden md:table-cell" },
    { header: "Views", accessor: "views", className: "hidden lg:table-cell" },
    ...(role === "ADMIN" ? [{ header: "Actions", accessor: "action" }] : []),
  ];

  const renderRow = (item: NewsArticle) => (
    <tr key={item.id} className="border-b even:bg-slate-50 hover:bg-gray-100 text-sm">
      <td className="p-4">
        <Link href={`/news/${item.id}`} className="font-medium hover:underline">
          {item.title}
        </Link>
      </td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-GB").format(item.createdAt)}
      </td>
      <td className="hidden lg:table-cell">{item.views}</td>
      {role === "ADMIN" && (
        <td className="p-4">
          <FormContainer type="delete" id={item.id} />
        </td>
      )}
    </tr>
  );

  return (
    <div className="flex flex-col gap-6 p-4 m-4 bg-white rounded-md">
      {/* Top: Reporter info */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex items-center gap-4 bg-blue-50 p-4 rounded-md">
          <Image
            src={(reporter as any).avatarUrl || "/noAvatar.png"}
            width={80}
            height={80}
            alt=""
            className="rounded-full"
          />
          <div>
            <h1 className="text-2xl font-semibold">{reporter.username ?? reporter.email}</h1>
            <p className="text-sm text-gray-500">{reporter.email}</p>
            <p className="mt-2 text-xs text-gray-600">
              Organization: {reporter.organization?.name ?? "Independent"}
            </p>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-md text-center">
            <p className="text-gray-500 text-xs">Articles</p>
            <p className="text-xl font-medium">{reporter._count.articles}</p>
          </div>
          <div className="bg-white p-4 rounded-md text-center">
            <p className="text-gray-500 text-xs">Followers</p>
            <p className="text-xl font-medium">{reporter._count.followers}</p>
          </div>
        </div>
      </div>

      {/* Bottom: Articles table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Articles by {reporter.username}</h2>
          <TableSearch placeholder="Filter articles…" />
        </div>
        <Pagination page={page} count={count} />
      </div>
    </div>
  );
}
