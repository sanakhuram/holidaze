// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // quick & dirty for school project
      // For production, restrict to known hosts
    ],
  },
};

export default nextConfig;
