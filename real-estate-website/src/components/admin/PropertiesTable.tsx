import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/lib/supabase'
import { Card, Badge, Button } from '@/components/ui/Button'
import { 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Building
} from 'lucide-react'

interface PropertiesTableProps {
  properties: Property[]
  loading: boolean
  error: string | null
  onStatusUpdate: (id: string, status: 'available' | 'sold' | 'reserved') => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function PropertiesTable({ 
  properties, 
  loading, 
  error, 
  onStatusUpdate, 
  onDelete 
}: PropertiesTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showActions, setShowActions] = useState<string | null>(null)

  const formatPrice = (price: number | null) => {
    if (!price) return 'Sob consulta'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  const handleStatusUpdate = async (id: string, status: 'available' | 'sold' | 'reserved') => {
    try {
      setActionLoading(id)
      await onStatusUpdate(id, status)
      setShowActions(null)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o imóvel "${title}"?`)) {
      try {
        setActionLoading(id)
        await onDelete(id)
        setShowActions(null)
      } catch (error) {
        console.error('Erro ao deletar imóvel:', error)
        alert('Erro ao deletar imóvel. Tente novamente.')
      } finally {
        setActionLoading(null)
      }
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="w-16 h-16 bg-background-tertiary rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-background-tertiary rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-background-tertiary rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-background-tertiary rounded"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <AlertCircle size={48} className="mx-auto text-danger mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Erro ao carregar</h3>
          <p className="text-text-secondary">{error}</p>
        </div>
      </Card>
    )
  }

  if (properties.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Building size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Nenhum imóvel encontrado
          </h3>
          <p className="text-text-secondary mb-4">
            Comece adicionando seu primeiro imóvel ao sistema.
          </p>
          <Link href="/admin/imoveis/novo">
            <Button>Adicionar Imóvel</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      {/* Header da tabela */}
      <div className="bg-background-tertiary/50 px-6 py-3 border-b border-background-tertiary">
        <div className="hidden md:grid md:grid-cols-12 gap-4 text-sm font-medium text-text-muted">
          <div className="col-span-4">Imóvel</div>
          <div className="col-span-2">Localização</div>
          <div className="col-span-2">Preço</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Criado</div>
          <div className="col-span-1">Ações</div>
        </div>
      </div>

      {/* Lista de imóveis */}
      <div className="divide-y divide-background-tertiary">
        {properties.map((property) => (
          <div 
            key={property.id} 
            className="p-6 hover:bg-background-tertiary/30 transition-colors"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Imóvel info */}
              <div className="md:col-span-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-background-tertiary flex-shrink-0">
                  {property.main_photo_url ? (
                    <Image
                      src={property.main_photo_url}
                      alt={property.title}
                      width={64}
                      height={64}
                      className={`w-full h-full object-cover ${
                        property.status === 'sold' ? 'filter-sold' : ''
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building size={24} className="text-text-muted" />
                    </div>
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold truncate ${
                    property.status === 'sold' ? 'text-sold' : 'text-text-primary'
                  }`}>
                    {property.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {property.bedrooms}q • {property.bathrooms}b
                    {property.area_sqm && ` • ${property.area_sqm}m²`}
                  </p>
                </div>
              </div>

              {/* Localização */}
              <div className="md:col-span-2">
                <p className="text-text-primary text-sm">
                  {property.city}
                </p>
                <p className="text-text-secondary text-xs">
                  {property.neighborhood}
                </p>
              </div>

              {/* Preço */}
              <div className="md:col-span-2">
                <p className={`font-semibold ${
                  property.status === 'sold' ? 'text-sold' : 'text-text-primary'
                }`}>
                  {formatPrice(property.price)}
                </p>
                {property.status === 'sold' && property.days_to_sell && (
                  <p className="text-xs text-success">
                    Vendido em {property.days_to_sell} dias
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="md:col-span-1">
                {getStatusBadge(property.status)}
              </div>

              {/* Data criação */}
              <div className="md:col-span-2">
                <p className="text-text-secondary text-sm">
                  {formatDate(property.created_at)}
                </p>
              </div>

              {/* Ações */}
              <div className="md:col-span-1">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowActions(
                      showActions === property.id ? null : property.id
                    )}
                    disabled={actionLoading === property.id}
                  >
                    <MoreHorizontal size={16} />
                  </Button>

                  {/* Menu de ações */}
                  {showActions === property.id && (
                    <div className="absolute right-0 top-full mt-1 bg-background-secondary border border-background-tertiary rounded-lg shadow-lg z-10 min-w-48">
                      <div className="py-1">
                        <Link 
                          href={`/imoveis/${property.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-background-tertiary"
                        >
                          <Eye size={14} />
                          Ver no site
                        </Link>
                        
                        <Link 
                          href={`/admin/imoveis/${property.id}/editar`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-background-tertiary"
                        >
                          <Edit size={14} />
                          Editar
                        </Link>

                        <hr className="border-background-tertiary my-1" />

                        {property.status !== 'available' && (
                          <button
                            onClick={() => handleStatusUpdate(property.id, 'available')}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-success hover:bg-background-tertiary"
                          >
                            <CheckCircle size={14} />
                            Marcar como Disponível
                          </button>
                        )}

                        {property.status !== 'reserved' && (
                          <button
                            onClick={() => handleStatusUpdate(property.id, 'reserved')}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warning hover:bg-background-tertiary"
                          >
                            <Clock size={14} />
                            Marcar como Reservado
                          </button>
                        )}

                        {property.status !== 'sold' && (
                          <button
                            onClick={() => handleStatusUpdate(property.id, 'sold')}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-background-tertiary"
                          >
                            <CheckCircle size={14} />
                            Marcar como Vendido
                          </button>
                        )}

                        <hr className="border-background-tertiary my-1" />

                        <button
                          onClick={() => handleDelete(property.id, property.title)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/10"
                        >
                          <Trash2 size={14} />
                          Deletar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}