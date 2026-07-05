import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { redirect } from "next/navigation";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const practitioner = await db.practitioner.findFirst({ where: { userId: session.user.id } });
  if (!practitioner) redirect("/onboard");

  const bookings = await db.booking.findMany({
    where: { practitionerId: practitioner.id },
    include: { service: true },
    orderBy: { startTime: "desc" },
    take: 50,
  });

  return <CalendarClient bookings={bookings.map(b => ({
    id: b.id,
    clientName: b.clientName,
    clientEmail: b.clientEmail,
    serviceName: b.service.name,
    startTime: b.startTime.toISOString(),
    endTime: b.endTime.toISOString(),
    status: b.status,
    depositPaise: b.depositPaise,
  }))} />;
}
