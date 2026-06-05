'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Property } from '@/lib/supabase'
import { Card, Button } from '@/components/ui/Button'
import { Upload, X, Camera, AlertCircle, CheckCircle, Plus } from 'lucide-react'

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
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

interface PendingPhoto {
  id: string
  file: File
  previewUrl: string
}

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
  const [photoUrls, setPhotoUrls] = useState<Record<PhotoType, string | null>>(
    () => getInitialUrls(property)
  )
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([])
  const [uploadingSlots, setUploadingSlots] = useState<Set<PhotoType>>(new Set())
  const [slotErrors, setSlotErrors] = useState<Partial<Record<PhotoType, string>>>({})
  const [stagingError, setStagingError] = useState<string | null>(null)
  const [uploadDone, setUploadDone] = useState<number>(0)

  const stagingInputRef = useRef<HTMLInputElement>(null)
  const replaceInputRefs = useRef<Partial<Record<PhotoType, HTMLInputElement | null>>>({})

  // ─── Helpers ─────────────────────────────────────────────────────────────

  const setSlotUploading = (type: PhotoType, value: boolean) =>
    setUploadingSlots(prev => {
      const next = new Set(prev)
      value ? next.add(type) : next.delete(type)
      return next
    })

  const addToPending = (files: FileList | File[]) => {
    setStagingError(null)
    const valid: PendingPhoto[] = []
    const skipped: string[] = []

    Array.from(files).forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        skipped.push(`${file.name} (tipo inválido)`)
        return
      }
      if (file.size > MAX_SIZE) {
        skipped.push(`${file.name} (muito grande)`)
        return
      }
      valid.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })
    })

    if (skipped.length) setStagingError(`Ignorados: ${skipped.join(', ')}`)
    if (valid.length) setPendingPhotos(prev => [...prev, ...valid])
  }

  const removePending = (id: string) => {
    setPendingPhotos(prev => {
      const photo = prev.find(p => p.id === id)
      if (photo) URL.revokeObjectURL(photo.previewUrl)
      return prev.filter(p => p.id !== id)
    })
  }

  const clearPending = () => {
    pendingPhotos.forEach(p => URL.revokeObjectURL(p.previewUrl))
    setPendingPhotos([])
    setStagingError(null)
  }

  // ─── Upload (single slot) ────────────────────────────────────────────────

  const uploadPhoto = async (photoType: PhotoType, file: File): Promise<boolean> => {
    setSlotUploading(photoType, true)
    setSlotErrors(prev => { const n = { ...prev }; delete n[photoType]; return n })

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('propertyId', property.id)
      formData.append('photoType', photoType)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro no upload')
      }

      const data = await res.json()
      setPhotoUrls(prev => ({ ...prev, [photoType]: data.url }))
      onPhotosUpdate() // silent background sync
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

  // ─── Confirm upload (staging → slots) ───────────────────────────────────

  const confirmUpload = async () => {
    if (pendingPhotos.length === 0) return

    const emptySlots = PHOTO_TYPES.filter(type => !photoUrls[type])
    const toUpload = pendingPhotos.slice(0, emptySlots.length)

    // Clear staging queue immediately so user sees it's been accepted
    clearPending()

    // Upload all in parallel
    const results = await Promise.all(
      toUpload.map((photo, i) => uploadPhoto(emptySlots[i], photo.file))
    )

    const count = results.filter(Boolean).length
    if (count > 0) {
      setUploadDone(count)
      setTimeout(() => setUploadDone(0), 3000)
    }
  }

  // ─── Remove existing photo ───────────────────────────────────────────────

  const removePhoto = async (photoType: PhotoType) => {
    setSlotUploading(photoType, true)
    try {
      const field = photoType === 'main' ? 'main_photo_url' : `${photoType}_url`
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: null }),
      })
      if (!res.ok) throw new Error('Erro ao remover foto')
      setPhotoUrls(prev => ({ ...prev, [photoType]: null }))
      onPhotosUpdate()
    } catch {
      setSlotErrors(prev => ({ ...prev, [photoType]: 'Erro ao remover foto' }))
    } finally {
      setSlotUploading(photoType, false)
    }
  }

  // ─── Computed ────────────────────────────────────────────────────────────

  const uploadedCount = Object.values(photoUrls).filter(Boolean).length
  const emptySlots = PHOTO_TYPES.filter(type => !photoUrls[type])
  const willUpload = Math.min(pendingPhotos.length, emptySlots.length)
  const isUploading = uploadingSlots.size > 0

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Header */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
          <Camera size={20} />
          Gerenciamento de Fotos
        </h3>
        <p className="text-text-secondary text-sm">
          Selecione as fotos, revise a fila e confirme o envio de uma vez.
          Máximo 20 fotos por imóvel.
        </p>
      </Card>

      {/* ── Staging Area ── */}
      {emptySlots.length > 0 && (
        <Card className="p-6 space-y-4">
          <h4 className="font-semibold text-text-primary flex items-center gap-2">
            <Upload size={18} className="text-accent-primary" />
            Adicionar fotos
            {pendingPhotos.length > 0 && (
              <span className="ml-auto text-sm font-normal text-text-muted">
                {pendingPhotos.length} na fila · {emptySlots.length} slot{emptySlots.length !== 1 ? 's' : ''} disponível{emptySlots.length !== 1 ? 'is' : ''}
              </span>
            )}
          </h4>

          {/* Dropzone */}
          <div
            className="border-2 border-dashed border-background-tertiary rounded-xl p-8 flex flex-col items-center gap-3 hover:border-accent-primary/60 hover:bg-accent-primary/5 transition-colors cursor-pointer group"
            onClick={() => stagingInputRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) addToPending(e.dataTransfer.files) }}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-12 h-12 bg-background-tertiary rounded-xl flex items-center justify-center group-hover:bg-accent-primary/10 transition-colors">
              <Plus size={26} className="text-text-muted group-hover:text-accent-primary transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-text-primary font-medium text-sm">
                Clique para selecionar ou arraste fotos aqui
              </p>
              <p className="text-text-muted text-xs mt-1">
                Selecione quantas quiser — JPEG, PNG ou WebP, máx. 10MB cada
              </p>
            </div>
          </div>
          <input
            ref={stagingInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files?.length) addToPending(e.target.files); e.target.value = '' }}
          />

          {/* Staging error */}
          {stagingError && (
            <div className="flex items-start gap-2 text-warning text-sm">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              {stagingError}
            </div>
          )}

          {/* Pending previews */}
          {pendingPhotos.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-widest">
                Aguardando confirmação
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {pendingPhotos.map((photo, index) => (
                  <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-background-tertiary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.previewUrl}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Slot assignment hint */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5 text-center">
                      <span className="text-white text-[10px] font-medium">
                        {emptySlots[index] ? PHOTO_LABELS[emptySlots[index]] : '—'}
                      </span>
                    </div>
                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removePending(photo.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger/80"
                    >
                      <X size={11} className="text-white" />
                    </button>
                    {/* Overflow indicator */}
                    {index >= emptySlots.length && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs font-medium text-center px-1">Sem slot</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Warning if more photos than slots */}
              {pendingPhotos.length > emptySlots.length && (
                <p className="text-warning text-xs flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  Apenas {emptySlots.length} de {pendingPhotos.length} foto{pendingPhotos.length !== 1 ? 's' : ''} serão enviadas (sem slots suficientes)
                </p>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-1">
                <Button
                  className="flex-1 gap-2"
                  onClick={confirmUpload}
                  disabled={isUploading || willUpload === 0}
                  loading={isUploading}
                >
                  <CheckCircle size={16} />
                  {isUploading
                    ? 'Enviando...'
                    : `Confirmar envio (${willUpload} foto${willUpload !== 1 ? 's' : ''})`}
                </Button>
                <Button variant="outline" onClick={clearPending} disabled={isUploading}>
                  Limpar fila
                </Button>
              </div>
            </div>
          )}

          {/* Success feedback */}
          {uploadDone > 0 && (
            <div className="flex items-center gap-2 text-success text-sm">
              <CheckCircle size={16} />
              {uploadDone} foto{uploadDone !== 1 ? 's' : ''} enviada{uploadDone !== 1 ? 's' : ''} com sucesso!
            </div>
          )}
        </Card>
      )}

      {/* ── Photo Slots Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PHOTO_TYPES.map((type) => {
          const currentUrl = photoUrls[type]
          const isSlotUploading = uploadingSlots.has(type)
          const error = slotErrors[type]

          return (
            <Card key={type} className="p-4">
              <h4 className="font-semibold text-text-primary mb-3 text-center text-sm">
                {PHOTO_LABELS[type]}
                {type === 'main' && <span className="text-accent-primary ml-1">*</span>}
              </h4>

              <div className="relative mb-3">
                {currentUrl ? (
                  // Existing photo — hover to replace or remove
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
                      <Button
                        size="sm"
                        onClick={() => replaceInputRefs.current[type]?.click()}
                        disabled={isSlotUploading}
                      >
                        <Upload size={14} className="mr-1" />
                        Trocar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removePhoto(type)}
                        disabled={isSlotUploading}
                        className="text-danger hover:bg-danger/10"
                      >
                        <X size={14} className="mr-1" />
                        Remover
                      </Button>
                    </div>
                    {isSlotUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                      </div>
                    )}
                    {/* Hidden input for direct replace */}
                    <input
                      ref={(el) => { replaceInputRefs.current[type] = el }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) uploadPhoto(type, f)
                        e.target.value = ''
                      }}
                    />
                  </div>
                ) : (
                  // Empty slot — shows loading if part of a bulk upload
                  <div className={`aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${
                    isSlotUploading
                      ? 'border-accent-primary bg-accent-primary/5'
                      : 'border-background-tertiary'
                  }`}>
                    {isSlotUploading ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-primary border-t-transparent mx-auto mb-2" />
                        <p className="text-sm text-accent-primary">Enviando...</p>
                      </div>
                    ) : (
                      <div className="text-center px-2">
                        <Upload size={22} className="mx-auto text-text-muted mb-1" />
                        <p className="text-xs text-text-muted">Vazio</p>
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
            </Card>
          )
        })}
      </div>

      {/* Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-text-primary font-medium">{uploadedCount}/20 fotos enviadas</p>
            <p className="text-text-secondary text-sm">
              {uploadedCount === 0 && 'Nenhuma foto enviada ainda'}
              {uploadedCount > 0 && uploadedCount < 20 && `${emptySlots.length} slot${emptySlots.length !== 1 ? 's' : ''} disponível${emptySlots.length !== 1 ? 'is' : ''}`}
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
