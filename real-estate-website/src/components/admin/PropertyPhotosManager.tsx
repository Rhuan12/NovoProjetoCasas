'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Property } from '@/lib/supabase'
import { Card, Button } from '@/components/ui/Button'
import { Upload, X, Camera, AlertCircle, CheckCircle } from 'lucide-react'

type PhotoType =
  | 'main' | 'photo_2' | 'photo_3' | 'photo_4' | 'photo_5'
  | 'photo_6' | 'photo_7' | 'photo_8' | 'photo_9' | 'photo_10'
  | 'photo_11' | 'photo_12' | 'photo_13' | 'photo_14' | 'photo_15'
  | 'photo_16' | 'photo_17' | 'photo_18' | 'photo_19' | 'photo_20'

const PHOTO_TYPES: PhotoType[] = [
  'main', 'photo_2', 'photo_3', 'photo_4', 'photo_5',
  'photo_6', 'photo_7', 'photo_8', 'photo_9', 'photo_10',
  'photo_11', 'photo_12', 'photo_13', 'photo_14', 'photo_15',
  'photo_16', 'photo_17', 'photo_18', 'photo_19', 'photo_20',
]

const PHOTO_LABELS: Record<PhotoType, string> = {
  main: 'Foto Principal', photo_2: 'Foto 2', photo_3: 'Foto 3',
  photo_4: 'Foto 4', photo_5: 'Foto 5', photo_6: 'Foto 6',
  photo_7: 'Foto 7', photo_8: 'Foto 8', photo_9: 'Foto 9',
  photo_10: 'Foto 10', photo_11: 'Foto 11', photo_12: 'Foto 12',
  photo_13: 'Foto 13', photo_14: 'Foto 14', photo_15: 'Foto 15',
  photo_16: 'Foto 16', photo_17: 'Foto 17', photo_18: 'Foto 18',
  photo_19: 'Foto 19', photo_20: 'Foto 20',
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

interface PropertyPhotosManagerProps {
  property: Property
  onPhotosUpdate: () => void
}

const getInitialUrls = (p: Property): Record<PhotoType, string | null> => ({
  main: p.main_photo_url, photo_2: p.photo_2_url, photo_3: p.photo_3_url,
  photo_4: p.photo_4_url, photo_5: p.photo_5_url, photo_6: p.photo_6_url,
  photo_7: p.photo_7_url, photo_8: p.photo_8_url, photo_9: p.photo_9_url,
  photo_10: p.photo_10_url, photo_11: p.photo_11_url, photo_12: p.photo_12_url,
  photo_13: p.photo_13_url, photo_14: p.photo_14_url, photo_15: p.photo_15_url,
  photo_16: p.photo_16_url, photo_17: p.photo_17_url, photo_18: p.photo_18_url,
  photo_19: p.photo_19_url, photo_20: p.photo_20_url,
})

export function PropertyPhotosManager({ property, onPhotosUpdate }: PropertyPhotosManagerProps) {
  // Local URLs — updated optimistically after each upload (no refetch needed)
  const [photoUrls, setPhotoUrls] = useState<Record<PhotoType, string | null>>(
    () => getInitialUrls(property)
  )
  // Multiple concurrent uploads tracked as a Set
  const [uploadingSlots, setUploadingSlots] = useState<Set<PhotoType>>(new Set())
  // Per-slot error messages
  const [slotErrors, setSlotErrors] = useState<Partial<Record<PhotoType, string>>>({})
  // Bulk upload feedback
  const [bulkSuccess, setBulkSuccess] = useState<number>(0)

  const fileInputRefs = useRef<Partial<Record<PhotoType, HTMLInputElement | null>>>({})
  const bulkInputRef = useRef<HTMLInputElement>(null)

  const setSlotUploading = (type: PhotoType, value: boolean) => {
    setUploadingSlots(prev => {
      const next = new Set(prev)
      value ? next.add(type) : next.delete(type)
      return next
    })
  }

  const clearSlotError = (type: PhotoType) =>
    setSlotErrors(prev => { const n = { ...prev }; delete n[type]; return n })

  const uploadPhoto = async (photoType: PhotoType, file: File): Promise<boolean> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setSlotErrors(prev => ({ ...prev, [photoType]: 'Tipo inválido. Use JPEG, PNG ou WebP.' }))
      return false
    }
    if (file.size > MAX_SIZE) {
      setSlotErrors(prev => ({ ...prev, [photoType]: 'Arquivo muito grande. Máximo 10MB.' }))
      return false
    }

    setSlotUploading(photoType, true)
    clearSlotError(photoType)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('propertyId', property.id)
      formData.append('photoType', photoType)

      const response = await fetch('/api/upload', { method: 'POST', body: formData })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Erro no upload')
      }

      const data = await response.json()

      // ✅ Update local state immediately — no page reload or refetch needed
      setPhotoUrls(prev => ({ ...prev, [photoType]: data.url }))
      // Notify parent in background (updates photo counter in tab)
      onPhotosUpdate()
      return true
    } catch (error) {
      setSlotErrors(prev => ({
        ...prev,
        [photoType]: error instanceof Error ? error.message : 'Erro no upload',
      }))
      return false
    } finally {
      setSlotUploading(photoType, false)
    }
  }

  const handleBulkUpload = async (files: FileList) => {
    const emptySlots = PHOTO_TYPES.filter(type => !photoUrls[type])
    const toUpload = Array.from(files).slice(0, emptySlots.length)
    if (toUpload.length === 0) return

    // All selected photos upload in parallel
    const results = await Promise.all(toUpload.map((file, i) => uploadPhoto(emptySlots[i], file)))
    const count = results.filter(Boolean).length
    if (count > 0) {
      setBulkSuccess(count)
      setTimeout(() => setBulkSuccess(0), 3000)
    }
  }

  const removePhoto = async (photoType: PhotoType) => {
    setSlotUploading(photoType, true)
    clearSlotError(photoType)
    try {
      const field = photoType === 'main' ? 'main_photo_url' : `${photoType}_url`
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: null }),
      })
      if (!response.ok) throw new Error('Erro ao remover foto')
      setPhotoUrls(prev => ({ ...prev, [photoType]: null }))
      onPhotosUpdate()
    } catch (error) {
      setSlotErrors(prev => ({ ...prev, [photoType]: 'Erro ao remover foto' }))
    } finally {
      setSlotUploading(photoType, false)
    }
  }

  const uploadedCount = Object.values(photoUrls).filter(Boolean).length
  const emptySlots = PHOTO_TYPES.filter(type => !photoUrls[type])

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
          <Camera size={20} />
          Gerenciamento de Fotos
        </h3>
        <p className="text-text-secondary text-sm">
          Adicione até 20 fotos para este imóvel. A primeira será a foto principal nas listagens.
        </p>
      </Card>

      {/* Bulk Upload Zone */}
      {emptySlots.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Upload size={18} className="text-accent-primary" />
            Upload em massa
          </h4>
          <div
            className="border-2 border-dashed border-accent-primary/40 rounded-xl p-8 flex flex-col items-center gap-3 hover:border-accent-primary hover:bg-accent-primary/5 transition-colors cursor-pointer group"
            onClick={() => bulkInputRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) handleBulkUpload(e.dataTransfer.files) }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-14 h-14 bg-accent-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
              <Upload size={28} className="text-accent-primary" />
            </div>
            <div className="text-center">
              <p className="text-text-primary font-medium">Selecione várias fotos de uma vez</p>
              <p className="text-text-muted text-sm mt-1">
                Preenche automaticamente os {emptySlots.length} slot{emptySlots.length !== 1 ? 's' : ''} vazio{emptySlots.length !== 1 ? 's' : ''} · Uploads em paralelo
              </p>
            </div>
            <Button size="sm" variant="outline" className="pointer-events-none">
              <Upload size={14} className="mr-2" />
              Escolher arquivos
            </Button>
          </div>
          <input
            ref={bulkInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files?.length) handleBulkUpload(e.target.files); e.target.value = '' }}
          />
          {bulkSuccess > 0 && (
            <div className="mt-3 flex items-center gap-2 text-success text-sm">
              <CheckCircle size={16} />
              {bulkSuccess} foto{bulkSuccess !== 1 ? 's' : ''} enviada{bulkSuccess !== 1 ? 's' : ''} com sucesso!
            </div>
          )}
        </Card>
      )}

      {/* Photo Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PHOTO_TYPES.map((type) => {
          const currentUrl = photoUrls[type]
          const isUploading = uploadingSlots.has(type)
          const error = slotErrors[type]

          return (
            <Card key={type} className="p-4">
              <h4 className="font-semibold text-text-primary mb-3 text-center text-sm">
                {PHOTO_LABELS[type]}
                {type === 'main' && <span className="text-accent-primary ml-1">*</span>}
              </h4>

              <div className="relative mb-3">
                {currentUrl ? (
                  <div className="relative group">
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-background-tertiary">
                      <Image
                        src={currentUrl}
                        alt={PHOTO_LABELS[type]}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button size="sm" onClick={() => fileInputRefs.current[type]?.click()} disabled={isUploading}>
                        <Upload size={14} className="mr-1" />
                        Trocar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => removePhoto(type)} disabled={isUploading} className="text-danger hover:bg-danger/10">
                        <X size={14} className="mr-1" />
                        Remover
                      </Button>
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer ${
                      isUploading
                        ? 'border-accent-primary bg-accent-primary/5'
                        : 'border-background-tertiary hover:border-accent-primary hover:bg-accent-primary/5'
                    }`}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) uploadPhoto(type, f) }}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRefs.current[type]?.click()}
                  >
                    {isUploading ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-primary border-t-transparent mx-auto mb-2" />
                        <p className="text-sm text-accent-primary">Enviando...</p>
                      </div>
                    ) : (
                      <div className="text-center px-2">
                        <Upload size={24} className="mx-auto text-text-muted mb-1" />
                        <p className="text-text-primary text-xs font-medium">Clique ou arraste</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-1.5 mb-2">
                  <AlertCircle size={13} className="text-danger flex-shrink-0 mt-0.5" />
                  <p className="text-danger text-xs leading-tight">{error}</p>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => fileInputRefs.current[type]?.click()}
                disabled={isUploading}
              >
                <Upload size={14} className="mr-2" />
                {currentUrl ? 'Trocar Foto' : 'Adicionar Foto'}
              </Button>

              <input
                ref={(el) => { fileInputRefs.current[type] = el }}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) uploadPhoto(type, f)
                  e.target.value = ''
                }}
              />
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary font-medium">
              {uploadedCount}/20 fotos enviadas
            </p>
            <p className="text-text-secondary text-sm">
              {uploadedCount === 0 && 'Nenhuma foto enviada ainda'}
              {uploadedCount > 0 && uploadedCount < 20 && `${20 - uploadedCount} slot${20 - uploadedCount > 1 ? 's' : ''} disponível${20 - uploadedCount > 1 ? 'is' : ''}`}
              {uploadedCount === 20 && 'Todas as fotos foram enviadas! ✅'}
            </p>
          </div>
          {uploadedCount > 0 && (
            <p className="text-success text-sm font-medium">Fotos salvas automaticamente</p>
          )}
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-6 bg-accent-primary/5 border-accent-primary/20">
        <h4 className="font-semibold text-text-primary mb-3">📸 Dicas para melhores fotos</h4>
        <ul className="text-text-secondary text-sm space-y-2">
          <li>• <strong>Foto Principal:</strong> Use a melhor imagem do imóvel, preferencialmente a fachada</li>
          <li>• <strong>Iluminação:</strong> Prefira fotos com boa iluminação natural</li>
          <li>• <strong>Qualidade:</strong> Use imagens de alta resolução (mínimo 1200x800 pixels)</li>
          <li>• <strong>Formato:</strong> JPEG é recomendado para melhor compatibilidade</li>
          <li>• <strong>Tamanho máximo:</strong> 10MB por foto</li>
        </ul>
      </Card>
    </div>
  )
}
