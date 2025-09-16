import { Card } from '@/components/ui/Button'
import { 
  Building, 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Eye,
  CheckCircle,
  AlertCircle,
  LucideIcon
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'blue'
}: StatCardProps) {
  const colorClasses = {
    blue: 'text-accent-primary bg-accent-primary/10',
    green: 'text-success bg-success/10',
    yellow: 'text-warning bg-warning/10',
    red: 'text-danger bg-danger/10',
    purple: 'text-purple-400 bg-purple-400/10'
  }

  const trendClasses = {
    up: 'text-success',
    down: 'text-danger',
    neutral: 'text-text-muted'
  }

  return (
    <Card className="p-6 hover:bg-background-tertiary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-text-muted text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary mb-1">{value}</p>
          {subtitle && (
            <p className="text-text-secondary text-sm">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 ${trendClasses[trend]}`}>
              <TrendingUp size={14} className={trend === 'down' ? 'rotate-180' : ''} />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  )
}

interface StatsGridProps {
  stats: {
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
  loading?: boolean
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-background-tertiary rounded w-24 mb-2"></div>
                <div className="h-8 bg-background-tertiary rounded w-16 mb-1"></div>
                <div className="h-3 bg-background-tertiary rounded w-20"></div>
              </div>
              <div className="w-12 h-12 bg-background-tertiary rounded-lg"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total de Imóveis"
        value={stats.totalProperties}
        subtitle={`${stats.availableProperties} disponíveis`}
        icon={Building}
        color="blue"
      />
      
      <StatCard
        title="Imóveis Vendidos"
        value={stats.soldProperties}
        subtitle={`${stats.reservedProperties} reservados`}
        icon={CheckCircle}
        color="green"
      />
      
      <StatCard
        title="Leads Totais"
        value={stats.totalLeads}
        subtitle={`${stats.newLeads} novos`}
        icon={Users}
        color="purple"
      />
      
      <StatCard
        title="Tempo Médio de Venda"
        value={stats.averageDaysToSell}
        subtitle="dias"
        icon={Clock}
        color="yellow"
      />
      
      <StatCard
        title="Valor em Carteira"
        value={formatCurrency(stats.totalValue)}
        subtitle="Imóveis disponíveis"
        icon={Eye}
        color="blue"
      />
      
      <StatCard
        title="Valor Vendido"
        value={formatCurrency(stats.soldValue)}
        subtitle="Total realizado"
        icon={DollarSign}
        color="green"
      />
      
      <StatCard
        title="Leads Novos"
        value={stats.newLeads}
        subtitle={`${stats.contactedLeads} contatados`}
        icon={AlertCircle}
        color="yellow"
      />
      
      <StatCard
        title="Taxa de Conversão"
        value={`${stats.totalProperties > 0 ? Math.round((stats.soldProperties / stats.totalProperties) * 100) : 0}%`}
        subtitle="Imóveis vendidos"
        icon={TrendingUp}
        color="green"
      />
    </div>
  )
}