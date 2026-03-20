/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [],
  },
  env: {
    REMOVE_BG_API_KEY: process.env.REMOVE_BG_API_KEY || '',
  },
  // Cloudflare Pages support
  serverExternalPackages: [],
}

// For Cloudflare Pages deployment, uncomment and use this:
// const { withNext } = require('@cloudflare/next-on-pages')
// module.exports = withNext(nextConfig)

// For local development, use standard config
module.exports = nextConfig
