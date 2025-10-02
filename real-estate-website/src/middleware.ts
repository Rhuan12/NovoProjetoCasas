import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Verificar autenticação apenas para rotas protegidas
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/login'

  // Se não for rota protegida, continuar sem verificação
  if (!isAdminRoute && !isLoginRoute) {
    return response
  }

  // Verificar sessão do usuário
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // === ROTA /login ===
  if (isLoginRoute) {
    // Se estiver logado e tentar acessar /login, redirecionar para /admin
    if (user && !authError) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin'
      return NextResponse.redirect(redirectUrl)
    }
    // Se não estiver logado, permitir acesso ao login
    return response
  }

  // === ROTAS /admin ===
  if (isAdminRoute) {
    // Se não estiver autenticado, redirecionar para login
    if (!user || authError) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Verificar role do usuário (admin ou photographer)
    // OTIMIZAÇÃO: Cache do perfil em header para evitar query dupla
    const cachedProfile = request.headers.get('x-user-profile')
    
    let userRole: string | null = null

    if (cachedProfile) {
      // Usar perfil do cache se disponível
      try {
        const profile = JSON.parse(cachedProfile)
        userRole = profile.role
      } catch (e) {
        console.error('Erro ao parsear perfil cacheado:', e)
      }
    }

    // Se não houver cache, buscar do banco
    if (!userRole) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name, id')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError)
        
        // Se erro ao buscar perfil, redirecionar para home
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/'
        redirectUrl.searchParams.set('error', 'profile_not_found')
        return NextResponse.redirect(redirectUrl)
      }

      if (!profile) {
        // Perfil não encontrado, redirecionar para home
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/'
        redirectUrl.searchParams.set('error', 'no_profile')
        return NextResponse.redirect(redirectUrl)
      }

      userRole = profile.role

      // Adicionar perfil ao header para uso posterior (evitar query dupla)
      response.headers.set('x-user-profile', JSON.stringify(profile))
      response.headers.set('x-user-role', profile.role)
      response.headers.set('x-user-id', profile.id)
      if (profile.full_name) {
        response.headers.set('x-user-name', profile.full_name)
      }
    }

    // ✅ CORREÇÃO: Verificar se userRole não é null antes de usar includes
    if (!userRole || !['admin', 'photographer'].includes(userRole)) {
      console.warn(`Acesso negado para usuário ${user.id} com role: ${userRole || 'null'}`)
      
      // Usuário não tem permissão, redirecionar para home
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/'
      redirectUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(redirectUrl)
    }

    // Usuário autenticado e autorizado, permitir acesso
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match apenas rotas que precisam de autenticação:
     * - /admin (todas as sub-rotas)
     * - /login
     * 
     * Excluir:
     * - /api (handled separately)
     * - /_next/static (static files)
     * - /_next/image (image optimization files)
     * - /favicon.ico (favicon file)
     * - arquivos públicos (svg, png, jpg, jpeg, gif, webp)
     */
    '/admin/:path*',
    '/login',
  ],
}