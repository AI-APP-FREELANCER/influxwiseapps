"use client";
import { useState } from "react";
import { Shield, Plus, Copy, Check, Eye, EyeOff, Loader2, BarChart3, Key, Zap } from "lucide-react";
import Link from "next/link";

const PLAN_BADGE: Record<string, string> = {
  PAYG: "bg-slate-800 text-slate-300",
  STARTER: "bg-blue-900/40 text-blue-300",
  GROWTH: "bg-purple-900/40 text-purple-300",
};

interface ApiKey {
  id: string;
  label: string;
  keyPrefix: string;
  plan: string;
  usageThisMonth: number;
  monthlyLimit: number | null;
  isActive: boolean;
  createdAt: string;
  recentVerifications: { id: string; result: string; score: number; createdAt: string }[];
}

interface Props {
  keys: ApiKey[];
  totalVerifications: number;
  totalSpentPaise: number;
}

const RESULT_COLOR: Record<string, string> = {
  CLEAN: "text-emerald-400",
  SUSPICIOUS: "text-yellow-400",
  SPAM: "text-orange-400",
  SCAM: "text-red-400",
  HUMAN_REVIEWED: "text-blue-400",
};

export default function ApiKeyDashboard({ keys: initialKeys, totalVerifications, totalSpentPaise }: Props) {
  const [keys, setKeys] = useState(initialKeys);
  const [showCreate, setShowCreate] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  async function createKey() {
    setCreating(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel }),
      });
      const data = await res.json();
      setNewKey(data.key);
      setKeys(prev => [data.apiKey, ...prev]);
      setShowCreate(false);
      setNewLabel("");
    } finally {
      setCreating(false);
    }
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function revokeKey(id: string) {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    await fetch(`/api/keys?id=${id}`, { method: "DELETE" });
    setKeys(prev => prev.map(k => k.id === id ? { ...k, isActive: false } : k));
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Nav */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-white">TrustMark</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/docs" className="text-white/40 hover:text-white text-sm transition-colors">API docs</Link>
          <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">← Home</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Newly created key — show once */}
        {newKey && (
          <div className="mb-6 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-5">
            <div className="text-emerald-300 font-semibold mb-2">API key created — copy it now, it won&apos;t be shown again</div>
            <div className="flex items-center gap-3 bg-black/30 rounded-xl px-4 py-3">
              <code className="text-emerald-300 text-sm font-mono flex-1 break-all">{newKey}</code>
              <button onClick={() => copy(newKey, "new")} className="text-emerald-400 hover:text-emerald-300 shrink-0">
                {copiedId === "new" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={() => setNewKey(null)} className="text-white/30 hover:text-white text-xs mt-2">Dismiss</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Verifications this month", value: totalVerifications, icon: BarChart3, color: "text-blue-400" },
            { label: "Total spent", value: `₹${(totalSpentPaise / 100).toFixed(2)}`, icon: Zap, color: "text-yellow-400" },
            { label: "Active keys", value: keys.filter(k => k.isActive).length, icon: Key, color: "text-emerald-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-4 text-center">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="text-xs text-white/30 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Create key */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">API keys</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            New key
          </button>
        </div>

        {showCreate && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
            <h3 className="font-semibold text-white mb-3">Create API key</h3>
            <input
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="Label (e.g. Production, My marketplace)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 outline-none focus:border-blue-500/50 text-sm mb-3"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowCreate(false)} className="flex-1 border border-white/10 text-white/50 font-semibold py-2.5 rounded-xl hover:bg-white/5 text-sm">Cancel</button>
              <button onClick={createKey} disabled={!newLabel || creating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                Create
              </button>
            </div>
          </div>
        )}

        {keys.length === 0 ? (
          <div className="bg-white/3 border border-white/8 rounded-2xl p-10 text-center">
            <Key className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm mb-4">No API keys yet. Create your first key to start verifying content.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {keys.map(k => (
              <div key={k.id} className={`bg-white/3 border rounded-2xl p-5 ${k.isActive ? "border-white/8" : "border-white/3 opacity-50"}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{k.label}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PLAN_BADGE[k.plan] ?? "bg-slate-800 text-slate-300"}`}>
                        {k.plan}
                      </span>
                      {!k.isActive && <span className="text-xs text-red-400/60">Revoked</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-white/40 text-xs font-mono">
                        {revealed.has(k.id) ? `${k.keyPrefix}••••••••••••••••` : `${k.keyPrefix}••••••••`}
                      </code>
                      <button onClick={() => setRevealed(s => { const n = new Set(s); n.has(k.id) ? n.delete(k.id) : n.add(k.id); return n; })}
                        className="text-white/20 hover:text-white/50">
                        {revealed.has(k.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => copy(k.keyPrefix, k.id)} className="text-white/20 hover:text-white/50">
                        {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  {k.isActive && (
                    <button onClick={() => revokeKey(k.id)} className="text-red-400/40 hover:text-red-400 text-xs transition-colors shrink-0">Revoke</button>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-white/30">
                  <span>{k.usageThisMonth}{k.monthlyLimit ? `/${k.monthlyLimit}` : ""} verifications this month</span>
                  <span>Created {new Date(k.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
                {k.recentVerifications.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex gap-2 flex-wrap">
                    {k.recentVerifications.map(v => (
                      <span key={v.id} className={`text-xs font-medium ${RESULT_COLOR[v.result] ?? "text-white/40"}`}>
                        {v.result} ({(v.score * 100).toFixed(0)}%)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upgrade prompt */}
        <div className="mt-8 bg-blue-900/10 border border-blue-800/20 rounded-2xl p-5">
          <div className="font-semibold text-white mb-1">Upgrade for higher limits</div>
          <p className="text-white/40 text-sm mb-4">Current plan: Pay-as-you-go (₹1/verification). Upgrade to Starter for 2,000/mo at ₹899.</p>
          <Link href="/#pricing" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm">
            View plans
          </Link>
        </div>
      </div>
    </div>
  );
}
