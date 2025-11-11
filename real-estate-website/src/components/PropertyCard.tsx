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
    <Card className="overflow-hidden group relative border-2 border-accent-primary/20 hover:border-accent-primary transition-all duration-300">
      {/* Imagem principal */}
      <div className="relative w-full h-64 overflow-hidden">
        {property.main_photo_url ? (
          <Image
            src={property.main_photo_url}
            alt={property.title}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-110 ${isSold ? 'grayscale opacity-70' : ''}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={`w-full h-full bg-background-tertiary flex items-center justify-center ${isSold ? 'grayscale opacity-70' : ''}`}>
            <span className="text-text-muted">No photo</span>
          </div>
        )}
        
        {/* Overlay gradient no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badge de Preço - Estilo PDF (canto superior esquerdo) */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-warning text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
            {formatPrice(property.price)}
          </div>
        </div>

        {/* Badge de Status - Canto superior direito */}
        <div className="absolute top-4 right-4 z-10">
          {getStatusBadge()}
        </div>

        {/* Tempo de venda para imóveis vendidos */}
        {isSold && property.days_to_sell && (
          <div className="absolute bottom-4 right-4 z-10">
            <Badge variant="sold" size="sm">
              Sold in {property.days_to_sell} days
            </Badge>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-6 bg-background-secondary">
        {/* Características - Ícones em linha (igual ao PDF) */}
        <div className="flex items-center gap-4 mb-4 text-text-muted">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <BedDouble size={18} />
              <span className="text-sm font-semibold">{property.bedrooms}</span>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath size={18} />
              <span className="text-sm font-semibold">{property.bathrooms}</span>
            </div>
          )}
          
          {property.area_sqm && (
            <div className="flex items-center gap-1">
              <Maximize size={18} />
              <span className="text-sm font-semibold">{property.area_sqm}m²</span>
            </div>
          )}
        </div>

        {/* Localização */}
        {(property.neighborhood || property.city) && (
          <div className="flex items-start gap-2 mb-4">
            <MapPin size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
            <p className={`text-sm line-clamp-2 ${isSold ? 'text-sold' : 'text-text-secondary'}`}>
              {property.neighborhood && `${property.neighborhood}, `}
              {property.city}
              {property.state && `, ${property.state}`}
            </p>
          </div>
        )}

        {/* Botão View Details */}
        <div className="mt-4">
          {!isSold ? (
            <Link href={`/imoveis/${property.id}`} className="block">
              <Button 
                className="w-full bg-background-tertiary hover:bg-accent-primary hover:text-white border border-accent-primary/30 text-text-primary font-semibold transition-all duration-300"
              >
                View Details
              </Button>
            </Link>
          ) : (
            <Button 
              className="w-full" 
              variant="ghost" 
              disabled
            >
              Property Sold
            </Button>
          )}
        </div>

        {/* Administrative controls */}
        {showAdminControls && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-background-tertiary">
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
        )}
      </div>
    </Card>
  )
}