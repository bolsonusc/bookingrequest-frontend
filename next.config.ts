import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*"],
  images: {
    domains: ['encrypted-tbn0.gstatic.com', 'emnunmldrxhtkaosboxw.supabase.co'],
  },
};

module.exports = nextConfig;