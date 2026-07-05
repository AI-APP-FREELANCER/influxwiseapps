import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const practitioner = await db.practitioner.findFirst({ where: { userId: session.user.id } });
  return NextResponse.json({ practitioner });
}

const patchSchema = z.object({
  businessName: z.string().min(1).max(120).optional(),
  bio: z.string().max(1000).optional(),
  timezone: z.string().optional(),
  customColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const practitioner = await db.practitioner.findFirst({ where: { userId: session.user.id } });
  if (!practitioner) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.practitioner.update({
    where: { id: practitioner.id },
    data: parsed.data,
  });

  return NextResponse.json({ practitioner: updated });
}
