/** @type {import('next').NextConfig} */

/**
 * Baseline security headers for every response.
 *
 * The CSP below only sets directives that can't break third-party scripts
 * (framing, plugins, base URI, form targets). A full script-src policy needs
 * nonces for Next's inline scripts plus allow-listing PostHog, Razorpay and
 * Vercel Analytics; roll that out in Report-Only mode first.
 */
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com")' },
  {
    key: 'Content-Security-Policy',
    value: [
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'tenderpost.org' },
      { protocol: 'https', hostname: 'www.tenderpost.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      // Never cache API responses in shared caches unless a route opts in.
      { source: '/api/(.*)', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ];
  },

  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/pricing', destination: '/#pricing', permanent: false },
    ];
  },

  async rewrites() {
    return [
      { source: '/tender-notifications', destination: '/make-payment' },
      // PostHog reverse proxy (avoids ad-blockers dropping analytics).
      { source: '/ingest/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://us.i.posthog.com/:path*' },
    ];
  },

  // Required for PostHog's trailing-slash API requests through /ingest.
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
