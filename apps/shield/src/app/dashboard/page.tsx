import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { redirect } from "next/navigation";
import ApiKeyDashboard from "./ApiKeyDashboard";

export default async function ShieldDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const keys = await db.shieldApiKey.findMany({
    where: { userId: session.user.id },
    include: {
      verifications: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalVerifications = keys.reduce((sum, k) => sum + k.usageThisMonth, 0);
  const totalSpentPaise = keys.reduce((sum, k) =>
    sum + k.verifications.reduce((s, v) => s + v.feePaise, 0), 0);

  return (
    <ApiKeyDashboard
      keys={keys.map(k => ({
        id: k.id,
        label: k.label,
        keyPrefix: k.keyPrefix,
        plan: k.plan,
        usageThisMonth: k.usageThisMonth,
        monthlyLimit: k.monthlyLimit,
        isActive: k.isActive,
        createdAt: k.createdAt.toISOString(),
        recentVerifications: k.verifications.map(v => ({
          id: v.id,
          result: v.result,
          score: v.score,
          createdAt: v.createdAt.toISOString(),
        })),
      }))}
      totalVerifications={totalVerifications}
      totalSpentPaise={totalSpentPaise}
    />
  );
}
