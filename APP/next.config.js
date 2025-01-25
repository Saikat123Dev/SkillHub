/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

// module.exports = nextConfig
// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = {
//   ...nextConfig,
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   reactStrictMode: true,
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'media.dev.to',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'utfs.io',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'assets.aceternity.com', // Added this entry
//         pathname: '/**',
//       },
//     ],
//   },
// };
