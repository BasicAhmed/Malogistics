import { NextRequest, NextResponse } from "next/server";
import { getOrderByTrackingNumber } from "@/lib/store";
import { STATUS_LABELS } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: { ref: string } }) {
  const order = getOrderByTrackingNumber(params.ref);

  if (!order) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  // Only expose what a customer should see — no internal notes/quote value.
  return NextResponse.json({
    found: true,
    trackingNumber: order.trackingNumber,
    status: order.status,
    statusLabel: STATUS_LABELS[order.status],
    origin: order.origin,
    destination: order.destination,
    goodsType: order.goodsType,
    history: order.history.map((h) => ({
      status: h.status,
      label: STATUS_LABELS[h.status],
      at: h.at,
    })),
    updatedAt: order.updatedAt,
  });
}
