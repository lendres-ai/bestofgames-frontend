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
    ],
    // Optional: disable optimization in dev for speed
    unoptimized: isDev,
  },
};



export default nextConfig;
