import { NextRequest, NextResponse } from "next/server";
import { getOrderById, saveQuote, getPricingConfig } from "@/lib/store";
import { sendQuotationEmail } from "@/lib/email";
import { calculateQuote, validateQuoteInput, QuoteInput } from "@/lib/pricing";
import { generateQuotePdf } from "@/lib/pdf";
import { isKnownLocation } from "@/lib/locations";
import { getAdminName } from "@/lib/auth";
import { sendAdminNotification } from "@/lib/email";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { orderId, category, weightKg, volumeM3, distanceKm, scope, urgency, crossBorder, corridor, origin, destination } =
    body as QuoteInput & { orderId: string; corridor?: string; origin?: string; destination?: string };

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

  // Backend independently validates and calculates — the client never
  // sends a price, only raw shipment facts, so nothing here can be
  // manipulated from the frontend.
  const errors = validateQuoteInput(inputs);
  if (
    inputs.scope === "regional" &&
    origin &&
    destination &&
    origin.trim().toLowerCase() === destination.trim().toLowerCase()
  ) {
    errors.push({
      field: "destination",
      message: "Origin and destination are the same — use \"Local / in-city\" scope instead.",
    });
  }
  if (origin && !isKnownLocation(origin)) {
    errors.push({ field: "origin", message: "Origin isn't a recognized location." });
  }
  if (destination && !isKnownLocation(destination)) {
    errors.push({ field: "destination", message: "Destination isn't a recognized location." });
  }
  if (errors.length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
  }

  const config = await getPricingConfig();
  const breakdown = calculateQuote(inputs, config);

  const finalOrigin = origin || order.origin;
  const finalDestination = destination || order.destination;

  const updated = await saveQuote(orderId, {
    quoteAmount: breakdown.total,
    corridor: corridor || `${finalOrigin} → ${finalDestination}`,
    breakdown,
    inputs,
    followUpDays: 2,
    by: getAdminName(),
  });

  if (!updated) {
    return NextResponse.json({ error: "Failed to save quote" }, { status: 500 });
  }

  let pdfBase64: string | undefined;
  let pdfError: string | undefined;
  try {
    const pdfBuffer = await generateQuotePdf(updated, breakdown, config);
    pdfBase64 = pdfBuffer.toString("base64");
  } catch (err: any) {
    console.error("PDF generation failed", err);
    pdfError = err?.message || "PDF generation failed";
  }

  const emailResult = await sendQuotationEmail(updated, breakdown, pdfBase64);

  await sendAdminNotification(
    "Quote sent to customer",
    updated,
    `${formatCurrency(breakdown.total)} — sent by ${getAdminName() ?? "Admin"}`
  );

  return NextResponse.json({ order: updated, breakdown, emailResult, pdfAttached: !!pdfBase64, pdfError });
}
