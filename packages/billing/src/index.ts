export { razorpay } from "./razorpay";
export { verifyRazorpayWebhook, verifyRazorpayPayment } from "./webhooks";

import { razorpay } from "./razorpay";
import { PRICING } from "@influxwise/config";

// ─── Spark helpers ────────────────────────────────────────────────────────────

export async function createSparkOrder({
  bundleIndex,
  userId,
  receipt,
}: {
  bundleIndex: number;
  userId: string;
  receipt: string;
}) {
  const bundle = PRICING.spark.creditBundles[bundleIndex];
  if (!bundle) throw new Error("Invalid bundle index");

  return razorpay.orders.create({
    amount: bundle.price,
    currency: "INR",
    receipt,
    notes: { userId, bundleIndex: String(bundleIndex), app: "spark" },
  });
}

// ─── Pad helpers ──────────────────────────────────────────────────────────────

export async function createPadBookingOrder({
  depositPaise,
  clientEmail,
  metadata,
  receipt,
}: {
  depositPaise: number;
  clientEmail: string;
  metadata: Record<string, string>;
  receipt: string;
}) {
  const platformFee = PRICING.pad.bookingFee;
  const total = depositPaise + platformFee;

  return razorpay.orders.create({
    amount: total,
    currency: "INR",
    receipt,
    notes: { ...metadata, clientEmail, app: "pad" },
  });
}

// ─── Flow helpers ─────────────────────────────────────────────────────────────

export async function createFlowTopupOrder({
  amountPaise,
  userId,
  receipt,
}: {
  amountPaise: number;
  userId: string;
  receipt: string;
}) {
  return razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes: { userId, amountPaise: String(amountPaise), app: "flow" },
  });
}

// ─── Shield helpers ───────────────────────────────────────────────────────────

export async function createShieldSubscription({
  plan,
  userId,
}: {
  plan: "starter" | "growth";
  userId: string;
}) {
  const amount =
    plan === "starter" ? PRICING.shield.starterMonthly : PRICING.shield.growthMonthly;
  const name =
    plan === "starter"
      ? "TrustMark Starter (2,000 verifications/mo)"
      : "TrustMark Growth (10,000 verifications/mo)";

  // Create a fresh plan each time (Razorpay plans are reusable but we keep it simple)
  const rzPlan = await razorpay.plans.create({
    period: "monthly",
    interval: 1,
    item: { name, amount, unit: "month", currency: "INR" },
    notes: { plan, app: "shield" },
  });

  return razorpay.subscriptions.create({
    plan_id: rzPlan.id,
    customer_notify: 1,
    total_count: 12,
    notes: { userId, plan, app: "shield" },
  });
}
