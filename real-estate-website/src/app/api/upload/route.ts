// src/app/api/upload/route.ts - VERSÃO CORRIGIDA
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // 1. VERIFICAR AUTENTICAÇÃO
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Erro de autenticação:', authError)
      return NextResponse.json(
        { error: 'Não autorizado - faça login novamente' }, 
        { status: 401 }
      )
    }

    console.log('✅ Usuário autenticado:', user.id)

    // 2. VERIFICAR PERMISSÃO (admin ou photographer)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('❌ Erro ao buscar perfil:', profileError)
      return NextResponse.json(
        { error: 'Perfil não encontrado' }, 
        { status: 403 }
      )
    }

    if (!['admin', 'photographer'].includes(profile.role)) {
      console.error('❌ Usuário sem permissão. Role:', profile.role)
      return NextResponse.json(
        { error: `Permissão negada. Apenas admin ou photographer podem fazer upload.` }, 
        { status: 403 }
      )
    }

    console.log('✅ Permissão verificada. Role:', profile.role)

    // 3. EXTRAIR DADOS DO FORM
    const formData = await request.formData()
    const file = formData.get('file') as File
    const propertyId = formData.get('propertyId') as string
    const photoType = formData.get('photoType') as string // 'main', 'photo_2', 'photo_3'
    const folder = formData.get('folder') as string | null // Para upload de donos

    // 4. VALIDAR DADOS
    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo é obrigatório' }, 
        { status: 400 }
      )
    }

    // Se for upload de imóvel, propertyId e photoType são obrigatórios
    if (!folder && !propertyId) {
      return NextResponse.json(
        { error: 'ID do imóvel é obrigatório para upload de fotos' }, 
        { status: 400 }
      )
    }

    console.log('📁 Upload iniciado:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      propertyId,
      photoType,
      folder
    })

    // 5. VALIDAR TIPO DE ARQUIVO
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP' },
        { status: 400 }
      )
    }

    // 6. VALIDAR TAMANHO (máximo 5MB)
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo 5MB` },
        { status: 400 }
      )
    }

    // 7. GERAR NOME ÚNICO PARA O ARQUIVO
    const fileExtension = file.name.split('.').pop()
    const timestamp = Date.now()
    
    let fileName: string
    
    if (folder) {
      // Upload para pasta específica (ex: owners)
      fileName = `${folder}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    } else {
      // Upload para imóvel específico
      fileName = `${propertyId}/${photoType}_${timestamp}.${fileExtension}`
    }

    console.log('📝 Nome do arquivo gerado:', fileName)

    // 8. CONVERTER FILE PARA BUFFER
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    console.log('🔄 Iniciando upload para Supabase Storage...')

    // 9. UPLOAD PARA SUPABASE STORAGE
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600' // Cache de 1 hora
      })

    if (uploadError) {
      console.error('❌ Erro no upload do Supabase:', uploadError)
      return NextResponse.json(
        { 
          error: `Erro no upload: ${uploadError.message}`,
          details: uploadError
        },
        { status: 400 }
      )
    }

    console.log('✅ Upload bem-sucedido no Storage:', uploadData.path)

    // 10. OBTER URL PÚBLICA DA IMAGEM
    const { data: urlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)

    if (!urlData || !urlData.publicUrl) {
      console.error('❌ Erro ao obter URL pública')
      return NextResponse.json(
        { error: 'Erro ao obter URL da imagem' },
        { status: 500 }
      )
    }

    const publicUrl = urlData.publicUrl

    console.log('🔗 URL pública gerada:', publicUrl)

    // 11. ATUALIZAR BANCO DE DADOS (se for upload de imóvel)
    if (propertyId && photoType) {
      const updateField = photoType === 'main' ? 'main_photo_url' :
                         photoType === 'photo_2' ? 'photo_2_url' : 'photo_3_url'

      console.log(`💾 Atualizando campo ${updateField} do imóvel ${propertyId}...`)

      const { error: updateError } = await supabase
        .from('properties')
        .update({
          [updateField]: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId)

      if (updateError) {
        console.error('❌ Erro ao atualizar imóvel:', updateError)
        
        // Tentar deletar a imagem do storage se falhou atualizar o banco
        await supabase.storage
          .from('property-images')
          .remove([fileName])
        
        return NextResponse.json(
          { 
            error: `Erro ao atualizar imóvel: ${updateError.message}`,
            details: updateError
          },
          { status: 400 }
        )
      }

      console.log('✅ Banco de dados atualizado com sucesso')
    }

    // 12. RETORNAR SUCESSO
    return NextResponse.json({
      success: true,
      message: 'Upload realizado com sucesso',
      url: publicUrl,
      photoType,
      path: uploadData.path
    })

  } catch (error) {
    console.error('❌ Erro interno no upload:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// ============================================
// FUNÇÃO AUXILIAR: Limpar imagens antigas
// ============================================
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
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
      return NextResponse.json({ error: 'Apenas admins podem deletar' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')

    if (!filePath) {
      return NextResponse.json({ error: 'Path é obrigatório' }, { status: 400 })
    }

    // Deletar do storage
    const { error: deleteError } = await supabase.storage
      .from('property-images')
      .remove([filePath])

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ message: 'Arquivo deletado com sucesso' })

  } catch (error) {
    console.error('Erro ao deletar:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}