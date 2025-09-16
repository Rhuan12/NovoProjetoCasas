'use client'

import { useState } from 'react'
import { useProperties } from '@/hooks/useProperties'
import { PropertyFilters } from '@/components/PropertyFilters'
import { PropertyGrid } from '@/components/PropertyGrid'
import { Header } from '@/components/Header'
import { Badge } from '@/components/ui/Button'

interface FilterState {
  status?: 'available' | 'sold' | 'reserved'
  bedrooms?: number
  bathrooms?: number
  maxPrice?: number
  city?: string
  neighborhood?: string
}

export default function ImoveisPage() {
  const [filters, setFilters] = useState<FilterState>({
    status: 'available' // Por padrão, mostrar apenas disponíveis
  })

  const { properties, loading, error } = useProperties(filters)

  // Estatísticas rápidas
  const availableCount = properties.filter(p => p.status === 'available').length
  const soldCount = properties.filter(p => p.status === 'sold').length
  const averageDaysToSell = soldCount > 0 
    ? Math.round(
        properties
          .filter(p => p.status === 'sold' && p.days_to_sell)
          .reduce((acc, p) => acc + (p.days_to_sell || 0), 0) / soldCount
      )
    : 0

  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Nossos Imóveis
              </h1>
              <p className="text-text-secondary">
                Encontre a casa perfeita com nossa seleção exclusiva de imóveis premium
              </p>
            </div>
            
            {/* Estatísticas rápidas */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{availableCount}</div>
                <div className="text-sm text-text-muted">Disponíveis</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{soldCount}</div>
                <div className="text-sm text-text-muted">Vendidos</div>
              </div>
              
              {averageDaysToSell > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{averageDaysToSell}</div>
                  <div className="text-sm text-text-muted">Dias média</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex gap-2 mb-6">
          <Badge 
            variant={filters.status === 'available' ? 'success' : 'default'}
          >
            {availableCount} Disponíveis
          </Badge>
          <Badge 
            variant={filters.status === 'sold' ? 'sold' : 'default'}
          >
            {soldCount} Vendidos
          </Badge>
          <Badge 
            variant={filters.status === 'reserved' ? 'warning' : 'default'}
          >
            {properties.filter(p => p.status === 'reserved').length} Reservados
          </Badge>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <PropertyFilters 
            onFiltersChange={setFilters}
            loading={loading}
          />
        </div>

        {/* Grid de Imóveis */}
        <PropertyGrid 
          properties={properties}
          loading={loading}
          error={error}
        />

        {/* Call to Action */}
        {properties.length > 0 && !loading && (
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-accent-primary/10 to-accent-light/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Não encontrou o que procura?
              </h3>
              <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                Nossa equipe especializada pode ajudar você a encontrar o imóvel ideal. 
                Entre em contato e deixe-nos saber suas preferências.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-accent-primary text-white px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors font-medium">
                  Falar com Especialista
                </button>
                <button className="border border-background-tertiary text-text-primary px-6 py-3 rounded-lg hover:bg-background-secondary transition-colors font-medium">
                  Lista de Espera
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer simples */}
      <footer className="border-t border-background-tertiary mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-text-muted">
            <p>&copy; 2024 Imóveis Premium. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}