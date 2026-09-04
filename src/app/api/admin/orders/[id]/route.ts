import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/store";
import { sendTrackingEmail, sendInTransitEmail, sendDeliveredEmail, sendCancelledEmail } from "@/lib/email";
import { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { status, quoteAmount, corridor, onTime } = body as {
    status: OrderStatus;
    quoteAmount?: number;
    corridor?: string;
    onTime?: boolean;
  };

  const existing = await getOrderById(params.id);
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Only email when the status is genuinely changing to something new —
  // avoids re-sending if an order is nudged back to a status it already had.
  const statusChanged = existing.status !== status;

  const updated = await updateOrderStatus(params.id, status, { quoteAmount, corridor, onTime });

  let emailResult = null;
  if (updated && statusChanged) {
    if (status === "confirmed") {
      emailResult = await sendTrackingEmail(updated);
    } else if (status === "in_transit") {
      emailResult = await sendInTransitEmail(updated);
    } else if (status === "delivered") {
      emailResult = await sendDeliveredEmail(updated);
    } else if (status === "cancelled") {
      emailResult = await sendCancelledEmail(updated);
    }
  }

  return NextResponse.json({ order: updated, emailResult });
}
