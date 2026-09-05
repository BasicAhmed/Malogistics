import { Order } from "./types";
import { QuoteBreakdown } from "./pricing";

const FROM = process.env.EMAIL_FROM || "MA Logistics <dispatch@malogisticsza.com>";
const BRAND = {
  maroon: "#3C0008",
  deckMaroon: "#5A0010",
  amber: "#E8A33D",
  paper: "#F4F1EC",
  steel: "#4A2A2E",
  fog: "#D8C9CC",
};

function wrapEmail(bodyHtml: string, preheader: string): string {
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:${BRAND.paper};font-family:Arial,Helvetica,sans-serif;color:${BRAND.maroon};">
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:${BRAND.maroon};border-radius:8px;overflow:hidden;max-width:560px;width:100%;">
        <tr><td style="padding:28px 32px 20px;">
          <div style="font-family:Arial,sans-serif;font-weight:bold;font-size:18px;color:${BRAND.paper};">
            M<span style="color:${BRAND.amber};">/</span> MA Logistics
          </div>
        </td></tr>
        <tr><td style="background:${BRAND.paper};padding:32px;border-radius:0 0 8px 8px;">
          ${bodyHtml}
        </td></tr>
      </table>
      <table role="presentation" width="560" style="max-width:560px;width:100%;">
        <tr><td style="padding:16px 32px;text-align:center;">
          <p style="font-family:monospace;font-size:11px;color:${BRAND.steel};margin:0;">
            MA Logistics · 5 Whitford Road, Germiston, Lambton
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function moneyRow(label: string, amount: number, opts?: { bold?: boolean; muted?: boolean }) {
  const weight = opts?.bold ? "bold" : "normal";
  const color = opts?.muted ? BRAND.steel : BRAND.maroon;
  return `<tr>
    <td style="padding:6px 0;font-size:14px;color:${color};font-weight:${weight};">${label}</td>
    <td style="padding:6px 0;font-size:14px;color:${color};font-weight:${weight};text-align:right;">R ${amount.toLocaleString(
    "en-ZA",
    { maximumFractionDigits: 0 }
  )}</td>
  </tr>`;
}

async function dispatch(
  to: string,
  subject: string,
  html: string,
  text: string,
  attachments?: { filename: string; content: string }[]
) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[email:not-configured] Would send to", to, "\n", subject);
    return { sent: false, reason: "RESEND_API_KEY not set" };
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: FROM, to, subject, html, text, attachments });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send email", err);
    return { sent: false, reason: "send_failed" };
  }
}

function signOff(name = "The MA Logistics team") {
  return `<p style="font-size:15px;margin-top:26px;">Speak soon,<br/>${name}<br/><span style="color:${BRAND.steel};font-size:13px;">MA Logistics — we arrange it, you forget the hassle.</span></p>`;
}

// ---- Confirmed: tracking number ----
export async function sendTrackingEmail(order: Order) {
  const subject = `You're all set — here's your tracking number 🚚`;
  const body = `
    <p style="font-size:15px;">Hey ${order.name.split(" ")[0]},</p>
    <p style="font-size:15px;line-height:1.6;">Good news — your shipment is confirmed and locked in. Here's the number to keep handy:</p>
    <table role="presentation" width="100%" style="background:${BRAND.fog}40;border-radius:6px;margin:20px 0;">
      <tr><td style="padding:16px 20px;">
        <p style="font-family:monospace;font-size:11px;color:${BRAND.steel};margin:0 0 4px;">TRACKING NUMBER</p>
        <p style="font-family:monospace;font-size:22px;font-weight:bold;color:${BRAND.maroon};margin:0;">${order.trackingNumber}</p>
      </td></tr>
    </table>
    <p style="font-size:14px;color:${BRAND.steel};">Route: ${order.origin} → ${order.destination}<br/>Goods: ${order.goodsType}</p>
    <p style="font-size:14px;line-height:1.6;">You can check on it any time at <a href="https://malogisticsza.com/track" style="color:${BRAND.maroon};">malogisticsza.com/track</a> — and we'll keep you posted as it moves, so you shouldn't need to.</p>
  `;
  const text = `Hey ${order.name.split(" ")[0]},\n\nYour shipment is confirmed. Tracking number: ${order.trackingNumber}\nRoute: ${order.origin} → ${order.destination}\n\nTrack it any time at malogisticsza.com/track\n\n— MA Logistics`;
  return dispatch(order.email, subject, wrapEmail(body + signOff(), `Tracking number ${order.trackingNumber}`), text);
}

