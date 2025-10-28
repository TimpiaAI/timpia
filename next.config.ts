
// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ['http://localhost:3000', '192.168.1.163'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'originui.com',
        port: '',
        pathname: '/**',
      },
      { // Added for the new Timeline component's demo images if user wants to use them later
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/**',
      },
      { // Added for imgur.com images
        protocol: 'https',
        hostname: 'imgur.com',
        port: '',
        pathname: '/**',
      },
      { // Added for i.imgur.com images
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      { // Added for placeholder images
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      }
    ],
  },

  async headers() {
    return [
      {
        // This path matches all files within any subdirectory of /chatbots
        // e.g., /chatbots/test/index.html, /chatbots/april91/loader.js
        source: '/chatbots/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            // For production, you should restrict this to your clients' domains.
            // For now, '*' allows embedding on any site for testing purposes.
            value: '*', 
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
      },
      {
        // This rule allows the /genesis-agro page to be embedded in an iframe on any site.
        // This is necessary for the loader.js to work correctly.
        source: '/genesis-agro',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM *', // A more lenient version, consider restricting in production
          },
           {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *", // The modern, more flexible alternative to X-Frame-Options
           }
        ],
      },
    ];
  },
  outputFileTracingRoot: path.join(__dirname),
};

export default withNextIntl(nextConfig);

    
