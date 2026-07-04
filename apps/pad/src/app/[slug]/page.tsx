import { Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// In production this fetches from DB by slug
const mockPractitioner = {
  name: "Priya Sharma",
  businessName: "Priya's Wellness Studio",
  bio: "Certified yoga instructor and wellness coach with 8 years of experience. I specialize in stress reduction, flexibility training, and mindful movement.",
  services: [
    { id: "s1", name: "90-min Yoga & Mindfulness Session", duration: 90, depositCents: 1500, desc: "A personalized yoga session combining asanas, breathwork, and guided meditation." },
    { id: "s2", name: "30-min Consultation Call", duration: 30, depositCents: 0, desc: "Discuss your wellness goals. Free of charge — let's find the right programme for you." },
    { id: "s3", name: "Monthly Wellness Package (4 sessions)", duration: 90, depositCents: 5000, desc: "4 x 90-min sessions. Save 20% vs individual bookings." },
  ],
};

export default async function PublicBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  await params; // Next.js 15 requires params to be awaited
  const p = mockPractitioner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-6 py-8 text-center">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-700 font-extrabold text-2xl">
            {p.name.charAt(0)}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{p.businessName}</h1>
          <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto leading-relaxed">{p.bio}</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Asia/Kolkata</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Verified practitioner</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="font-bold text-slate-900 mb-4">Select a service</h2>
        <div className="space-y-4">
          {p.services.map((s) => (
            <Link
              key={s.id}
              href={`/${params.slug}/book/${s.id}`}
              className="block bg-white rounded-2xl border-2 border-slate-100 hover:border-brand-300 hover:shadow-md transition-all p-5 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{s.name}</div>
                  <div className="text-sm text-slate-500 mt-1 leading-relaxed">{s.desc}</div>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.duration} min</span>
                    {s.depositCents > 0 && (
                      <span className="flex items-center gap-1 text-brand-600 font-medium">
                        ${(s.depositCents / 100).toFixed(2)} deposit to book
                      </span>
                    )}
                    {s.depositCents === 0 && (
                      <span className="text-emerald-600 font-medium">Free</span>
                    )}
                  </div>
                </div>
                <div className="text-brand-600 group-hover:translate-x-1 transition-transform shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          Powered by{" "}
          <Link href="/" className="text-brand-600 font-medium hover:underline">BookPad</Link>
          {" "}· A $0.30 service fee applies to deposits
        </div>
      </div>
    </div>
  );
}