// ---- In transit ----
export async function sendInTransitEmail(order: Order) {
  const subject = `It's moving! Your shipment is on its way`;
  const body = `
    <p style="font-size:15px;">Hey ${order.name.split(" ")[0]},</p>
    <p style="font-size:15px;line-height:1.6;">Quick update — your shipment just left and is now on its way from ${order.origin} to ${order.destination}. Nothing you need to do, just wanted you in the loop.</p>
    <p style="font-size:14px;color:${BRAND.steel};">Reference: ${order.trackingNumber}</p>
    <p style="font-size:14px;line-height:1.6;">You can follow along any time at <a href="https://malogisticsza.com/track" style="color:${BRAND.maroon};">malogisticsza.com/track</a>. We'll let you know the moment it lands.</p>
  `;
  const text = `Hey ${order.name.split(" ")[0]},\n\nYour shipment (${order.trackingNumber}) is on its way from ${order.origin} to ${order.destination}. Track it at malogisticsza.com/track\n\n— MA Logistics`;
  return dispatch(order.email, subject, wrapEmail(body + signOff(), "Your shipment is on the move"), text);
}

// ---- Delivered ----
export async function sendDeliveredEmail(order: Order) {
  const subject = `Delivered! 🎉 ${order.trackingNumber}`;
  const body = `
    <p style="font-size:15px;">Hey ${order.name.split(" ")[0]},</p>
    <p style="font-size:15px;line-height:1.6;">Your shipment has arrived — ${order.origin} to ${order.destination}, done. Thanks for trusting us with it.</p>
    <p style="font-size:14px;color:${BRAND.steel};">Reference: ${order.trackingNumber}</p>
    <p style="font-size:15px;line-height:1.6;">If anything about the delivery wasn't right, just reply to this email — a real person reads these. And if you've got another shipment coming up, we'd love to help again.</p>
  `;
  const text = `Hey ${order.name.split(" ")[0]},\n\nYour shipment (${order.trackingNumber}) has been delivered — ${order.origin} to ${order.destination}. Thanks for choosing us!\n\n— MA Logistics`;
  return dispatch(order.email, subject, wrapEmail(body + signOff(), "Your shipment has arrived"), text);
}

// ---- Cancelled ----
export async function sendCancelledEmail(order: Order) {
  const subject = `Your shipment (${order.trackingNumber}) has been cancelled`;
  const body = `
    <p style="font-size:15px;">Hey ${order.name.split(" ")[0]},</p>
    <p style="font-size:15px;line-height:1.6;">Just confirming this shipment (${order.origin} → ${order.destination}, ref ${order.trackingNumber}) has been cancelled. No charges, no follow-up needed.</p>
    <p style="font-size:15px;line-height:1.6;">If this was a mistake, or you'd like to get a new quote whenever the timing's right, just reply — happy to help.</p>
  `;
  const text = `Hey ${order.name.split(" ")[0]},\n\nYour shipment (${order.trackingNumber}) has been cancelled. Reply any time if you'd like to requote.\n\n— MA Logistics`;
  return dispatch(order.email, subject, wrapEmail(body + signOff(), "Shipment cancelled"), text);
}

