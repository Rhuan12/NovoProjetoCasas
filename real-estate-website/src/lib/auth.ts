import { createSupabaseServerClient } from './supabase'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      ...user,
      profile
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  
  if (user.profile?.role !== 'admin') {
    redirect('/')
  }
  
  return user
}

export async function requirePhotographer() {
  const user = await requireAuth()
  
  if (!['admin', 'photographer'].includes(user.profile?.role || '')) {
    redirect('/')
  }
  
  return user
}

// Função para criar perfil após signup
export async function createUserProfile(userId: string, userData: {
  full_name?: string
  role?: 'admin' | 'photographer' | 'viewer'
}) {
  const supabase = createSupabaseServerClient()
  
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      full_name: userData.full_name,
      role: userData.role || 'viewer'
    })
  
  if (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}