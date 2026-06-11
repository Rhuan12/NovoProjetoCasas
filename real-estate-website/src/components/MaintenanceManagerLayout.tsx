'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wrench, LogOut, ExternalLink } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface MaintenanceManagerLayoutProps {
  children: React.ReactNode
}

export function MaintenanceManagerLayout({ children }: MaintenanceManagerLayoutProps) {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    router.push('/maintenance-manager/login')
  }

  const roleLabel = profile?.role === 'admin' ? 'Admin' : profile?.role === 'manager' ? 'Manager' : ''
  const displayName = profile?.full_name || user?.email || ''
  const initial = displayName[0]?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Top navbar */}
      <header className="sticky top-0 z-40 bg-background-secondary border-b border-background-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                <Wrench size={20} className="text-accent-primary" />
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm leading-tight">Maintenance Portal</p>
                <p className="text-xs text-text-muted leading-tight">MW Homes KC</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {!loading && profile && (
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary leading-tight">{displayName}</p>
                    <p className="text-xs text-text-muted leading-tight">{roleLabel}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-semibold text-sm">
                    {initial}
                  </div>
                </div>
              )}

              <a
                href="/resident-portal"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-background-tertiary rounded-lg text-xs text-text-secondary hover:text-text-primary hover:border-accent-primary/50 transition-colors"
              >
                <ExternalLink size={12} />
                Resident Portal
              </a>

              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-danger transition-colors rounded-lg hover:bg-danger/10 disabled:opacity-50"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">{signingOut ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
