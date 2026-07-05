import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Mail } from "lucide-react";

export default async function ClientsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const practitioner = await db.practitioner.findFirst({ where: { userId: session.user.id } });
  if (!practitioner) redirect("/onboard");

  const bookings = await db.booking.findMany({
    where: { practitionerId: practitioner.id },
    orderBy: { createdAt: "desc" },
  });

  // Deduplicate by email
  const clientMap = new Map<string, { name: string; email: string; count: number; lastBooking: string; totalPaise: number }>();
  for (const b of bookings) {
    const existing = clientMap.get(b.clientEmail);
    if (existing) {
      existing.count++;
      existing.totalPaise += b.depositPaise;
    } else {
      clientMap.set(b.clientEmail, {
        name: b.clientName,
        email: b.clientEmail,
        count: 1,
        lastBooking: b.startTime.toISOString(),
        totalPaise: b.depositPaise,
      });
    }
  }
  const clients = Array.from(clientMap.values()).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-4 h-4" /></Link>
        <h1 className="font-bold text-slate-900">Clients</h1>
        <span className="text-slate-400 text-sm ml-1">({clients.length})</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {clients.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No clients yet. Share your booking page to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map(c => (
              <div key={c.email} className="flex items-center justify-between border border-slate-100 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{c.name}</div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                      <Mail className="w-3 h-3" />{c.email}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">{c.count} {c.count === 1 ? "booking" : "bookings"}</div>
                  {c.totalPaise > 0 && <div className="text-xs text-emerald-600">₹{(c.totalPaise / 100).toFixed(0)} paid</div>}
                  <div className="text-xs text-slate-300">{new Date(c.lastBooking).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
