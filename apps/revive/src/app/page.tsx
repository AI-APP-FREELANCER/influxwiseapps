import Link from "next/link";
import { RefreshCw, TrendingUp, Zap, Shield, ArrowRight, DollarSign, CheckCircle2 } from "lucide-react";

export default function ReviveLanding() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl">ReviveRecurr</span>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/signin" className="text-sm text-white/50 hover:text-white font-medium transition-colors">Sign in</Link>
            <Link href="/connect" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              Connect Stripe — free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-brand-600/5 blur-3xl rounded-full" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 text-brand-300 text-sm px-4 py-1.5 rounded-full mb-8">
            <DollarSign className="w-3.5 h-3.5" />
            We only charge when you recover money
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Stop losing{" "}
            <span className="text-brand-400">9% of your MRR</span>
            {" "}to failed payments.
          </h1>
          <p className="text-xl text-white/50 leading-relaxed mb-10 max-w-2xl mx-auto">
            ReviveRecurr connects to your Stripe account and automatically retries failed subscription payments
            at optimal intervals. Pay nothing upfront — just 5% of what we recover (capped at $1 per account).
          </p>
          <Link
            href="/connect"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-brand-600/20 hover:-translate-y-0.5"
          >
            Connect Stripe for free
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* ROI Calculator preview */}
          <div className="mt-16 max-w-lg mx-auto bg-white/3 border border-white/8 rounded-2xl p-8 text-left">
            <div className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">Quick ROI estimate</div>
            <div className="space-y-3 text-sm">
              {[
                ["Monthly recurring revenue", "$10,000"],
                ["Typical failed payment rate", "9%"],
                ["Monthly revenue at risk", "$900"],
                ["ReviveRecurr recovery rate", "~70%"],
                ["Revenue recovered / month", "$630"],
                ["Our fee (5% capped at $1/acct)", "~$18"],
                ["Your net gain per month", "$612"],
              ].map(([label, value], i) => (
                <div key={label} className={`flex items-center justify-between ${i === 6 ? "pt-3 border-t border-white/10 font-bold text-brand-400" : "text-white/60"}`}>
                  <span>{label}</span>
                  <span className={i === 6 ? "text-brand-300 text-lg" : ""}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-6">
          {[
            { icon: RefreshCw, title: "Smart retry logic", desc: "Retries at optimal times based on failure reason — not daily spam." },
            { icon: Zap, title: "One-click connect", desc: "OAuth Stripe integration. No API keys to paste. Works in 60 seconds." },
            { icon: Shield, title: "White-label emails", desc: "Card-update emails come from your domain. Clients never see ReviveRecurr." },
            { icon: TrendingUp, title: "Recovery dashboard", desc: "See every retry attempt, success rate, and revenue recovered in real time." },
          ].map((f) => (
            <div key={f.title} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-brand-600/30 transition-colors group">
              <div className="w-10 h-10 bg-brand-600/15 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Pure performance pricing</h2>
          <p className="text-white/50 mb-10">If we don't recover it, you owe us nothing.</p>
          <div className="bg-white/3 border border-brand-600/30 rounded-2xl p-10">
            <div className="text-6xl font-extrabold text-brand-400 mb-2">5%</div>
            <div className="text-white/60 text-lg mb-6">of each recovered payment</div>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-white">$1.00</div>
                <div className="text-xs text-white/40 mt-1">max per account</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-white">$0.10</div>
                <div className="text-xs text-white/40 mt-1">minimum fee</div>
              </div>
            </div>
            <ul className="text-sm text-white/60 space-y-2 mb-8">
              {["No monthly fee", "No setup cost", "No minimum volume", "Cancel anytime"].map((i) => (
                <li key={i} className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-500" />
                  {i}
                </li>
              ))}
            </ul>
            <Link href="/connect" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
              Connect Stripe — free
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-brand-400" />
            <span className="font-bold">ReviveRecurr</span>
            <span className="text-white/30 text-sm">by Influxwise</span>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
