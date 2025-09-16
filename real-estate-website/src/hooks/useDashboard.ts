import { useState, useEffect } from 'react'
import { Property, Lead } from '@/lib/supabase'

interface DashboardStats {
  totalProperties: number
  availableProperties: number
  soldProperties: number
  reservedProperties: number
  totalLeads: number
  newLeads: number
  contactedLeads: number
  averageDaysToSell: number
  totalValue: number
  soldValue: number
}

interface RecentActivity {
  id: string
  type: 'lead' | 'property' | 'sale'
  title: string
  description: string
  timestamp: string
  status?: string
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    reservedProperties: 0,
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    averageDaysToSell: 0,
    totalValue: 0,
    soldValue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar propriedades
      const propertiesResponse = await fetch('/api/properties')
      if (!propertiesResponse.ok) {
        throw new Error('Erro ao carregar propriedades')
      }
      const { properties } = await propertiesResponse.json()

      // Tentar buscar leads (sem falhar se der erro)
      let leads: Lead[] = []
      try {
        const leadsResponse = await fetch('/api/leads')
        if (leadsResponse.ok) {
          const leadsData = await leadsResponse.json()
          leads = leadsData.leads || []
        }
      } catch (leadsError) {
        console.warn('Erro ao carregar leads:', leadsError)
        // Continuar sem leads
      }

      // Calcular estatísticas das propriedades
      const totalProperties = properties.length
      const availableProperties = properties.filter((p: Property) => p.status === 'available').length
      const soldProperties = properties.filter((p: Property) => p.status === 'sold').length
      const reservedProperties = properties.filter((p: Property) => p.status === 'reserved').length

      // Calcular valor total e vendido
      const totalValue = properties
        .filter((p: Property) => p.status === 'available')
        .reduce((sum: number, p: Property) => sum + (p.price || 0), 0)
      
      const soldValue = properties
        .filter((p: Property) => p.status === 'sold')
        .reduce((sum: number, p: Property) => sum + (p.price || 0), 0)

      // Calcular tempo médio de venda
      const soldWithDays = properties.filter((p: Property) => 
        p.status === 'sold' && p.days_to_sell
      )
      const averageDaysToSell = soldWithDays.length > 0
        ? Math.round(
            soldWithDays.reduce((sum: number, p: Property) => sum + (p.days_to_sell || 0), 0) / soldWithDays.length
          )
        : 0

      // Calcular estatísticas dos leads
      const totalLeads = leads.length
      const newLeads = leads.filter((l: Lead) => l.status === 'new').length
      const contactedLeads = leads.filter((l: Lead) => l.status === 'contacted').length

      setStats({
        totalProperties,
        availableProperties,
        soldProperties,
        reservedProperties,
        totalLeads,
        newLeads,
        contactedLeads,
        averageDaysToSell,
        totalValue,
        soldValue
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, refetch: fetchStats }
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivity = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar propriedades
      const propertiesResponse = await fetch('/api/properties')
      if (!propertiesResponse.ok) {
        throw new Error('Erro ao carregar propriedades')
      }
      const { properties } = await propertiesResponse.json()

      // Tentar buscar leads
      let leads: Lead[] = []
      try {
        const leadsResponse = await fetch('/api/leads')
        if (leadsResponse.ok) {
          const leadsData = await leadsResponse.json()
          leads = leadsData.leads || []
        }
      } catch (leadsError) {
        console.warn('Erro ao carregar leads para atividades:', leadsError)
      }

      const recentActivities: RecentActivity[] = []

      // Adicionar leads recentes
      leads
        .slice(0, 5)
        .forEach((lead: Lead) => {
          recentActivities.push({
            id: lead.id,
            type: 'lead',
            title: `Novo lead: ${lead.full_name}`,
            description: `Interesse demonstrado via formulário`,
            timestamp: lead.created_at,
            status: lead.status
          })
        })

      // Adicionar propriedades recentes
      properties
        .slice(0, 5)
        .forEach((property: Property) => {
          if (property.status === 'sold') {
            recentActivities.push({
              id: property.id,
              type: 'sale',
              title: `Venda concluída: ${property.title}`,
              description: `Imóvel vendido em ${property.days_to_sell || 'N/A'} dias`,
              timestamp: property.sold_date || property.updated_at,
              status: 'sold'
            })
          } else {
            recentActivities.push({
              id: property.id,
              type: 'property',
              title: `Novo imóvel: ${property.title}`,
              description: `${property.city} - ${property.neighborhood || 'Localização não informada'}`,
              timestamp: property.created_at,
              status: property.status
            })
          }
        })

      // Ordenar por data mais recente
      recentActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      setActivities(recentActivities.slice(0, 10))

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivity()
  }, [])

  return { activities, loading, error, refetch: fetchActivity }
}