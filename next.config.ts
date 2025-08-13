import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://your-cdn-url.com' : '',
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
  // experimental: {
  //   optimizeCss: true
  // }
}

export default nextConfig