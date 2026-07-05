import { auth } from "@influxwise/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TrendingUp, ArrowLeft, AlertCircle } from "lucide-react";

export default async function ConnectPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Connect your Razorpay</h1>
            <p className="text-white/40 text-sm">We monitor and recover your failed payments</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5">
          <h2 className="font-semibold text-white mb-3">How it works</h2>
          <ol className="space-y-3 text-sm text-white/60">
            {[
              "Enter your Razorpay Merchant ID below",
              "We monitor payment failures via Razorpay webhooks",
              "ReviveRecurr auto-retries at Day 1, Day 3, and Day 7",
              "When a payment recovers, we earn 5% (min ₹10, max ₹100)",
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-amber-900/10 border border-amber-700/20 rounded-xl px-4 py-3 mb-5 flex gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-300/80 text-xs leading-relaxed">
            You&apos;ll need to set up a Razorpay webhook pointing to <code className="bg-white/10 px-1 py-0.5 rounded text-xs">https://revive.influxwise.com/api/razorpay/webhook</code> for automatic recovery to work.
          </p>
        </div>

        <form
          action="/api/connect"
          method="POST"
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">Razorpay Merchant ID</label>
            <input
              name="merchantId"
              required
              placeholder="e.g. Hxr2QyPmGfCKsZ"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-emerald-500/50 text-sm"
            />
            <p className="text-white/30 text-xs mt-1">Found in Razorpay Dashboard → Settings → Account & Business</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-1">Business name (for reference)</label>
            <input
              name="businessName"
              placeholder="Your SaaS / product name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none focus:border-emerald-500/50 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Connect & start recovering
          </button>
        </form>
      </div>
    </div>
  );
}
