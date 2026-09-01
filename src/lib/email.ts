import { Order } from "./types";

const FROM = process.env.EMAIL_FROM || "MA Logistics <dispatch@malogistics.co>";

export async function sendTrackingEmail(order: Order) {
  const subject = `Your MA Logistics tracking number: ${order.trackingNumber}`;
  const body = `Hi ${order.name},

Your shipment has been confirmed.

Tracking number: ${order.trackingNumber}
Route: ${order.origin} → ${order.destination}
Goods: ${order.goodsType}

Track it any time at malogistics.co/track using the number above.

— MA Logistics
Delivered without hassle.`;

  if (!process.env.RESEND_API_KEY) {
    // No email provider configured yet — log instead of failing silently.
    console.log("[email:not-configured] Would send to", order.email, "\n", subject, "\n", body);
    return { sent: false, reason: "RESEND_API_KEY not set" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject,
      text: body,
    });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send tracking email", err);
    return { sent: false, reason: "send_failed" };
  }
}
