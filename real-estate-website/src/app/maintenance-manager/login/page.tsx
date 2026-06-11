'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button } from '@/components/ui/Button'
import { Wrench, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'

export default function MaintenanceManagerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createSupabaseClient()

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError
      if (!authData.user) throw new Error('Login failed')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', authData.user.id)
        .maybeSingle()

      if (profileError) {
        await supabase.auth.signOut()
        throw new Error(`Profile error: ${profileError.message}`)
      }

      if (!profile) {
        await supabase.auth.signOut()
        throw new Error('Profile not found. Contact your administrator.')
      }

      if (!['admin', 'manager'].includes(profile.role)) {
        await supabase.auth.signOut()
        throw new Error('You do not have access to the Maintenance Portal.')
      }

      router.push('/maintenance-manager')
      router.refresh()
    } catch (err: any) {
      let errorMessage = 'Invalid email or password'
      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password'
      } else if (
        err.message?.includes('not have access') ||
        err.message?.includes('Profile') ||
        err.message?.includes('Contact')
      ) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-light/5" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-light rounded-2xl mb-4">
            <Wrench size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Maintenance Portal</h1>
          <p className="text-text-secondary">MW Homes KC</p>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Sign In</h2>

          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-danger flex-shrink-0" />
                <p className="text-danger text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            ← Back to site
          </button>
        </div>

        <div className="mt-8">
          <Card className="p-4 bg-background-tertiary/30">
            <p className="text-text-muted text-xs text-center">
              🔒 Secure and encrypted connection. Your data is protected.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
