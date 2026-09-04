import { Order, StatusEvent } from "./types";
import { QuoteBreakdown } from "./pricing";

const FROM = process.env.EMAIL_FROM || "MA Logistics <dispatch@malogistics.co>";
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

export async function sendTrackingEmail(order: Order) {
  const subject = `Your MA Logistics tracking number: ${order.trackingNumber}`;
  const body = `
    <p style="font-size:15px;">Hi ${order.name},</p>
    <p style="font-size:15px;line-height:1.6;">Your shipment has been confirmed. Here's your reference — save it, you'll use it to check status any time.</p>
    <table role="presentation" width="100%" style="background:${BRAND.fog}40;border-radius:6px;margin:20px 0;">
      <tr><td style="padding:16px 20px;">
        <p style="font-family:monospace;font-size:11px;color:${BRAND.steel};margin:0 0 4px;">TRACKING NUMBER</p>
        <p style="font-family:monospace;font-size:22px;font-weight:bold;color:${BRAND.maroon};margin:0;">${order.trackingNumber}</p>
      </td></tr>
    </table>
    <p style="font-size:14px;color:${BRAND.steel};">Route: ${order.origin} → ${order.destination}<br/>Goods: ${order.goodsType}</p>
    <p style="font-size:14px;">Track it any time at <a href="https://malogistics.vercel.app/track" style="color:${BRAND.maroon};">malogistics.vercel.app/track</a>.</p>
    <p style="font-size:15px;margin-top:24px;">— MA Logistics<br/><span style="color:${BRAND.steel};font-size:13px;">Delivered without hassle.</span></p>
  `;
  const text = `Hi ${order.name},\n\nYour shipment has been confirmed.\nTracking number: ${order.trackingNumber}\nRoute: ${order.origin} → ${order.destination}\n\nTrack it at malogistics.vercel.app/track\n\n— MA Logistics`;
  return dispatch(order.email, subject, wrapEmail(body, `Tracking number ${order.trackingNumber}`), text);
}

export async function sendQuotationEmail(order: Order, breakdown: QuoteBreakdown, pdfBase64?: string) {
  const subject = `Your MA Logistics quote — ${order.origin} → ${order.destination}`;

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
    <p style="font-size:15px;">Hi ${order.name},</p>
    <p style="font-size:15px;line-height:1.6;">Here's your quote for ${order.origin} → ${order.destination}. Full breakdown below, and a PDF copy is attached for your records. Reply to this email and we'll get it moving — or let us know if anything about the shipment changes and we'll adjust it.</p>
    <table role="presentation" width="100%" style="margin:20px 0;border-top:1px solid ${BRAND.fog};padding-top:8px;">
      ${lines.join("")}
      <tr><td colspan="2" style="border-top:2px solid ${BRAND.maroon};padding-top:10px;"></td></tr>
      ${moneyRow("Total", breakdown.total, { bold: true })}
    </table>
    <p style="font-size:13px;color:${BRAND.steel};">Reference: ${order.trackingNumber} · Goods: ${order.goodsType}</p>
    <p style="font-size:14px;margin-top:20px;">This quote is valid for 7 days. Confirm any time by replying "confirmed" or calling your dispatcher directly.</p>
    <p style="font-size:15px;margin-top:24px;">— MA Logistics<br/><span style="color:${BRAND.steel};font-size:13px;">Delivered without hassle.</span></p>
  `;

  const text = `Hi ${order.name},\n\nYour quote for ${order.origin} → ${order.destination}:\nTotal: R ${breakdown.total.toLocaleString(
    "en-ZA"
  )}\n\nReference: ${order.trackingNumber}\n\nReply to confirm.\n\n— MA Logistics`;

  const attachments = pdfBase64
    ? [{ filename: `MA-Logistics-Quote-${order.trackingNumber}.pdf`, content: pdfBase64 }]
    : undefined;

  return dispatch(
    order.email,
    subject,
    wrapEmail(body, `Your quote: R ${Math.round(breakdown.total).toLocaleString()}`),
    text,
    attachments
  );
}

const FOLLOW_UP_COPY = [
  {
    subject: (o: Order) => `Still good for ${o.origin} → ${o.destination}?`,
    body: (o: Order) => `
      <p style="font-size:15px;">Hi ${o.name},</p>
      <p style="font-size:15px;line-height:1.6;">Just checking in — your quote for ${o.origin} → ${o.destination} (ref ${o.trackingNumber}) is still open. No pressure, just didn't want it to slip through the cracks on our end.</p>
      <p style="font-size:15px;line-height:1.6;">Reply any time if you'd like to confirm, adjust the details, or ask a question.</p>
      <p style="font-size:15px;margin-top:24px;">— MA Logistics</p>
    `,
  },
  {
    subject: (o: Order) => `Last check — quote for ${o.trackingNumber}`,
    body: (o: Order) => `
      <p style="font-size:15px;">Hi ${o.name},</p>
      <p style="font-size:15px;line-height:1.6;">This is our last follow-up on the quote for ${o.origin} → ${o.destination} (ref ${o.trackingNumber}). We'll assume the timing isn't right for now — but the quote details are saved, so just reply whenever you're ready and we'll pick it back up.</p>
      <p style="font-size:15px;margin-top:24px;">— MA Logistics</p>
    `,
  },
];

export async function sendFollowUpEmail(order: Order, stage: 0 | 1) {
  const copy = FOLLOW_UP_COPY[stage];
  const html = wrapEmail(copy.body(order), copy.subject(order));
  const text = `Hi ${order.name},\n\nFollowing up on your quote for ${order.origin} → ${order.destination} (ref ${order.trackingNumber}). Reply any time.\n\n— MA Logistics`;
  return dispatch(order.email, copy.subject(order), html, text);
}
