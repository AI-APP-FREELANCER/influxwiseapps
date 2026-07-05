import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { createFlowTopupOrder } from "@influxwise/billing";
import { db } from "@influxwise/db";
import { z } from "zod";

const TOPUP_OPTIONS = [5000, 10000, 25000, 50000]; // ₹50, ₹100, ₹250, ₹500 in paise

const schema = z.object({ amountPaise: z.number().int().min(5000) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

  if (!TOPUP_OPTIONS.includes(parsed.data.amountPaise)) {
    return NextResponse.json({ error: "Invalid topup amount" }, { status: 400 });
  }

  // Ensure wallet exists
  await db.flowWallet.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, balancePaise: 0 },
    update: {},
  });

  const receipt = `flow_topup_${session.user.id}_${Date.now()}`;
  const order = await createFlowTopupOrder({
    amountPaise: parsed.data.amountPaise,
    userId: session.user.id,
    receipt,
  });

  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
}
