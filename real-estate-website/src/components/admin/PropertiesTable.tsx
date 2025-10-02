// src/components/admin/PropertiesTable.tsx - VERSÃO FINAL COMPLETA

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createPortal } from 'react-dom'
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
  Building,
  X
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const [mounted, setMounted] = useState(false)

  // ✅ Garantir que está no client-side para usar portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ Calcular posição do dropdown baseado no botão
  useEffect(() => {
    if (showActions && buttonRefs.current[showActions]) {
      const button = buttonRefs.current[showActions]
      const rect = button.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      const scrollX = window.scrollX || window.pageXOffset

      const dropdownWidth = 200
      const dropdownHeight = 400
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      // Posicionamento melhorado
      let left = rect.right + scrollX - dropdownWidth + 8
      let top = rect.bottom + scrollY + 4

      // Ajustar se não cabe à direita
      if (left + dropdownWidth > viewportWidth - 10) {
        left = rect.left + scrollX
      }

      // Ajustar se está muito à esquerda
      if (left < 10) {
        left = 10
      }

      // Ajustar se não cabe embaixo
      if (rect.bottom + dropdownHeight > viewportHeight - 20) {
        top = rect.top + scrollY - dropdownHeight - 4
        
        // Se também não cabe em cima, manter embaixo com scroll
        if (top < 20) {
          top = rect.bottom + scrollY + 4
        }
      }

      setDropdownPosition({ top, left })
    }
  }, [showActions])

  // ✅ Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        showActions &&
        buttonRefs.current[showActions] &&
        !buttonRefs.current[showActions]?.contains(event.target as Node)
      ) {
        setShowActions(null)
      }
    }

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showActions])

  // ✅ Fechar com ESC
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowActions(null)
      }
    }

    if (showActions) {
      document.addEventListener('keydown', handleEscKey)
      return () => {
        document.removeEventListener('keydown', handleEscKey)
      }
    }
  }, [showActions])

  // ✅ Fechar ao fazer scroll
  useEffect(() => {
    function handleScroll() {
      if (showActions) {
        setShowActions(null)
      }
    }

    if (showActions) {
      window.addEventListener('scroll', handleScroll, true)
      return () => {
        window.removeEventListener('scroll', handleScroll, true)
      }
    }
  }, [showActions])

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

  // ✅ Componente Dropdown com Portal
  const DropdownMenu = ({ property }: { property: Property }) => {
    if (!mounted || showActions !== property.id) return null

    const menuContent = (
      <div
        ref={dropdownRef}
        className="fixed bg-background-secondary border border-background-tertiary rounded-lg shadow-2xl z-[9999] min-w-[200px] max-h-[70vh] overflow-y-auto"
        style={{
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
        }}
      >
        {/* Seta apontando para o botão (opcional) */}
        <div className="hidden lg:block absolute -top-2 right-4 w-4 h-4 bg-background-secondary border-t border-l border-background-tertiary transform rotate-45"></div>

        {/* Header Mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-background-tertiary sticky top-0 bg-background-secondary z-10">
          <h3 className="font-semibold text-text-primary">Opções</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(null)}
          >
            <X size={20} />
          </Button>
        </div>

        <div className="py-2">
          {/* Ver no site */}
          <Link 
            href={`/imoveis/${property.id}`}
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-background-tertiary transition-colors w-full text-left"
            onClick={() => setShowActions(null)}
          >
            <Eye size={16} />
            Ver no site
          </Link>
          
          {/* Editar */}
          <Link 
            href={`/admin/imoveis/${property.id}/editar`}
            className="flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-background-tertiary transition-colors w-full text-left"
            onClick={() => setShowActions(null)}
          >
            <Edit size={16} />
            Editar
          </Link>

          <hr className="border-background-tertiary my-2" />

          {/* Atualizar Status */}
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-text-muted mb-2">MUDAR STATUS</p>
          </div>

          {property.status !== 'available' && (
            <button
              onClick={() => handleStatusUpdate(property.id, 'available')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-success hover:bg-background-tertiary transition-colors text-left"
              disabled={actionLoading === property.id}
            >
              <CheckCircle size={16} />
              Marcar como Disponível
            </button>
          )}

          {property.status !== 'reserved' && (
            <button
              onClick={() => handleStatusUpdate(property.id, 'reserved')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-warning hover:bg-background-tertiary transition-colors text-left"
              disabled={actionLoading === property.id}
            >
              <Clock size={16} />
              Marcar como Reservado
            </button>
          )}

          {property.status !== 'sold' && (
            <button
              onClick={() => handleStatusUpdate(property.id, 'sold')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-background-tertiary transition-colors text-left"
              disabled={actionLoading === property.id}
            >
              <CheckCircle size={16} />
              Marcar como Vendido
            </button>
          )}

          <hr className="border-background-tertiary my-2" />

          {/* Deletar */}
          <button
            onClick={() => handleDelete(property.id, property.title)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-danger hover:bg-danger/10 transition-colors text-left"
            disabled={actionLoading === property.id}
          >
            <Trash2 size={16} />
            Deletar Imóvel
          </button>
        </div>
      </div>
    )

    // Usar Portal para renderizar fora da hierarquia
    return createPortal(menuContent, document.body)
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
    <>
      <Card className="overflow-visible">
        {/* Header da tabela - Desktop Only */}
        <div className="hidden lg:block bg-background-tertiary/50 px-6 py-3 border-b border-background-tertiary">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-text-muted">
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
              className="p-4 lg:p-6 hover:bg-background-tertiary/30 transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                
                {/* Imóvel info */}
                <div className="lg:col-span-4 flex items-center gap-4">
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
                <div className="lg:col-span-2">
                  <p className="text-text-primary text-sm font-medium lg:font-normal">
                    {property.city}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {property.neighborhood}
                  </p>
                </div>

                {/* Preço */}
                <div className="lg:col-span-2">
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
                <div className="lg:col-span-1">
                  {getStatusBadge(property.status)}
                </div>

                {/* Data criação */}
                <div className="lg:col-span-2 hidden lg:block">
                  <p className="text-text-secondary text-sm">
                    {formatDate(property.created_at)}
                  </p>
                </div>

                {/* Ações */}
                <div className="lg:col-span-1 relative">
                  <Button
                    ref={(el) => {
                      buttonRefs.current[property.id] = el
                    }}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowActions(
                      showActions === property.id ? null : property.id
                    )}
                    disabled={actionLoading === property.id}
                    className="w-full lg:w-auto"
                  >
                    <MoreHorizontal size={16} />
                    <span className="lg:hidden ml-2">Opções</span>
                  </Button>

                  {/* Dropdown renderizado via Portal */}
                  <DropdownMenu property={property} />
                </div>
              </div>

              {/* Info adicional mobile */}
              <div className="lg:hidden mt-3 pt-3 border-t border-background-tertiary flex items-center justify-between text-xs text-text-muted">
                <span>Criado em {formatDate(property.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Overlay escuro para mobile */}
      {showActions && (
        <div 
          className="fixed inset-0 bg-black/20 z-[9998] lg:hidden"
          onClick={() => setShowActions(null)}
        />
      )}
    </>
  )
}