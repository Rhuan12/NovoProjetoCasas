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
    status: 'available' // Default: show only available properties
  })

  const { properties, loading, error } = useProperties(filters)

  // Quick statistics
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
                Our Properties
              </h1>
              <p className="text-text-secondary">
                Find your perfect home with our exclusive selection of properties
              </p>
            </div>
            
            {/* Quick statistics */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{availableCount}</div>
                <div className="text-sm text-text-muted">Available</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{soldCount}</div>
                <div className="text-sm text-text-muted">Sold</div>
              </div>
              
              {averageDaysToSell > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{averageDaysToSell}</div>
                  <div className="text-sm text-text-muted">Avg. Days</div>
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
            {availableCount} Available
          </Badge>
          <Badge 
            variant={filters.status === 'sold' ? 'sold' : 'default'}
          >
            {soldCount} Sold
          </Badge>
          <Badge 
            variant={filters.status === 'reserved' ? 'warning' : 'default'}
          >
            {properties.filter(p => p.status === 'reserved').length} Reserved
          </Badge>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <PropertyFilters 
            onFiltersChange={setFilters}
            loading={loading}
          />
        </div>

        {/* Property Grid */}
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
                Didn't find what you're looking for?
              </h3>
              <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                Our specialized team can help you find the ideal property. 
                Get in touch and let us know your preferences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-accent-primary text-white px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors font-medium">
                  Talk to a Specialist
                </button>
                <button className="border border-background-tertiary text-text-primary px-6 py-3 rounded-lg hover:bg-background-secondary transition-colors font-medium">
                  Join Waiting List
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Simple footer */}
      <footer className="border-t border-background-tertiary mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-text-muted">
            <p>&copy; 2025 McSilva & Wiggit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}