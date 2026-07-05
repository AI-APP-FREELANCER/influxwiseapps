"use client";
import { useState, useEffect } from "react";
import { Flame, Coins, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const TOPUPS = [
  { amountPaise: 5000, label: "₹50", sessions: "10 focus sessions", popular: false },
  { amountPaise: 10000, label: "₹100", sessions: "20 focus sessions", popular: true },
  { amountPaise: 25000, label: "₹250", sessions: "50 focus sessions", popular: false },
  { amountPaise: 50000, label: "₹500", sessions: "100 focus sessions", popular: false },
];

declare global {
  interface Window { Razorpay: new (opts: Record<string, unknown>) => { open(): void }; }
}

export default function FlowWallet() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/wallet").then(r => r.json()).then(d => {
      setBalance(d.balance ?? 0);
      setLoading(false);
    }).catch(() => setLoading(false));

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.head.appendChild(script);
  }, []);

  async function handleTopup(opt: typeof TOPUPS[0]) {
    setBuying(opt.amountPaise);
    try {
      const res = await fetch("/api/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaise: opt.amountPaise }),
      });
      const { orderId, amount } = await res.json();
      if (!orderId) throw new Error();

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        order_id: orderId,
        name: "FocusBurner",
        description: opt.sessions,
        theme: { color: "#4f46e5" },
        handler: () => {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 4000);
          fetch("/api/wallet").then(r => r.json()).then(d => setBalance(d.balance ?? 0));
        },
      });
      rzp.open();
    } catch {
      alert("Payment could not be initiated. Please try again.");
    } finally {
      setBuying(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0A1E]">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5">
        <Link href="/dashboard" className="text-white/40 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Flame className="w-5 h-5 text-brand-400" />
        <span className="font-bold text-white">FocusBurner — Wallet</span>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10">
        {success && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl px-5 py-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-emerald-300 font-medium">Wallet topped up successfully!</span>
          </div>
        )}

        {/* Balance */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 text-center">
          <Coins className="w-6 h-6 text-brand-400 mx-auto mb-2" />
          <div className="text-sm text-white/40 mb-1">Current balance</div>
          {loading ? (
            <Loader2 className="w-7 h-7 animate-spin text-brand-400 mx-auto" />
          ) : (
            <>
              <div className="text-5xl font-extrabold text-white mb-1">₹{(balance / 100).toFixed(2)}</div>
              <div className="text-white/30 text-sm">
                ≈ {Math.floor(balance / 500)} focus sessions available
              </div>
            </>
          )}
        </div>

        {/* Top-up options */}
        <h2 className="text-lg font-bold text-white mb-4">Top up</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {TOPUPS.map((opt) => (
            <button
              key={opt.amountPaise}
              onClick={() => handleTopup(opt)}
              disabled={buying !== null}
              className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border transition-all disabled:opacity-50 ${
                opt.popular
                  ? "bg-brand-600/20 border-brand-500/50 hover:bg-brand-600/30"
                  : "bg-white/3 border-white/10 hover:border-white/20"
              }`}
            >
              {opt.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              {buying === opt.amountPaise
                ? <Loader2 className="w-6 h-6 animate-spin text-brand-400 mb-2" />
                : <span className="text-2xl font-extrabold text-white mb-1">{opt.label}</span>
              }
              <span className="text-xs text-white/40">{opt.sessions}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-white/20 text-center">
          Powered by Razorpay · Secure payment · Instant credit
        </p>
      </div>
    </div>
  );
}
