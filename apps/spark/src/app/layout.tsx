import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spark — Turn Any Content Into 6 Platform Formats Instantly",
  description: "Upload audio, video, or text. Get tweets, LinkedIn posts, newsletters, YouTube descriptions, and more — in seconds. Pay-as-you-go starting at $0.25.",
  metadataBase: new URL("https://spark.influxwise.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-charcoal text-white antialiased">{children}</body>
    </html>
  );
}
