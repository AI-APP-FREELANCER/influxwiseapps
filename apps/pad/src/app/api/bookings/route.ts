import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@influxwise/db";
import { createPadBookingPaymentIntent } from "@influxwise/billing";
import { sendEmail, bookingConfirmationEmail } from "@influxwise/email";
import { format } from "date-fns";

const bookingSchema = z.object({
  serviceId: z.string(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  startTime: z.string().datetime(),
  intakeData: z.record(z.string()).optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const data = bookingSchema.safeParse(body);

  if (!data.success) {
    return NextResponse.json({ error: "Invalid request", issues: data.error.issues }, { status: 400 });
  }

  const service = await db.practitionerService.findUnique({
    where: { id: data.data.serviceId },
    include: { practitioner: true },
  });

  if (!service || !service.isActive) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const startTime = new Date(data.data.startTime);
  const endTime = new Date(startTime.getTime() + service.durationMin * 60 * 1000);

  // Check for conflicts
  const conflict = await db.booking.findFirst({
    where: {
      practitionerId: service.practitionerId,
      status: { in: ["CONFIRMED", "PENDING"] },
      OR: [
        { startTime: { lt: endTime }, endTime: { gt: startTime } },
      ],
    },
  });

  if (conflict) {
    return NextResponse.json({ error: "Time slot no longer available" }, { status: 409 });
  }

  const booking = await db.booking.create({
    data: {
      practitionerId: service.practitionerId,
      serviceId: service.id,
      clientName: data.data.clientName,
      clientEmail: data.data.clientEmail,
      clientPhone: data.data.clientPhone,
      startTime,
      endTime,
      depositCents: service.depositCents,
      intakeData: data.data.intakeData,
      status: service.depositCents > 0 ? "PENDING" : "CONFIRMED",
    },
  });

  if (service.depositCents > 0 && service.practitioner.stripeAccountId && service.practitioner.stripeAccountEnabled) {
    const pi = await createPadBookingPaymentIntent({
      depositCents: service.depositCents,
      practitionerStripeAccountId: service.practitioner.stripeAccountId,
      clientEmail: data.data.clientEmail,
      metadata: { bookingId: booking.id, serviceId: service.id },
    });

    await db.booking.update({
      where: { id: booking.id },
      data: { stripePaymentIntentId: pi.id },
    });

    return NextResponse.json({ bookingId: booking.id, clientSecret: pi.client_secret, requiresPayment: true });
  }

  // No deposit — send confirmation email immediately
  const emailContent = bookingConfirmationEmail({
    clientName: data.data.clientName,
    practitionerName: service.practitioner.businessName,
    serviceName: service.name,
    startTime: format(startTime, "EEEE, MMMM d 'at' h:mm a"),
    timezone: service.practitioner.timezone,
    bookingId: booking.id,
  });

  await sendEmail({ to: data.data.clientEmail, ...emailContent });

  return NextResponse.json({ bookingId: booking.id, requiresPayment: false });
}
