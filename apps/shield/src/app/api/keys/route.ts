import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createSchema = z.object({ label: z.string().min(1).max(80) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const raw = `tm_${randomBytes(24).toString("hex")}`;
  const keyHash = await bcrypt.hash(raw, 10);
  const keyPrefix = raw.slice(0, 8);

  const apiKey = await db.shieldApiKey.create({
    data: {
      userId: session.user.id,
      keyHash,
      keyPrefix,
      label: parsed.data.label,
      plan: "PAYG",
      monthlyLimit: null,
    },
  });

  return NextResponse.json({
    key: raw,
    apiKey: {
      id: apiKey.id,
      label: apiKey.label,
      keyPrefix,
      plan: "PAYG",
      usageThisMonth: 0,
      monthlyLimit: null,
      isActive: true,
      createdAt: apiKey.createdAt.toISOString(),
      recentVerifications: [],
    },
  });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db.shieldApiKey.updateMany({
    where: { id, userId: session.user.id },
    data: { isActive: false },
  });

  return NextResponse.json({ ok: true });
}
