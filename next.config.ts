// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
<<<<<<< Updated upstream
      { protocol: 'https', hostname: '**' }, 
    ],
  },
=======
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.myapi.com" },
    ],
  },
  experimental: {
    typedRoutes: true, 
  },
>>>>>>> Stashed changes
};

export default nextConfig;
