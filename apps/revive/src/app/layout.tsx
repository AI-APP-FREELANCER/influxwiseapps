import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "ReviveRecurr — Recover Failed Payments Automatically",
  description: "Connect your Stripe. Recover failed subscription payments automatically. Pay only when we succeed — 5% of recovered revenue, capped at $1.",
  metadataBase: new URL("https://revive.influxwise.com"),
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="bg-void text-white antialiased">{children}</body></html>;
}
