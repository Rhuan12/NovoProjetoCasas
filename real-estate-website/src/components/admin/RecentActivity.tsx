import { Card, Badge } from '@/components/ui/Button'
import { Clock, User, Building, DollarSign } from 'lucide-react'

interface RecentActivity {
  id: string
  type: 'lead' | 'property' | 'sale'
  title: string
  description: string
  timestamp: string
  status?: string
}

interface RecentActivityProps {
  activities: RecentActivity[]
  loading?: boolean
}

export function RecentActivity({ activities, loading }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead':
        return User
      case 'property':
        return Building
      case 'sale':
        return DollarSign
      default:
        return Clock
    }
  }

  const getActivityColor = (type: string, status?: string) => {
    switch (type) {
      case 'lead':
        return status === 'new' ? 'yellow' : 'blue'
      case 'property':
        return 'blue'
      case 'sale':
        return 'green'
      default:
        return 'default'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Agora mesmo'
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d atrás`
    
    return past.toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Atividades Recentes</h3>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 bg-background-tertiary rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-background-tertiary rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-background-tertiary rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-background-tertiary rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Atividades Recentes</h3>
        <Badge variant="default" size="sm">
          {activities.length} atividades
        </Badge>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock size={48} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-secondary">Nenhuma atividade recente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            const color = getActivityColor(activity.type, activity.status)
            
            return (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-background-tertiary/50 transition-colors">
                <div className={`
                  p-2 rounded-lg flex-shrink-0
                  ${color === 'yellow' ? 'bg-warning/10 text-warning' : ''}
                  ${color === 'blue' ? 'bg-accent-primary/10 text-accent-primary' : ''}
                  ${color === 'green' ? 'bg-success/10 text-success' : ''}
                  ${color === 'default' ? 'bg-background-tertiary text-text-muted' : ''}
                `}>
                  <Icon size={20} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium mb-1 truncate">
                    {activity.title}
                  </p>
                  <p className="text-text-secondary text-sm mb-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted text-xs">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                    {activity.status && (
                      <Badge 
                        variant={
                          activity.status === 'new' ? 'warning' :
                          activity.status === 'sold' ? 'success' :
                          activity.status === 'available' ? 'success' :
                          'default'
                        }
                        size="sm"
                      >
                        {activity.status === 'new' ? 'Novo' :
                         activity.status === 'sold' ? 'Vendido' :
                         activity.status === 'available' ? 'Disponível' :
                         activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}