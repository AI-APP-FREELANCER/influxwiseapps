import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyRazorpayWebhook } from "@influxwise/billing";
import { db } from "@influxwise/db";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("x-razorpay-signature") ?? "";

  if (!verifyRazorpayWebhook(body, sig, process.env.RAZORPAY_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as {
    event: string;
    payload: { payment: { entity: { id: string; order_id: string; notes: Record<string, string> } } };
  };

  const payment = event.payload?.payment?.entity;
  if (!payment) return NextResponse.json({ received: true });

  await db.paymentEvent.upsert({
    where: { id: payment.id },
    update: {},
    create: { id: payment.id, type: event.event, app: "pad", payload: event as object },
  });

  if (event.event === "payment.captured") {
    const notes = payment.notes ?? {};
    if (notes.app === "pad" && notes.bookingId) {
      await db.booking.update({
        where: { id: notes.bookingId },
        data: { status: "CONFIRMED", razorpayPaymentId: payment.id },
      });
    }
  }

  if (event.event === "payment.failed") {
    const notes = payment.notes ?? {};
    if (notes.app === "pad" && notes.bookingId) {
      await db.booking.update({
        where: { id: notes.bookingId },
        data: { status: "CANCELLED" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
