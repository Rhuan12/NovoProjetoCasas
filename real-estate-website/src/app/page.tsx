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
  const { properties, loading } = useProperties({ status: 'available' })

  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  // Fetch site settings
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
  
  // Get featured properties (first 6 available)
  const featuredProperties = properties.slice(0, 6)
  
  // Statistics
  const availableCount = properties.filter(p => p.status === 'available').length
  const soldCount = properties.filter(p => p.status === 'sold').length
  
  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      
      {/* Hero Section */}
      <section className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-light/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Credibility badge */}
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Award size={16} />
              <span>Real Estate Specialists</span>
            </div>
            
            {/* Main title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
              {settings?.company_name || 'McSilva & Wiggit'}
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto mb-12 leading-relaxed">
              We guarantee your approval with just your country of origin identification.
            </p>
            
            {/* Quick search */}
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="p-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search by city, neighborhood or features..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-transparent border-none text-text-primary placeholder-text-muted focus:outline-none text-lg"
                    />
                  </div>
                  <Link href={`/imoveis${searchTerm ? `?search=${searchTerm}` : ''}`}>
                    <Button size="lg" className="px-8">
                      Search
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
            
            {/* Quick statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-text-primary mb-1">
                  {availableCount}
                </div>
                <div className="text-text-secondary text-sm md:text-base">
                  Available Properties
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-success mb-1">
                  {soldCount}
                </div>
                <div className="text-text-secondary text-sm md:text-base">
                  Sold Properties
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent-primary mb-1">
                  15
                </div>
                <div className="text-text-secondary text-sm md:text-base">
                  Days Average
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-warning mb-1">
                  98%
                </div>
                <div className="text-text-secondary text-sm md:text-base">
                  Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Unique Opportunities</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
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
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      <AboutOwners />

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-accent-primary to-accent-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Contact us now and discover how we can help you achieve the dream of homeownership.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className=""
              onClick={() => {
                const phone = settings?.contact_phone?.replace(/\D/g, '') || '18168901804'
                window.open(`https://wa.me/${phone}`, '_blank')
              }}
            >
              <MessageCircle size={20} />
              WhatsApp: {settings?.contact_phone || '+1 (816) 890-1804'}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 gap-2"
              onClick={() => {
                const phone = settings?.contact_phone?.replace(/\D/g, '') || '18168901804'
                window.open(`tel:+${phone}`, '_self')
              }}
            >
              <Phone size={20} />
              Call Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-secondary border-t border-background-tertiary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Phone size={16} />
                  <span>{settings?.contact_phone || '+1 (816) 890-1804'}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail size={16} />
                  <span>{settings?.contact_email || 'contact@realestate.com'}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin size={16} />
                  <span>{settings?.contact_address || 'Fortaleza, CE'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-background-tertiary mt-12 pt-8 text-center text-text-muted">
            <p>&copy; 2024 {settings?.company_name || 'Premium Real Estate'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}