// ---- Quotation ----
export async function sendQuotationEmail(order: Order, breakdown: QuoteBreakdown, pdfBase64?: string) {
  const subject = `Here's your quote — ${order.origin} → ${order.destination}`;

  const lines: string[] = [];
  lines.push(moneyRow("Base price", breakdown.basePrice));
  lines.push(moneyRow("Weight charge", breakdown.weightCost));
  if (breakdown.distanceCost > 0) lines.push(moneyRow("Distance charge", breakdown.distanceCost));
  lines.push(moneyRow("Volume charge", breakdown.volumeCost));
  if (breakdown.coldChainFee > 0) lines.push(moneyRow("Cold-chain handling", breakdown.coldChainFee));
  if (breakdown.containerHandlingFee > 0)
    lines.push(moneyRow("Container handling", breakdown.containerHandlingFee));
  if (breakdown.crossBorderFee > 0)
    lines.push(moneyRow("Cross-border clearance", breakdown.crossBorderFee));
  if (breakdown.urgencySurcharge > 0)
    lines.push(moneyRow(`Urgency (${breakdown.urgencyPct}%)`, breakdown.urgencySurcharge));
  lines.push(
    moneyRow(breakdown.taxPct > 0 ? `VAT (${breakdown.taxPct}%)` : "VAT (zero-rated, cross-border)", breakdown.tax, {
      muted: true,
    })
  );

  const body = `
    <p style="font-size:15px;">Hey ${order.name.split(" ")[0]},</p>
    <p style="font-size:15px;line-height:1.6;">Here's what it'll cost to move your shipment from ${order.origin} to ${order.destination} — full breakdown below, and a PDF copy is attached to keep for your records.</p>
    <table role="presentation" width="100%" style="margin:20px 0;border-top:1px solid ${BRAND.fog};padding-top:8px;">
      ${lines.join("")}
      <tr><td colspan="2" style="border-top:2px solid ${BRAND.maroon};padding-top:10px;"></td></tr>
      ${moneyRow("Total", breakdown.total, { bold: true })}
    </table>
    <p style="font-size:13px;color:${BRAND.steel};">Reference: ${order.trackingNumber} · Goods: ${order.goodsType}</p>
    <p style="font-size:14px;line-height:1.6;margin-top:20px;">Happy with it? Just reply "confirmed" and we'll get moving. Got questions, or need something adjusted — reply here too, a real dispatcher reads these. This quote's good for 7 days.</p>
  `;

  const text = `Hey ${order.name.split(" ")[0]},\n\nYour quote for ${order.origin} → ${order.destination}:\nTotal: R ${breakdown.total.toLocaleString(
    "en-ZA"
  )}\n\nReference: ${order.trackingNumber}\n\nReply "confirmed" any time to get moving.\n\n— MA Logistics`;

  const attachments = pdfBase64
    ? [{ filename: `MA-Logistics-Quote-${order.trackingNumber}.pdf`, content: pdfBase64 }]
    : undefined;

  return dispatch(
    order.email,
    subject,
    wrapEmail(body + signOff(), `Your quote: R ${Math.round(breakdown.total).toLocaleString()}`),
    text,
    attachments
  );
}

// ---- Follow-ups on an unconfirmed quote ----
const FOLLOW_UP_COPY = [
  {
    subject: (o: Order) => `Still thinking it over?`,
    body: (o: Order) => `
      <p style="font-size:15px;">Hey ${o.name.split(" ")[0]},</p>
      <p style="font-size:15px;line-height:1.6;">Just floating this back to the top of your inbox — your quote for ${o.origin} → ${o.destination} (ref ${o.trackingNumber}) is still open whenever you're ready.</p>
      <p style="font-size:15px;line-height:1.6;">No pressure at all. Reply if you'd like to confirm, tweak anything, or just ask a question.</p>
    `,
  },
  {
    subject: (o: Order) => `Last nudge on ${o.trackingNumber}, promise`,
    body: (o: Order) => `
      <p style="font-size:15px;">Hey ${o.name.split(" ")[0]},</p>
      <p style="font-size:15px;line-height:1.6;">Last check-in on the quote for ${o.origin} → ${o.destination} (ref ${o.trackingNumber}) — we'll leave it with you from here. Everything's saved, so whenever the timing's right, just reply and we'll pick it straight back up. No expiry, no awkwardness.</p>
    `,
  },
];

export async function sendFollowUpEmail(order: Order, stage: 0 | 1) {
  const copy = FOLLOW_UP_COPY[stage];
  const html = wrapEmail(copy.body(order) + signOff(), copy.subject(order));
  const text = `Hey ${order.name.split(" ")[0]},\n\nFollowing up on your quote for ${order.origin} → ${order.destination} (ref ${order.trackingNumber}). Reply any time.\n\n— MA Logistics`;
  return dispatch(order.email, copy.subject(order), html, text);
}
