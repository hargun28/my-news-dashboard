import { NextResponse } from "next/server";
import { listReporters } from "@/lib/reporters";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  const url = new URL(req.url || "");
  const take = parseInt(url.searchParams.get("take") || "10", 10);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const skip = (page - 1) * take;
  const reporters = await listReporters(skip, take, userId || undefined);
  return NextResponse.json(reporters);
}