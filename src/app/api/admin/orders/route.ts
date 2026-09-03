import { NextRequest, NextResponse } from "next/server";
import { listOrders, createOrder } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const status = searchParams.get("status") || undefined;
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "25");

  const result = await listOrders({ q, status, page, pageSize });
  return NextResponse.json(result);
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
