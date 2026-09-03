import { NextRequest, NextResponse } from "next/server";
import { getOrderById, getPricingConfig } from "@/lib/store";
import { generateQuotePdf } from "@/lib/pdf";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  if (!order || !order.quoteBreakdown) {
    return NextResponse.json({ error: "No quote found for this order" }, { status: 404 });
  }

  // Rendered from the breakdown stored at the moment the quote was sent —
  // so re-downloading later always matches what the customer received,
  // even if pricing config has changed since.
  const config = await getPricingConfig();
  const breakdown = order.quoteBreakdown as any;

  const buffer = await generateQuotePdf(order, breakdown, config);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="MA-Logistics-Quote-${order.trackingNumber}.pdf"`,
    },
  });
}
