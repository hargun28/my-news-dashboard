import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getDbUserAndOrg() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const user = await prisma.user.findUnique({ 
    where: { clerkId },
    select: { id: true, organizationId: true },
  });
  return user;
}
