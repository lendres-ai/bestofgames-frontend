import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";


const nextConfig: NextConfig = {
  images: {
    // Remote patterns are the new way instead of `domains`
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "www.nintendo.com",
      },
      {
        protocol: "https",
        hostname: "shared.akamai.steamstatic.com",
      },
    ],
    // Enable image optimization for external domains
    unoptimized: false,
  },
};



export default nextConfig;
