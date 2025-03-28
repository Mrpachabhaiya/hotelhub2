/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: { properties: ["^fdprocessedid$"] },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverActions: true, // Enable server actions
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during build
  },
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript errors during build
  }
};

module.exports = nextConfig;
