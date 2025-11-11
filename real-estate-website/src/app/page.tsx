'use client'

import { useState, useEffect } from 'react'
import { useProperties } from '@/hooks/useProperties'
import { Header } from '@/components/Header'
import { PropertyCard } from '@/components/PropertyCard'
import { AboutOwners } from '@/components/AboutOwners'
import { Button, Card, Badge } from '@/components/ui/Button'
import { 
  Search, 
  MapPin, 
  BedDouble, 
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Star,
  ArrowRight,
  CheckCircle,
  Building
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { TestimonialsSection } from '@/components/TestimonialsSection'

interface SiteSettings {
  owner_name: string
  owner_photo_url: string
  owner_bio: string
  company_name: string
  company_logo_url: string
  contact_phone: string
  contact_email: string
  contact_address: string
  google_reviews_link: string
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const { properties, loading } = useProperties({})

  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      } finally {
        setSettingsLoading(false)
      }
    }
    
    fetchSettings()
  }, [])
  
  const availableProperties = properties.filter(p => p.status === 'available')
  const featuredProperties = availableProperties.slice(0, 6)
  
  const availableCount = properties.filter(p => p.status === 'available').length
  const soldCount = properties.filter(p => p.status === 'sold').length
  
  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      
      {/* HERO SECTION - IMAGEM FULL COM BORDA DECORATIVA POR CIMA */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image com Overlay - PREENCHE TODA A SEÇÃO */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background-primary z-10"></div>
          <Image
            src="/hero-house.jpg" 
            alt="Dream Home"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Borda Decorativa Laranja - OVERLAY POR CIMA */}
        <div className="absolute inset-0 z-20 px-4 sm:px-6 lg:px-8 py-12 pointer-events-none">
          <div className="max-w-7xl mx-auto h-full">
            <div className="border-4 border-warning/40 rounded-[3rem] h-full"></div>
          </div>
        </div>

        {/* Content Container - POR CIMA DE TUDO */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Statistics Badges - Topo */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-background-secondary/80 backdrop-blur-sm border border-background-tertiary px-4 py-2 rounded-full">
              <span className="text-text-primary font-semibold">{availableCount}</span>
              <span className="text-text-secondary ml-2">Available Properties</span>
            </div>
            <div className="bg-background-secondary/80 backdrop-blur-sm border border-background-tertiary px-4 py-2 rounded-full">
              <span className="text-text-primary font-semibold">{soldCount}</span>
              <span className="text-text-secondary ml-2">Sold Properties</span>
            </div>
            <div className="bg-background-secondary/80 backdrop-blur-sm border border-background-tertiary px-4 py-2 rounded-full">
              <span className="text-text-primary font-semibold">15</span>
              <span className="text-text-secondary ml-2">Days Average</span>
            </div>
            <div className="bg-background-secondary/80 backdrop-blur-sm border border-background-tertiary px-4 py-2 rounded-full">
              <span className="text-text-primary font-semibold">98%</span>
              <span className="text-text-secondary ml-2">Satisfaction</span>
            </div>
          </div>

          {/* Main Headline - TODO BRANCO */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              We guarantee<br />
              your approval<br />
              with just your country<br />
              of origin identification.
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Imagine being able to buy your own home with just $5,000 down payment.
            </p>
          </div>

          {/* Search Bar */}
          <Card className="max-w-5xl mx-auto p-4 bg-background-secondary/95 backdrop-blur-sm border-accent-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Property Location */}
              <div className="md:col-span-1">
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <select className="w-full pl-10 pr-3 py-3 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary appearance-none cursor-pointer">
                    <option>Property Location</option>
                    <option>Kansas City</option>
                    <option>Independence</option>
                    <option>Lee&apos;s Summit</option>
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div className="md:col-span-1">
                <div className="relative">
                  <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <select className="w-full pl-10 pr-3 py-3 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary appearance-none cursor-pointer">
                    <option>Property Type</option>
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Condo</option>
                  </select>
                </div>
              </div>

              {/* Listing Status */}
              <div className="md:col-span-1">
                <div className="relative">
                  <TrendingUp size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <select className="w-full pl-10 pr-3 py-3 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary appearance-none cursor-pointer">
                    <option>Listing Status</option>
                    <option>Available</option>
                    <option>Sold</option>
                    <option>Reserved</option>
                  </select>
                </div>
              </div>

              {/* Set Value */}
              <div className="md:col-span-1">
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Max Price"
                    className="w-full pl-10 pr-3 py-3 bg-background-tertiary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1">
                <Link href="/imoveis" className="block">
                  <Button className="w-full h-full bg-accent-primary hover:bg-accent-hover text-white font-semibold flex items-center justify-center gap-2">
                    <Search size={18} />
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FEATURED PROPERTIES - COM BORDA DECORATIVA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Borda decorativa laranja */}
          <div className="border-4 border-warning/40 rounded-[3rem] p-8 md:p-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-accent-primary mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                Imagine being able to buy your own home with just $5,000 down payment.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <Card className="overflow-hidden">
                      <div className="h-64 bg-background-tertiary"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-background-tertiary rounded w-3/4"></div>
                        <div className="h-3 bg-background-tertiary rounded w-1/2"></div>
                        <div className="h-6 bg-background-tertiary rounded w-1/3"></div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {featuredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                <div className="text-center">
                  <Link href="/imoveis">
                    <Button size="lg" variant="outline" className="gap-2">
                      View All Properties
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <AboutOwners />

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* FINAL CTA */}
      <section className="py-20" style={{ backgroundColor: '#1a2e44' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Building size={40} style={{ color: '#1a2e44' }} />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-warning mb-6">
            Ready to Find<br />
            Your Dream Home?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Contact us now and discover how we can help you achieve the dream of homeownership.
          </p>

          <div className="inline-flex flex-col sm:flex-row items-center gap-3 border-2 border-white/30 rounded-full p-2">
            <a
              href="https://wa.me/18168901804"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-warning text-white px-6 py-3 rounded-full font-semibold hover:bg-warning/90 transition-colors w-full sm:w-auto"
            >
              <MessageCircle size={18} />
              WhatsApp: +1 (816) 890-1804
            </a>
            <a
              href="tel:+18168901804"
              className="inline-flex items-center justify-center gap-2 bg-warning text-white px-6 py-3 rounded-full font-semibold hover:bg-warning/90 transition-colors w-full sm:w-auto"
            >
              <Phone size={18} />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER - ESTILO PDF MELHORADO */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ backgroundColor: '#1a2e44' }}>
        {/* Bordas decorativas arredondadas */}
        <div className="absolute top-0 left-0 w-48 h-48 border-4 border-white/10 rounded-[3rem] -translate-x-24 -translate-y-24"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 border-4 border-white/10 rounded-[3rem] translate-x-32 translate-y-32"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Grid com 2 colunas: Contact Info | Logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12 pb-12 border-b border-white/10">
            
            {/* Contact Info - Lado esquerdo */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-6">Contact</h3>
              
              <div className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} />
                </div>
                <a href="tel:+18168901804" className="text-base">
                  +1 (816) 890-1804
                </a>
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

            {/* Logo - Lado direito */}
            <div className="flex justify-center md:justify-end">
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-3 mb-2">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Building size={28} className="text-warning" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-warning">MCSILVA & WIGGIT</h3>
                  </div>
                </div>
                <p className="text-sm text-white/60">Making dreams come true since 2014</p>
              </div>
            </div>
          </div>

          {/* Copyright - Centralizado em caixa arredondada */}
          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-white/20 rounded-2xl px-8 py-5 text-center backdrop-blur-sm bg-white/5">
              <p className="text-white/90 text-sm font-medium">
                © 2024 McSilva & Wiggit. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}