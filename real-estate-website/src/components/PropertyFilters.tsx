import { useState } from 'react'
import { Input, Button, Card } from '@/components/ui/Button'
import { Search, Filter, X } from 'lucide-react'

interface PropertyFiltersProps {
  onFiltersChange: (filters: any) => void
  loading?: boolean
}

export function PropertyFilters({ onFiltersChange, loading = false }: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    city: '',
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    maxPrice: '',
    status: 'available' as 'available' | 'sold' | 'reserved' | ''
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Remove empty fields before sending
    const cleanFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== '')
    )
    
    onFiltersChange(cleanFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      city: '',
      neighborhood: '',
      bedrooms: '',
      bathrooms: '',
      maxPrice: '',
      status: 'available' as const
    }
    setFilters(emptyFilters)
    onFiltersChange({ status: 'available' })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'available'
  )

  return (
    <Card className="p-6">
      {/* Filter header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-accent-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
          {hasActiveFilters && (
            <span className="text-sm text-accent-primary bg-accent-primary/10 px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-text-muted hover:text-text-primary"
            >
              <X size={16} className="mr-1" />
              Clear
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {/* Main filters (always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-text-muted" />
          <Input
            placeholder="City..."
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Input
          placeholder="Neighborhood..."
          value={filters.neighborhood}
          onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
        />

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
        >
          <option value="available">Available</option>
          <option value="">All Status</option>
          <option value="sold">Sold</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      {/* Advanced filters (mobile: collapsible) */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <div className="border-t border-background-tertiary pt-4">
          <h4 className="text-sm font-medium text-text-secondary mb-3">Features</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Bedrooms (minimum)</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1">Bathrooms (minimum)</label>
              <select
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1">Maximum price</label>
              <select
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="">No limit</option>
                <option value="300000">Up to $300,000</option>
                <option value="500000">Up to $500,000</option>
                <option value="800000">Up to $800,000</option>
                <option value="1000000">Up to $1,000,000</option>
                <option value="1500000">Up to $1,500,000</option>
                <option value="2000000">Up to $2,000,000</option>
                <option value="3000000">Up to $3,000,000</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-4 mt-4 border-t border-background-tertiary">
          <div className="flex items-center gap-2 text-text-muted">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent-primary border-t-transparent"></div>
            <span className="text-sm">Loading properties...</span>
          </div>
        </div>
      )}
    </Card>
  )
}