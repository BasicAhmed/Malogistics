import { NextRequest, NextResponse } from "next/server";
import { listOrders, createOrder } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    goodsType,
    origin,
    destination,
    details,
    urgency,
    name,
    company,
    phone,
    email,
    corridor,
    quoteAmount,
    status,
  } = body;

  if (!name || !phone || !email) {
    return NextResponse.json({ error: "Missing required contact details" }, { status: 400 });
  }

  const order = await createOrder({
    source: "sales_manual",
    goodsType: goodsType || "",
    origin: origin || "",
    destination: destination || "",
    details: details || "",
    urgency: urgency || "",
    name,
    company,
    phone,
    email,
    corridor,
    quoteAmount: quoteAmount ? Number(quoteAmount) : undefined,
    status: status || "quoted",
  });

  return NextResponse.json({ order });
}
