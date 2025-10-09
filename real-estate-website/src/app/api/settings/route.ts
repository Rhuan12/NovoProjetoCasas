import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

// GET - Buscar configurações
export async function GET() {
  try {
    const supabase = createSupabaseServerClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }

    return NextResponse.json(data || null)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}

// POST - Salvar/Atualizar configurações
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se é admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Apenas administradores podem alterar configurações' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Verificar se já existe um registro
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .single()

    let result

    if (existing) {
      // Atualizar registro existente
      const { data, error } = await supabase
        .from('site_settings')
        .update({
          owner_name: body.owner_name,
          owner_photo_url: body.owner_photo_url,
          owner_bio: body.owner_bio,
          company_name: body.company_name,
          company_logo_url: body.company_logo_url,
          contact_phone: body.contact_phone,
          contact_email: body.contact_email,
          contact_address: body.contact_address,
          google_reviews_link: body.google_reviews_link,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Criar novo registro
      const { data, error } = await supabase
        .from('site_settings')
        .insert({
          owner_name: body.owner_name,
          owner_photo_url: body.owner_photo_url,
          owner_bio: body.owner_bio,
          company_name: body.company_name,
          company_logo_url: body.company_logo_url,
          contact_phone: body.contact_phone,
          contact_email: body.contact_email,
          contact_address: body.contact_address,
          google_reviews_link: body.google_reviews_link
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar configurações' },
      { status: 500 }
    )
  }
}