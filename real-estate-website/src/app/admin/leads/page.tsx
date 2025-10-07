// src/app/admin/leads/page.tsx - VERSÃO COM HEADER FIXO

'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, Badge, Button, Input } from '@/components/ui/Button'
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MessageCircle,
  Eye,
  CheckCircle,
  Clock,
  X,
  Calendar,
  Building,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Download
} from 'lucide-react'
import Link from 'next/link'

interface Lead {
  id: string
  property_id: string | null
  full_name: string
  email: string
  phone: string | null
  max_budget: number | null
  desired_bedrooms: number | null
  desired_bathrooms: number | null
  message: string | null
  status: 'new' | 'contacted' | 'interested' | 'closed'
  created_at: string
  properties?: {
    id: string
    title: string
    price: number | null
    city: string | null
    neighborhood: string | null
  } | null
}

type LeadStatus = 'new' | 'contacted' | 'interested' | 'closed' | 'all'

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [statusFilter, setStatusFilter] = useState<LeadStatus>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [statusFilter])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/leads?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao carregar leads')
      }

      const data = await response.json()
      setLeads(data.leads || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Erro ao atualizar status')

      // Atualizar localmente
      setLeads(prev => 
        prev.map(lead => 
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      )

      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null)
      }

      alert('Status atualizado com sucesso!')
    } catch (err) {
      alert('Erro ao atualizar status')
    }
  }

  const deleteLead = async (leadId: string) => {
    if (!confirm('Tem certeza que deseja deletar este lead?')) return

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erro ao deletar lead')

      setLeads(prev => prev.filter(lead => lead.id !== leadId))
      if (selectedLead?.id === leadId) {
        setSelectedLead(null)
      }

      alert('Lead deletado com sucesso!')
    } catch (err) {
      alert('Erro ao deletar lead')
    }
  }

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="warning">Novo</Badge>
      case 'contacted':
        return <Badge variant="default">Contatado</Badge>
      case 'interested':
        return <Badge variant="success">Interessado</Badge>
      case 'closed':
        return <Badge variant="sold">Fechado</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Há poucos minutos'
    if (diffInHours < 24) return `Há ${diffInHours}h`
    if (diffInHours < 48) return 'Ontem'
    
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatPrice = (price: number | null) => {
    if (!price) return 'Não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(price)
  }

  const openWhatsApp = (lead: Lead) => {
    const message = `Olá ${lead.full_name}! Vi seu interesse no nosso imóvel e gostaria de conversar sobre as opções disponíveis. Podemos agendar uma visita?`
    const phone = lead.phone?.replace(/\D/g, '') || ''
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      lead.full_name.toLowerCase().includes(search) ||
      lead.email.toLowerCase().includes(search) ||
      lead.phone?.toLowerCase().includes(search) ||
      lead.properties?.title.toLowerCase().includes(search)
    )
  })

  // Estatísticas
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    interested: leads.filter(l => l.status === 'interested').length,
    closed: leads.filter(l => l.status === 'closed').length
  }

  const conversionRate = stats.total > 0 
    ? Math.round((stats.closed / stats.total) * 100) 
    : 0

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <Users size={32} className="text-accent-primary" />
              Gerenciar Leads
            </h1>
            <p className="text-text-secondary mt-1">
              Acompanhe e gerencie todos os interessados nos imóveis
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-accent-primary" />
              <span className="text-sm text-text-muted">Total</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-warning" />
              <span className="text-sm text-text-muted">Novos</span>
            </div>
            <p className="text-2xl font-bold text-warning">{stats.new}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle size={16} className="text-accent-primary" />
              <span className="text-sm text-text-muted">Contatados</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{stats.contacted}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck size={16} className="text-success" />
              <span className="text-sm text-text-muted">Interessados</span>
            </div>
            <p className="text-2xl font-bold text-success">{stats.interested}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-success" />
              <span className="text-sm text-text-muted">Fechados</span>
            </div>
            <p className="text-2xl font-bold text-success">{stats.closed}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-purple-400" />
              <span className="text-sm text-text-muted">Conversão</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">{conversionRate}%</p>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Busca e toggle filtros */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-3 text-text-muted" />
                <Input
                  placeholder="Buscar por nome, email, telefone ou imóvel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter size={16} />
                Filtros
              </Button>
            </div>

            {/* Status Filter */}
            {showFilters && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-background-tertiary">
                <Button
                  variant={statusFilter === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  Todos ({stats.total})
                </Button>
                <Button
                  variant={statusFilter === 'new' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('new')}
                >
                  Novos ({stats.new})
                </Button>
                <Button
                  variant={statusFilter === 'contacted' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('contacted')}
                >
                  Contatados ({stats.contacted})
                </Button>
                <Button
                  variant={statusFilter === 'interested' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('interested')}
                >
                  Interessados ({stats.interested})
                </Button>
                <Button
                  variant={statusFilter === 'closed' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('closed')}
                >
                  Fechados ({stats.closed})
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Lista de Leads */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-background-tertiary rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-background-tertiary rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-background-tertiary rounded w-2/3"></div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-danger mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Erro ao carregar leads
            </h3>
            <p className="text-text-secondary">{error}</p>
          </Card>
        ) : filteredLeads.length === 0 ? (
          <Card className="p-12 text-center">
            <Users size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Nenhum lead encontrado
            </h3>
            <p className="text-text-secondary">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Os leads aparecerão aqui quando houver interessados'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <Card 
                key={lead.id} 
                className="p-6 hover:bg-background-tertiary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedLead(lead)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate mb-1">
                      {lead.full_name}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {formatDate(lead.created_at)}
                    </p>
                  </div>
                  {getStatusBadge(lead.status)}
                </div>

                {/* Imóvel */}
                {lead.properties && (
                  <div className="mb-4 p-3 bg-background-tertiary rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Building size={14} className="text-accent-primary" />
                      <span className="text-xs font-semibold text-accent-primary">
                        IMÓVEL DE INTERESSE
                      </span>
                    </div>
                    <p className="text-sm text-text-primary font-medium truncate">
                      {lead.properties.title}
                    </p>
                    {lead.properties.city && (
                      <p className="text-xs text-text-secondary">
                        {lead.properties.neighborhood && `${lead.properties.neighborhood}, `}
                        {lead.properties.city}
                      </p>
                    )}
                  </div>
                )}

                {/* Contato */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Mail size={14} />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Phone size={14} />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedLead(lead)
                    }}
                  >
                    <Eye size={14} className="mr-1" />
                    Ver
                  </Button>
                  {lead.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openWhatsApp(lead)
                      }}
                      className="text-success"
                    >
                      <MessageCircle size={14} />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de Detalhes - COM HEADER FIXO */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header do Modal - FIXO */}
              <div className="flex-shrink-0 p-6 border-b border-background-tertiary bg-background-secondary">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-text-primary">
                    Detalhes do Lead
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLead(null)}
                  >
                    <X size={20} />
                  </Button>
                </div>
              </div>

              {/* Conteúdo Scrollável */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Informações do Lead */}
                <div className="space-y-6">
                  {/* Status e Data */}
                  <div className="flex items-center justify-between">
                    {getStatusBadge(selectedLead.status)}
                    <span className="text-sm text-text-muted">
                      {formatDate(selectedLead.created_at)}
                    </span>
                  </div>

                  {/* Dados Pessoais */}
                  <div>
                    <h3 className="font-semibold text-text-primary mb-3">
                      Dados Pessoais
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-text-muted">Nome</label>
                        <p className="text-text-primary font-medium">
                          {selectedLead.full_name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-text-muted">Email</label>
                        <p className="text-text-primary">{selectedLead.email}</p>
                      </div>
                      {selectedLead.phone && (
                        <div>
                          <label className="text-sm text-text-muted">Telefone</label>
                          <p className="text-text-primary">{selectedLead.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Imóvel de Interesse */}
                  {selectedLead.properties && (
                    <div>
                      <h3 className="font-semibold text-text-primary mb-3">
                        Imóvel de Interesse
                      </h3>
                      <Card className="p-4">
                        <h4 className="font-medium text-text-primary mb-2">
                          {selectedLead.properties.title}
                        </h4>
                        {selectedLead.properties.city && (
                          <p className="text-sm text-text-secondary mb-2">
                            {selectedLead.properties.neighborhood && 
                              `${selectedLead.properties.neighborhood}, `}
                            {selectedLead.properties.city}
                          </p>
                        )}
                        {selectedLead.properties.price && (
                          <p className="text-accent-primary font-semibold">
                            {formatPrice(selectedLead.properties.price)}
                          </p>
                        )}
                        <Link 
                          href={`/imoveis/${selectedLead.properties.id}`}
                          target="_blank"
                        >
                          <Button variant="outline" size="sm" className="mt-3">
                            Ver Imóvel
                          </Button>
                        </Link>
                      </Card>
                    </div>
                  )}

                  {/* Mensagem */}
                  {selectedLead.message && (
                    <div>
                      <h3 className="font-semibold text-text-primary mb-3">
                        Mensagem
                      </h3>
                      <Card className="p-4">
                        <p className="text-text-secondary whitespace-pre-line">
                          {selectedLead.message}
                        </p>
                      </Card>
                    </div>
                  )}

                  {/* Preferências */}
                  {(selectedLead.max_budget || selectedLead.desired_bedrooms || 
                    selectedLead.desired_bathrooms) && (
                    <div>
                      <h3 className="font-semibold text-text-primary mb-3">
                        Preferências
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedLead.max_budget && (
                          <div>
                            <label className="text-sm text-text-muted">
                              Orçamento Máx.
                            </label>
                            <p className="text-text-primary font-medium">
                              {formatPrice(selectedLead.max_budget)}
                            </p>
                          </div>
                        )}
                        {selectedLead.desired_bedrooms && (
                          <div>
                            <label className="text-sm text-text-muted">
                              Quartos
                            </label>
                            <p className="text-text-primary font-medium">
                              {selectedLead.desired_bedrooms}+
                            </p>
                          </div>
                        )}
                        {selectedLead.desired_bathrooms && (
                          <div>
                            <label className="text-sm text-text-muted">
                              Banheiros
                            </label>
                            <p className="text-text-primary font-medium">
                              {selectedLead.desired_bathrooms}+
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Atualizar Status */}
                  <div>
                    <h3 className="font-semibold text-text-primary mb-3">
                      Atualizar Status
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={selectedLead.status === 'new' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateLeadStatus(selectedLead.id, 'new')}
                      >
                        Novo
                      </Button>
                      <Button
                        variant={selectedLead.status === 'contacted' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateLeadStatus(selectedLead.id, 'contacted')}
                      >
                        Contatado
                      </Button>
                      <Button
                        variant={selectedLead.status === 'interested' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateLeadStatus(selectedLead.id, 'interested')}
                      >
                        Interessado
                      </Button>
                      <Button
                        variant={selectedLead.status === 'closed' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateLeadStatus(selectedLead.id, 'closed')}
                      >
                        Fechado
                      </Button>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-3 pt-4 border-t border-background-tertiary">
                    {selectedLead.phone && (
                      <Button
                        className="flex-1"
                        onClick={() => openWhatsApp(selectedLead)}
                      >
                        <MessageCircle size={16} className="mr-2" />
                        WhatsApp
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => window.open(`mailto:${selectedLead.email}`)}
                    >
                      <Mail size={16} className="mr-2" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => deleteLead(selectedLead.id)}
                      className="text-danger hover:bg-danger/10"
                    >
                      Deletar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}