"use client";
import { useState } from "react";
import { Calendar, Clock, User, Mail, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-brand-100 text-brand-700",
  CANCELLED: "bg-red-100 text-red-600",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  NO_SHOW: "bg-slate-100 text-slate-500",
};

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: string;
  depositPaise: number;
}

export default function CalendarClient({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  const upcoming = bookings.filter(b => new Date(b.startTime) > new Date() && b.status !== "CANCELLED");
  const thisMonth = bookings.filter(b => {
    const d = new Date(b.startTime);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const revenue = thisMonth.filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((acc, b) => acc + b.depositPaise, 0);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-4 h-4" /></Link>
        <h1 className="font-bold text-slate-900">Bookings calendar</h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "text-brand-600" },
            { label: "This month", value: thisMonth.length, icon: Clock, color: "text-slate-600" },
            { label: "Revenue (deposits)", value: `₹${(revenue / 100).toFixed(0)}`, icon: CheckCircle2, color: "text-emerald-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-50 rounded-2xl p-4 text-center">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
              <div className="text-2xl font-extrabold text-slate-900">{value}</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {["all", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}>
              {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No bookings found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(b => (
              <div key={b.id} className="border border-slate-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900">{b.clientName}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[b.status] ?? "bg-slate-100 text-slate-500"}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="text-sm text-brand-700 font-medium mb-2">{b.serviceName}</div>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
                        {new Date(b.startTime).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{b.clientName}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{b.clientEmail}</span>
                      {b.depositPaise > 0 && <span className="text-emerald-600 font-medium">₹{(b.depositPaise / 100).toFixed(0)} deposit</span>}
                    </div>
                  </div>
                  {b.status === "PENDING" && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => updateStatus(b.id, "CONFIRMED")}
                        className="flex items-center gap-1 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" />Confirm
                      </button>
                      <button onClick={() => updateStatus(b.id, "CANCELLED")}
                        className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        <XCircle className="w-3.5 h-3.5" />Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
