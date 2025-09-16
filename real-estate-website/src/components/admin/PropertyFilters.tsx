import { useState } from 'react'
import { Input, Button, Card } from '@/components/ui/Button'
import { Search, Filter, X, Plus } from 'lucide-react'
import Link from 'next/link'

interface AdminPropertyFiltersProps {
  onFiltersChange: (filters: any) => void
  loading?: boolean
  totalProperties?: number
}

export function AdminPropertyFilters({ 
  onFiltersChange, 
  loading = false, 
  totalProperties = 0 
}: AdminPropertyFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Remover campos vazios antes de enviar
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '')
    )
    
    onFiltersChange(cleanFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      status: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: ''
    }
    setFilters(emptyFilters)
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Gerenciar Imóveis ({totalProperties})
          </h2>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-text-muted hover:text-text-primary"
            >
              <X size={16} className="mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>
        
        <Link href="/admin/imoveis/novo">
          <Button className="gap-2">
            <Plus size={16} />
            Novo Imóvel
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Busca */}
        <div className="lg:col-span-2 relative">
          <Search size={16} className="absolute left-3 top-3 text-text-muted" />
          <Input
            placeholder="Buscar por título, cidade, bairro..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
        >
          <option value="">Todos os Status</option>
          <option value="available">Disponíveis</option>
          <option value="sold">Vendidos</option>
          <option value="reserved">Reservados</option>
        </select>

        {/* Cidade */}
        <Input
          placeholder="Cidade"
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
        />

        {/* Preço mínimo */}
        <Input
          type="number"
          placeholder="Preço mín."
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
        />

        {/* Quartos */}
        <select
          value={filters.bedrooms}
          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
          className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
        >
          <option value="">Quartos</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-4 mt-4 border-t border-background-tertiary">
          <div className="flex items-center gap-2 text-text-muted">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent-primary border-t-transparent"></div>
            <span className="text-sm">Carregando imóveis...</span>
          </div>
        </div>
      )}
    </Card>
  )
}