"use client";
import { useState, useEffect } from "react";
import { Flame, Play, Coins, Calendar, TrendingUp, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface FlowSession {
  id: string;
  type: "FOCUS_25" | "DEEP_50";
  status: "COMPLETED" | "ABANDONED" | "ACTIVE";
  costPaise: number;
  startedAt: string;
  completedAt?: string;
  streakDay: number;
}

export default function FlowDashboard() {
  const [balance, setBalance] = useState(0);
  const [sessions, setSessions] = useState<FlowSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wallet").then(r => r.json()).then(d => {
      setBalance(d.balance ?? 0);
      setSessions(d.sessions ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const completed = sessions.filter(s => s.status === "COMPLETED");
  const totalFocusMin = completed.reduce((acc, s) => acc + (s.type === "FOCUS_25" ? 25 : 50), 0);
  const streak = sessions.length > 0 ? (sessions[0]?.streakDay ?? 0) : 0;
  const totalSpentPaise = completed.reduce((acc, s) => acc + s.costPaise, 0);

  const grouped = sessions.slice(0, 20).reduce<Record<string, FlowSession[]>>((acc, s) => {
    const date = new Date(s.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    if (!acc[date]) acc[date] = [];
    acc[date].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0F0A1E]">
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/40 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Flame className="w-5 h-5 text-brand-400" />
          <span className="font-bold text-white">FocusBurner</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm">
            <Coins className="w-4 h-4 text-brand-400" />
            <span className="text-white font-semibold">₹{(balance / 100).toFixed(2)}</span>
            <Link href="/wallet" className="text-xs text-brand-400 hover:text-brand-300 ml-1">Top up</Link>
          </div>
          <Link
            href="/focus"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm"
          >
            <Play className="w-4 h-4" />
            Start session
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Current streak", value: `${streak}d`, icon: Flame, color: "text-orange-400" },
            { label: "Sessions done", value: completed.length, icon: TrendingUp, color: "text-brand-400" },
            { label: "Focus minutes", value: `${totalFocusMin}m`, icon: Calendar, color: "text-emerald-400" },
            { label: "Total spent", value: `₹${(totalSpentPaise / 100).toFixed(2)}`, icon: Coins, color: "text-white/60" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-4 text-center">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-xs text-white/30 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Weekly heatmap */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-white/40 mb-4">This week</h2>
          <div className="flex gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const today = new Date().getDay();
              const dayIdx = today === 0 ? 6 : today - 1;
              const isPast = i <= dayIdx;
              const dayStr = new Date(Date.now() - (dayIdx - i) * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
              const daySessions = grouped[dayStr] ?? [];
              const hasSession = daySessions.some(s => s.status === "COMPLETED");
              return (
                <div key={day} className="flex-1 text-center">
                  <div className={`w-full aspect-square rounded-xl mb-1 flex items-center justify-center ${
                    hasSession ? "bg-brand-600" : isPast ? "bg-white/5" : "bg-white/2"
                  }`}>
                    {hasSession && <Flame className="w-4 h-4 text-white" />}
                  </div>
                  <div className="text-xs text-white/20">{day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session history */}
        <h2 className="text-lg font-bold text-white mb-4">Session history</h2>
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-brand-400 mx-auto" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-10 text-center">
            <Flame className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm mb-4">No sessions yet. Start your first focus session.</p>
            <Link href="/focus" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
              <Play className="w-4 h-4" />
              Start now
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 20).map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    s.status === "COMPLETED" ? "bg-brand-400" : s.status === "ABANDONED" ? "bg-red-400/50" : "bg-yellow-400"
                  }`} />
                  <div>
                    <span className="text-white/80 text-sm font-medium">
                      {s.type === "FOCUS_25" ? "25-min Focus" : "50-min Deep Work"}
                    </span>
                    <span className={`ml-2 text-xs ${
                      s.status === "COMPLETED" ? "text-emerald-400" : s.status === "ABANDONED" ? "text-red-400/60" : "text-yellow-400"
                    }`}>
                      {s.status.toLowerCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/30 text-xs">₹{(s.costPaise / 100).toFixed(2)}</span>
                  <span className="text-white/20 text-xs">{new Date(s.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
