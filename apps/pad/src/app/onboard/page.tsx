"use client";
import { useState } from "react";
import { Calendar, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

const steps = ["Account", "Your practice", "Services", "Availability", "Connect payments"];

export default function OnboardPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    businessName: "",
    bio: "",
    timezone: "Asia/Kolkata",
    slug: "",
  });

  function handleChange(field: string, value: string) {
    setData((prev) => ({ ...prev, [field]: value }));
    if (field === "businessName") {
      setData((prev) => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-2">
        <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-slate-900">BookPad</span>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  i < step ? "bg-brand-600 text-white" : i === step ? "bg-brand-600 text-white" : "bg-slate-200 text-slate-400"
                }`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 transition-colors ${i < step ? "bg-brand-600" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            {step === 0 && (
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Create your account</h1>
                <p className="text-slate-500 text-sm mb-6">Sign in with Google to get started instantly.</p>
                <Link
                  href="/api/auth/signin/google?callbackUrl=/onboard"
                  className="flex items-center justify-center gap-3 border-2 border-slate-200 hover:border-brand-300 text-slate-700 font-semibold py-3 rounded-xl transition-colors w-full"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </Link>
                <div className="mt-4 text-center text-xs text-slate-400">
                  By continuing you agree to our{" "}
                  <Link href="/terms" className="text-brand-600 underline">Terms</Link> and{" "}
                  <Link href="/privacy" className="text-brand-600 underline">Privacy Policy</Link>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Your practice</h1>
                <p className="text-slate-500 text-sm mb-6">This is what clients will see on your booking page.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business / Practice name</label>
                    <input
                      className="w-full border-2 border-slate-200 focus:border-brand-500 outline-none rounded-xl px-4 py-3 text-slate-900 transition-colors"
                      placeholder="e.g. Priya's Wellness Studio"
                      value={data.businessName}
                      onChange={(e) => handleChange("businessName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your booking URL</label>
                    <div className="flex items-center border-2 border-slate-200 focus-within:border-brand-500 rounded-xl overflow-hidden transition-colors">
                      <span className="bg-slate-50 px-3 py-3 text-slate-400 text-sm border-r border-slate-200 shrink-0">pad.influxwise.com/</span>
                      <input
                        className="flex-1 px-3 py-3 outline-none text-slate-900 text-sm"
                        value={data.slug}
                        onChange={(e) => handleChange("slug", e.target.value)}
                        placeholder="your-name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short bio (optional)</label>
                    <textarea
                      className="w-full border-2 border-slate-200 focus:border-brand-500 outline-none rounded-xl px-4 py-3 text-slate-900 resize-none transition-colors"
                      rows={3}
                      placeholder="Tell clients what you do..."
                      value={data.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Timezone</label>
                    <select
                      className="w-full border-2 border-slate-200 focus:border-brand-500 outline-none rounded-xl px-4 py-3 text-slate-900 bg-white transition-colors"
                      value={data.timezone}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                    >
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="America/New_York">US Eastern (ET)</option>
                      <option value="America/Los_Angeles">US Pacific (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Africa/Lagos">Lagos (WAT)</option>
                      <option value="Asia/Dubai">Dubai (GST)</option>
                      <option value="Asia/Singapore">Singapore (SGT)</option>
                      <option value="Australia/Sydney">Sydney (AEDT)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step >= 2 && step <= 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-brand-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{steps[step]}</h2>
                <p className="text-slate-500 text-sm">This step will be configured in your dashboard after account creation.</p>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} className="text-slate-500 hover:text-slate-700 font-medium text-sm">
                  ← Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={step === 1 && !data.businessName}
                  className="ml-auto flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition-colors"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => { setLoading(true); window.location.href = "/dashboard"; }}
                  className="ml-auto flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Go to dashboard <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
