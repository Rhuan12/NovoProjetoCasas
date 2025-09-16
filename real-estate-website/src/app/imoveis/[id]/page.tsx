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
  Mail,
  Share2,
  Heart,
  ArrowLeft
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
              Imóvel não encontrado
            </h1>
            <p className="text-text-secondary mb-6">
              O imóvel que você está procurando não existe ou foi removido.
            </p>
            <Link href="/imoveis">
              <Button>
                <ArrowLeft size={16} className="mr-2" />
                Voltar para listagem
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
    if (!price) return 'Preço sob consulta'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusInfo = () => {
    switch (property.status) {
      case 'available':
        return { badge: <Badge variant="success">Disponível</Badge>, canContact: true }
      case 'sold':
        return { 
          badge: <Badge variant="sold">Vendido</Badge>, 
          canContact: false,
          extraInfo: property.days_to_sell ? `Vendido em ${property.days_to_sell} dias` : 'Vendido'
        }
      case 'reserved':
        return { badge: <Badge variant="warning">Reservado</Badge>, canContact: false }
      default:
        return { badge: <Badge>-</Badge>, canContact: false }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link href="/" className="hover:text-text-primary">Início</Link>
          <span>/</span>
          <Link href="/imoveis" className="hover:text-text-primary">Imóveis</Link>
          <span>/</span>
          <span className="text-text-primary">{property.title}</span>
        </nav>

        {/* Botão voltar */}
        <Link href="/imoveis" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6">
          <ArrowLeft size={16} />
          <span>Voltar para listagem</span>
        </Link>

        {/* Gallery de imagens */}
        <div className="mb-8">
          <PropertyImageGallery property={property} />
        </div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do imóvel */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Header do imóvel */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className={`text-3xl font-bold mb-2 ${isSold ? 'text-sold' : 'text-text-primary'}`}>
                      {property.title}
                    </h1>
                    
                    {(property.neighborhood || property.city) && (
                      <div className="flex items-center text-text-secondary mb-3">
                        <MapPin size={18} className="mr-2" />
                        <span>
                          {property.address && `${property.address}, `}
                          {property.neighborhood && `${property.neighborhood}, `}
                          {property.city}
                          {property.state && `, ${property.state}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {statusInfo.badge}
                    <Button variant="ghost" size="sm">
                      <Share2 size={16} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart size={16} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`text-4xl font-bold ${isSold ? 'text-sold' : 'text-text-primary'}`}>
                    {formatPrice(property.price)}
                  </div>
                  
                  {statusInfo.extraInfo && (
                    <div className="text-sm text-success">
                      {statusInfo.extraInfo}
                    </div>
                  )}
                </div>
              </div>

              {/* Características */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Características</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.bedrooms && (
                    <div className="flex items-center gap-3">
                      <BedDouble size={20} className="text-accent-primary" />
                      <div>
                        <div className="font-semibold text-text-primary">{property.bedrooms}</div>
                        <div className="text-sm text-text-muted">Quartos</div>
                      </div>
                    </div>
                  )}
                  
                  {property.bathrooms && (
                    <div className="flex items-center gap-3">
                      <Bath size={20} className="text-accent-primary" />
                      <div>
                        <div className="font-semibold text-text-primary">{property.bathrooms}</div>
                        <div className="text-sm text-text-muted">Banheiros</div>
                      </div>
                    </div>
                  )}
                  
                  {property.area_sqm && (
                    <div className="flex items-center gap-3">
                      <Maximize size={20} className="text-accent-primary" />
                      <div>
                        <div className="font-semibold text-text-primary">{property.area_sqm}m²</div>
                        <div className="text-sm text-text-muted">Área total</div>
                      </div>
                    </div>
                  )}
                  
                  {property.created_at && (
                    <div className="flex items-center gap-3">
                      <Calendar size={20} className="text-accent-primary" />
                      <div>
                        <div className="font-semibold text-text-primary">
                          {new Date(property.created_at).getFullYear()}
                        </div>
                        <div className="text-sm text-text-muted">Anunciado</div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Descrição */}
              {property.description && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Descrição</h3>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar - Contato */}
          <div className="space-y-6">
            {/* Card de contato */}
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {isSold ? 'Imóvel Vendido' : 'Interesse neste imóvel?'}
              </h3>
              
              {isSold ? (
                <div className="text-center py-4">
                  <p className="text-text-secondary mb-4">
                    Este imóvel já foi vendido, mas temos outras opções similares.
                  </p>
                  <Button className="w-full">
                    Ver Imóveis Similares
                  </Button>
                </div>
              ) : isReserved ? (
                <div className="text-center py-4">
                  <p className="text-text-secondary mb-4">
                    Este imóvel está reservado. Entre na lista de espera caso a negociação não se concretize.
                  </p>
                  <Button className="w-full" variant="outline">
                    Lista de Espera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => setShowContactForm(!showContactForm)}
                  >
                    <Mail size={16} className="mr-2" />
                    Tenho Interesse
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Phone size={16} className="mr-2" />
                    (11) 99999-9999
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-text-muted">
                      Resposta em até 2 horas
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Formulário de contato */}
            {showContactForm && statusInfo.canContact && (
              <ContactForm 
                propertyId={property.id}
                propertyTitle={property.title}
                onSuccess={() => setShowContactForm(false)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}