import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

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

  // ===========================================
  // CACHE HEADERS STRATEGY
  // ===========================================
  // Works in conjunction with Cloudflare Cache Rules (configured in dashboard)
  // 
  // Cache TTLs are aligned with ISR revalidate values in page.tsx files:
  // - Landing pages: 5 min (bandit learning)
  // - Game list/tag pages: 1 hour
  // - Game detail pages: 7 days (rarely change)
  // - Static pages: 1 day
  // - Static assets: immutable (1 year)
  //
  // stale-while-revalidate allows Cloudflare to serve stale content
  // while fetching fresh in background - users always get fast response
  // ===========================================
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
      // Optimized images - cache aggressively (31 days edge, 1 day browser)
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=2678400, stale-while-revalidate=86400'
          }
        ]
      },
      // ===========================================
      // Landing pages (bandit learning - needs frequent updates)
      // ISR: 5 min, Edge: 5 min, Browser: 0 (force revalidate)
      // ===========================================
      {
        source: '/:lang(en|de)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=60'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=300, stale-while-revalidate=60'
          }
        ]
      },
      // ===========================================
      // Game list pages (changes when new games added)
      // ISR: 1 hour, Edge: 1 hour, Browser: 0
      // ===========================================
      {
        source: '/:lang(en|de)/games',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=7200'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=3600, stale-while-revalidate=7200'
          }
        ]
      },
      // ===========================================
      // Game detail pages (rarely change after publish)
      // ISR: 1 day, Edge: 7 days (aggressive), Browser: 1 hour
      // ===========================================
      {
        source: '/:lang(en|de)/games/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=604800, stale-while-revalidate=604800'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=604800, stale-while-revalidate=604800'
          }
        ]
      },
      // ===========================================
      // Tag pages (similar to game list)
      // ISR: 1 hour, Edge: 1 hour, Browser: 0
      // ===========================================
      {
        source: '/:lang(en|de)/tags/:tag',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=7200'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=3600, stale-while-revalidate=7200'
          }
        ]
      },
      // ===========================================
      // Static pages (about, privacy, contact)
      // Rarely change, cache for 1 day
      // ===========================================
      {
        source: '/:lang(en|de)/(about|privacy|contact)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=86400, stale-while-revalidate=86400'
          }
        ]
      },
      // ===========================================
      // Wishlist page (user-specific, no edge caching)
      // ===========================================
      {
        source: '/:lang(en|de)/wishlist',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate'
          }
        ]
      },
      // ===========================================
      // API routes - always bypass cache
      // ===========================================
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate'
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

// Bundle analyzer - only load when ANALYZE=true (avoids MODULE_NOT_FOUND in production)
let config = nextConfig;
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  config = withBundleAnalyzer(nextConfig);
}

export default config;

