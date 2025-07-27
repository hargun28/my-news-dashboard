import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDbUserAndOrg } from "@/lib/get-db-user";
import fs from "fs/promises";
import path from "path";

interface Body {
  title?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
}

export async function POST(req: Request) {
  const viewer = await getDbUserAndOrg();
  if (!viewer) return new NextResponse("Unauthorized", { status: 401 });

  let title: string | null = null;
  let description: string | null = null;
  let category: string | null = null;
  let imageUrl: string | null = null;
  let file: File | null = null;

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    title = form.get("title") as string | null;
    description = form.get("description") as string | null;
    category = form.get("category") as string | null;
    const uploaded = form.get("image");
    if (uploaded instanceof File && uploaded.size > 0) {
      file = uploaded;
    }
  } else {
    const body: Body = await req.json().catch(() => ({}));
    title = body.title ?? null;
    description = body.description ?? null;
    category = body.category ?? null;
    imageUrl = body.imageUrl ?? null;
  }

  if (!title || !description)
    return new NextResponse("Missing fields", { status: 400 });

    if (file) {
    const uploadDir = path.join(process.cwd(), "public", "articles");
    await fs.mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    imageUrl = `/articles/${fileName}`;
   }

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
