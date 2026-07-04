import { db } from "@influxwise/db";
import { TrendingUp, Users, Zap, Calendar, RefreshCw, Shield, Flame, Activity } from "lucide-react";

async function getStats() {
  const [users, sparkJobs, bookings, recoveries, verifications, flowSessions] = await Promise.all([
    db.user.count(),
    db.sparkJob.count({ where: { status: "COMPLETED" } }),
    db.booking.count({ where: { status: "CONFIRMED" } }),
    db.reviveRecoveryEvent.aggregate({ where: { status: "RECOVERED" }, _sum: { feeCents: true } }),
    db.shieldVerification.count(),
    db.flowSession.count({ where: { status: "COMPLETED" } }),
  ]);

  const sparkRevenue = await db.sparkTransaction.aggregate({ where: { amount: { gt: 0 } }, _sum: { amount: true } });
  const flowRevenue = await db.flowSession.aggregate({ where: { status: "COMPLETED" }, _sum: { costCents: true } });
  const padRevenue = await db.booking.aggregate({ where: { status: { in: ["CONFIRMED", "COMPLETED"] } }, _sum: { platformFeeCents: true } });
  const shieldRevenue = await db.shieldVerification.aggregate({ _sum: { feeCents: true } });

  return {
    users,
    sparkJobs,
    bookings,
    flowSessions,
    verifications,
    revenue: {
      spark: sparkRevenue._sum.amount ?? 0,
      flow: flowRevenue._sum.costCents ?? 0,
      pad: padRevenue._sum.platformFeeCents ?? 0,
      revive: recoveries._sum.feeCents ?? 0,
      shield: shieldRevenue._sum.feeCents ?? 0,
    },
  };
}

const APP_CONFIG = [
  { key: "spark", label: "Spark", icon: Zap, color: "amber", url: "https://spark.influxwise.com" },
  { key: "pad", label: "BookPad", icon: Calendar, color: "teal", url: "https://pad.influxwise.com" },
  { key: "flow", label: "FocusBurner", icon: Flame, color: "indigo", url: "https://flow.influxwise.com" },
  { key: "revive", label: "ReviveRecurr", icon: RefreshCw, color: "emerald", url: "https://revive.influxwise.com" },
  { key: "shield", label: "TrustMark", icon: Shield, color: "blue", url: "https://shield.influxwise.com" },
] as const;

const COLOR_MAP = {
  amber: "bg-amber-500/15 text-amber-400",
  teal: "bg-teal-500/15 text-teal-400",
  indigo: "bg-indigo-500/15 text-indigo-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  blue: "bg-blue-500/15 text-blue-400",
};

export default async function AdminDashboard() {
  const stats = await getStats();
  const totalRevenueCents = Object.values(stats.revenue).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Influxwise Admin</h1>
            <p className="text-slate-400 text-sm mt-1">Unified revenue and operations dashboard</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-300">
            <Activity className="w-4 h-4 text-green-400" />
            All systems operational
          </div>
        </div>

        {/* Top-level stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total revenue", value: `$${(totalRevenueCents / 100).toFixed(2)}`, icon: TrendingUp, color: "text-green-400" },
            { label: "Total users", value: stats.users.toLocaleString(), icon: Users, color: "text-blue-400" },
            { label: "Jobs processed", value: stats.sparkJobs.toLocaleString(), icon: Zap, color: "text-amber-400" },
            { label: "Bookings confirmed", value: stats.bookings.toLocaleString(), icon: Calendar, color: "text-teal-400" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">{s.label}</span>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Per-app revenue breakdown */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {APP_CONFIG.map((app) => {
            const rev = stats.revenue[app.key as keyof typeof stats.revenue];
            const colorClass = COLOR_MAP[app.color];
            return (
              <a
                key={app.key}
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorClass.split(" ")[0]}`}>
                  <app.icon className={`w-5 h-5 ${colorClass.split(" ")[1]}`} />
                </div>
                <div className="font-semibold text-white text-sm mb-1">{app.label}</div>
                <div className="text-xl font-extrabold text-white">${(rev / 100).toFixed(2)}</div>
                <div className="text-xs text-slate-500 mt-1">total revenue</div>
              </a>
            );
          })}
        </div>

        {/* Recent payment events */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="p-5 border-b border-slate-800">
            <h2 className="font-bold text-white">Recent payment events</h2>
          </div>
          <RecentEvents />
        </div>
      </div>
    </div>
  );
}

async function RecentEvents() {
  const events = await db.paymentEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  if (events.length === 0) {
    return <div className="p-8 text-center text-slate-500 text-sm">No events yet</div>;
  }

  return (
    <div className="divide-y divide-slate-800">
      {events.map((e) => (
        <div key={e.id} className="px-5 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              e.app === "spark" ? "bg-amber-500/10 text-amber-400" :
              e.app === "pad" ? "bg-teal-500/10 text-teal-400" :
              e.app === "flow" ? "bg-indigo-500/10 text-indigo-400" :
              e.app === "revive" ? "bg-emerald-500/10 text-emerald-400" :
              "bg-blue-500/10 text-blue-400"
            }`}>{e.app}</span>
            <span className="text-slate-300 font-mono text-xs">{e.type}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${e.processed ? "bg-green-500" : "bg-slate-600"}`} />
            <span className="text-slate-500 text-xs">{e.createdAt.toISOString().slice(0, 16).replace("T", " ")}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
