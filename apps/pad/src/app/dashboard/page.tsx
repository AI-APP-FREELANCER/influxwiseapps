import { Calendar, Users, TrendingUp, Clock, Plus, Settings, ExternalLink } from "lucide-react";
import Link from "next/link";

const upcomingBookings = [
  { id: "b1", client: "Riya Menon", service: "90-min Yoga Session", time: "Today, 10:00 AM", status: "confirmed" },
  { id: "b2", client: "Arun Kumar", service: "Consultation Call", time: "Today, 2:30 PM", status: "confirmed" },
  { id: "b3", client: "Fatima Hassan", service: "90-min Yoga Session", time: "Tomorrow, 9:00 AM", status: "pending" },
];

export default function PadDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar + Main layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">BookPad</span>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {[
              { label: "Overview", icon: TrendingUp, href: "/dashboard", active: true },
              { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
              { label: "Clients", icon: Users, href: "/dashboard/clients" },
              { label: "Services", icon: Clock, href: "/dashboard/services" },
              { label: "Settings", icon: Settings, href: "/dashboard/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-100">
            <Link
              href="/pad/priya-wellness"
              target="_blank"
              className="flex items-center gap-2 text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View your booking page
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Good morning 👋</h1>
                <p className="text-slate-500 text-sm mt-1">Here's what's happening today.</p>
              </div>
              <Link
                href="/dashboard/services/new"
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add service
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: "This month's bookings", value: "24", delta: "+12%", color: "brand" },
                { label: "Revenue collected", value: "$840", delta: "+8%", color: "emerald" },
                { label: "No-shows", value: "1", delta: "-80%", color: "amber" },
                { label: "New clients", value: "7", delta: "+40%", color: "sky" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className="text-xs text-slate-400 font-medium mb-2">{s.label}</div>
                  <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
                  <div className="text-xs text-emerald-600 font-medium mt-1">{s.delta} vs last month</div>
                </div>
              ))}
            </div>

            {/* Upcoming Bookings */}
            <div className="bg-white rounded-2xl border border-slate-100">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Upcoming bookings</h2>
                <Link href="/dashboard/calendar" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                  View all →
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {upcomingBookings.map((b) => (
                  <div key={b.id} className="px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                        {b.client.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{b.client}</div>
                        <div className="text-xs text-slate-400">{b.service} · {b.time}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      b.status === "confirmed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
