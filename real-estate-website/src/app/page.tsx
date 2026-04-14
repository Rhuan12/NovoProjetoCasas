'use client'

import { useState, useRef } from 'react'
import { useProperties } from '@/hooks/useProperties'
import { Header } from '@/components/Header'
import { PropertyFilters } from '@/components/PropertyFilters'
import { PropertyGrid } from '@/components/PropertyGrid'
import { Badge } from '@/components/ui/Button'
import { Phone, Mail, MapPin, MessageCircle, Building, ArrowUp, PhoneCall } from 'lucide-react'
import Image from 'next/image'

interface FilterState {
  status?: 'available' | 'filled' | 'reserved'
  bedrooms?: number
  bathrooms?: number
  maxPrice?: number
  city?: string
  neighborhood?: string
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    status: 'available'
  })

  const { properties, loading, error } = useProperties(filters)
  const { properties: allProperties } = useProperties({})

  const contactRef = useRef<HTMLElement>(null)

  const availableCount = allProperties.filter(p => p.status === 'available').length
  const filledCount = allProperties.filter(p => p.status === 'filled').length
  const reservedCount = allProperties.filter(p => p.status === 'reserved').length
  const averageDaysToSell = filledCount > 0
    ? Math.round(
        allProperties
          .filter(p => p.status === 'filled' && p.days_to_sell)
          .reduce((acc, p) => acc + (p.days_to_sell || 0), 0) / filledCount
      )
    : 0

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <Header />

      {/* HERO - fundo preto com logo em destaque */}
      <section className="bg-background-primary flex items-center justify-center py-20 px-4">
        <Image
          src="/logo-cara.png"
          alt="McSilva & Wiggit"
          width={380}
          height={380}
          className="mx-auto"
          priority
        />
      </section>

      {/* PROPERTIES SECTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">Our Properties</h2>
              <p className="text-text-secondary">
                Find your perfect home with our exclusive selection of properties
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{availableCount}</div>
                <div className="text-sm text-text-muted">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{filledCount}</div>
                <div className="text-sm text-text-muted">Filled</div>
              </div>
              {averageDaysToSell > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{averageDaysToSell}</div>
                  <div className="text-sm text-text-muted">Avg. Days</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <Badge variant={filters.status === 'available' ? 'success' : 'default'}>
            {availableCount} Available
          </Badge>
          <Badge variant={filters.status === 'filled' ? 'filled' : 'default'}>
            {filledCount} Filled
          </Badge>
          <Badge variant={filters.status === 'reserved' ? 'warning' : 'default'}>
            {reservedCount} Reserved
          </Badge>
        </div>

        <div className="mb-8">
          <PropertyFilters onFiltersChange={setFilters} loading={loading} />
        </div>

        <PropertyGrid properties={properties} loading={loading} error={error} />
      </main>

      {/* CTA / CONTATO */}
      <section ref={contactRef} className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Building size={40} className="text-black" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-accent-primary mb-6">
            Ready to Find<br />Your Dream Home?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Contact us now and discover how we can help you to find your next residence!
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 border-2 border-white/30 rounded-full p-2">
            <a
              href="https://wa.me/18168901804"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent-primary text-black px-6 py-3 rounded-full font-semibold hover:bg-accent-hover transition-colors w-full sm:w-auto"
            >
              <MessageCircle size={18} />
              WhatsApp: +1 (816) 890-1804
            </a>
            <a
              href="tel:+18168901804"
              className="inline-flex items-center justify-center gap-2 bg-accent-primary text-black px-6 py-3 rounded-full font-semibold hover:bg-accent-hover transition-colors w-full sm:w-auto"
            >
              <Phone size={18} />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
        <div className="absolute top-0 left-0 w-48 h-48 border-4 border-white/10 rounded-[3rem] -translate-x-24 -translate-y-24" />
        <div className="absolute bottom-0 right-0 w-64 h-64 border-4 border-white/10 rounded-[3rem] translate-x-32 translate-y-32" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12 pb-12 border-b border-white/10">
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-6">Contact</h3>
              <div className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} />
                </div>
                <a href="tel:+18168901804" className="text-base">+1 (816) 890-1804</a>
              </div>
              <div className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <a href="mailto:marketingmwhomes@gmail.com" className="text-base">
                  marketingmwhomes@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <span className="text-base">800 E 101st Terrace</span>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Building size={28} className="text-accent-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-accent-primary">MCSILVA & WIGGIT</h3>
                </div>
                <p className="text-sm text-white/60">Making dreams come true since 2014</p>
              </div>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-white/20 rounded-2xl px-8 py-5 text-center backdrop-blur-sm bg-white/5">
              <p className="text-white/90 text-sm font-medium">
                © 2024 McSilva & Wiggit. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* BOTÕES FLUTUANTES */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-background-secondary border border-background-tertiary text-text-secondary hover:text-accent-primary hover:border-accent-primary rounded-full flex items-center justify-center shadow-lg transition-all"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
        <button
          onClick={scrollToContact}
          className="w-12 h-12 bg-accent-primary hover:bg-accent-hover text-black rounded-full flex items-center justify-center shadow-lg transition-all"
          aria-label="Go to contact"
        >
          <PhoneCall size={20} />
        </button>
      </div>
    </div>
  )
}
