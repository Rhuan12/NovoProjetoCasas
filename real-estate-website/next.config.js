// next.config.js - VERSÃO CORRIGIDA

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ✅ CORREÇÃO: Domínio correto do Supabase
    domains: [
      'localhost',
      'evjyqdgdczakjoolfjyo.supabase.co', // ← Corrigido (estava evjygd... agora é evjyqd...)
      'images.unsplash.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig