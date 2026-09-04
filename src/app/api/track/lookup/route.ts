import { NextRequest, NextResponse } from "next/server";
import { getOrdersByContact } from "@/lib/store";
import { STATUS_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { contact } = await req.json();
  if (!contact || contact.trim().length < 4) {
    return NextResponse.json({ error: "Enter a valid email or phone number." }, { status: 400 });
  }

  const orders = await getOrdersByContact(contact);

  return NextResponse.json({
    results: orders.map((o) => ({
      trackingNumber: o.trackingNumber,
      statusLabel: STATUS_LABELS[o.status],
      origin: o.origin,
      destination: o.destination,
      createdAt: o.createdAt,
    })),
  });
}
