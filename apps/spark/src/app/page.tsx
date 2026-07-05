import Link from "next/link";
import { Zap, Upload, Twitter, Linkedin, Mail, Youtube, ArrowRight, CheckCircle2, Coins } from "lucide-react";

const outputs = [
  { icon: Twitter, label: "Twitter/X Thread", desc: "5-tweet thread with hooks & CTAs" },
  { icon: Linkedin, label: "LinkedIn Post", desc: "Long-form + short-form versions" },
  { icon: Mail, label: "Newsletter Section", desc: "Intro, body, and CTA copy" },
  { icon: Youtube, label: "YouTube Description", desc: "SEO-optimised with timestamps" },
  { icon: Zap, label: "Instagram Caption", desc: "Hook + hashtags + CTA" },
  { icon: Zap, label: "Short-form Script", desc: "TikTok/Reels 60-sec script" },
];

const pricing = [
  { label: "Text / URL", price: "$0.25", icon: "📝", desc: "Blog post, article, or any URL" },
  { label: "Audio ≤10 min", price: "$0.50", icon: "🎙️", desc: "Podcast clips, voice memos" },
  { label: "Audio 10–30 min", price: "$1.00", icon: "🎧", desc: "Full podcast episodes" },
  { label: "Audio 30–60 min", price: "$2.00", icon: "🎬", desc: "Long-form video/podcast" },
];

export default function SparkLanding() {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-charcoal" />
            </div>
            <span className="font-bold text-xl">Spark</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <Link href="#how" className="hover:text-white transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#outputs" className="hover:text-white transition-colors">Outputs</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-white/50 hover:text-white font-medium transition-colors">Sign in</Link>
            <Link href="/dashboard" className="bg-brand-500 hover:bg-brand-400 text-charcoal text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              Try it free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/5 blur-3xl rounded-full" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" />
              6 content formats. One upload. From $0.25.
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              One piece of content.{" "}
              <span className="text-brand-400">Six platforms covered.</span>
            </h1>
            <p className="text-xl text-white/50 leading-relaxed mb-10 max-w-2xl">
              Upload your audio, video, or paste a URL. Spark extracts the core ideas and repurposes
              them into Twitter threads, LinkedIn posts, newsletters, YouTube descriptions, and more — in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-charcoal font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-brand-500/20 hover:-translate-y-0.5"
              >
                Start repurposing
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-colors"
              >
                See a live demo
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/40">
              {["No subscription", "Pay per job", "Credit bundles from $5", "Private — your content stays yours"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Output formats */}
      <section id="outputs" className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3">Every output format you need</h2>
            <p className="text-white/50">One job produces all 6 simultaneously.</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {outputs.map((o) => (
              <div key={o.label} className="bg-white/3 hover:bg-white/5 border border-white/8 rounded-2xl p-5 text-center transition-colors">
                <div className="w-10 h-10 bg-brand-500/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <o.icon className="w-5 h-5 text-brand-400" />
                </div>
                <div className="font-semibold text-sm text-white mb-1">{o.label}</div>
                <div className="text-xs text-white/40">{o.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-12">From upload to post in under 60 seconds</h2>
          <div className="space-y-6">
            {[
              { step: "01", title: "Upload or paste", desc: "Drop an audio/video file, paste a URL, or type your text directly. We accept MP3, MP4, M4A, WAV, and all major video formats." },
              { step: "02", title: "Credits deducted by input length", desc: "Spark deducts from your pre-funded credit wallet. Text costs 25¢. Audio costs 50¢–$2 based on length." },
              { step: "03", title: "Processing begins", desc: "Audio is transcribed via Whisper. Claude analyses the content and generates platform-specific copy for all 6 formats." },
              { step: "04", title: "Copy and post", desc: "Results appear in a clean dashboard. One-click copy to clipboard. Edit inline if needed. Download as a text bundle." },
            ].map((s) => (
              <div key={s.step} className="flex gap-6 items-start bg-white/3 border border-white/8 rounded-2xl p-6">
                <div className="text-4xl font-extrabold text-brand-500/30 shrink-0">{s.step}</div>
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
      <section id="pricing" className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3">Pay for what you process</h2>
            <p className="text-white/50">Buy credits once. Use them whenever.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {pricing.map((p) => (
              <div key={p.label} className="bg-white/3 border border-white/8 rounded-2xl p-6 text-center hover:border-brand-500/30 transition-colors">
                <div className="text-3xl mb-3">{p.icon}</div>
                <div className="text-2xl font-extrabold text-brand-400 mb-1">{p.price}</div>
                <div className="font-semibold text-white text-sm mb-2">{p.label}</div>
                <div className="text-xs text-white/40">{p.desc}</div>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { bundle: "$5", credits: "22 jobs", badge: "" },
              { bundle: "$10", credits: "48 jobs", badge: "Popular" },
              { bundle: "$25", credits: "130 jobs", badge: "Best value" },
            ].map((b) => (
              <div key={b.bundle} className={`relative bg-white/3 border rounded-2xl p-6 text-center ${b.badge ? "border-brand-500/40" : "border-white/8"}`}>
                {b.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-charcoal text-xs font-bold px-3 py-1 rounded-full">
                    {b.badge}
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-brand-400" />
                  <span className="text-2xl font-extrabold text-white">{b.bundle}</span>
                </div>
                <div className="text-brand-300 font-semibold text-sm">{b.credits}</div>
                <Link href="/wallet" className="mt-4 block text-center bg-brand-500/15 hover:bg-brand-500/25 text-brand-300 font-semibold text-sm py-2 rounded-xl transition-colors">
                  Buy bundle
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-brand-500/10 to-amber-800/5 border border-brand-500/15 rounded-3xl p-16">
            <h2 className="text-4xl font-extrabold mb-4">Start repurposing in 30 seconds</h2>
            <p className="text-white/50 mb-8">Your first job is on us. No credit card required to start.</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-charcoal font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-2xl shadow-brand-500/20 hover:-translate-y-0.5"
            >
              Get started free
              <Zap className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-400" />
            <span className="font-bold">Spark</span>
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
