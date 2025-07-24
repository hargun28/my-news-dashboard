import { NextResponse } from "next/server";
import { searchReporters } from "@/lib/reporters";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  const url = new URL(req.url || "");
  const query = url.searchParams.get("query") || "";
  const results = await searchReporters(query, userId || undefined);
  return NextResponse.json(results);
}