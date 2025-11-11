import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/lib/supabase'
import { Card, Badge, Button } from '@/components/ui/Button'
import { MapPin, BedDouble, Bath, Maximize } from 'lucide-react'

interface PropertyCardProps {
  property: Property
  showAdminControls?: boolean
  onEdit?: (property: Property) => void
  onDelete?: (property: Property) => void
}

export function PropertyCard({ 
  property, 
  showAdminControls = false,
  onEdit,
  onDelete 
}: PropertyCardProps) {
  const isSold = property.status === 'sold'
  
  const formatPrice = (price: number | null) => {
    if (!price) return 'Price upon request'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusBadge = () => {
    switch (property.status) {
      case 'available':
        return <Badge variant="success">Available</Badge>
      case 'sold':
        return <Badge variant="sold">Sold</Badge>
      case 'reserved':
        return <Badge variant="warning">Reserved</Badge>
      default:
        return <Badge>-</Badge>
    }
  }

  return (
    <Card className="overflow-hidden group relative hover:shadow-2xl transition-all duration-300 border-0 bg-transparent">
      {/* Container principal */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Imagem principal - BEM MAIOR */}
        <div className="relative w-full h-96 overflow-hidden">
          {property.main_photo_url ? (
            <Image
              src={property.main_photo_url}
              alt={property.title}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSold ? 'grayscale opacity-70' : ''}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className={`w-full h-full bg-background-tertiary flex items-center justify-center ${isSold ? 'grayscale opacity-70' : ''}`}>
              <span className="text-text-muted">No photo</span>
            </div>
          )}
          
          {/* Overlay gradient apenas no topo para o badge */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none"></div>

          {/* Badge de Status - Canto superior direito */}
          <div className="absolute top-4 right-4 z-10">
            {getStatusBadge()}
          </div>

          {/* Tempo de venda para imóveis vendidos */}
          {isSold && property.days_to_sell && (
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="sold" size="sm">
                Sold in {property.days_to_sell} days
              </Badge>
            </div>
          )}
        </div>

        {/* RODAPÉ GLASSMORPHISM - Separado da imagem */}
        <div className="relative bg-background-secondary/80 backdrop-blur-xl border-t border-white/10 p-5">
          {/* Preço em destaque */}
          <div className="mb-4">
            <span className="text-3xl font-bold text-warning">
              {formatPrice(property.price)}
            </span>
          </div>

          {/* Características em linha */}
          <div className="flex items-center gap-4 mb-4">
            {property.bedrooms && (
              <div className="flex items-center gap-2 text-text-primary">
                <div className="w-10 h-10 rounded-lg bg-background-tertiary/80 backdrop-blur-sm flex items-center justify-center border border-background-tertiary">
                  <BedDouble size={20} strokeWidth={2.5} className="text-text-secondary" />
                </div>
                <span className="text-lg font-bold">{property.bedrooms}</span>
              </div>
            )}
            
            {property.bathrooms && (
              <div className="flex items-center gap-2 text-text-primary">
                <div className="w-10 h-10 rounded-lg bg-background-tertiary/80 backdrop-blur-sm flex items-center justify-center border border-background-tertiary">
                  <Bath size={20} strokeWidth={2.5} className="text-text-secondary" />
                </div>
                <span className="text-lg font-bold">{property.bathrooms}</span>
              </div>
            )}
          </div>

          {/* Localização */}
          {(property.neighborhood || property.city) && (
            <p className="text-base text-text-secondary font-medium mb-4 line-clamp-1">
              {property.neighborhood && `${property.neighborhood}, `}
              {property.city}
              {property.state && `, ${property.state}`}
            </p>
          )}

          {/* Botão View Details */}
          {!isSold ? (
            <Link href={`/imoveis/${property.id}`} className="block">
              <button className="w-full py-3.5 px-4 bg-background-tertiary/60 hover:bg-accent-primary hover:text-white text-text-primary font-semibold rounded-xl transition-all duration-300 border border-background-tertiary backdrop-blur-sm">
                View Details
              </button>
            </Link>
          ) : (
            <button 
              className="w-full py-3.5 px-4 bg-background-tertiary/40 text-text-muted font-semibold rounded-xl cursor-not-allowed border border-background-tertiary"
              disabled
            >
              Property Sold
            </button>
          )}
        </div>
      </div>

      {/* Seção administrativa */}
      {showAdminControls && (
        <div className="mt-2 p-4 bg-background-secondary/80 backdrop-blur-xl rounded-xl border border-background-tertiary">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(property)}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(property)}
              className="flex-1 text-danger hover:bg-danger/10"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}