import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDbUserAndOrg } from "@/lib/get-db-user";

type Body = { reporterId?: string };

export async function POST(req: Request) {
  const viewer = await getDbUserAndOrg();
  const dbUserId = viewer?.id;  if (!dbUserId) return new NextResponse("Unauthorized", { status: 401 });

  const { reporterId }: Body = await req.json().catch(() => ({}));
  if (!reporterId) return new NextResponse("Missing reporterId", { status: 400 });
  if (reporterId === dbUserId) return new NextResponse("Cannot follow yourself", { status: 400 });

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: dbUserId, followingId: reporterId } },
    create: { followerId: dbUserId, followingId: reporterId },
    update: {},
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const viewer = await getDbUserAndOrg();
  const dbUserId = viewer?.id;  if (!dbUserId) return new NextResponse("Unauthorized", { status: 401 });

  const { reporterId }: Body = await req.json().catch(() => ({}));
  if (!reporterId) return new NextResponse("Missing reporterId", { status: 400 });

  await prisma.follow
    .delete({
      where: { followerId_followingId: { followerId: dbUserId, followingId: reporterId } },
    })
    .catch(() => { /* ignore if not following */ });

  return NextResponse.json({ ok: true });
}
