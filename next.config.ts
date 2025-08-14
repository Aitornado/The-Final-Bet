import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  // Ensure proper routing for Twitch Extension
  trailingSlash: true,
  // experimental: {
  //   optimizeCss: true
  // }
}

export default nextConfig