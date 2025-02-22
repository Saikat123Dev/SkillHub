// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'standalone',
//   eslint: {
//     // Warning: This allows production builds to successfully complete even if
//     // your project has ESLint errors.
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     // !! WARN !!
//     // Dangerously allow production builds to successfully complete even if
//     // your project has type errors.
//     // !! WARN !!
//     ignoreBuildErrors: true,
//   },
// }

//  module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com", // Add this to allow Google profile pictures
      "media.dev.to",
      "utfs.io",
      "assets.aceternity.com",
      "avatars.githubusercontent.com",
      "camo.githubusercontent.com"
    ],
  },
};

module.exports = nextConfig;
