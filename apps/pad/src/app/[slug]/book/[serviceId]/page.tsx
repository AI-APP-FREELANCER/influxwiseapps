import { db } from "@influxwise/db";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string; serviceId: string }>;
}) {
  const { slug, serviceId } = await params;

  const practitioner = await db.practitioner.findUnique({
    where: { slug },
    include: { services: { where: { id: serviceId, isActive: true } } },
  });

  if (!practitioner || practitioner.services.length === 0) notFound();

  const service = practitioner.services[0];

  return (
    <BookingForm
      practitioner={{
        id: practitioner.id,
        businessName: practitioner.businessName,
        bio: practitioner.bio ?? "",
        timezone: practitioner.timezone,
        slug,
      }}
      service={{
        id: service.id,
        name: service.name,
        description: service.description ?? "",
        durationMin: service.durationMin,
        depositPaise: service.depositPaise,
      }}
    />
  );
}
