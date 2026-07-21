import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Menu placeholder photos come from Unsplash (see src/data/dishes.ts).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
