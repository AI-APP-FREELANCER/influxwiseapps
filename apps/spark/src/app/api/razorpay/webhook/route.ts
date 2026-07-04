import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyRazorpayWebhook } from "@influxwise/billing";
import { db } from "@influxwise/db";
import { PRICING } from "@influxwise/config";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("x-razorpay-signature") ?? "";

  if (!verifyRazorpayWebhook(body, sig, process.env.RAZORPAY_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as {
    event: string;
    payload: { payment: { entity: { id: string; order_id: string; amount: number; notes: Record<string, string> } } };
  };

  const payment = event.payload?.payment?.entity;
  if (!payment) return NextResponse.json({ received: true });

  await db.paymentEvent.upsert({
    where: { id: payment.id },
    update: {},
    create: { id: payment.id, type: event.event, app: "spark", payload: event as object },
  });

  if (event.event === "payment.captured") {
    const notes = payment.notes ?? {};
    if (notes.app === "spark" && notes.userId) {
      const bundleIndex = parseInt(notes.bundleIndex ?? "0");
      const bundle = PRICING.spark.creditBundles[bundleIndex];
      if (bundle) {
        const credit = await db.sparkCredit.upsert({
          where: { userId: notes.userId },
          update: { balance: { increment: payment.amount } },
          create: { userId: notes.userId, balance: payment.amount },
        });

        await db.sparkTransaction.create({
          data: {
            creditId: credit.id,
            amount: payment.amount,
            description: `Top-up: ${bundle.label} bundle`,
          },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
