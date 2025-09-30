import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const propertyId = formData.get('propertyId') as string
    const photoType = formData.get('photoType') as string // 'main', 'photo_2', 'photo_3'

    if (!file) {
      return NextResponse.json({ error: 'Arquivo é obrigatório' }, { status: 400 })
    }

    if (!propertyId) {
      return NextResponse.json({ error: 'ID do imóvel é obrigatório' }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP' },
        { status: 400 }
      )
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB' },
        { status: 400 }
      )
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop()
    const fileName = `${propertyId}/${photoType}_${Date.now()}.${fileExtension}`

    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      return NextResponse.json(
        { error: `Erro no upload: ${uploadError.message}` },
        { status: 400 }
      )
    }

    // Obter URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)

    // Atualizar o imóvel com a URL da foto
    const updateField = photoType === 'main' ? 'main_photo_url' :
                       photoType === 'photo_2' ? 'photo_2_url' : 'photo_3_url'

    const { error: updateError } = await supabase
      .from('properties')
      .update({
        [updateField]: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', propertyId)

    if (updateError) {
      return NextResponse.json(
        { error: `Erro ao atualizar imóvel: ${updateError.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Upload realizado com sucesso',
      url: publicUrl,
      photoType
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}