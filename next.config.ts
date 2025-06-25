import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*"],
  images: {
    domains: ['encrypted-tbn0.gstatic.com'],
  },
};

module.exports = nextConfig;