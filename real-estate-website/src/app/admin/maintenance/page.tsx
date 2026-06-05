'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, Badge, Button } from '@/components/ui/Button'
import {
  Wrench, Search, Filter, Phone, MapPin,
  AlertTriangle, Clock, CheckCircle, X,
  Zap, Droplets, Wind, Settings, Image as ImgIcon,
} from 'lucide-react'

interface MaintenanceRequest {
  id: string
  phone_number: string
  property_address: string
  maintenance_category: 'electrical' | 'plumbing' | 'hvac' | 'general'
  priority_level: 'emergency' | 'high' | 'medium' | 'slow'
  description: string
  preferred_visit_time: 'morning' | 'afternoon' | 'evening' | 'anytime'
  photos: string[]
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
}

type StatusFilter = 'all' | 'pending' | 'in_progress' | 'completed'
type CategoryFilter = 'all' | 'electrical' | 'plumbing' | 'hvac' | 'general'
type PriorityFilter = 'all' | 'emergency' | 'high' | 'medium' | 'slow'

const CATEGORY_LABELS: Record<string, string> = {
  electrical: 'Electrical',
  plumbing: 'Plumbing',
  hvac: 'Mechanical / HVAC',
  general: 'General Maintenance',
}

const CATEGORY_ICONS = {
  electrical: Zap,
  plumbing: Droplets,
  hvac: Wind,
  general: Settings,
}

const PRIORITY_LABELS: Record<string, string> = {
  emergency: 'Emergency',
  high: 'High',
  medium: 'Medium',
  slow: 'Slow',
}

const VISIT_TIME_LABELS: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  anytime: 'Anytime',
}

function PriorityBadge({ priority }: { priority: MaintenanceRequest['priority_level'] }) {
  if (priority === 'emergency') return <Badge variant="danger" size="sm">Emergency</Badge>
  if (priority === 'high') return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-400/20 text-orange-400">High</span>
  if (priority === 'medium') return <Badge variant="warning" size="sm">Medium</Badge>
  return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">Slow</span>
}

function StatusBadge({ status }: { status: MaintenanceRequest['status'] }) {
  if (status === 'pending') return <Badge variant="warning" size="sm">Pendente</Badge>
  if (status === 'in_progress') return <Badge variant="default" size="sm">Em Andamento</Badge>
  return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">Concluído</span>
}

