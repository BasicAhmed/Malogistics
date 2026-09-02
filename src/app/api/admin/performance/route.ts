import { NextResponse } from "next/server";
import { performanceStats } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await performanceStats());
}
