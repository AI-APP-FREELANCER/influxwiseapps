import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { createSparkOrder } from "@influxwise/billing";
import { z } from "zod";

const schema = z.object({ bundleIndex: z.number().int().min(0).max(2) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid bundle" }, { status: 400 });

  const receipt = `spark_topup_${session.user.id}_${Date.now()}`;
  const order = await createSparkOrder({
    bundleIndex: parsed.data.bundleIndex,
    userId: session.user.id,
    receipt,
  });

  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
}
