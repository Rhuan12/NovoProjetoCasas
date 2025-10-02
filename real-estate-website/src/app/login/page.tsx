'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Input, Button } from '@/components/ui/Button'
import { Building, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'

export default function LoginPage() {
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
      
      // 1. Fazer login
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (!authData.user) {
        throw new Error('Erro ao fazer login')
      }

      console.log('✅ Login bem-sucedido. User ID:', authData.user.id)

      // 2. Buscar perfil do usuário
      // ✅ CORREÇÃO: Usar sintaxe correta do Supabase
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', authData.user.id)
        .maybeSingle() // ← Mudança: usar maybeSingle() ao invés de single()

      // Log para debug
      console.log('Profile query result:', { profile, profileError })

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError)
        throw new Error(`Erro ao buscar perfil: ${profileError.message}`)
      }

      if (!profile) {
        // Perfil não existe - criar automaticamente ou negar acesso
        console.error('Perfil não encontrado para o usuário:', authData.user.id)
        await supabase.auth.signOut()
        throw new Error('Perfil não encontrado. Entre em contato com o administrador.')
      }

      // 3. Verificar se tem permissão (admin ou photographer)
      if (!['admin', 'photographer'].includes(profile.role)) {
        console.warn('Usuário sem permissão. Role:', profile.role)
        await supabase.auth.signOut()
        throw new Error('Você não tem permissão para acessar o painel administrativo')
      }

      console.log('✅ Autenticação completa. Role:', profile.role)

      // 4. Redirecionar para o admin
      router.push('/admin')
      router.refresh()
      
    } catch (err: any) {
      console.error('Erro no login:', err)
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Email ou senha incorretos'
      
      if (err.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos'
      } else if (err.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login'
      } else if (err.message.includes('perfil')) {
        errorMessage = err.message
      } else if (err.message.includes('permissão')) {
        errorMessage = err.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-light/5"></div>
      
      <div className="relative w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-light rounded-2xl mb-4">
            <Building size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Imóveis Premium
          </h1>
          <p className="text-text-secondary">
            Painel Administrativo
          </p>
        </div>

        {/* Card de Login */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Bem-vindo de volta
          </h2>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-danger flex-shrink-0" />
                <p className="text-danger text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Senha
              </label>
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
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              Esqueceu sua senha?{' '}
              <button 
                className="text-accent-primary hover:text-accent-hover transition-colors"
                onClick={() => alert('Funcionalidade em desenvolvimento')}
              >
                Recuperar acesso
              </button>
            </p>
          </div>
        </Card>

        {/* Voltar ao site */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            ← Voltar ao site
          </button>
        </div>

        {/* Info de Segurança */}
        <div className="mt-8">
          <Card className="p-4 bg-background-tertiary/30">
            <p className="text-text-muted text-xs text-center">
              🔒 Conexão segura e criptografada. Seus dados estão protegidos.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}