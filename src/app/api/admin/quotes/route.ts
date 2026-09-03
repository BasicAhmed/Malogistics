import { NextRequest, NextResponse } from "next/server";
import { getOrderById, saveQuote } from "@/lib/store";
import { sendQuotationEmail } from "@/lib/email";
import { calculateQuote, QuoteInput } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, category, weightKg, volumeM3, distanceKm, scope, urgency, crossBorder, corridor } =
    body as QuoteInput & { orderId: string; corridor?: string };

  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const inputs: QuoteInput = {
    category,
    weightKg: Number(weightKg) || 0,
    volumeM3: Number(volumeM3) || 0,
    distanceKm: Number(distanceKm) || 0,
    scope,
    urgency,
    crossBorder: !!crossBorder,
  };

  const breakdown = calculateQuote(inputs);

  const updated = await saveQuote(orderId, {
    quoteAmount: breakdown.total,
    corridor,
    breakdown,
    inputs,
    followUpDays: 2,
  });

  if (!updated) {
    return NextResponse.json({ error: "Failed to save quote" }, { status: 500 });
  }

  const emailResult = await sendQuotationEmail(updated, breakdown);

  return NextResponse.json({ order: updated, breakdown, emailResult });
}
