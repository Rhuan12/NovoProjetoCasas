import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'McSilva & Wiggit - Premium Real Estate',
  description: 'Experts in premium properties. Find your perfect home with our personalized service. Making dreams come true since 2014.',
  keywords: ['real estate', 'properties', 'houses', 'apartments', 'premium homes', 'luxury real estate'],
  authors: [{ name: 'McSilva & Wiggit' }],
  
  // ✨ Ícones - Next.js detecta automaticamente os arquivos em src/app/
  // Mas você pode declarar explicitamente se preferir
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  
  openGraph: {
    title: 'McSilva & Wiggit - Premium Real Estate',
    description: 'Experts in premium properties. Find your perfect home with our personalized service.',
    type: 'website',
    locale: 'en_US',
    siteName: 'McSilva & Wiggit',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'McSilva & Wiggit Logo',
      },
    ],
  },
  
  // Para Twitter/X
  twitter: {
    card: 'summary',
    title: 'McSilva & Wiggit - Premium Real Estate',
    description: 'Making dreams come true since 2014',
    images: ['/icon.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background-primary text-text-primary antialiased`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}