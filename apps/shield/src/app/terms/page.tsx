import Link from "next/link";
export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 mb-8 inline-block">← Back</Link>
      <h1 className="text-3xl font-extrabold mb-2">Terms of Service</h1>
      <p className="text-slate-500 text-sm mb-8">Last updated: July 2026 · Influxwise / TrustMark</p>
      <div className="prose prose-slate max-w-none space-y-6 text-sm leading-relaxed text-slate-600">
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">1. Service</h2><p>TrustMark is operated by Influxwise (Bengaluru, India). By using our service you agree to these terms. We may update these terms — continued use constitutes acceptance.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">2. Account</h2><p>You must provide accurate information. You are responsible for all activity under your account. We reserve the right to suspend accounts that violate these terms.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">3. Payments</h2><p>All payments are processed in INR via Razorpay. Wallet credits are non-refundable once used. Unused credits may be refunded within 7 days of purchase by contacting support.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">4. Acceptable use</h2><p>You may not use TrustMark to process illegal, harmful, or abusive content. We reserve the right to terminate access without notice for violations.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">5. Limitation of liability</h2><p>TrustMark is provided "as is". We are not liable for indirect, incidental, or consequential damages. Our total liability is limited to amounts paid in the 30 days prior to a claim.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">6. Governing law</h2><p>These terms are governed by the laws of India. Disputes shall be resolved in courts of Bengaluru, Karnataka.</p></section>
        <section><h2 className="text-lg font-bold text-slate-900 mb-2">7. Contact</h2><p><a href="mailto:contact@influxwise.com" className="text-brand-600 hover:underline">contact@influxwise.com</a></p></section>
      </div>
    </div>
  );
}
