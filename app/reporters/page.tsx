// app/reporters/page.tsx
import FormContainer from "@/components//FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { User, Organization, Prisma } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { ITEM_PER_PAGE } from "@//lib/settings";
import { auth } from "@clerk/nextjs/server";

type ReporterListItem = User & {
  organization: Organization | null;
  _count: { followers: number; articles: number };
};

export default async function ReportersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // 1) Auth & role check
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // 2) Pagination & search filter
  const { page, search, ...rest } = searchParams;
  const p = page ? parseInt(page, 10) : 1;

  const where: Prisma.UserWhereInput = {
    role: "REPORTER",
    ...(search
      ? {
          OR: [
            { username: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  // 3) Fetch data + count in a transaction
  const [data, count] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: {
        organization: { select: { id: true, name: true } },
        _count: { select: { followers: true, articles: true } },
      },
      skip: ITEM_PER_PAGE * (p - 1),
      take: ITEM_PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  // 4) Table column definitions
  // const columns = [
  //   { header: "Info", accessor: "info" },
  //   { header: "Organization", accessor: "organization", className: "hidden md:table-cell" },
  //   { header: "Articles", accessor: "articlesCount", className: "hidden md:table-cell" },
  //   { header: "Followers", accessor: "followersCount", className: "hidden lg:table-cell" },
  // ];
  // inside your Reporter list page
const columns = [
  {
    header: "Reporter",
    render: (item: ReporterListItem) => (
      <div className="flex items-center gap-4">
        <Image
          src={(item as any).avatarUrl || "/noAvatar.png"}
          alt=""
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <Link
            href={`/reporters/${item.id}`}
            className="font-semibold hover:underline"
          >
            {item.username ?? item.email}
          </Link>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Organization",
    className: "hidden md:table-cell",
    render: (item: ReporterListItem) => item.organization?.name ?? "Independent",
  },
  {
    header: "Articles",
    className: "hidden md:table-cell",
    render: (item: ReporterListItem) => item._count.articles,

  },
  {
    header: "Followers",
    className: "hidden lg:table-cell",
    render: (item: ReporterListItem) => item._count.followers,

  },
];



  // 5) Render each row

  console.log("Data fetched:", data);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">All Reporters</h1>
        <div className="flex items-center gap-4">
          <TableSearch placeholder="Search reporters..." />
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} data={data as ReporterListItem[]} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
  );
}
