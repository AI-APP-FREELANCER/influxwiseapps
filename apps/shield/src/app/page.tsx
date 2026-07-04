import Link from "next/link";
import { Shield, Cpu, Globe, Lock, ArrowRight, CheckCircle2, Code2, Zap } from "lucide-react";

const codeSnippet = `// Verify a post in one API call
const response = await fetch('https://api.shield.influxwise.com/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk_shield_...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: "Selling brand new iPhone 15 Pro...",
    language: "en",
    context: "marketplace"
  })
});

const { result, score, badge_token } = await response.json();
// result: "CLEAN" | "SUSPICIOUS" | "SPAM" | "SCAM"
// score: 0.97
// badge_token: "tkv_8f3a..."`;

export default function ShieldLanding() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <nav className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl">TrustMark</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <Link href="#api" className="hover:text-white transition-colors">API Reference</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/signin" className="text-sm text-white/50 hover:text-white font-medium transition-colors">Sign in</Link>
            <Link href="/signup" className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              Get API key
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-600/10 border border-brand-600/20 text-brand-300 text-sm px-4 py-1.5 rounded-full mb-6">
              <Globe className="w-3.5 h-3.5" />
              Understands 40+ regional languages & dialects
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6 tracking-tight">
              Moderation that understands{" "}
              <span className="text-brand-400">your community.</span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed mb-8">
              Standard moderation APIs fail on regional scams written in local dialects.
              TrustMark is trained on cultural context, idioms, and marketplace fraud patterns
              specific to your geography. One API call. Real results.
            </p>
            <div className="flex gap-4">
              <Link href="/signup" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Get API key
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#api" className="inline-flex items-center gap-2 border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                <Code2 className="w-4 h-4" />
                View docs
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/40">
              {["<100ms response time", "REST + SDK", "Webhook callbacks", "Badge verification endpoint"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Code preview */}
          <div id="api" className="bg-[#0D1117] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/3">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-white/30 font-mono">verify.js</span>
            </div>
            <pre className="p-5 text-xs font-mono text-green-300/80 leading-relaxed overflow-x-auto">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: "Cultural NLP models", desc: "Trained on regional marketplace fraud, colloquial scam patterns, and dialect-specific spam across South Asia, West Africa, Southeast Asia, and MENA." },
            { icon: Shield, title: "Cryptographic trust badges", desc: "Every verified post gets a signed badge token. Your platform can display the badge publicly to signal verified authenticity to buyers." },
            { icon: Lock, title: "Private by design", desc: "Post content is processed in-memory and never stored on our servers. Results are stored as hashed metadata only." },
          ].map((f) => (
            <div key={f.title} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-brand-600/30 transition-colors">
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
      <section id="pricing" className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4">Simple, predictable pricing</h2>
            <p className="text-white/50">Start pay-as-you-go. Switch to a plan when volume grows.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Pay as you go", price: "$0.01", unit: "/ verification", features: ["Unlimited API keys", "All classification types", "Badge token generation", "1,000 req/min rate limit"], highlight: false },
              { name: "Starter", price: "$9", unit: "/ month", features: ["2,000 verifications included", "All PAYG features", "Priority support", "Usage dashboard"], highlight: true, note: "Best for communities <2k posts/mo" },
              { name: "Growth", price: "$29", unit: "/ month", features: ["10,000 verifications included", "All Starter features", "Webhook delivery", "SLA: 99.9% uptime"], highlight: false, note: "Best for growing platforms" },
            ].map((p) => (
              <div key={p.name} className={`rounded-2xl p-8 ${p.highlight ? "bg-brand-600/10 border-2 border-brand-600/40" : "bg-white/3 border border-white/8"}`}>
                {p.highlight && <div className="text-xs font-bold text-brand-400 mb-3 uppercase tracking-wider">Most popular</div>}
                <div className="font-bold text-xl mb-1">{p.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="text-white/40 text-sm">{p.unit}</span>
                </div>
                {p.note && <div className="text-xs text-white/40 mb-4">{p.note}</div>}
                <ul className="space-y-2 text-sm text-white/60 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`block text-center font-bold py-3 rounded-xl transition-colors ${p.highlight ? "bg-brand-600 hover:bg-brand-700 text-white" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-400" />
            <span className="font-bold">TrustMark</span>
            <span className="text-white/30 text-sm">by Influxwise</span>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <Link href="/docs" className="hover:text-white/60">Docs</Link>
            <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
