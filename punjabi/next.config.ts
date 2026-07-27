import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Private LAN ranges, so a new router-assigned IP doesn't break phone testing.
  allowedDevOrigins: ["10.*.*.*", "172.*.*.*", "192.168.*.*", "127.0.0.1"],
  images: {
    // Menu placeholder photos come from Unsplash (see src/data/dishes.ts).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
