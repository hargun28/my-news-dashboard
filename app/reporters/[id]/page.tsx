import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { NewsArticle } from "@prisma/client";
import { ITEM_PER_PAGE } from "../../../lib/settings";
import { getDbUserAndOrg } from "@/lib/get-db-user";
import type { ReporterStats } from "@/lib/reporters";
import TableSearch from "@/components/TableSearch";

interface Props {
  params: { id: string };
  searchParams?: { [key: string]: string | undefined };
}

export default async function SingleReporterPage(props: Props) {
  const { params, searchParams = {} } = props;

  // 1) Auth & role
  const viewer = await getDbUserAndOrg();
  const viewerOrg = viewer?.organizationId;


  // 2) Load reporter + counts
  const reporter = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      organization: { select: { id: true, name: true } },
      _count: { select: { followers: true, articles: true } },
    },
  }) as ReporterStats | null;
  if (!reporter) return notFound();

  const canSeePrivate =
    viewerOrg && viewerOrg === reporter.organizationId;


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
            <h1 className="text-2xl font-semibold text-black">{reporter.username ?? reporter.email}</h1>
            <p className="text-sm text-gray-500">{reporter.email}</p>
            {canSeePrivate && (
             <>
               {reporter.phone && (
                 <p className="text-sm text-gray-700">
                   📞 {reporter.phone}
                 </p>
                )}
               {reporter.internalEmail && (
                 <p className="text-sm text-gray-700">
                   ✉️ {reporter.internalEmail}
                 </p>
               )}
             </>
           )}
            <p className="mt-2 text-xs text-gray-600">
              Organization: {reporter.organization?.name ?? "Independent"}
            </p>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="bg-slate-700 p-4 rounded-md text-center">
            <p className="text-gray-500 text-xs">Articles</p>
            <p className="text-xl font-medium">{reporter._count.articles}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-md text-center">
            <p className="text-gray-500 text-xs">Followers</p>
            <p className="text-xl font-medium">{reporter._count.followers}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-100 text-black p-6 rounded-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Articles by {reporter.username}</h2>
          <TableSearch placeholder="Search articles..." />
        </div>

        <div className="space-y-4">
          {articles.map((a) => (
            <div
              key={a.id}
              className="flex gap-4 border rounded-md p-4 bg-white text-black"
            >
              {a.imageUrl && (
                <Image
                  src={a.imageUrl}
                  alt=""
                  width={120}
                  height={80}
                  className="object-cover rounded w-32 h-20"
                />
              )}
              <div>
                <Link
                  href={`/news/${a.id}`}
                  className="font-medium hover:underline text-black"
                >
                  {a.title}
               </Link>
                <p className="text-xs text-gray-700">{a.category ?? ""}</p>
              </div>
            </div>
          ))}
        </div>
       <Pagination page={page} count={count} />

      </div>
    </div>
  );
}
