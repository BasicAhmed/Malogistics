import { NextRequest, NextResponse } from "next/server";
import { getPricingConfig, updatePricingConfig } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPricingConfig());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = await updatePricingConfig(body);
  return NextResponse.json(updated);
}
