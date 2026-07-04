"use client";
import { useState, useEffect, useRef } from "react";
import { Zap, Upload, FileText, Link2, Coins, Clock, CheckCircle2, Loader2, Copy, Check, ArrowRight } from "lucide-react";
import NextLink from "next/link";

type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
type InputMode = "text" | "url" | "file";

interface Job {
  id: string;
  inputType: string;
  status: JobStatus;
  costCents: number;
  results?: Record<string, string>;
  createdAt: string;
}

const OUTPUT_LABELS: Record<string, string> = {
  twitter_thread: "Twitter/X Thread",
  linkedin_post: "LinkedIn Post (Long)",
  linkedin_short: "LinkedIn Short",
  newsletter_section: "Newsletter Section",
  youtube_description: "YouTube Description",
  instagram_caption: "Instagram Caption",
  reels_script: "Reels/TikTok Script",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-xs text-white/40 hover:text-brand-400 transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function SparkDashboard() {
  const [mode, setMode] = useState<InputMode>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/jobs").then((r) => r.json()).then(setJobs).catch(() => {});
    fetch("/api/wallet").then((r) => r.json()).then((d) => setBalance(d.balance || 0)).catch(() => {});
  }, []);

  // Poll for job completion
  useEffect(() => {
    if (activeJob?.status === "PENDING" || activeJob?.status === "PROCESSING") {
      pollRef.current = setInterval(async () => {
        const res = await fetch(`/api/jobs?id=${activeJob.id}`);
        const updated = await res.json();
        if (updated.status === "COMPLETED" || updated.status === "FAILED") {
          setActiveJob(updated);
          setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, 2000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeJob?.id, activeJob?.status]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      let body: Record<string, unknown> = {};

      if (mode === "text") body = { inputType: "TEXT", inputData: text };
      else if (mode === "url") body = { inputType: "URL", inputData: url };
      else if (file) {
        // 1. Get presigned URL
        const presRes = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
        });
        const { uploadUrl, s3Key } = await presRes.json();
        // 2. Upload directly to S3
        await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        body = { inputType: "AUDIO", s3Key, durationMin: 5 }; // duration estimated client-side
      }

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const job = await res.json();
      if (job.jobId) {
        const newJob: Job = { id: job.jobId, inputType: mode.toUpperCase(), status: "PENDING", costCents: 25, createdAt: new Date().toISOString() };
        setActiveJob(newJob);
        setJobs((prev) => [newJob, ...prev]);
        setText(""); setUrl(""); setFile(null);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const costForMode = mode === "text" || mode === "url" ? 25 : 50;

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Top nav */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-charcoal" />
          </div>
          <span className="font-bold">Spark</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm">
            <Coins className="w-4 h-4 text-brand-400" />
            <span className="font-semibold">${(balance / 100).toFixed(2)}</span>
            <NextLink href="/wallet" className="text-xs text-brand-400 hover:text-brand-300 ml-1">Top up</NextLink>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-8">
        {/* Input panel */}
        <div>
          <h1 className="text-2xl font-extrabold mb-6">Atomize your content</h1>

          {/* Mode picker */}
          <div className="flex gap-2 mb-5">
            {([["text", FileText, "Text"], ["url", Link2, "URL"], ["file", Upload, "Audio/Video"]] as const).map(([m, Icon, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  mode === m ? "bg-brand-500/20 border border-brand-500/40 text-brand-300" : "bg-white/5 border border-white/8 text-white/50 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-4">
            {mode === "text" && (
              <textarea
                className="w-full bg-transparent text-white placeholder-white/20 outline-none resize-none text-sm leading-relaxed"
                rows={10}
                placeholder="Paste your article, transcript, show notes, or any long-form content here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            )}
            {mode === "url" && (
              <div>
                <input
                  className="w-full bg-transparent text-white placeholder-white/20 outline-none text-sm py-2"
                  placeholder="https://yourpodcast.com/episode-123 or any article URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}
            {mode === "file" && (
              <div
                className="border-2 border-dashed border-white/10 hover:border-brand-500/30 rounded-xl p-10 text-center transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
              >
                {file ? (
                  <div>
                    <CheckCircle2 className="w-8 h-8 text-brand-400 mx-auto mb-2" />
                    <div className="font-semibold text-white text-sm">{file.name}</div>
                    <div className="text-white/40 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                    <button onClick={() => setFile(null)} className="mt-2 text-xs text-red-400/60 hover:text-red-400">Remove</button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    <div className="text-white/40 text-sm">Drop audio or video file here</div>
                    <div className="text-white/20 text-xs mt-1">MP3, MP4, WAV, M4A · Max 500MB</div>
                    <label className="mt-3 inline-block text-xs text-brand-400 hover:text-brand-300 cursor-pointer underline">
                      or browse files
                      <input type="file" className="hidden" accept="audio/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-white/30">
              Cost: <span className="text-brand-400 font-semibold">${(costForMode / 100).toFixed(2)}</span> from wallet
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || (mode === "text" && text.length < 50) || (mode === "url" && !url) || (mode === "file" && !file) || balance < costForMode}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed text-charcoal font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Atomize
            </button>
          </div>
        </div>

        {/* Results panel */}
        <div>
          <h2 className="text-xl font-bold mb-6">Results</h2>
          {activeJob?.status === "PENDING" || activeJob?.status === "PROCESSING" ? (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-10 text-center">
              <Loader2 className="w-10 h-10 text-brand-400 animate-spin mx-auto mb-4" />
              <div className="font-semibold text-white">Processing your content...</div>
              <div className="text-white/40 text-sm mt-2">Usually takes 15–45 seconds</div>
            </div>
          ) : activeJob?.status === "COMPLETED" && activeJob.results ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {Object.entries(activeJob.results).map(([key, value]) => (
                <div key={key} className="bg-white/3 border border-white/8 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                      {OUTPUT_LABELS[key] || key}
                    </span>
                    <CopyButton text={value} />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
                </div>
              ))}
            </div>
          ) : activeJob?.status === "FAILED" ? (
            <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-8 text-center">
              <div className="text-red-400 font-semibold mb-1">Processing failed</div>
              <div className="text-white/40 text-sm">Credits have been refunded to your wallet.</div>
            </div>
          ) : (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-10 text-center">
              <Zap className="w-10 h-10 text-white/10 mx-auto mb-4" />
              <div className="text-white/40 text-sm">Your repurposed content will appear here</div>
            </div>
          )}

          {/* Recent jobs */}
          {jobs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white/40 mb-3">Recent jobs</h3>
              <div className="space-y-2">
                {jobs.slice(0, 5).map((j) => (
                  <button
                    key={j.id}
                    onClick={() => setActiveJob(j)}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl border transition-colors ${
                      activeJob?.id === j.id ? "bg-brand-500/10 border-brand-500/30" : "bg-white/3 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        j.status === "COMPLETED" ? "bg-emerald-400" : j.status === "FAILED" ? "bg-red-400" : "bg-brand-400 animate-pulse"
                      }`} />
                      <span className="text-sm text-white/70">{j.inputType}</span>
                    </div>
                    <span className="text-xs text-white/30">{new Date(j.createdAt).toLocaleDateString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
