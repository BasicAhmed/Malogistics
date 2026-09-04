import { NextResponse } from "next/server";
import { getPricingConfig } from "@/lib/store";

export const dynamic = "force-dynamic";

// Public and read-only on purpose — the enquiry form needs this to show a
// live estimate before submitting. No write access lives at this path.
export async function GET() {
  return NextResponse.json(await getPricingConfig());
}
