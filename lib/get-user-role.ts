// import { currentUser } from "@clerk/nextjs/server";

// export type UserRole = "REPORTER" | "READER";

// export async function getUserRole(): Promise<UserRole> {
//   const user = await currentUser();
//   const role = user?.publicMetadata?.role;
//   if (role === "REPORTER") return "REPORTER";
//   return "READER";
// }

// components/hooks/useUserRole.ts
"use client";
import { useUser } from "@clerk/nextjs";

export function useUserRole(): "REPORTER" | "READER" | null {
  const { isLoaded, user } = useUser();
  if (!isLoaded || !user) return null;
  const role = user.publicMetadata?.role as string;
  return role === "REPORTER" ? "REPORTER" : "READER";
}
