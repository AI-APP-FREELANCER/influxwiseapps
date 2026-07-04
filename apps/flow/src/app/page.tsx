import Link from "next/link";
import { Flame, Zap, Shield, TrendingUp, ArrowRight, CheckCircle2, Wallet } from "lucide-react";

const features = [
  { icon: Flame, title: "Pay to finish", desc: "$0.05 is charged only when your timer hits zero. Abandon a session — pay nothing." },
  { icon: Wallet, title: "Pre-fund wallet", desc: "Top up $2–$50 once. Sessions deduct automatically. No card at every session." },
  { icon: TrendingUp, title: "Streak science", desc: "Daily streak tracking with visual rewards. Miss a day and your streak resets — the stakes make it stick." },
  { icon: Shield, title: "No subscription", desc: "Use it once this month, once this year — it's the same price. Pay for what you actually use." },
];

export default function FlowLanding() {
  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0F0A1E]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl">FocusBurner</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <Link href="#how" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Sign in</Link>
            <Link href="/signup" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Start focusing
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-brand-600/10 animate-spin-slow" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-brand-600/15" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-brand-600/5 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600/15 border border-brand-600/30 text-brand-300 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            <Zap className="w-3.5 h-3.5" />
            Pay $0.05 per completed session — nothing else
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Focus deeply.{" "}
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              Pay only when you finish.
            </span>
          </h1>
          <p className="text-xl text-white/50 leading-relaxed mb-10 max-w-2xl mx-auto">
            FocusBurner is the world's first pay-per-completion focus timer. Every session you complete costs
            5¢. Every session you abandon costs nothing. Your skin is in the game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-brand-600/30 hover:-translate-y-0.5"
            >
              Start your first session
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-colors"
            >
              Try the timer (demo)
            </Link>
          </div>

          {/* Mini wallet preview */}
          <div className="mt-16 flex justify-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left max-w-sm w-full backdrop-blur-sm">
              <div className="text-xs text-white/40 font-medium mb-3">YOUR WALLET</div>
              <div className="text-3xl font-extrabold text-white mb-1">$2.00</div>
              <div className="text-sm text-white/40 mb-4">= 40 focus sessions</div>
              <div className="space-y-2">
                {[
                  { label: "25-min Focus", cost: "$0.05", sessions: 40 },
                  { label: "50-min Deep Work", cost: "$0.08", sessions: 25 },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{s.label}</span>
                    <span className="text-brand-300 font-semibold">{s.cost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Built on one simple principle</h2>
            <p className="text-white/50 text-lg">You pay when you win. Not before.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white/3 border border-white/8 hover:border-brand-600/40 rounded-2xl p-6 transition-colors group">
                <div className="w-12 h-12 bg-brand-600/15 group-hover:bg-brand-600/25 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-16">How it works</h2>
          <div className="space-y-6">
            {[
              { n: "1", title: "Add money to your wallet", desc: "Start with as little as $2 — enough for 40 sessions. We accept all major cards worldwide including Visa, Mastercard, and UPI." },
              { n: "2", title: "Pick a session type and start", desc: "Choose 25-minute Focus or 50-minute Deep Work. Hit start. Your wallet isn't touched yet." },
              { n: "3", title: "Timer reaches zero", desc: "You did it. $0.05 or $0.08 is deducted from your wallet. You get a streak point. Abandon halfway — nothing is deducted." },
              { n: "4", title: "Watch your streak grow", desc: "Daily completions build your streak. Visual milestones at 7, 30, and 100 days. Your longest streak is displayed on your profile." },
            ].map((s) => (
              <div key={s.n} className="flex gap-6 items-start">
                <div className="w-10 h-10 bg-brand-600/20 border border-brand-600/30 rounded-full flex items-center justify-center text-brand-300 font-bold shrink-0">
                  {s.n}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Radically simple pricing</h2>
          <p className="text-white/50 mb-12">No tiers. No monthly fees. No surprises.</p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { type: "25-min Focus Session", price: "$0.05", perSession: true, color: "brand" },
              { type: "50-min Deep Work Session", price: "$0.08", perSession: true, color: "purple" },
            ].map((p) => (
              <div key={p.type} className="bg-white/5 border border-white/10 hover:border-brand-600/40 rounded-2xl p-8 transition-colors">
                <div className="text-4xl font-extrabold text-brand-400 mb-2">{p.price}</div>
                <div className="text-white/60 text-sm">per completed session</div>
                <div className="mt-4 font-semibold text-white">{p.type}</div>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
            <div className="font-semibold text-white mb-3">Wallet top-up amounts</div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { amount: "$2", sessions: "40 sessions" },
                { amount: "$5", sessions: "100 sessions" },
                { amount: "$10", sessions: "200 sessions" },
                { amount: "$25", sessions: "500 sessions" },
              ].map((t) => (
                <div key={t.amount} className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="font-bold text-brand-300">{t.amount}</div>
                  <div className="text-xs text-white/40 mt-1">{t.sessions}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-xs text-white/30 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Wallet balance never expires
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-brand-600/20 to-purple-600/10 border border-brand-600/20 rounded-3xl p-16">
            <h2 className="text-4xl font-extrabold mb-4">Stop reading. Start focusing.</h2>
            <p className="text-white/50 mb-8">Add $2 to your wallet. Start your first session. 5¢ on the line.</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-brand-600/30 hover:-translate-y-0.5"
            >
              Add $2 and start focusing
              <Flame className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-400" />
            <span className="font-bold">FocusBurner</span>
            <span className="text-white/30 text-sm">by Influxwise</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60">Terms</Link>
            <Link href="mailto:support@influxwise.com" className="hover:text-white/60">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
