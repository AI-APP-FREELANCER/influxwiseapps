import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { PRICING } from "@influxwise/config";
import { z } from "zod";

const schema = z.object({ type: z.enum(["FOCUS_25", "DEEP_50"]) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = schema.safeParse(body);
  if (!data.success) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  const cost = data.data.type === "FOCUS_25" ? PRICING.flow.session25min : PRICING.flow.session50min;

  const wallet = await db.flowWallet.findUnique({ where: { userId: session.user.id } });
  if (!wallet || wallet.balanceCents < cost) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 402 });
  }

  // Check no active session exists
  const active = await db.flowSession.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
  });
  if (active) {
    return NextResponse.json({ error: "Session already active", sessionId: active.id }, { status: 409 });
  }

  const flowSession = await db.flowSession.create({
    data: {
      userId: session.user.id,
      walletId: wallet.id,
      type: data.data.type,
      costCents: cost,
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ sessionId: flowSession.id });
}
