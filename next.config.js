/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize bundle size and performance
  compress: true,
  
  // Image optimization for tender-related images
  images: {
    domains: [
      'tenderpost.org',
      'www.tenderpost.org',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  
  // Headers for SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/((?!api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/tender-guide',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO consolidation
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/government-tender',
        destination: '/tender-guide',
        permanent: true,
      },
      {
        source: '/healthcare-tender',
        destination: '/tender-guide#types',
        permanent: true,
      },
      {
        source: '/construction-tender',
        destination: '/tender-guide#types',
        permanent: true,
      },
    ];
  },
  
  // Rewrites for better URL structure
  async rewrites() {
    return [
      {
        source: '/government-tenders',
        destination: '/tender-guide',
      },
      {
        source: '/healthcare-tenders',
        destination: '/tender-guide',
      },
      {
        source: '/construction-tenders',
        destination: '/tender-guide',
      },
      {
        source: '/tender-notifications',
        destination: '/make-payment',
      },
    ];
  },
  
  // Build optimization
  output: 'standalone',
  
  // Enable static optimization
  trailingSlash: false,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize for production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Performance budgets
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // ESLint configuration for build
  eslint: {
    // Allow production builds to successfully complete even if ESLint errors are present
    ignoreDuringBuilds: false,
  },
  
  // TypeScript configuration
  typescript: {
    // Allow production builds to successfully complete even if TypeScript errors are present
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig; 