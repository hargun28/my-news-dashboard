// lib/get-db-user.ts
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const user = await prisma.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
}
