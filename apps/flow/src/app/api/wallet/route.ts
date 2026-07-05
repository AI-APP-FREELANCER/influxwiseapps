import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ balance: 0, sessions: [] });

  const wallet = await db.flowWallet.findUnique({ where: { userId: session.user.id } });
  const sessions = await db.flowSession.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: "desc" },
    take: 30,
  });

  return NextResponse.json({
    balance: wallet?.balancePaise ?? 0,
    sessions,
  });
}
