import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  appDir: true,
  images: {
    domains: ["fakestoreapi.com"],
  },
};

export default nextConfig;
