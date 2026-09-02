import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus } from "@/lib/store";
import { sendTrackingEmail } from "@/lib/email";
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

  const wasConfirmedBefore =
    existing.status === "confirmed" ||
    existing.status === "in_transit" ||
    existing.status === "delivered";

  const updated = await updateOrderStatus(params.id, status, { quoteAmount, corridor, onTime });

  let emailResult = null;
  if (status === "confirmed" && !wasConfirmedBefore && updated) {
    emailResult = await sendTrackingEmail(updated);
  }

  return NextResponse.json({ order: updated, emailResult });
}
