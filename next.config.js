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
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil'
    });
    return config;
  }
};

module.exports = nextConfig;
