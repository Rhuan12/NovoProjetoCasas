import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

// POST - Criar novo lead
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()

    // Validar dados obrigatórios
    if (!body.full_name || !body.email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Inserir lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        property_id: body.property_id || null,
        full_name: body.full_name.trim(),
        email: body.email.toLowerCase().trim(),
        phone: body.phone?.trim() || null,
        max_budget: body.max_budget || null,
        desired_bedrooms: body.desired_bedrooms || null,
        desired_bathrooms: body.desired_bathrooms || null,
        message: body.message?.trim() || null,
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar lead:', error)
      return NextResponse.json(
        { error: 'Erro ao processar solicitação' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Lead criado com sucesso',
        lead 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET - Listar leads (apenas para admins)
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { searchParams } = new URL(request.url)

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se é admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Parâmetros de filtro
    const status = searchParams.get('status')
    const propertyId = searchParams.get('property_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('leads')
      .select(`
        *,
        properties (
          id,
          title,
          price,
          city,
          neighborhood
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status)
    }

    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }

    const { data: leads, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Contar total de leads
    let countQuery = supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })

    if (status) {
      countQuery = countQuery.eq('status', status)
    }

    if (propertyId) {
      countQuery = countQuery.eq('property_id', propertyId)
    }

    const { count } = await countQuery

    return NextResponse.json({
      leads,
      total: count || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('Erro ao buscar leads:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}