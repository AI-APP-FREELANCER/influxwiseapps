import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@influxwise/auth",
    "@influxwise/billing",
    "@influxwise/config",
    "@influxwise/db",
    "@influxwise/email",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.amazonaws.com" },
    ],
  },
};

export default nextConfig;
