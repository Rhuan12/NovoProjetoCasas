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

  const pathname = request.nextUrl.pathname

  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === '/login'
  const isMaintenanceManagerLoginRoute = pathname === '/maintenance-manager/login'
  const isMaintenanceManagerRoute = pathname.startsWith('/maintenance-manager') && !isMaintenanceManagerLoginRoute

  // Rotas não protegidas: passar direto
  if (!isAdminRoute && !isLoginRoute && !isMaintenanceManagerRoute && !isMaintenanceManagerLoginRoute) {
    return response
  }

  // Verificar sessão do usuário
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // === ROTA /login ===
  if (isLoginRoute) {
    if (user && !authError) {
      // Redirecionar managers para o portal deles, não para /admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'manager') {
        return NextResponse.redirect(new URL('/maintenance-manager', request.url))
      }

      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  // === ROTA /maintenance-manager/login ===
  if (isMaintenanceManagerLoginRoute) {
    if (user && !authError) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile && ['admin', 'manager'].includes(profile.role)) {
        return NextResponse.redirect(new URL('/maintenance-manager', request.url))
      }
    }
    return response
  }

  // === ROTAS PROTEGIDAS: verificar autenticação ===
  if (!user || authError) {
    if (isAdminRoute) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    if (isMaintenanceManagerRoute) {
      return NextResponse.redirect(new URL('/maintenance-manager/login', request.url))
    }
  }

  // Buscar role do usuário (com cache em header)
  const cachedProfile = request.headers.get('x-user-profile')
  let userRole: string | null = null

  if (cachedProfile) {
    try {
      const profile = JSON.parse(cachedProfile)
      userRole = profile.role
    } catch (e) {
      console.error('Erro ao parsear perfil cacheado:', e)
    }
  }

  if (!userRole) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name, id')
      .eq('id', user!.id)
      .single()

    if (profileError || !profile) {
      const redirectUrl = new URL('/', request.url)
      redirectUrl.searchParams.set('error', profileError ? 'profile_not_found' : 'no_profile')
      return NextResponse.redirect(redirectUrl)
    }

    userRole = profile.role

    response.headers.set('x-user-profile', JSON.stringify(profile))
    response.headers.set('x-user-role', profile.role)
    response.headers.set('x-user-id', profile.id)
    if (profile.full_name) {
      response.headers.set('x-user-name', profile.full_name)
    }
  }

  // === /admin: apenas admin e photographer ===
  if (isAdminRoute && (!userRole || !['admin', 'photographer'].includes(userRole))) {
    console.warn(`Acesso negado a /admin para role: ${userRole || 'null'}`)
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('error', 'unauthorized')
    return NextResponse.redirect(redirectUrl)
  }

  // === /maintenance-manager: admin e manager ===
  if (isMaintenanceManagerRoute && (!userRole || !['admin', 'manager'].includes(userRole))) {
    console.warn(`Acesso negado a /maintenance-manager para role: ${userRole || 'null'}`)
    return NextResponse.redirect(new URL('/maintenance-manager/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/maintenance-manager',
    '/maintenance-manager/:path*',
  ],
}