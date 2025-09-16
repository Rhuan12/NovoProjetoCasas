import { Property } from '@/lib/supabase'
import { PropertyCard } from '@/components/PropertyCard'
import { Home, AlertCircle } from 'lucide-react'

interface PropertyGridProps {
  properties: Property[]
  loading: boolean
  error: string | null
}

export function PropertyGrid({ properties, loading, error }: PropertyGridProps) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-background-secondary rounded-xl overflow-hidden">
              <div className="h-64 bg-background-tertiary"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-background-tertiary rounded w-3/4"></div>
                <div className="h-3 bg-background-tertiary rounded w-1/2"></div>
                <div className="h-6 bg-background-tertiary rounded w-1/3"></div>
                <div className="flex gap-2">
                  <div className="h-3 bg-background-tertiary rounded w-16"></div>
                  <div className="h-3 bg-background-tertiary rounded w-16"></div>
                </div>
                <div className="h-10 bg-background-tertiary rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle size={48} className="text-danger mb-4" />
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Erro ao carregar imóveis
        </h3>
        <p className="text-text-secondary mb-4 max-w-md">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-accent-primary text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  // Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Home size={48} className="text-text-muted mb-4" />
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Nenhum imóvel encontrado
        </h3>
        <p className="text-text-secondary mb-4 max-w-md">
          Não encontramos imóveis que correspondam aos seus filtros. 
          Tente ajustar os critérios de busca.
        </p>
      </div>
    )
  }

  // Success state with properties
  return (
    <div className="space-y-6">
      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary">
          <span className="font-semibold text-text-primary">{properties.length}</span> 
          {properties.length === 1 ? ' imóvel encontrado' : ' imóveis encontrados'}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span>Ordenado por:</span>
          <span className="text-text-primary">Mais recentes</span>
        </div>
      </div>

      {/* Grid de imóveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property}
          />
        ))}
      </div>

      {/* Separação entre disponíveis e vendidos */}
      {properties.some(p => p.status === 'sold') && properties.some(p => p.status !== 'sold') && (
        <div className="border-t border-background-tertiary pt-8 mt-8">
          <h3 className="text-lg font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-sold rounded-full"></div>
            Imóveis Vendidos
          </h3>
          <p className="text-sm text-text-muted mb-6">
            Veja nosso histórico de vendas e o tempo médio para vendas.
          </p>
        </div>
      )}
    </div>
  )
}