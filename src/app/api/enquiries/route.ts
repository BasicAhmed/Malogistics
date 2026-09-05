import { NextRequest, NextResponse } from "next/server";
import { createOrder, countRecentEnquiries } from "@/lib/store";
import { isKnownLocation } from "@/lib/locations";
import { sendAdminNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { goodsType, origin, destination, details, urgency, name, company, phone, email } = body;

  if (!name || !phone || !email) {
    return NextResponse.json({ error: "Missing required contact details" }, { status: 400 });
  }

  if (origin && !isKnownLocation(origin)) {
    return NextResponse.json({ error: "Origin isn't a recognized location." }, { status: 400 });
  }
  if (destination && !isKnownLocation(destination)) {
    return NextResponse.json({ error: "Destination isn't a recognized location." }, { status: 400 });
  }

  const recentCount = await countRecentEnquiries(email, 10);
  if (recentCount >= 3) {
    return NextResponse.json(
      { error: "You've submitted a few enquiries already — a dispatcher will be in touch shortly. Please wait before submitting again." },
      { status: 429 }
    );
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

  await sendAdminNotification("New enquiry received", order, details);

  return NextResponse.json({
    trackingNumber: order.trackingNumber,
    status: order.status,
  });
}
