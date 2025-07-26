import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDbUserAndOrg } from "@/lib/get-db-user";

interface Body {
  title?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
}

export async function POST(req: Request) {
  const viewer = await getDbUserAndOrg();
  if (!viewer) return new NextResponse("Unauthorized", { status: 401 });

  const { title, description, category, imageUrl }: Body = await req
    .json()
    .catch(() => ({}));

  if (!title || !description)
    return new NextResponse("Missing fields", { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: viewer.id },
    select: { role: true, organizationId: true },
  });
  if (!user || user.role !== "REPORTER")
    return new NextResponse("Forbidden", { status: 403 });

  const article = await prisma.newsArticle.create({
    data: {
      title,
      description,
      content: description,
      category: category || null,
      imageUrl: imageUrl || null,
      authorId: viewer.id,
      organizationId: user.organizationId ?? undefined,
    },
  });

  return NextResponse.json(article);
}
