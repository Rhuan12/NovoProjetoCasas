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
    if (!price) return 'Preço sob consulta'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusBadge = () => {
    switch (property.status) {
      case 'available':
        return <Badge variant="success">Disponível</Badge>
      case 'sold':
        return <Badge variant="sold">Vendido</Badge>
      case 'reserved':
        return <Badge variant="warning">Reservado</Badge>
      default:
        return <Badge>-</Badge>
    }
  }

  return (
    <Card className="overflow-hidden" hover={!isSold}>
      {/* Imagem principal */}
      <div className="relative w-full h-64">
        {property.main_photo_url ? (
          <Image
            src={property.main_photo_url}
            alt={property.title}
            fill
            className={`object-cover property-image ${isSold ? 'sold filter-sold' : ''}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={`w-full h-full bg-background-tertiary flex items-center justify-center ${isSold ? 'filter-sold' : ''}`}>
            <span className="text-text-muted">Sem foto</span>
          </div>
        )}
        
        {/* Badge de status */}
        <div className="absolute top-4 left-4">
          {getStatusBadge()}
        </div>

        {/* Tempo de venda para imóveis vendidos */}
        {isSold && property.days_to_sell && (
          <div className="absolute top-4 right-4">
            <Badge variant="sold" size="sm">
              Vendido em {property.days_to_sell} dias
            </Badge>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-6">
        {/* Título e localização */}
        <div className="mb-4">
          <h3 className={`text-xl font-semibold mb-2 ${isSold ? 'text-sold' : 'text-text-primary'}`}>
            {property.title}
          </h3>
          
          {(property.neighborhood || property.city) && (
            <div className="flex items-center text-text-secondary text-sm">
              <MapPin size={16} className="mr-1" />
              <span>
                {property.neighborhood && `${property.neighborhood}, `}
                {property.city}
                {property.state && `, ${property.state}`}
              </span>
            </div>
          )}
        </div>

        {/* Preço */}
        <div className="mb-4">
          <span className={`text-2xl font-bold ${isSold ? 'text-sold' : 'text-text-primary'}`}>
            {formatPrice(property.price)}
          </span>
        </div>

        {/* Características */}
        <div className="flex gap-4 mb-4 text-sm text-text-muted">
          {property.bedrooms && (
            <div className="flex items-center">
              <BedDouble size={16} className="mr-1" />
              <span>{property.bedrooms} quartos</span>
            </div>
          )}
          
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath size={16} className="mr-1" />
              <span>{property.bathrooms} banheiros</span>
            </div>
          )}
          
          {property.area_sqm && (
            <div className="flex items-center">
              <Maximize size={16} className="mr-1" />
              <span>{property.area_sqm}m²</span>
            </div>
          )}
        </div>

        {/* Descrição resumida */}
        {property.description && (
          <p className="text-text-secondary text-sm mb-4 line-clamp-2">
            {property.description}
          </p>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          {!isSold && (
            <Link href={`/imoveis/${property.id}`} className="flex-1">
              <Button className="w-full" variant="outline">
                Ver Detalhes
              </Button>
            </Link>
          )}
          
          {isSold && (
            <Button className="flex-1" variant="ghost" disabled>
              Imóvel Vendido
            </Button>
          )}

          {/* Controles administrativos */}
          {showAdminControls && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(property)}
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(property)}
                className="text-danger hover:bg-danger/10"
              >
                Excluir
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}