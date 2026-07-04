import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: ["@influxwise/auth", "@influxwise/config", "@influxwise/db"],
};
export default nextConfig;
