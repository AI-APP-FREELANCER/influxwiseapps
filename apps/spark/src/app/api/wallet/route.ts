import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ balance: 0 });

  const credit = await db.sparkCredit.findUnique({ where: { userId: session.user.id } });
  const transactions = await db.sparkTransaction.findMany({
    where: { credit: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    balance: credit?.balance ?? 0,
    transactions,
  });
}
