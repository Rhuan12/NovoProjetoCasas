'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Property } from '@/lib/supabase'
import { Card, Button, Badge } from '@/components/ui/Button'
import { Upload, CheckCircle, AlertCircle, Camera, RefreshCw, Eye } from 'lucide-react'
import Link from 'next/link'

interface PhotoUploadInterfaceProps {
  property: Property
  onPhotosUpdate: () => void
}

interface UploadSlot {
  type: 'main' | 'photo_2' | 'photo_3' | 'photo_4' | 'photo_5' | 'photo_6' | 'photo_7' | 'photo_8' | 'photo_9' | 'photo_10' | 'photo_11' | 'photo_12' | 'photo_13' | 'photo_14' | 'photo_15' | 'photo_16' | 'photo_17' | 'photo_18' | 'photo_19' | 'photo_20'
  label: string
  priority: number
  currentUrl: string | null
}

export function PhotoUploadInterface({ property, onPhotosUpdate }: PhotoUploadInterfaceProps) {
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadResults, setUploadResults] = useState<Record<string, 'success' | 'error'>>({})
  const [uploadError, setUploadError] = useState<string | null>(null)
  
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
    photo_10: useRef<HTMLInputElement>(null),
    photo_11: useRef<HTMLInputElement>(null),
    photo_12: useRef<HTMLInputElement>(null),
    photo_13: useRef<HTMLInputElement>(null),
    photo_14: useRef<HTMLInputElement>(null),
    photo_15: useRef<HTMLInputElement>(null),
    photo_16: useRef<HTMLInputElement>(null),
    photo_17: useRef<HTMLInputElement>(null),
    photo_18: useRef<HTMLInputElement>(null),
    photo_19: useRef<HTMLInputElement>(null),
    photo_20: useRef<HTMLInputElement>(null)
  }

  const uploadSlots: UploadSlot[] = [
    {
      type: 'main',
      label: 'Foto Principal',
      priority: 1,
      currentUrl: property.main_photo_url
    },
    {
      type: 'photo_2',
      label: 'Segunda Foto',
      priority: 2,
      currentUrl: property.photo_2_url
    },
    {
      type: 'photo_3',
      label: 'Terceira Foto',
      priority: 3,
      currentUrl: property.photo_3_url
    },
    {
      type: 'photo_4',
      label: 'Quarta Foto',
      priority: 4,
      currentUrl: property.photo_4_url
    },
    {
      type: 'photo_5',
      label: 'Quinta Foto',
      priority: 5,
      currentUrl: property.photo_5_url
    },
    {
      type: 'photo_6',
      label: 'Sexta Foto',
      priority: 6,
      currentUrl: property.photo_6_url
    },
    {
      type: 'photo_7',
      label: 'Sétima Foto',
      priority: 7,
      currentUrl: property.photo_7_url
    },
    {
      type: 'photo_8',
      label: 'Oitava Foto',
      priority: 8,
      currentUrl: property.photo_8_url
    },
    {
      type: 'photo_9',
      label: 'Nona Foto',
      priority: 9,
      currentUrl: property.photo_9_url
    },
    {
      type: 'photo_10',
      label: 'Décima Foto',
      priority: 10,
      currentUrl: property.photo_10_url
    },
    {
      type: 'photo_11',
      label: 'Décima Primeira Foto',
      priority: 11,
      currentUrl: property.photo_11_url
    },
    {
      type: 'photo_12',
      label: 'Décima Segunda Foto',
      priority: 12,
      currentUrl: property.photo_12_url
    },
    {
      type: 'photo_13',
      label: 'Décima Terceira Foto',
      priority: 13,
      currentUrl: property.photo_13_url
    },
    {
      type: 'photo_14',
      label: 'Décima Quarta Foto',
      priority: 14,
      currentUrl: property.photo_14_url
    },
    {
      type: 'photo_15',
      label: 'Décima Quinta Foto',
      priority: 15,
      currentUrl: property.photo_15_url
    },
    {
      type: 'photo_16',
      label: 'Décima Sexta Foto',
      priority: 16,
      currentUrl: property.photo_16_url
    },
    {
      type: 'photo_17',
      label: 'Décima Sétima Foto',
      priority: 17,
      currentUrl: property.photo_17_url
    },
    {
      type: 'photo_18',
      label: 'Décima Oitava Foto',
      priority: 18,
      currentUrl: property.photo_18_url
    },
    {
      type: 'photo_19',
      label: 'Décima Nona Foto',
      priority: 19,
      currentUrl: property.photo_19_url
    },
    {
      type: 'photo_20',
      label: 'Vigésima Foto',
      priority: 20,
      currentUrl: property.photo_20_url
    }
  ]

  const uploadPhoto = async (photoType: 'main' | 'photo_2' | 'photo_3' | 'photo_4' | 'photo_5' | 'photo_6' | 'photo_7' | 'photo_8' | 'photo_9' | 'photo_10' | 'photo_11' | 'photo_12' | 'photo_13' | 'photo_14' | 'photo_15' | 'photo_16' | 'photo_17' | 'photo_18' | 'photo_19' | 'photo_20', file: File) => {
    try {
      setUploading(photoType)
      setUploadError(null)

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

      setUploadResults(prev => ({ ...prev, [photoType]: 'success' }))
      
      setTimeout(() => {
        onPhotosUpdate()
      }, 1000)

    } catch (error) {
      setUploadResults(prev => ({ ...prev, [photoType]: 'error' }))
      setUploadError(error instanceof Error ? error.message : 'Erro no upload')
    } finally {
      setUploading(null)
    }
  }

  const handleFileSelect = (photoType: 'main' | 'photo_2' | 'photo_3' | 'photo_4' | 'photo_5' | 'photo_6' | 'photo_7' | 'photo_8' | 'photo_9' | 'photo_10' | 'photo_11' | 'photo_12' | 'photo_13' | 'photo_14' | 'photo_15' | 'photo_16' | 'photo_17' | 'photo_18' | 'photo_19' | 'photo_20', files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validações
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Arquivo muito grande. Máximo 10MB.')
      return
    }

    uploadPhoto(photoType, file)
  }

  const handleDrop = (e: React.DragEvent, photoType: 'main' | 'photo_2' | 'photo_3' | 'photo_4' | 'photo_5' | 'photo_6' | 'photo_7' | 'photo_8' | 'photo_9' | 'photo_10' | 'photo_11' | 'photo_12' | 'photo_13' | 'photo_14' | 'photo_15' | 'photo_16' | 'photo_17' | 'photo_18' | 'photo_19' | 'photo_20') => {
    e.preventDefault()
    handleFileSelect(photoType, e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const getStatusBadge = () => {
    switch (property.status) {
      case 'available':
        return <Badge variant="success">Disponível</Badge>
      case 'sold':
        return <Badge variant="sold">Vendido</Badge>
      case 'reserved':
        return <Badge variant="warning">Reservado</Badge>
      default:
        return <Badge>-</Badge>
    }
  }

  const formatPrice = (price: number | null) => {
    if (!price) return 'Sob consulta'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const completedPhotos = uploadSlots.filter(slot => slot.currentUrl).length
  const totalPhotos = uploadSlots.length

  return (
    <div className="space-y-6">
      {/* Property Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-text-primary">{property.title}</h2>
              {getStatusBadge()}
            </div>
            <p className="text-text-secondary">
              {property.city}{property.neighborhood && `, ${property.neighborhood}`}
            </p>
            <p className="text-lg font-semibold text-text-primary mt-1">
              {formatPrice(property.price)}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href={`/admin/imoveis/${property.id}/editar`}>
              <Button variant="outline" size="sm">
                Editar Imóvel
              </Button>
            </Link>
            <Link href={`/imoveis/${property.id}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye size={16} className="mr-2" />
                Ver Site
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">
                Progresso das Fotos
              </span>
              <span className="text-sm text-text-secondary">
                {completedPhotos}/{totalPhotos}
              </span>
            </div>
            <div className="w-full bg-background-tertiary rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedPhotos / totalPhotos) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {completedPhotos === totalPhotos && (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle size={16} />
              <span className="text-sm font-medium">Completo!</span>
            </div>
          )}
        </div>
      </Card>

      {/* Error Message */}
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

      {/* Upload Slots */}
      <div className="grid grid-cols-1 gap-6">
        {uploadSlots.map((slot) => {
          const isUploading = uploading === slot.type
          const uploadResult = uploadResults[slot.type]
          
          return (
            <Card key={slot.type} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    slot.currentUrl 
                      ? 'bg-success text-white' 
                      : 'bg-background-tertiary text-text-muted'
                  }`}>
                    {slot.priority}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{slot.label}</h3>
                    <p className="text-sm text-text-muted">
                      {slot.type === 'main' && 'Imagem principal que aparece nas listagens'}
                      {slot.type === 'photo_2' && 'Segunda imagem para detalhes'}
                      {slot.type === 'photo_3' && 'Terceira imagem para complementar'}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {isUploading && (
                    <div className="flex items-center gap-2 text-accent-primary">
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="text-sm">Enviando...</span>
                    </div>
                  )}
                  
                  {uploadResult === 'success' && (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle size={16} />
                      <span className="text-sm">Enviado!</span>
                    </div>
                  )}
                  
                  {uploadResult === 'error' && (
                    <div className="flex items-center gap-2 text-danger">
                      <AlertCircle size={16} />
                      <span className="text-sm">Erro</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Photo */}
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-3">Foto Atual</h4>
                  {slot.currentUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-background-tertiary">
                      <Image
                        src={slot.currentUrl}
                        alt={slot.label}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <RefreshCw size={24} className="text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg bg-background-tertiary flex items-center justify-center">
                      <div className="text-center">
                        <Camera size={32} className="mx-auto text-text-muted mb-2" />
                        <p className="text-text-muted text-sm">Nenhuma foto</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Area */}
                <div>
                  <h4 className="text-sm font-medium text-text-primary mb-3">
                    {slot.currentUrl ? 'Substituir Foto' : 'Enviar Foto'}
                  </h4>
                  
                  <div
                    className={`aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer ${
                      isUploading
                        ? 'border-accent-primary bg-accent-primary/5'
                        : 'border-background-tertiary hover:border-accent-primary hover:bg-accent-primary/5'
                    }`}
                    onDrop={(e) => handleDrop(e, slot.type)}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRefs[slot.type].current?.click()}
                  >
                    {isUploading ? (
                      <div className="text-center">
                        <RefreshCw size={32} className="mx-auto text-accent-primary mb-2 animate-spin" />
                        <p className="text-accent-primary font-medium">Enviando foto...</p>
                        <p className="text-accent-primary/70 text-sm">Aguarde alguns segundos</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload size={32} className="mx-auto text-text-muted mb-2" />
                        <p className="text-text-primary font-medium mb-1">
                          Clique ou arraste a foto
                        </p>
                        <p className="text-text-muted text-sm">
                          JPEG, PNG ou WebP • Máx. 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => fileInputRefs[slot.type].current?.click()}
                    disabled={isUploading}
                  >
                    <Upload size={16} className="mr-2" />
                    Selecionar Arquivo
                  </Button>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRefs[slot.type]}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      handleFileSelect(slot.type, e.target.files)
                      e.target.value = '' // Reset
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-accent-primary/5 border-accent-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text-primary mb-1">
              Status do Upload: {completedPhotos}/20 fotos enviadas
            </h3>
            <p className="text-text-secondary text-sm">
              {completedPhotos === 0 && 'Envie a primeira foto para começar'}
              {completedPhotos > 0 && completedPhotos < 10 && `Bom começo! Adicione mais ${20 - completedPhotos} fotos`}
              {completedPhotos >= 10 && completedPhotos < 20 && `Quase lá! Faltam ${20 - completedPhotos} fotos`}
              {completedPhotos === 20 && 'Perfeito! Todas as fotos foram enviadas ✅'}
            </p>
          </div>
          
          {completedPhotos === 20 && (
            <div className="text-center">
              <CheckCircle size={32} className="text-success mx-auto mb-1" />
              <p className="text-success text-sm font-medium">Completo!</p>
            </div>
          )}
        </div>

        {completedPhotos < 20 && (
          <div className="mt-4 p-4 bg-white/50 rounded-lg">
            <h4 className="font-medium text-text-primary mb-2">🎯 Próximos passos:</h4>
            <ul className="text-text-secondary text-sm space-y-1">
              {!property.main_photo_url && (
                <li>• <strong>Foto Principal:</strong> Fachada ou melhor ângulo do imóvel</li>
              )}
              {property.main_photo_url && completedPhotos < 20 && (
                <li>• Continue adicionando fotos de diferentes ângulos e ambientes</li>
              )}
              {completedPhotos >= 1 && completedPhotos < 20 && (
                <li>• Faltam {20 - completedPhotos} foto{20 - completedPhotos > 1 ? 's' : ''} para completar</li>
              )}
            </ul>
          </div>
        )}
      </Card>
    </div>
  )
}