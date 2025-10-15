'use client'

import { useState, ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { 
  Home, 
  Building, 
  Users as UsersIcon, 
  Camera, 
  Settings, 
  Menu, 
  X,
  LogOut,
  BarChart3,
  Plus,
  MessageSquare,
  User
} from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, profile, signOut, loading } = useAuth()

  const navigationItems = [
    { 
      href: '/admin', 
      label: 'Dashboard', 
      icon: BarChart3,
      description: 'Visão geral'
    },
    { 
      href: '/admin/imoveis', 
      label: 'Imóveis', 
      icon: Building,
      description: 'Gerenciar propriedades'
    },
    { 
      href: '/admin/leads', 
      label: 'Leads', 
      icon: UsersIcon,
      description: 'Interessados'
    },
    { 
      href: '/admin/fotos', 
      label: 'Fotos', 
      icon: Camera,
      description: 'Upload de imagens'
    },
    { 
      href: '/admin/depoimentos', 
      label: 'Depoimentos', 
      icon: MessageSquare,
      description: 'Avaliações de clientes'
    },
    { 
      href: '/admin/donos', 
      label: 'Donos', 
      icon: User,
      description: 'Proprietários'
    },
    { 
      href: '/admin/configuracoes', 
      label: 'Configurações', 
      icon: Settings,
      description: 'Dados da empresa'
    },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    if (confirm('Tem certeza que deseja sair?')) {
      await signOut()
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-secondary">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background-primary flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-background-secondary border-r border-background-tertiary transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header da sidebar */}
          <div className="flex items-center justify-between p-6 border-b border-background-tertiary flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-light rounded-lg flex items-center justify-center">
                <Home size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Admin</h2>
                <p className="text-sm text-text-muted">Painel de controle</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Navegação */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                    ${active 
                      ? 'bg-accent-primary text-white shadow-lg' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent size={20} className={active ? 'text-white' : 'text-text-muted group-hover:text-accent-primary'} />
                  <div className="flex-1">
                    <div className={`font-medium ${active ? 'text-white' : 'text-text-primary'}`}>
                      {item.label}
                    </div>
                    <div className={`text-sm ${active ? 'text-white/80' : 'text-text-muted'}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Actions rápidas */}
          <div className="p-4 border-t border-background-tertiary space-y-2 flex-shrink-0">
            <Link href="/admin/imoveis/novo">
              <Button className="w-full justify-start gap-3" size="sm">
                <Plus size={16} />
                Novo Imóvel
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full justify-start gap-3" size="sm">
                <Home size={16} />
                Ver Site
              </Button>
            </Link>
          </div>

          {/* User info */}
          <div className="p-4 border-t border-background-tertiary flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-text-primary truncate">
                  {profile?.full_name || user?.email || 'Usuário'}
                </div>
                <div className="text-xs text-text-muted capitalize">
                  {profile?.role === 'admin' ? 'Administrador' : 
                   profile?.role === 'photographer' ? 'Fotógrafo' : 'Usuário'}
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-text-muted hover:text-danger hover:bg-danger/10" 
              size="sm"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-background-primary/95 backdrop-blur-sm border-b border-background-tertiary flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu size={20} />
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-text-primary">
                  {navigationItems.find(item => isActive(item.href))?.label || 'Admin'}
                </h1>
                <p className="text-sm text-text-muted">
                  {navigationItems.find(item => isActive(item.href))?.description || 'Painel administrativo'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/imoveis">
                <Button variant="outline" size="sm">
                  Ver Site Público
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}