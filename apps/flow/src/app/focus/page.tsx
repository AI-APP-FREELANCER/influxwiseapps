"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Flame, Pause, Play, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const SESSIONS = {
  FOCUS_25: { label: "Focus", duration: 25 * 60, cost: 5 },
  DEEP_50: { label: "Deep Work", duration: 50 * 60, cost: 8 },
};

type SessionType = keyof typeof SESSIONS;

export default function FocusRoom() {
  const [sessionType, setSessionType] = useState<SessionType>("FOCUS_25");
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SESSIONS.FOCUS_25.duration);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(200); // cents, from API
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const session = SESSIONS[sessionType];
  const progress = 1 - timeLeft / session.duration;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  const handleComplete = useCallback(async () => {
    setCompleted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (sessionId) {
      await fetch("/api/sessions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      setWalletBalance((b) => b - session.cost);
    }
  }, [sessionId, session.cost]);

  useEffect(() => {
    if (started && !paused && !completed) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { handleComplete(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [started, paused, completed, handleComplete]);

  async function startSession() {
    const res = await fetch("/api/sessions/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: sessionType }),
    });
    const data = await res.json();
    setSessionId(data.sessionId);
    setTimeLeft(session.duration);
    setStarted(true);
    setPaused(false);
    setCompleted(false);
  }

  function resetSession() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStarted(false);
    setPaused(false);
    setCompleted(false);
    setSessionId(null);
    setTimeLeft(session.duration);
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-[#0F0A1E] flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-brand-600/20 border-2 border-brand-600/40 rounded-full flex items-center justify-center mx-auto mb-6 glow-brand">
            <CheckCircle2 className="w-12 h-12 text-brand-400" />
          </div>
          <h1 className="text-4xl font-extrabold mb-2">Session complete! 🔥</h1>
          <p className="text-white/50 mb-2">You earned a streak point.</p>
          <p className="text-white/40 text-sm mb-8">${(session.cost / 100).toFixed(2)} deducted from wallet</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { resetSession(); startSession(); }}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Another session
            </button>
            <Link href="/dashboard" className="border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0A1E] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-brand-400" />
          <span className="font-bold">FocusBurner</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/40">
          <span>Wallet: <strong className="text-white">${(walletBalance / 100).toFixed(2)}</strong></span>
          <Link href="/dashboard" className="hover:text-white/60 transition-colors">
            <X className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Session type picker */}
        {!started && (
          <div className="flex gap-3 mb-10">
            {(Object.keys(SESSIONS) as SessionType[]).map((key) => (
              <button
                key={key}
                onClick={() => { setSessionType(key); setTimeLeft(SESSIONS[key].duration); }}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  sessionType === key
                    ? "bg-brand-600 text-white"
                    : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                {SESSIONS[key].label} · ${(SESSIONS[key].cost / 100).toFixed(2)}
              </button>
            ))}
          </div>
        )}

        {/* Ring timer */}
        <div className="relative w-72 h-72 flex items-center justify-center mb-10">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 280 280">
            {/* Background track */}
            <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            {/* Progress arc */}
            <circle
              cx="140" cy="140" r="120"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="text-center">
            <div className="text-6xl font-extrabold tabular-nums tracking-tight">
              {mins}:{secs}
            </div>
            <div className="text-white/40 text-sm mt-2">
              {started ? (paused ? "paused" : session.label) : "ready to start"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!started ? (
            <button
              onClick={startSession}
              disabled={walletBalance < session.cost}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-lg px-10 py-4 rounded-2xl transition-colors shadow-2xl shadow-brand-600/30"
            >
              <Play className="w-5 h-5" />
              Start session
            </button>
          ) : (
            <>
              <button
                onClick={() => setPaused((p) => !p)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={resetSession}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-red-900/30 text-red-400/60 hover:text-red-400 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                Abandon (free)
              </button>
            </>
          )}
        </div>

        {!started && walletBalance < session.cost && (
          <div className="mt-4 text-center">
            <p className="text-red-400/70 text-sm mb-2">Insufficient wallet balance</p>
            <Link href="/wallet" className="text-brand-400 hover:text-brand-300 text-sm font-semibold underline">
              Top up wallet →
            </Link>
          </div>
        )}

        {started && !paused && (
          <p className="mt-6 text-white/20 text-xs text-center max-w-xs">
            ${(session.cost / 100).toFixed(2)} will be deducted when the timer reaches zero.
            Abandon at any time for free.
          </p>
        )}
      </div>
    </div>
  );
}
