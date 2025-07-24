"use client";

import { useUser } from "@clerk/nextjs";

export function useUserRole(): "REPORTER" | "READER" | null {
  const { isLoaded, user } = useUser();
  if (!isLoaded || !user) return null;
  const role = user.publicMetadata?.role as string;
  return role === "REPORTER" ? "REPORTER" : "READER";
}