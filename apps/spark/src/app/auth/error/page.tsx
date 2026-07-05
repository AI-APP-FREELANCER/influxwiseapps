import Link from "next/link";
import { Zap, AlertCircle } from "lucide-react";

export default async function AuthError({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const msg = error === "OAuthAccountNotLinked"
    ? "An account with this email already exists. Sign in with the original method."
    : error === "EmailSignin"
    ? "Could not send the magic link. Check your email address and try again."
    : "Something went wrong during sign in. Please try again.";

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Sign in failed</h1>
        <p className="text-white/40 text-sm mb-6">{msg}</p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-charcoal font-bold px-6 py-3 rounded-xl transition-colors"
        >
          <Zap className="w-4 h-4" />
          Try again
        </Link>
      </div>
    </div>
  );
}
