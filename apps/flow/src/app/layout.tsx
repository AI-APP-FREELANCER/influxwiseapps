import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusBurner — Pay Only for Focus Sessions You Complete",
  description: "The world's only focus timer where you pay $0.05 only when you finish. No subscription. Pre-fund a wallet and burn through your goals.",
  metadataBase: new URL("https://flow.influxwise.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0F0A1E] text-white antialiased">{children}</body>
    </html>
  );
}
