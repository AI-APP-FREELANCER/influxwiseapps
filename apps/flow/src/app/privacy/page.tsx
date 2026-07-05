import Link from "next/link";
export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 mb-8 inline-block">← Back</Link>
      <h1 className="text-3xl font-extrabold mb-2">Privacy Policy</h1>
      <p className="text-slate-500 text-sm mb-8">Last updated: July 2026 · Influxwise / FocusBurner</p>
      <div className="prose prose-slate max-w-none space-y-6 text-sm leading-relaxed text-slate-600">
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">1. What we collect</h2><p>We collect your email address and name when you sign in with Google. We store data you submit (content, session history, bookings) to provide our service. Payment details are handled entirely by Razorpay — we never see your card number.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">2. How we use it</h2><p>Your data is used solely to operate FocusBurner. We do not sell or share your data with third parties for advertising. We may share minimal data with AWS (hosting), Neon (database), and Upstash (caching) as necessary to run the service.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">3. Data retention</h2><p>You may delete your account at any time by emailing contact@influxwise.com. We will remove your data within 30 days of a valid request.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">4. Cookies</h2><p>We use a single session cookie for authentication (NextAuth.js). We do not use tracking or advertising cookies.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">5. Security</h2><p>Data is encrypted in transit (HTTPS via Cloudflare) and at rest (Neon PostgreSQL). API keys are stored as bcrypt hashes.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">6. Contact</h2><p>Privacy questions: <a href="mailto:contact@influxwise.com" className="text-brand-600 hover:underline">contact@influxwise.com</a></p></section>
      </div>
    </div>
  );
}
