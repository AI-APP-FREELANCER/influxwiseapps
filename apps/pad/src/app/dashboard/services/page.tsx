import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { redirect } from "next/navigation";
import ServicesClient from "./ServicesClient";

export default async function ServicesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const practitioner = await db.practitioner.findFirst({
    where: { userId: session.user.id },
    include: { services: { orderBy: { isActive: "desc" } } },
  });

  if (!practitioner) redirect("/onboard");

  return <ServicesClient practitioner={practitioner} services={practitioner.services} />;
}
