/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      // Supabase
      'evjygdgdczakjoolfjyo.supabase.co',
      // Unsplash para imagens de teste
      'images.unsplash.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig