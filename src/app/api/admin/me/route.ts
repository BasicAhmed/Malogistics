import { NextResponse } from "next/server";
import { getAdminName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ name: getAdminName() ?? "Admin" });
}
