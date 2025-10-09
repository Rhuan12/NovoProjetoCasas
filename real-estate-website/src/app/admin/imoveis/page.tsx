'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { AdminPropertyFilters } from '@/components/admin/PropertyFilters'
import { PropertiesTable } from '@/components/admin/PropertiesTable'
import { useAdminProperties } from '@/hooks/useAdminProperties'
import { Card } from '@/components/ui/Button'
import { Building, TrendingUp, Eye, DollarSign } from 'lucide-react'

export default function AdminPropertiesPage() {
  const [filters, setFilters] = useState({})
  const { 
    properties, 
    loading, 
    error, 
    refetch, 
    updatePropertyStatus, 
    deleteProperty 
  } = useAdminProperties(filters)

  // Estatísticas rápidas
  const totalProperties = properties.length
  const availableProperties = properties.filter(p => p.status === 'available').length
  const soldProperties = properties.filter(p => p.status === 'sold').length
  const totalValue = properties
    .filter(p => p.status === 'available')
    .reduce((sum, p) => sum + (p.price || 0), 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value)
  }

  const handleStatusUpdate = async (id: string, status: 'available' | 'sold' | 'reserved') => {
    try {
      await updatePropertyStatus(id, status)
      // Refetch para atualizar estatísticas
      refetch()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProperty(id)
      // Refetch para atualizar estatísticas
      refetch()
    } catch (error) {
      console.error('Erro ao deletar:', error)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-primary/10 rounded-lg">
                <Building size={20} className="text-accent-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{totalProperties}</p>
                <p className="text-sm text-text-muted">Total de Imóveis</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Eye size={20} className="text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{availableProperties}</p>
                <p className="text-sm text-text-muted">Disponíveis</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <TrendingUp size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{soldProperties}</p>
                <p className="text-sm text-text-muted">Vendidos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-400/10 rounded-lg">
                <DollarSign size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-text-primary">{formatCurrency(totalValue)}</p>
                <p className="text-sm text-text-muted">Valor em Carteira</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <AdminPropertyFilters 
          onFiltersChange={setFilters}
          loading={loading}
          totalProperties={totalProperties}
        />

        {/* Tabela de imóveis */}
        <PropertiesTable
          properties={properties}
          loading={loading}
          error={error}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  )
}