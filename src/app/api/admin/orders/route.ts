import { NextRequest, NextResponse } from "next/server";
import { listOrders, createOrder } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ orders: listOrders() });
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

  const order = createOrder({
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
