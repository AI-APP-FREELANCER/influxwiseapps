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
    payload: {
      subscription?: { entity: { id: string; notes: Record<string, string>; plan_id: string } };
      payment?: { entity: { id: string; amount: number } };
    };
  };

  const subEntity = event.payload?.subscription?.entity;

  if (event.event === "subscription.charged" && subEntity) {
    const notes = subEntity.notes ?? {};
    if (notes.app === "shield" && notes.userId) {
      const plan = notes.plan as "starter" | "growth";
      const monthlyLimit = plan === "starter" ? 2000 : 10000;

      await db.shieldApiKey.updateMany({
        where: { userId: notes.userId, razorpaySubscriptionId: subEntity.id },
        data: {
          plan: plan === "starter" ? "STARTER" : "GROWTH",
          planRenewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          usageThisMonth: 0,
          monthlyLimit,
        },
      });
    }
  }

  if (event.event === "subscription.halted" && subEntity) {
    const notes = subEntity.notes ?? {};
    if (notes.app === "shield" && notes.userId) {
      await db.shieldApiKey.updateMany({
        where: { userId: notes.userId, razorpaySubscriptionId: subEntity.id },
        data: { plan: "PAYG", monthlyLimit: null, razorpaySubscriptionId: null },
      });
    }
  }

  const paymentId = event.payload?.payment?.entity?.id ?? subEntity?.id ?? "evt_" + Date.now();
  await db.paymentEvent.upsert({
    where: { id: paymentId },
    update: {},
    create: { id: paymentId, type: event.event, app: "shield", payload: event as object },
  });

  return NextResponse.json({ received: true });
}
