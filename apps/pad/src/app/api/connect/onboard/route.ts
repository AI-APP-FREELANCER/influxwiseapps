import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";

// Saves practitioner bank account details for manual payouts.
// Razorpay Route / Payout API can be wired here later.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { bankAccountInfo?: string };

  const practitioner = await db.practitioner.findFirst({ where: { userId: session.user.id } });
  if (!practitioner) return NextResponse.json({ error: "Practitioner not found" }, { status: 404 });

  await db.practitioner.update({
    where: { id: practitioner.id },
    data: { bankAccountInfo: body.bankAccountInfo ?? null },
  });

  return NextResponse.json({ success: true });
}
