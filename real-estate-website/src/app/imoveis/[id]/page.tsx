// src/app/imoveis/[id]/page.tsx - ENGLISH VERSION

'use client'

import { useProperty } from '@/hooks/useProperties'
import { Header } from '@/components/Header'
import { PropertyImageGallery } from '@/components/PropertyImageGallery'
import { ContactForm } from '@/components/ContactForm'
import { Card, Badge, Button } from '@/components/ui/Button'
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  Calendar,
  Phone,
  MessageCircle,
  Share2,
  ArrowLeft,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const { property, loading, error } = useProperty(params.id)
  const [showContactForm, setShowContactForm] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-background-tertiary rounded w-1/4"></div>
            <div className="h-96 bg-background-tertiary rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-background-tertiary rounded w-3/4"></div>
                <div className="h-4 bg-background-tertiary rounded w-1/2"></div>
                <div className="h-20 bg-background-tertiary rounded"></div>
              </div>
              <div className="h-80 bg-background-tertiary rounded"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background-primary">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Property not found
            </h1>
            <p className="text-text-secondary mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/imoveis">
              <Button>
                <ArrowLeft size={16} className="mr-2" />
                Back to listings
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const isSold = property.status === 'sold'
  const isReserved = property.status === 'reserved'

  const formatPrice = (price: number | null) => {
    if (!price) return 'Price upon request'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusInfo = () => {
    switch (property.status) {
      case 'available':
        return { badge: <Badge variant="success">Available</Badge>, canContact: true }
      case 'sold':
        return { 
          badge: <Badge variant="sold">Sold</Badge>, 
          canContact: false,
          extraInfo: property.days_to_sell ? `Sold in ${property.days_to_sell} days` : 'Sold'
        }
      case 'reserved':
        return { badge: <Badge variant="warning">Reserved</Badge>, canContact: false }
      default:
        return { badge: <Badge>-</Badge>, canContact: false }
    }
  }

  const statusInfo = getStatusInfo()

  // Share function
  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Check out this property: ${property.title}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  // Direct WhatsApp (without form)
  const handleQuickWhatsApp = () => {
    const message = `Hello! I'm interested in the property "${property.title}". Link: ${window.location.href}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/18168901804?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link href="/" className="hover:text-text-primary">Home</Link>
          <span>/</span>
          <Link href="/imoveis" className="hover:text-text-primary">Properties</Link>
          <span>/</span>
          <span className="text-text-primary truncate">{property.title}</span>
        </nav>

        {/* Back button */}
        <Link href="/imoveis" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6">
          <ArrowLeft size={16} />
          <span>Back to listings</span>
        </Link>

        {/* Image gallery */}
        <div className="mb-8">
          <PropertyImageGallery property={property} />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property information */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Property header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h1 className={`text-3xl font-bold mb-2 ${isSold ? 'text-sold' : 'text-text-primary'}`}>
                      {property.title}
                    </h1>
                    
                    {(property.neighborhood || property.city) && (
                      <div className="flex items-center text-text-secondary mb-3">
                        <MapPin size={18} className="mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {property.address && `${property.address}, `}
                          {property.neighborhood && `${property.neighborhood}, `}
                          {property.city}
                          {property.state && `, ${property.state}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {statusInfo.badge}
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share2 size={16} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className={`text-3xl sm:text-4xl font-bold ${isSold ? 'text-sold' : 'text-text-primary'}`}>
                    {formatPrice(property.price)}
                  </div>
                  
                  {statusInfo.extraInfo && (
                    <div className="text-sm text-success">
                      {statusInfo.extraInfo}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-3">
                      <BedDouble size={20} className="text-accent-primary flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-text-primary">{property.bedrooms}</div>
                        <div className="text-sm text-text-muted">Bedrooms</div>
                      </div>
                    </div>
                  )}
                  
                  {property.bathrooms && (
                    <div className="flex items-center gap-3">
                      <Bath size={20} className="text-accent-primary flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-text-primary">{property.bathrooms}</div>
                        <div className="text-sm text-text-muted">Bathrooms</div>
                      </div>
                    </div>
                  )}
                  
                  {property.area_sqm && (
                    <div className="flex items-center gap-3">
                      <Maximize size={20} className="text-accent-primary flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-text-primary">{property.area_sqm}m²</div>
                        <div className="text-sm text-text-muted">Total area</div>
                      </div>
                    </div>
                  )}
                  
                  {property.created_at && (
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-accent-primary flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-text-primary">
                          {new Date(property.created_at).getFullYear()}
                        </div>
                        <div className="text-sm text-text-muted">Listed</div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Description */}
              {property.description && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Description</h3>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar - Contact */}
          <div className="space-y-6">
            {/* Quick contact card - Sticky on desktop when form is closed */}
            <Card className={`p-6 ${!showContactForm ? 'lg:sticky lg:top-24' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {isSold ? 'Property Sold' : 'Interested in this property?'}
                </h3>
                
                {/* Close button (mobile) */}
                {showContactForm && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowContactForm(false)}
                    className="lg:hidden"
                  >
                    <X size={20} />
                  </Button>
                )}
              </div>
              
              {isSold ? (
                <div className="text-center py-4">
                  <p className="text-text-secondary mb-4">
                    This property has been sold, but we have other similar options.
                  </p>
                  <Button className="w-full" onClick={handleQuickWhatsApp}>
                    <MessageCircle size={16} className="mr-2" />
                    View Similar Properties
                  </Button>
                </div>
              ) : isReserved ? (
                <div className="text-center py-4">
                  <p className="text-text-secondary mb-4">
                    This property is reserved. Join the waiting list in case the deal doesn't go through.
                  </p>
                  <Button className="w-full" variant="outline" onClick={handleQuickWhatsApp}>
                    <MessageCircle size={16} className="mr-2" />
                    Join Waiting List
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Main button - Opens/closes form */}
                  <Button 
                    className="w-full" 
                    onClick={() => setShowContactForm(!showContactForm)}
                  >
                    <MessageCircle size={16} className="mr-2" />
                    {showContactForm ? 'Hide Form' : 'I\'m Interested'}
                  </Button>
                  
                  {/* Direct WhatsApp button */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleQuickWhatsApp}
                  >
                    <MessageCircle size={16} className="mr-2" />
                    Direct WhatsApp
                  </Button>
                  
                  {/* Phone button */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open('tel:+18168901804', '_self')}
                  >
                    <Phone size={16} className="mr-2" />
                    +1 (816) 890-1804
                  </Button>
                  
                  <div className="text-center pt-2">
                    <p className="text-sm text-text-muted">
                      ⚡ Response within 2 hours
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Contact form */}
            {showContactForm && statusInfo.canContact && (
              <ContactForm 
                propertyId={property.id}
                propertyTitle={property.title}
                propertyPrice={property.price}
                propertyCity={property.city}
                propertyNeighborhood={property.neighborhood}
                propertyBedrooms={property.bedrooms}
                propertyBathrooms={property.bathrooms}
                propertyAreaSqm={property.area_sqm}
                onSuccess={() => setShowContactForm(false)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}