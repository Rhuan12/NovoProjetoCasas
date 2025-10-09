'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Property } from '@/lib/supabase'
import { Card, Button } from '@/components/ui/Button'
import { Upload, X, Camera, AlertCircle, CheckCircle } from 'lucide-react'

interface PropertyPhotosManagerProps {
  property: Property
  onPhotosUpdate: () => void
}

interface PhotoSlot {
  type: 'main' | 'photo_2' | 'photo_3' | 'photo_4' | 'photo_5' | 'photo_6' | 'photo_7' | 'photo_8' | 'photo_9' | 'photo_10'
  label: string
  currentUrl: string | null
}

export function PropertyPhotosManager({ property, onPhotosUpdate }: PropertyPhotosManagerProps) {
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  
  const fileInputRefs = {
    main: useRef<HTMLInputElement>(null),
    photo_2: useRef<HTMLInputElement>(null),
    photo_3: useRef<HTMLInputElement>(null),
    photo_4: useRef<HTMLInputElement>(null),
    photo_5: useRef<HTMLInputElement>(null),
    photo_6: useRef<HTMLInputElement>(null),
    photo_7: useRef<HTMLInputElement>(null),
    photo_8: useRef<HTMLInputElement>(null),
    photo_9: useRef<HTMLInputElement>(null),
    photo_10: useRef<HTMLInputElement>(null)
  }

  const photoSlots: PhotoSlot[] = [
    {
      type: 'main',
      label: 'Foto Principal',
      currentUrl: property.main_photo_url
    },
    {
      type: 'photo_2',
      label: 'Foto 2',
      currentUrl: property.photo_2_url
    },
    {
      type: 'photo_3',
      label: 'Foto 3',
      currentUrl: property.photo_3_url
    },
    {
      type: 'photo_4',
      label: 'Foto 4',
      currentUrl: property.photo_4_url
    },
    {
      type: 'photo_5',
      label: 'Foto 5',
      currentUrl: property.photo_5_url
    },
    {
      type: 'photo_6',
      label: 'Foto 6',
      currentUrl: property.photo_6_url
    },
    {
      type: 'photo_7',
      label: 'Foto 7',
      currentUrl: property.photo_7_url
    },
    {
      type: 'photo_8',
      label: 'Foto 8',
      currentUrl: property.photo_8_url
    },
    {
      type: 'photo_9',
      label: 'Foto 9',
      currentUrl: property.photo_9_url
    },
    {
      type: 'photo_10',
      label: 'Foto 10',
      currentUrl: property.photo_10_url
    }
  ]

  const handleFileSelect = (photoType: 'main' | 'photo_2' | 'photo_3' | 'photo_4' | 'photo_5' | 'photo_6' | 'photo_7' | 'photo_8' | 'photo_9' | 'photo_10', file: File) => {
    if (!file) return

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.')
      return
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Arquivo muito grande. Máximo 10MB.')
      return
    }

    uploadPhoto(photoType, file)
  }

  const uploadPhoto = async (photoType: 'main' | 'photo_2' | 'photo_3' | 'photo_4' | 'photo_5' | 'photo_6' | 'photo_7' | 'photo_8' | 'photo_9' | 'photo_10', file: File) => {
    try {
      setUploading(photoType)
      setUploadError(null)
      setUploadSuccess(null)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('propertyId', property.id)
      formData.append('photoType', photoType)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro no upload')
      }

      const data = await response.json()
      setUploadSuccess(`Foto ${photoType === 'main' ? 'principal' : photoType.replace('photo_', '')} atualizada com sucesso!`)
      
      // Atualizar a página após sucesso
      setTimeout(() => {
        onPhotosUpdate()
        setUploadSuccess(null)
      }, 2000)

    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Erro no upload')
    } finally {
      setUploading(null)
    }
  }

  const handleDrop = (e: React.DragEvent, photoType: 'main' | 'photo_2' | 'photo_3' | 'photo_4' | 'photo_5' | 'photo_6' | 'photo_7' | 'photo_8' | 'photo_9' | 'photo_10') => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(photoType, files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removePhoto = async (photoType: 'main' | 'photo_2' | 'photo_3' | 'photo_4' | 'photo_5' | 'photo_6' | 'photo_7' | 'photo_8' | 'photo_9' | 'photo_10') => {
    try {
      setUploading(photoType)
      
      const updateField = photoType === 'main' ? 'main_photo_url' : `${photoType}_url`

      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [updateField]: null
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao remover foto')
      }

      onPhotosUpdate()
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Erro ao remover foto')
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
          <Camera size={20} />
          Gerenciamento de Fotos
        </h3>
        <p className="text-text-secondary text-sm">
          Adicione até 10 fotos para este imóvel. A primeira será a foto principal que aparece nas listagens.
        </p>
      </Card>

      {/* Success/Error Messages */}
      {uploadSuccess && (
        <Card className="p-4 border-success/20 bg-success/5">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-success" />
            <p className="text-success">{uploadSuccess}</p>
          </div>
        </Card>
      )}

      {uploadError && (
        <Card className="p-4 border-danger/20 bg-danger/5">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-danger" />
            <div>
              <h4 className="font-semibold text-danger">Erro no upload</h4>
              <p className="text-danger text-sm">{uploadError}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Photo Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photoSlots.map((slot) => (
          <Card key={slot.type} className="p-6">
            <h4 className="font-semibold text-text-primary mb-4 text-center">
              {slot.label}
              {slot.type === 'main' && <span className="text-accent-primary ml-1">*</span>}
            </h4>

            {/* Photo Display Area */}
            <div className="relative mb-4">
              {slot.currentUrl ? (
                // Existing Photo
                <div className="relative group">
                  <div className="aspect-video relative rounded-lg overflow-hidden bg-background-tertiary">
                    <Image
                      src={slot.currentUrl}
                      alt={slot.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  
                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => fileInputRefs[slot.type].current?.click()}
                      disabled={uploading === slot.type}
                    >
                      <Upload size={14} className="mr-1" />
                      Trocar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removePhoto(slot.type)}
                      disabled={uploading === slot.type}
                      className="text-danger hover:bg-danger/10"
                    >
                      <X size={14} className="mr-1" />
                      Remover
                    </Button>
                  </div>

                  {/* Loading overlay */}
                  {uploading === slot.type && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
              ) : (
                // Empty Slot - Drop Zone
                <div
                  className={`aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer ${
                    uploading === slot.type
                      ? 'border-accent-primary bg-accent-primary/5'
                      : 'border-background-tertiary hover:border-accent-primary hover:bg-accent-primary/5'
                  }`}
                  onDrop={(e) => handleDrop(e, slot.type)}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRefs[slot.type].current?.click()}
                >
                  {uploading === slot.type ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-primary border-t-transparent mx-auto mb-2"></div>
                      <p className="text-sm text-accent-primary">Fazendo upload...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={32} className="mx-auto text-text-muted mb-2" />
                      <p className="text-text-primary font-medium mb-1">Clique ou arraste uma foto</p>
                      <p className="text-text-muted text-sm">JPEG, PNG ou WebP até 10MB</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Upload Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRefs[slot.type].current?.click()}
              disabled={uploading === slot.type}
            >
              <Upload size={16} className="mr-2" />
              {slot.currentUrl ? 'Trocar Foto' : 'Adicionar Foto'}
            </Button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRefs[slot.type]}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileSelect(slot.type, file)
                }
                e.target.value = '' // Reset input
              }}
              className="hidden"
            />
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Card className="p-6 bg-accent-primary/5 border-accent-primary/20">
        <h4 className="font-semibold text-text-primary mb-3">📸 Dicas para melhores fotos</h4>
        <ul className="text-text-secondary text-sm space-y-2">
          <li>• <strong>Foto Principal:</strong> Use a melhor imagem do imóvel, preferencialmente a fachada ou ambiente principal</li>
          <li>• <strong>Iluminação:</strong> Prefira fotos com boa iluminação natural</li>
          <li>• <strong>Qualidade:</strong> Use imagens de alta resolução (mínimo 1200x800 pixels)</li>
          <li>• <strong>Composição:</strong> Mantenha as fotos organizadas e limpas</li>
          <li>• <strong>Formato:</strong> JPEG é recomendado para melhor compatibilidade</li>
        </ul>
      </Card>

      {/* Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary font-medium">
              Status das Fotos: {photoSlots.filter(slot => slot.currentUrl).length}/10 enviadas
            </p>
            <p className="text-text-secondary text-sm">
              {photoSlots.filter(slot => slot.currentUrl).length === 0 && 'Nenhuma foto enviada ainda'}
              {photoSlots.filter(slot => slot.currentUrl).length > 0 && photoSlots.filter(slot => slot.currentUrl).length < 10 && `Adicione mais ${10 - photoSlots.filter(slot => slot.currentUrl).length} foto${10 - photoSlots.filter(slot => slot.currentUrl).length > 1 ? 's' : ''} para completar`}
              {photoSlots.filter(slot => slot.currentUrl).length === 10 && 'Todas as fotos foram enviadas! ✅'}
            </p>
          </div>
          
          {photoSlots.filter(slot => slot.currentUrl).length > 0 && (
            <div className="text-right">
              <p className="text-success text-sm font-medium">
                Fotos salvas automaticamente
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}