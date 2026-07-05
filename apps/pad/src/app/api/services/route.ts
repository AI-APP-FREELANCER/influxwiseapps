import { NextResponse } from "next/server";
import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  durationMin: z.number().int().min(15).max(480),
  depositPaise: z.number().int().min(0),
});

const patchSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  durationMin: z.number().int().min(15).max(480).optional(),
  depositPaise: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const practitioner = await db.practitioner.findFirst({ where: { userId: session.user.id } });
  if (!practitioner) return NextResponse.json({ error: "No practitioner" }, { status: 400 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const service = await db.practitionerService.create({
    data: { ...parsed.data, practitionerId: practitioner.id },
  });

  return NextResponse.json(service);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { id, ...data } = parsed.data;

  const practitioner = await db.practitioner.findFirst({ where: { userId: session.user.id } });
  if (!practitioner) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const service = await db.practitionerService.updateMany({
    where: { id, practitionerId: practitioner.id },
    data,
  });

  return NextResponse.json(service);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const practitioner = await db.practitioner.findFirst({ where: { userId: session.user.id } });
  if (!practitioner) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await db.practitionerService.deleteMany({ where: { id, practitionerId: practitioner.id } });
  return NextResponse.json({ ok: true });
}
