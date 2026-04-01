/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Empty turbopack config to allow build with next-pwa's webpack config
  turbopack: {},
};

module.exports = withPWA(nextConfig);
