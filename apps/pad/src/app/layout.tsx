import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookPad — Smart Booking for Independent Practitioners",
  description: "Accept bookings, collect deposits, and eliminate no-shows. Free for practitioners. Pay $0.30 per booking.",
  metadataBase: new URL("https://pad.influxwise.com"),
  openGraph: {
    title: "BookPad — Smart Booking for Independent Practitioners",
    description: "Accept bookings, collect deposits, and eliminate no-shows.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
