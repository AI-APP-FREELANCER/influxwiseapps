import { auth } from "@influxwise/auth";
import { db } from "@influxwise/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TrendingUp, ArrowUpRight, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export default async function ReviveDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const connection = await db.reviveConnection.findFirst({
    where: { userId: session.user.id },
    include: {
      recoveryEvents: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!connection) redirect("/connect");

  const events = connection.recoveryEvents;
  const recovered = events.filter(e => e.status === "RECOVERED");
  const pending = events.filter(e => e.status === "PENDING" || e.status === "RETRYING");

  const STATUS_ICON: Record<string, React.ReactNode> = {
    PENDING: <Clock className="w-4 h-4 text-yellow-400" />,
    RETRYING: <RefreshCw className="w-4 h-4 text-blue-400" />,
    RECOVERED: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    FAILED: <XCircle className="w-4 h-4 text-red-400/60" />,
    ABANDONED: <XCircle className="w-4 h-4 text-slate-400" />,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-white">ReviveRecurr</span>
        </div>
        <Link href="/" className="text-white/30 hover:text-white text-sm transition-colors">← Home</Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Recovered", value: `₹${(connection.totalRecoveredPaise / 100).toFixed(0)}`, color: "text-emerald-400" },
            { label: "Your earnings (5%)", value: `₹${(connection.totalEarnedPaise / 100).toFixed(0)}`, color: "text-gold-400 text-yellow-400" },
            { label: "Active retries", value: pending.length, color: "text-blue-400" },
            { label: "Recovered events", value: recovered.length, color: "text-white" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-4 text-center">
              <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
              <div className="text-xs text-white/30 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Connection info */}
        <div className="bg-emerald-900/10 border border-emerald-700/20 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/40 mb-0.5">Connected merchant</div>
            <div className="text-white font-mono text-sm">{connection.merchantId}</div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </div>
        </div>

        {/* Webhook reminder */}
        {events.length === 0 && (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6 text-center">
            <RefreshCw className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm mb-2">No recovery events yet.</p>
            <p className="text-white/20 text-xs">
              Make sure your Razorpay webhook is configured to send events to:<br />
              <code className="text-white/40">https://revive.influxwise.com/api/razorpay/webhook</code>
            </p>
          </div>
        )}

        {/* Events table */}
        {events.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Recovery events</h2>
            <div className="space-y-2">
              {events.map(e => (
                <div key={e.id} className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    {STATUS_ICON[e.status] ?? <Clock className="w-4 h-4 text-white/20" />}
                    <div>
                      <span className="text-white/70 text-sm font-medium">₹{(e.amountPaise / 100).toFixed(0)}</span>
                      <span className="text-white/30 text-xs ml-2">Customer: {e.customerId}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {e.status === "RECOVERED" && e.feePaise && (
                      <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        ₹{(e.feePaise / 100).toFixed(0)} earned
                      </span>
                    )}
                    <span className="text-white/20 text-xs">Retry {e.retryCount}</span>
                    <span className="text-white/20 text-xs">{new Date(e.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
