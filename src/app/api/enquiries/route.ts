import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/store";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { goodsType, origin, destination, details, urgency, name, company, phone, email } = body;

  if (!name || !phone || !email) {
    return NextResponse.json({ error: "Missing required contact details" }, { status: 400 });
  }

  const order = await createOrder({
    source: "web_enquiry",
    goodsType: goodsType || "",
    origin: origin || "",
    destination: destination || "",
    details: details || "",
    urgency: urgency || "",
    name,
    company,
    phone,
    email,
  });

  return NextResponse.json({
    trackingNumber: order.trackingNumber,
    status: order.status,
  });
}
