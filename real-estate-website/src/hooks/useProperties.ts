import { useState, useEffect } from 'react'
import { Property } from '@/lib/supabase'

interface UsePropertiesOptions {
  status?: 'available' | 'sold' | 'reserved'
  bedrooms?: number
  bathrooms?: number
  maxPrice?: number
  city?: string
  neighborhood?: string
}

export function useProperties(filters: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      
      if (filters.status) searchParams.append('status', filters.status)
      if (filters.bedrooms) searchParams.append('bedrooms', filters.bedrooms.toString())
      if (filters.bathrooms) searchParams.append('bathrooms', filters.bathrooms.toString())
      if (filters.maxPrice) searchParams.append('maxPrice', filters.maxPrice.toString())
      if (filters.city) searchParams.append('city', filters.city)
      if (filters.neighborhood) searchParams.append('neighborhood', filters.neighborhood)

      const response = await fetch(`/api/properties?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar imóveis')
      }

      const data = await response.json()
      setProperties(data.properties || [])
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
    filters.bedrooms,
    filters.bathrooms,
    filters.maxPrice,
    filters.city,
    filters.neighborhood
  ])

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties
  }
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProperty = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/properties/${id}`)
        
        if (!response.ok) {
          throw new Error('Imóvel não encontrado')
        }

        const data = await response.json()
        setProperty(data.property)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  return { property, loading, error }
}

// Hook para criar/atualizar imóveis
export function usePropertyMutations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProperty = async (propertyData: Partial<Property>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar imóvel')
      }

      const data = await response.json()
      return data.property
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProperty = async (id: string, propertyData: Partial<Property>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar imóvel')
      }

      const data = await response.json()
      return data.property
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProperty = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar imóvel')
      }

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createProperty,
    updateProperty,
    deleteProperty,
    loading,
    error
  }
}