export default function AdminMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<MaintenanceRequest | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter, priorityFilter])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)
      const res = await fetch(`/api/maintenance?${params}`)
      if (!res.ok) throw new Error('Erro ao carregar solicitações')
      const data = await res.json()
      setRequests(data.requests || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: MaintenanceRequest['status']) => {
    try {
      const res = await fetch(`/api/maintenance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null)
    } catch {
      alert('Erro ao atualizar status')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffH = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffH < 1) return 'Há poucos minutos'
    if (diffH < 24) return `Há ${diffH}h`
    if (diffH < 48) return 'Ontem'
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const filteredRequests = requests.filter(r => {
    if (!searchTerm) return true
    const s = searchTerm.toLowerCase()
    return (
      r.phone_number.toLowerCase().includes(s) ||
      r.property_address.toLowerCase().includes(s) ||
      r.description.toLowerCase().includes(s)
    )
  })

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    emergency: requests.filter(r => r.priority_level === 'emergency' && r.status !== 'completed').length,
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <Wrench size={32} className="text-accent-primary" />
              Solicitações de Manutenção
            </h1>
            <p className="text-text-secondary mt-1">
              Gerencie as solicitações do portal do residente
            </p>
          </div>
          <a
            href="/resident-portal"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-accent-primary text-accent-primary rounded-lg text-sm font-medium hover:bg-accent-primary/10 transition-colors"
          >
            Ver Portal Público
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, color: 'text-text-primary', icon: Wrench },
            { label: 'Pendentes', value: stats.pending, color: 'text-warning', icon: Clock },
            { label: 'Em Andamento', value: stats.inProgress, color: 'text-accent-primary', icon: Settings },
            { label: 'Concluídos', value: stats.completed, color: 'text-success', icon: CheckCircle },
            { label: 'Emergências', value: stats.emergency, color: 'text-danger', icon: AlertTriangle },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={stat.color} />
                  <span className="text-sm text-text-muted">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <Card className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-3 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar por telefone, endereço ou descrição..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter size={16} />
              Filtros
            </Button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-background-tertiary space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-text-muted w-20 flex-shrink-0">Status:</span>
                {(['all', 'pending', 'in_progress', 'completed'] as StatusFilter[]).map(s => (
                  <Button key={s} variant={statusFilter === s ? 'primary' : 'outline'} size="sm" onClick={() => setStatusFilter(s)}>
                    {s === 'all' ? 'Todos' : s === 'pending' ? 'Pendente' : s === 'in_progress' ? 'Em Andamento' : 'Concluído'}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-text-muted w-20 flex-shrink-0">Categoria:</span>
                {(['all', 'electrical', 'plumbing', 'hvac', 'general'] as CategoryFilter[]).map(c => (
                  <Button key={c} variant={categoryFilter === c ? 'primary' : 'outline'} size="sm" onClick={() => setCategoryFilter(c)}>
                    {c === 'all' ? 'Todas' : CATEGORY_LABELS[c]}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-text-muted w-20 flex-shrink-0">Prioridade:</span>
                {(['all', 'emergency', 'high', 'medium', 'slow'] as PriorityFilter[]).map(p => (
                  <Button key={p} variant={priorityFilter === p ? 'primary' : 'outline'} size="sm" onClick={() => setPriorityFilter(p)}>
                    {p === 'all' ? 'Todas' : PRIORITY_LABELS[p]}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-background-tertiary rounded w-3/4 mb-4" />
                <div className="h-3 bg-background-tertiary rounded w-1/2 mb-2" />
                <div className="h-3 bg-background-tertiary rounded w-2/3" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-12 text-center">
            <AlertTriangle size={48} className="mx-auto text-danger mb-4" />
            <p className="text-text-secondary">{error}</p>
            <Button variant="outline" onClick={fetchRequests} className="mt-4">Tentar novamente</Button>
          </Card>
        ) : filteredRequests.length === 0 ? (
          <Card className="p-12 text-center">
            <Wrench size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-text-secondary">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                ? 'Tente ajustar os filtros'
                : 'As solicitações aparecerão aqui quando forem enviadas pelo portal'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map(req => {
              const CategoryIcon = CATEGORY_ICONS[req.maintenance_category]
              return (
                <Card
                  key={req.id}
                  className="p-5 cursor-pointer hover:bg-background-tertiary/50 transition-colors"
                  onClick={() => setSelected(req)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CategoryIcon size={16} className="text-accent-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary leading-tight">
                          {CATEGORY_LABELS[req.maintenance_category]}
                        </p>
                        <p className="text-xs text-text-muted">{formatDate(req.created_at)}</p>
                      </div>
                    </div>
                    <PriorityBadge priority={req.priority_level} />
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Phone size={13} className="flex-shrink-0" />
                      <span>{req.phone_number}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-text-secondary">
                      <MapPin size={13} className="flex-shrink-0 mt-0.5" />
                      <span className="truncate">{req.property_address}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted line-clamp-2 mb-4">
                    {req.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <StatusBadge status={req.status} />
                    {req.photos.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <ImgIcon size={12} />
                        {req.photos.length}
                      </span>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="flex-shrink-0 p-6 border-b border-background-tertiary flex items-center justify-between bg-background-secondary">
                <h2 className="text-xl font-bold text-text-primary">Detalhes da Solicitação</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                  <X size={20} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={selected.status} />
                  <PriorityBadge priority={selected.priority_level} />
                  <span className="text-xs text-text-muted ml-auto">{formatDate(selected.created_at)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Telefone</p>
                    <a
                      href={`tel:${selected.phone_number}`}
                      className="text-text-primary font-medium hover:text-accent-primary transition-colors flex items-center gap-1.5"
                    >
                      <Phone size={13} />
                      {selected.phone_number}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Horário Preferido</p>
                    <p className="text-text-primary font-medium">
                      {VISIT_TIME_LABELS[selected.preferred_visit_time]}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-text-muted mb-1">Endereço</p>
                  <p className="text-text-primary flex items-start gap-1.5">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0 text-text-muted" />
                    {selected.property_address}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-muted mb-1">Categoria</p>
                  <p className="text-text-primary">{CATEGORY_LABELS[selected.maintenance_category]}</p>
                </div>

                <div>
                  <p className="text-xs text-text-muted mb-1">Descrição</p>
                  <p className="text-text-secondary whitespace-pre-line leading-relaxed text-sm">
                    {selected.description}
                  </p>
                </div>

                {selected.photos.length > 0 && (
                  <div>
                    <p className="text-xs text-text-muted mb-3">
                      Fotos ({selected.photos.length})
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {selected.photos.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setLightboxPhoto(url)}
                          className="aspect-square rounded-lg overflow-hidden bg-background-tertiary hover:ring-2 hover:ring-accent-primary transition-all"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-text-muted mb-3">Atualizar Status</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['pending', 'in_progress', 'completed'] as MaintenanceRequest['status'][]).map(s => (
                      <Button
                        key={s}
                        variant={selected.status === s ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateStatus(selected.id, s)}
                      >
                        {s === 'pending' ? 'Pendente' : s === 'in_progress' ? 'Em Andamento' : 'Concluído'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-background-tertiary">
                  <a href={`tel:${selected.phone_number}`} className="flex-1">
                    <Button className="w-full gap-2">
                      <Phone size={15} />
                      Ligar
                    </Button>
                  </a>
                  <Button variant="outline" onClick={() => setSelected(null)}>Fechar</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Lightbox */}
        {lightboxPhoto && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setLightboxPhoto(null)}
            >
              <X size={28} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxPhoto}
              alt="Foto ampliada"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
