"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

const TIMEZONES = ["Asia/Kolkata", "Asia/Singapore", "Asia/Dubai", "Europe/London", "America/New_York", "America/Los_Angeles", "UTC"];

export default function SettingsPage() {
  const [form, setForm] = useState({ businessName: "", bio: "", timezone: "Asia/Kolkata", customColor: "#0D9488" });
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/practitioner").then(r => r.json()).then(d => {
      if (d.practitioner) {
        setForm({
          businessName: d.practitioner.businessName ?? "",
          bio: d.practitioner.bio ?? "",
          timezone: d.practitioner.timezone ?? "Asia/Kolkata",
          customColor: d.practitioner.customColor ?? "#0D9488",
        });
        setSlug(d.practitioner.slug ?? "");
      }
    });
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/practitioner", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-4 h-4" /></Link>
        <h1 className="font-bold text-slate-900">Settings</h1>
      </div>

      <div className="max-w-lg mx-auto px-6 py-8 space-y-6">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-3 rounded-xl">
            Settings saved!
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Business name</label>
          <input value={form.businessName} onChange={e => setForm(f => ({...f, businessName: e.target.value}))}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Bio</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))}
            rows={4} placeholder="Tell clients about your experience and approach..."
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm resize-none" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Timezone</label>
          <select value={form.timezone} onChange={e => setForm(f => ({...f, timezone: e.target.value}))}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm">
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Brand color</label>
          <div className="flex items-center gap-3">
            <input type="color" value={form.customColor} onChange={e => setForm(f => ({...f, customColor: e.target.value}))}
              className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer" />
            <span className="text-sm text-slate-500">{form.customColor}</span>
          </div>
        </div>

        {slug && (
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-sm font-semibold text-slate-700 mb-1">Your booking page</div>
            <a href={`https://pad.influxwise.com/${slug}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-brand-600 text-sm hover:underline">
              pad.influxwise.com/{slug}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <button onClick={save} disabled={saving || !form.businessName}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save changes
        </button>
      </div>
    </div>
  );
}
