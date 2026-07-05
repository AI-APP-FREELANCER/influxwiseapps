"use client";
import { useState } from "react";
import { Calendar, Clock, ChevronLeft, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  practitioner: { id: string; businessName: string; bio: string; timezone: string; slug: string };
  service: { id: string; name: string; description: string; durationMin: number; depositPaise: number };
}

declare global {
  interface Window { Razorpay: new (opts: Record<string, unknown>) => { open(): void }; }
}

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

export default function BookingForm({ practitioner, service }: Props) {
  const [step, setStep] = useState<"datetime" | "details" | "pay" | "confirmed">("datetime");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const totalPaise = service.depositPaise + 2500; // deposit + ₹25 platform fee

  async function handleBook() {
    setSubmitting(true);
    try {
      const startTime = new Date(`${selectedDate}T${selectedTime}:00`);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          practitionerId: practitioner.id,
          serviceId: service.id,
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          notes,
          startTime: startTime.toISOString(),
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Booking failed");

      setBookingId(data.bookingId);

      if (data.razorpayOrderId && totalPaise > 0) {
        // Load Razorpay SDK if not loaded
        if (!window.Razorpay) {
          await new Promise<void>((resolve) => {
            const s = document.createElement("script");
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.onload = () => resolve();
            document.head.appendChild(s);
          });
        }
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: totalPaise,
          currency: "INR",
          order_id: data.razorpayOrderId,
          name: practitioner.businessName,
          description: service.name,
          prefill: { name, email, contact: phone },
          theme: { color: "#0D9488" },
          handler: () => setStep("confirmed"),
        });
        rzp.open();
      } else {
        setStep("confirmed");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "confirmed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-brand-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Booking confirmed!</h1>
          <p className="text-slate-500 mb-2">
            {service.name} with {practitioner.businessName}
          </p>
          <p className="text-slate-400 text-sm mb-2">
            {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} at {selectedTime}
          </p>
          {bookingId && (
            <p className="text-slate-300 text-xs mb-8">Booking ID: {bookingId}</p>
          )}
          <p className="text-slate-500 text-sm mb-6">A confirmation email has been sent to {email}.</p>
          <Link href={`/${practitioner.slug}`} className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold">
            <ChevronLeft className="w-4 h-4" />
            Back to booking page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50">
      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Back */}
        <Link href={`/${practitioner.slug}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Service summary */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6 shadow-sm">
          <div className="font-bold text-slate-900 mb-1">{service.name}</div>
          <div className="text-slate-500 text-sm mb-3">{service.description}</div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{service.durationMin} min</span>
            {service.depositPaise > 0 && (
              <span className="text-brand-600 font-medium">₹{(service.depositPaise / 100).toFixed(0)} deposit + ₹25 booking fee</span>
            )}
            {service.depositPaise === 0 && (
              <span className="text-brand-600 font-medium">₹25 booking fee</span>
            )}
          </div>
        </div>

        {/* Step 1: Date & Time */}
        {step === "datetime" && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              Pick a date & time
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm"
              />
            </div>
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Available slots</label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedTime === t
                          ? "bg-brand-600 text-white"
                          : "bg-slate-50 hover:bg-brand-50 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => setStep("details")}
              disabled={!selectedDate || !selectedTime}
              className="mt-6 w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === "details" && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-900 mb-4">Your details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Full name *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Anjali Sharma"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="anjali@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Phone (optional)</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Notes for practitioner (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Anything you'd like them to know..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 outline-none focus:border-brand-400 text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep("datetime")} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                Back
              </button>
              <button
                onClick={handleBook}
                disabled={!name || !email || submitting}
                className="flex-2 flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {totalPaise > 0 ? `Pay ₹${(totalPaise / 100).toFixed(0)} & confirm` : "Confirm booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
