const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allows production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allows production builds to complete even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "media.dev.to",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        pathname: "/**",
      },
    ],
  }
};

module.exports = nextConfig;
