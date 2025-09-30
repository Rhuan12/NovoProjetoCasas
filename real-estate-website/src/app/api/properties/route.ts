import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

// GET - Listar imóveis com filtros
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    
    // Parâmetros de filtro
    const status = searchParams.get('status')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')
    const maxPrice = searchParams.get('maxPrice')
    const city = searchParams.get('city')
    const neighborhood = searchParams.get('neighborhood')

    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status)
    }
    
    if (bedrooms) {
      query = query.gte('bedrooms', parseInt(bedrooms))
    }
    
    if (bathrooms) {
      query = query.gte('bathrooms', parseInt(bathrooms))
    }
    
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice))
    }
    
    if (city) {
      query = query.ilike('city', `%${city}%`)
    }
    
    if (neighborhood) {
      query = query.ilike('neighborhood', `%${neighborhood}%`)
    }

    const { data: properties, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ properties })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo imóvel
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se é admin ou photographer
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'photographer'].includes(profile.role)) {
      return NextResponse.json({ error: 'Permissão negada' }, { status: 403 })
    }

    // Validar dados obrigatórios
    if (!body.title) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    // Inserir imóvel
    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        ...body,
        created_by: user.id,
        status: body.status || 'available'
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}