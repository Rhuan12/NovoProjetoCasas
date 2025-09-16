/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      // Adicione o domínio do Supabase após configurar
      'your-supabase-project.supabase.co',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig