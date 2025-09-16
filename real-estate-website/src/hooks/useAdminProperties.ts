import { useState, useEffect } from 'react'
import { Property } from '@/lib/supabase'

interface AdminPropertiesFilters {
  status?: 'available' | 'sold' | 'reserved' | ''
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  search?: string
}

export function useAdminProperties(filters: AdminPropertiesFilters = {}) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      
      if (filters.status) searchParams.append('status', filters.status)
      if (filters.city) searchParams.append('city', filters.city)
      if (filters.minPrice) searchParams.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) searchParams.append('maxPrice', filters.maxPrice.toString())
      if (filters.bedrooms) searchParams.append('bedrooms', filters.bedrooms.toString())

      const response = await fetch(`/api/properties?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar imóveis')
      }

      const data = await response.json()
      let allProperties = data.properties || []

      // Filtro de busca (cliente-side para simplicidade)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        allProperties = allProperties.filter((property: Property) =>
          property.title.toLowerCase().includes(searchTerm) ||
          property.city?.toLowerCase().includes(searchTerm) ||
          property.neighborhood?.toLowerCase().includes(searchTerm) ||
          property.description?.toLowerCase().includes(searchTerm)
        )
      }

      setProperties(allProperties)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [
    filters.status,
    filters.city,
    filters.minPrice,
    filters.maxPrice,
    filters.bedrooms,
    filters.search
  ])

  const updatePropertyStatus = async (id: string, status: 'available' | 'sold' | 'reserved') => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar status')
      }

      // Atualizar localmente
      setProperties(prev => 
        prev.map(prop => 
          prop.id === id ? { ...prop, status } : prop
        )
      )

      return true
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      throw err
    }
  }

  const deleteProperty = async (id: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar imóvel')
      }

      // Remover localmente
      setProperties(prev => prev.filter(prop => prop.id !== id))

      return true
    } catch (err) {
      console.error('Erro ao deletar imóvel:', err)
      throw err
    }
  }

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties,
    updatePropertyStatus,
    deleteProperty
  }
}