import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { sendEmail, flowLowBalanceEmail } from "@influxwise/email";
import { z } from "zod";

const schema = z.object({ sessionId: z.string() });

export async function POST(req: Request) {
  const userSession = await auth();
  if (!userSession?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = schema.safeParse(body);
  if (!data.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const flowSession = await db.flowSession.findUnique({
    where: { id: data.data.sessionId },
    include: { wallet: true, user: true },
  });

  if (!flowSession || flowSession.userId !== userSession.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (flowSession.status !== "ACTIVE") {
    return NextResponse.json({ error: "Session not active" }, { status: 409 });
  }

  const lastSession = await db.flowSession.findFirst({
    where: { userId: userSession.user.id, status: "COMPLETED", id: { not: flowSession.id } },
    orderBy: { completedAt: "desc" },
  });
  const yesterday = new Date(Date.now() - 86400000);
  const streakDay = lastSession?.completedAt && lastSession.completedAt > yesterday
    ? (lastSession.streakDay + 1)
    : 1;

  const [, updatedWallet] = await db.$transaction([
    db.flowSession.update({
      where: { id: flowSession.id },
      data: { status: "COMPLETED", completedAt: new Date(), streakDay },
    }),
    db.flowWallet.update({
      where: { id: flowSession.walletId },
      data: { balancePaise: { decrement: flowSession.costPaise } },
    }),
  ]);

  // Send low balance alert if under ₹5
  if (updatedWallet.balancePaise < 500 && userSession.user.email) {
    const emailContent = flowLowBalanceEmail({
      userName: userSession.user.name || "there",
      balanceCents: updatedWallet.balancePaise,
      topupUrl: "https://flow.influxwise.com/wallet",
    });
    await sendEmail({ to: userSession.user.email, ...emailContent }).catch(() => {});
  }

  return NextResponse.json({
    success: true,
    newBalance: updatedWallet.balancePaise,
    streakDay,
  });
}
