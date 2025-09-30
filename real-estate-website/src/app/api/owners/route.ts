import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

// GET - Listar donos ativos
export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    const { data: owners, error } = await supabase
      .from('owners')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ owners })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo dono
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const body = await request.json()

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
      return NextResponse.json({ error: 'Apenas admins podem criar donos' }, { status: 403 })
    }

    // Validar dados obrigatórios
    if (!body.name || !body.role) {
      return NextResponse.json({ error: 'Nome e cargo são obrigatórios' }, { status: 400 })
    }

    // Verificar limite de 3 donos ativos
    const { data: activeOwners } = await supabase
      .from('owners')
      .select('id')
      .eq('is_active', true)

    if (activeOwners && activeOwners.length >= 3) {
      return NextResponse.json(
        { error: 'Máximo de 3 donos ativos permitido. Desative um dono antes de adicionar outro.' },
        { status: 400 }
      )
    }

    // Inserir dono
    const { data: owner, error } = await supabase
      .from('owners')
      .insert({
        name: body.name,
        role: body.role,
        creci: body.creci || null,
        bio: body.bio || null,
        photo_url: body.photo_url || null,
        achievements: body.achievements || [],
        display_order: body.display_order || 1,
        is_active: body.is_active !== undefined ? body.is_active : true,
        created_by: user.id
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ owner }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}