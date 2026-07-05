"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Clock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  depositPaise: number;
  isActive: boolean;
}

interface Practitioner {
  slug: string;
  businessName: string;
}

interface Props {
  practitioner: Practitioner;
  services: Service[];
}

export default function ServicesClient({ practitioner, services: initial }: Props) {
  const [services, setServices] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ name: "", description: "", durationMin: 60, depositPaise: 0 });

  function openNew() {
    setEditing(null);
    setForm({ name: "", description: "", durationMin: 60, depositPaise: 0 });
    setShowForm(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({ name: s.name, description: s.description ?? "", durationMin: s.durationMin, depositPaise: s.depositPaise });
    setShowForm(true);
  }

  async function saveService() {
    setSaving(true);
    try {
      const method = editing ? "PATCH" : "POST";
      const res = await fetch("/api/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...(editing ? { id: editing.id } : {}) }),
      });
      const data = await res.json();
      if (editing) {
        setServices(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s));
      } else {
        setServices(prev => [...prev, data]);
      }
      setShowForm(false);
    } catch {
      alert("Could not save service");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch("/api/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !current }),
    });
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !current } : s));
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services?id=${id}`, { method: "DELETE" });
    setServices(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="font-bold text-slate-900">Services</h1>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add service
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {services.length === 0 && !showForm ? (
          <div className="text-center py-16">
            <Clock className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">No services yet. Add your first offering.</p>
            <button onClick={openNew} className="bg-brand-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors">
              Add service
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map(s => (
              <div key={s.id} className={`border rounded-2xl p-5 ${s.isActive ? "border-slate-200" : "border-slate-100 bg-slate-50 opacity-60"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 mb-0.5">{s.name}</div>
                    {s.description && <div className="text-sm text-slate-500 mb-2">{s.description}</div>}
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span><Clock className="w-3 h-3 inline mr-1" />{s.durationMin} min</span>
                      <span className="text-brand-600 font-medium">
                        {s.depositPaise > 0 ? `₹${(s.depositPaise / 100).toFixed(0)} deposit` : "Free"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleActive(s.id, s.isActive)} className="text-slate-400 hover:text-brand-600 transition-colors">
                      {s.isActive ? <ToggleRight className="w-5 h-5 text-brand-600" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button onClick={() => openEdit(s)} className="text-slate-400 hover:text-slate-700 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteService(s.id)} className="text-slate-300 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/edit form */}
        {showForm && (
          <div className="mt-6 border-2 border-brand-200 rounded-2xl p-6">
            <h2 className="font-bold text-slate-900 mb-4">{editing ? "Edit service" : "New service"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Service name *</label>
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="e.g. 60-min Yoga Session"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  rows={2} placeholder="Brief description..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Duration (min)</label>
                  <input type="number" min={15} max={480} value={form.durationMin}
                    onChange={e => setForm(f => ({...f, durationMin: parseInt(e.target.value)}))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Deposit (₹, 0 = free)</label>
                  <input type="number" min={0} value={form.depositPaise / 100}
                    onChange={e => setForm(f => ({...f, depositPaise: Math.round(parseFloat(e.target.value || "0") * 100)}))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={saveService} disabled={!form.name || saving}
                className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-slate-50 rounded-xl text-sm text-slate-500">
          Your public booking page: <a href={`https://pad.influxwise.com/${practitioner.slug}`} target="_blank" rel="noreferrer"
            className="text-brand-600 font-medium hover:underline">pad.influxwise.com/{practitioner.slug}</a>
        </div>
      </div>
    </div>
  );
}
