import type { NextConfig } from "next";

// Disable Next.js telemetry
process.env.NEXT_TELEMETRY_DISABLED = '1';

const nextConfig: NextConfig = {
  images: {
    // Reduce image optimization costs
    minimumCacheTTL: 2678400, // 31 days
    formats: ['image/webp'], // Limit to WebP to reduce transformations
    // Limit generated sizes to reduce transformations
    deviceSizes: [640, 1080, 1920],
    imageSizes: [96, 256, 384],

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
      // Steam CDN domains
      {
        protocol: "https",
        hostname: "shared.akamai.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "cdn.akamai.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "cdn.cloudflare.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "media.steampowered.com",
      },
      {
        protocol: "https",
        hostname: "steamcdn-a.akamaihd.net",
      },
      {
        protocol: "https",
        hostname: "store.steampowered.com",
      },
    ],
  },

  // Security + Cache headers
  async headers() {
    return [
      // Static assets with hashes - cache forever (immutable)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // HTML pages - always revalidate to get fresh chunk references
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      },
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: "geolocation=(), microphone=(), camera=(), magnetometer=(), gyroscope=(), accelerometer=(), payment=(), usb=(), interest-cohort=()"
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://umami.mountdoom.space https://*.googletagmanager.com https://*.google-analytics.com https://*.googleadservices.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob: https://*.google-analytics.com https://*.googletagmanager.com https://*.google.com https://*.google.de https://*.googleadservices.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://umami.mountdoom.space https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com https://*.google.de https://*.googleadservices.com",
              "worker-src 'self'",
              "manifest-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

export default nextConfig;

