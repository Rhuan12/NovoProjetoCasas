'use client'

import { AdminLayout } from '@/components/AdminLayout'
import { StatsGrid } from '@/components/admin/StatsCards'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { useDashboardStats, useRecentActivity } from '@/hooks/useDashboard'
import { Card, Button } from '@/components/ui/Button'
import { Plus, TrendingUp, Users, Building, Camera, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats()
  const { activities, loading: activitiesLoading, error: activitiesError } = useRecentActivity()

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
            <p className="text-text-secondary mt-1">
              Visão geral do seu negócio imobiliário
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/admin/imoveis/novo">
              <Button className="gap-2">
                <Plus size={16} />
                Novo Imóvel
              </Button>
            </Link>
            
            <Link href="/admin/fotos">
              <Button variant="outline" className="gap-2">
                <Camera size={16} />
                Upload Fotos
              </Button>
            </Link>
          </div>
        </div>

        {/* Error States */}
        {(statsError || activitiesError) && (
          <Card className="p-6 border-danger/20 bg-danger/5">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-danger" />
              <div>
                <h3 className="font-semibold text-text-primary">Erro ao carregar dados</h3>
                <p className="text-text-secondary text-sm">
                  {statsError || activitiesError}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-6">Estatísticas Gerais</h2>
          <StatsGrid stats={stats} loading={statsLoading} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity activities={activities} loading={activitiesLoading} />
          </div>

          {/* Quick Actions & Insights */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <Link href="/admin/imoveis/novo" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Plus size={16} />
                    Adicionar Imóvel
                  </Button>
                </Link>
                
                <Link href="/admin/leads" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Users size={16} />
                    Ver Leads ({stats.newLeads} novos)
                  </Button>
                </Link>
                
                <Link href="/admin/fotos" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Camera size={16} />
                    Gerenciar Fotos
                  </Button>
                </Link>
                
                <Link href="/admin/imoveis" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <Building size={16} />
                    Todos os Imóveis
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Performance Insights */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Insights</h3>
              <div className="space-y-4">
                {/* Tempo médio de venda */}
                <div className="p-4 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-success" />
                    <span className="text-sm font-medium text-success">Tempo de Venda</span>
                  </div>
                  <p className="text-text-primary font-semibold">
                    {stats.averageDaysToSell} dias em média
                  </p>
                  <p className="text-text-secondary text-sm">
                    {stats.averageDaysToSell < 30 ? 'Excelente!' : 
                     stats.averageDaysToSell < 60 ? 'Bom ritmo' : 
                     'Pode melhorar'}
                  </p>
                </div>

                {/* Taxa de conversão */}
                <div className="p-4 bg-accent-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building size={16} className="text-accent-primary" />
                    <span className="text-sm font-medium text-accent-primary">Conversão</span>
                  </div>
                  <p className="text-text-primary font-semibold">
                    {stats.totalProperties > 0 ? 
                      Math.round((stats.soldProperties / stats.totalProperties) * 100) : 0}% vendidos
                  </p>
                  <p className="text-text-secondary text-sm">
                    {stats.soldProperties} de {stats.totalProperties} imóveis
                  </p>
                </div>

                {/* Leads pendentes */}
                {stats.newLeads > 0 && (
                  <div className="p-4 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-warning" />
                      <span className="text-sm font-medium text-warning">Atenção</span>
                    </div>
                    <p className="text-text-primary font-semibold">
                      {stats.newLeads} leads novos
                    </p>
                    <p className="text-text-secondary text-sm">
                      Aguardando primeiro contato
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Properties Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Resumo dos Imóveis</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Disponíveis</span>
                  <span className="font-semibold text-success">{stats.availableProperties}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Vendidos</span>
                  <span className="font-semibold text-text-primary">{stats.soldProperties}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Reservados</span>
                  <span className="font-semibold text-warning">{stats.reservedProperties}</span>
                </div>
                
                <hr className="border-background-tertiary" />
                
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Total</span>
                  <span className="font-bold text-text-primary">{stats.totalProperties}</span>
                </div>
              </div>
              
              <Link href="/admin/imoveis">
                <Button variant="outline" className="w-full mt-4">
                  Ver Todos os Imóveis
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Bottom Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 text-center hover:bg-background-tertiary/50 transition-colors">
            <Building size={32} className="mx-auto text-accent-primary mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Gerenciar Imóveis</h3>
            <p className="text-text-secondary text-sm mb-4">
              Adicione, edite ou remova imóveis do seu portfólio
            </p>
            <Link href="/admin/imoveis">
              <Button variant="outline" className="w-full">
                Acessar
              </Button>
            </Link>
          </Card>

          <Card className="p-6 text-center hover:bg-background-tertiary/50 transition-colors">
            <Users size={32} className="mx-auto text-success mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Gerenciar Leads</h3>
            <p className="text-text-secondary text-sm mb-4">
              Acompanhe interessados e oportunidades de venda
            </p>
            <Link href="/admin/leads">
              <Button variant="outline" className="w-full">
                Ver Leads {stats.newLeads > 0 && `(${stats.newLeads})`}
              </Button>
            </Link>
          </Card>

          <Card className="p-6 text-center hover:bg-background-tertiary/50 transition-colors">
            <Camera size={32} className="mx-auto text-warning mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">Sistema de Fotos</h3>
            <p className="text-text-secondary text-sm mb-4">
              Interface especializada para upload de imagens
            </p>
            <Link href="/admin/fotos">
              <Button variant="outline" className="w-full">
                Upload Fotos
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}