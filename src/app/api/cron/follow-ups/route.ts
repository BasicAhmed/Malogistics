import { NextRequest, NextResponse } from "next/server";
import { getOrdersDueForFollowUp, advanceFollowUp } from "@/lib/store";
import { sendFollowUpEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Triggered daily by Vercel Cron (see vercel.json). Protected by CRON_SECRET
// so it can't be hit by randoms — Vercel sends this automatically for its
// own cron invocations when the env var is set.
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await getOrdersDueForFollowUp();
  const results = [];

  for (const order of due) {
    const stage = (order.followUpStage ?? 0) as 0 | 1;
    const emailResult = await sendFollowUpEmail(order, stage);
    // Stage 0 -> send again in 3 days as stage 1. Stage 1 -> final, no more scheduled.
    await advanceFollowUp(order.id, stage === 0 ? 3 : null);
    results.push({ orderId: order.id, trackingNumber: order.trackingNumber, stage, emailResult });
  }

  return NextResponse.json({ processed: results.length, results });
}
