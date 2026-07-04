import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: ["@influxwise/auth", "@influxwise/billing", "@influxwise/config", "@influxwise/db", "@influxwise/email"],
};
export default nextConfig;
