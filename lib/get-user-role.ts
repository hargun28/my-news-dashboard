import { currentUser } from "@clerk/nextjs/server";

export type UserRole = "REPORTER" | "READER";

export async function getUserRole(): Promise<UserRole> {
  const user = await currentUser();
  const role = user?.publicMetadata?.role;
  if (role === "REPORTER") return "REPORTER";
  return "READER";
}