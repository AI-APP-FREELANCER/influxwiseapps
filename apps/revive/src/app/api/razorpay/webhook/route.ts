import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyRazorpayWebhook } from "@influxwise/billing";
import { db } from "@influxwise/db";
import { PRICING } from "@influxwise/config";

// Merchants register THIS endpoint as their Razorpay webhook.
// Revive intercepts failed subscription payments and retries them.

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("x-razorpay-signature") ?? "";

  // Each merchant uses our shared webhook secret (they copy it from our dashboard)
  if (!verifyRazorpayWebhook(body, sig, process.env.RAZORPAY_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as {
    event: string;
    account_id?: string;
    payload: {
      subscription?: { entity: { id: string; customer_id: string; charge_at: number } };
      payment?: { entity: { id: string; amount: number; currency: string; error_code?: string } };
    };
  };

  const merchantId = event.account_id;
  if (!merchantId) return NextResponse.json({ received: true });

  const connection = await db.reviveConnection.findFirst({
    where: { merchantId, isActive: true },
  });

  if (!connection) return NextResponse.json({ received: true });

  const sub = event.payload?.subscription?.entity;
  const payment = event.payload?.payment?.entity;
  const eventId = payment?.id ?? sub?.id ?? `evt_${Date.now()}`;

  await db.paymentEvent.upsert({
    where: { id: eventId },
    update: {},
    create: { id: eventId, type: event.event, app: "revive", payload: event as object },
  });

  if (event.event === "subscription.halted" && sub) {
    await db.reviveRecoveryEvent.upsert({
      where: { razorpayEventId: sub.id },
      update: {},
      create: {
        connectionId: connection.id,
        razorpayEventId: sub.id,
        customerId: sub.customer_id,
        amountPaise: payment?.amount ?? 0,
        currency: payment?.currency ?? "INR",
        failureCode: payment?.error_code,
        status: "PENDING",
        nextRetryAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  if (event.event === "subscription.charged" && sub) {
    const recoveryEvent = await db.reviveRecoveryEvent.findFirst({
      where: { razorpayEventId: sub.id, status: "RETRYING" },
    });

    if (recoveryEvent && payment) {
      const feePaise = Math.min(
        Math.max(
          Math.round(payment.amount * PRICING.revive.recoveryFeePercent / 100),
          PRICING.revive.recoveryFeeMin
        ),
        PRICING.revive.recoveryFeeCap
      );

      await db.$transaction([
        db.reviveRecoveryEvent.update({
          where: { id: recoveryEvent.id },
          data: { status: "RECOVERED", recoveredAt: new Date(), feePaise },
        }),
        db.reviveConnection.update({
          where: { id: connection.id },
          data: {
            totalRecoveredPaise: { increment: payment.amount },
            totalEarnedPaise: { increment: feePaise },
          },
        }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
