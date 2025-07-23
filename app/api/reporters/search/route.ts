import { NextResponse } from "next/server";
import { searchReporters } from "@/lib/reporters";
import { getDbUserId } from "@/lib/get-db-user";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const userId = await getDbUserId();
  const results = await searchReporters(q, userId ?? undefined);
  return NextResponse.json(results);
}
