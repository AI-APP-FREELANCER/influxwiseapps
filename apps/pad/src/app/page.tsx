import Link from "next/link";
import { Calendar, CreditCard, Bell, Star, ArrowRight, CheckCircle2, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "Share your booking link. Clients pick from your real-time availability — no back-and-forth.",
  },
  {
    icon: CreditCard,
    title: "Deposit Collection",
    desc: "Secure a deposit at booking time. Eliminates no-shows by up to 80%.",
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    desc: "SMS and email reminders sent 24 hours and 1 hour before every appointment.",
  },
  {
    icon: Star,
    title: "Intake Forms",
    desc: "Collect client info, preferences, and consents right inside the booking flow.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Wellness Coach, Mumbai",
    quote: "No-shows dropped from 3 per week to almost zero. I just share my link and it handles everything.",
    avatar: "PS",
  },
  {
    name: "James Okonkwo",
    role: "Physiotherapist, Lagos",
    quote: "My clients love how smooth the booking is. Deposits are collected automatically — I don't chase anyone.",
    avatar: "JO",
  },
  {
    name: "Sophie Laurent",
    role: "Nutritionist, Paris",
    quote: "The intake form saves me 15 minutes per client. Everything I need is there before the session starts.",
    avatar: "SL",
  },
];

const steps = [
  { num: "01", title: "Create your page", desc: "Set your services, duration, pricing, and availability in 5 minutes." },
  { num: "02", title: "Share your link", desc: "Post it on Instagram, WhatsApp, or your website. Clients book instantly." },
  { num: "03", title: "Get paid", desc: "Deposits are collected at booking. $0.30 platform fee per booking — paid by the client." },
];

export default function PadLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">BookPad</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <Link href="#features" className="hover:text-brand-600 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-brand-600 transition-colors">Pricing</Link>
            <Link href="#how-it-works" className="hover:text-brand-600 transition-colors">How it works</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="text-sm text-slate-600 hover:text-brand-600 transition-colors font-medium">
              Sign in
            </Link>
            <Link
              href="/onboard"
              className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-white pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" />
              Free for practitioners — always
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
              Bookings that{" "}
              <span className="text-brand-600">actually show up.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl">
              BookPad gives independent practitioners a beautiful booking page with deposit collection, intake forms,
              and automated reminders. Zero monthly fee. $0.30 per booking — paid by your client.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/onboard"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30 hover:-translate-y-0.5"
              >
                Create your booking page
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-brand-300 text-slate-700 font-semibold text-lg px-8 py-4 rounded-2xl transition-colors"
              >
                See a demo page
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                No monthly fees
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                Set up in 5 minutes
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                Accepts all currencies
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-600 py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-3 gap-8 text-center text-white">
          {[
            { n: "80%", label: "reduction in no-shows" },
            { n: "$0.30", label: "flat fee per booking" },
            { n: "5 min", label: "to set up your page" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold">{s.n}</div>
              <div className="text-brand-100 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Designed for solo practitioners who want to look professional and save time.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-50 transition-all">
                <div className="w-12 h-12 bg-brand-50 group-hover:bg-brand-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Up and running in minutes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-brand-100 -translate-x-4 z-0" />
                )}
                <div className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <div className="text-5xl font-extrabold text-brand-100 mb-4">{s.num}</div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-500">No subscription. No surprises.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border-2 border-slate-100">
              <div className="text-2xl font-extrabold text-slate-900 mb-1">Free</div>
              <div className="text-slate-500 mb-6">For practitioners</div>
              <ul className="space-y-3 text-sm text-slate-600">
                {["Unlimited booking pages", "Stripe payment collection", "Automated SMS + email reminders", "Custom intake forms", "Calendar sync (Google / Outlook)", "Basic analytics"].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link href="/onboard" className="mt-8 block text-center bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors">
                Get started
              </Link>
            </div>
            <div className="p-8 rounded-2xl border-2 border-brand-200 bg-brand-50/50 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                PREMIUM
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1">$7 <span className="text-lg font-medium text-slate-400">/month</span></div>
              <div className="text-slate-500 mb-6">For growing practitioners</div>
              <ul className="space-y-3 text-sm text-slate-600">
                {["Everything in Free", "Custom brand colors + logo", "Remove 'Powered by BookPad'", "Priority support", "Advanced analytics", "Client CRM notes"].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link href="/onboard?plan=premium" className="mt-8 block text-center bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors">
                Start premium
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500">
              <strong className="text-slate-700">Client fee:</strong> A $0.30 platform fee is added to each booking — charged to the client, not you. Most clients don't notice it.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Loved by practitioners worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-brand-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Your clients deserve a better booking experience.</h2>
          <p className="text-brand-100 text-lg mb-8">Create your page in 5 minutes. Free forever for practitioners.</p>
          <Link
            href="/onboard"
            className="inline-flex items-center gap-2 bg-white hover:bg-brand-50 text-brand-700 font-bold text-lg px-8 py-4 rounded-2xl transition-colors shadow-xl"
          >
            Create your free booking page
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900">BookPad</span>
            <span className="text-slate-400 text-sm">by Influxwise</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-slate-600">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-600">Terms</Link>
            <Link href="mailto:support@influxwise.com" className="hover:text-slate-600">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
