'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button } from '@/components/ui/Button'
import { Search, MapPin, BedDouble, DollarSign, Filter } from 'lucide-react'

interface QuickSearchProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function QuickSearch({ className = '', size = 'lg' }: QuickSearchProps) {
  const router = useRouter()
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    maxPrice: '',
    bedrooms: ''
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.city) params.append('city', filters.city)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms)

    router.push(`/imoveis?${params.toString()}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const inputClasses = {
    sm: 'py-2 px-3',
    md: 'py-3 px-4', 
    lg: 'py-4 px-4'
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card className="p-3">
        {/* Busca Principal */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={size === 'lg' ? 20 : 16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Busque por cidade, bairro, características..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              onKeyPress={handleKeyPress}
              className={`w-full pl-12 pr-4 bg-transparent border-none text-text-primary placeholder-text-muted focus:outline-none ${sizeClasses[size]} ${inputClasses[size]}`}
            />
          </div>
          
          <Button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            size={size === 'lg' ? 'md' : 'sm'}
            className="gap-2"
          >
            <Filter size={16} />
            {showAdvanced ? 'Menos' : 'Filtros'}
          </Button>
          
          <Button 
            onClick={handleSearch}
            size={size === 'lg' ? 'md' : 'sm'}
            className="px-6"
          >
            Buscar
          </Button>
        </div>

        {/* Filtros Avançados */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-background-tertiary">
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cidade específica..."
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>

            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <select
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="">Preço máximo</option>
                <option value="300000">Até R$ 300.000</option>
                <option value="500000">Até R$ 500.000</option>
                <option value="800000">Até R$ 800.000</option>
                <option value="1000000">Até R$ 1.000.000</option>
                <option value="1500000">Até R$ 1.500.000</option>
                <option value="2000000">Até R$ 2.000.000</option>
                <option value="3000000">Até R$ 3.000.000</option>
              </select>
            </div>

            <div className="relative">
              <BedDouble size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="">Quartos</option>
                <option value="1">1+ quarto</option>
                <option value="2">2+ quartos</option>
                <option value="3">3+ quartos</option>
                <option value="4">4+ quartos</option>
                <option value="5">5+ quartos</option>
              </select>
            </div>
          </div>
        )}

        {/* Sugestões Rápidas */}
        {!showAdvanced && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-background-tertiary">
            <span className="text-text-muted text-sm">Buscas populares:</span>
            {[
              'Copacabana', 
              'Ipanema', 
              '2 quartos', 
              'Até R$ 800k', 
              'Apartamento'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setFilters(prev => ({ ...prev, search: suggestion }))
                  setTimeout(handleSearch, 100)
                }}
                className="text-accent-primary hover:text-accent-hover text-sm hover:underline transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}