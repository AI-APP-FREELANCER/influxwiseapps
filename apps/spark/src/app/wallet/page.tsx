"use client";
import { useState, useEffect } from "react";
import { Zap, Coins, ArrowLeft, TrendingUp, TrendingDown, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

const BUNDLES = [
  { index: 0, price: 49900, paise: 49900, label: "Starter", jobs: 22, badge: "" },
  { index: 1, price: 99900, paise: 99900, label: "Popular", jobs: 48, badge: "Most popular" },
  { index: 2, price: 249900, paise: 249900, label: "Best value", jobs: 130, badge: "Best value" },
];

interface Transaction {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
}

declare global {
  interface Window { Razorpay: new (opts: Record<string, unknown>) => { open(): void }; }
}

export default function SparkWallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/wallet").then(r => r.json()).then(d => {
      setBalance(d.balance ?? 0);
      setTransactions(d.transactions ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));

    // Load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.head.appendChild(script);
  }, []);

  async function handleBuy(bundle: typeof BUNDLES[0]) {
    setBuying(bundle.index);
    try {
      const res = await fetch("/api/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleIndex: bundle.index }),
      });
      const { orderId, amount } = await res.json();
      if (!orderId) throw new Error("Order creation failed");

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        order_id: orderId,
        name: "Spark — Content Atomizer",
        description: `${bundle.jobs} content jobs`,
        theme: { color: "#F59E0B" },
        handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          fetch("/api/razorpay/webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "order.paid", payload: response }),
          }).then(() => {
            setBalance(b => b + bundle.paise);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
            fetch("/api/wallet").then(r => r.json()).then(d => {
              setBalance(d.balance ?? 0);
              setTransactions(d.transactions ?? []);
            });
          });
        },
      });
      rzp.open();
    } catch {
      alert("Could not initiate payment. Please try again.");
    } finally {
      setBuying(null);
    }
  }

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-400" />
          <span className="font-bold text-white">Spark — Wallet</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {success && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl px-5 py-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-emerald-300 font-medium">Credits added successfully!</span>
          </div>
        )}

        {/* Balance card */}
        <div className="bg-gradient-to-br from-brand-500/10 to-amber-800/5 border border-brand-500/20 rounded-2xl p-8 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-brand-400" />
            <span className="text-sm text-white/40">Current balance</span>
          </div>
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-brand-400 mx-auto" />
          ) : (
            <>
              <div className="text-5xl font-extrabold text-white mb-1">
                ₹{(balance / 100).toFixed(2)}
              </div>
              <div className="text-white/30 text-sm">
                ≈ {Math.floor(balance / 2500)} text jobs remaining
              </div>
            </>
          )}
        </div>

        {/* Bundles */}
        <h2 className="text-lg font-bold text-white mb-4">Top up your wallet</h2>
        <div className="grid gap-4 mb-10">
          {BUNDLES.map((b) => (
            <div
              key={b.index}
              className={`relative flex items-center justify-between bg-white/3 border rounded-2xl p-5 ${
                b.badge === "Most popular" ? "border-brand-500/40" : "border-white/8"
              }`}
            >
              {b.badge && (
                <span className="absolute -top-3 left-4 bg-brand-500 text-charcoal text-xs font-bold px-3 py-1 rounded-full">
                  {b.badge}
                </span>
              )}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    ₹{(b.price / 100).toFixed(0)}
                  </span>
                  <span className="text-brand-300 text-sm font-medium">{b.jobs} jobs</span>
                </div>
                <div className="text-white/30 text-xs mt-0.5">
                  ≈ ₹{(b.price / b.jobs / 100).toFixed(2)}/job
                </div>
              </div>
              <button
                onClick={() => handleBuy(b)}
                disabled={buying !== null}
                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-charcoal font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                {buying === b.index ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                Buy
              </button>
            </div>
          ))}
        </div>

        {/* Transaction history */}
        {transactions.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Transaction history</h2>
            <div className="space-y-2">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    {t.amount > 0
                      ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                      : <TrendingDown className="w-4 h-4 text-red-400/70" />}
                    <span className="text-white/70 text-sm">{t.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold text-sm ${t.amount > 0 ? "text-emerald-400" : "text-red-400/70"}`}>
                      {t.amount > 0 ? "+" : ""}₹{(Math.abs(t.amount) / 100).toFixed(2)}
                    </span>
                    <span className="text-white/20 text-xs">{new Date(t.createdAt).toLocaleDateString("en-IN")}</span>
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
