import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Imóveis Premium - Encontre sua casa dos sonhos',
  description: 'Especialistas em imóveis de alto padrão. Encontre a casa perfeita com nosso atendimento personalizado.',
  keywords: 'imóveis, casas, apartamentos, venda, compra, imobiliária',
  authors: [{ name: 'Imóveis Premium' }],
  openGraph: {
    title: 'Imóveis Premium - Encontre sua casa dos sonhos',
    description: 'Especialistas em imóveis de alto padrão. Encontre a casa perfeita com nosso atendimento personalizado.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-background-primary text-text-primary antialiased`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}