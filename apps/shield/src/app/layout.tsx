import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "TrustMark — Community Moderation API for Regional Marketplaces",
  description: "AI-powered spam and scam detection trained on regional dialects and cultural context. $0.01 per verified post. Plans from $9/month.",
  metadataBase: new URL("https://shield.influxwise.com"),
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="bg-[#0F172A] text-white antialiased">{children}</body></html>;
}
