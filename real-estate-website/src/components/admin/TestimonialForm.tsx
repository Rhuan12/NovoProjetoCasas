'use client'

import { useState, useEffect } from 'react'
import { Card, Input, Button } from '@/components/ui/Button'
import type { Testimonial, TestimonialFormData } from '@/types/testimonial'
import { Star } from 'lucide-react'

interface TestimonialFormProps {
  testimonial?: Testimonial
  onSubmit: (data: TestimonialFormData) => Promise<{ success: boolean; error?: string }>
  onCancel?: () => void
  submitText?: string
}

export function TestimonialForm({ 
  testimonial, 
  onSubmit, 
  onCancel,
  submitText = 'Salvar'
}: TestimonialFormProps) {
  const [formData, setFormData] = useState<TestimonialFormData>({
    client_name: testimonial?.client_name || '',
    client_photo_url: testimonial?.client_photo_url || '',
    testimonial: testimonial?.testimonial || '',
    rating: testimonial?.rating || 5,
    property_id: testimonial?.property_id || '',
    is_active: testimonial?.is_active ?? true
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await onSubmit({
      ...formData,
      client_photo_url: formData.client_photo_url || undefined,
      property_id: formData.property_id || undefined
    })

    setLoading(false)

    if (result.success) {
      setSuccess(true)
      if (!testimonial) {
        // Limpar form se for novo
        setFormData({
          client_name: '',
          client_photo_url: '',
          testimonial: '',
          rating: 5,
          property_id: '',
          is_active: true
        })
      }
    } else {
      setError(result.error || 'Erro ao salvar depoimento')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome do Cliente */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Nome do Cliente *
        </label>
        <Input
          type="text"
          value={formData.client_name}
          onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
          placeholder="Ex: Maria Silva"
          required
        />
      </div>

      {/* URL da Foto */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          URL da Foto do Cliente (opcional)
        </label>
        <Input
          type="url"
          value={formData.client_photo_url}
          onChange={(e) => setFormData({ ...formData, client_photo_url: e.target.value })}
          placeholder="https://..."
        />
        <p className="text-xs text-text-muted mt-1">
          Cole a URL de uma foto do cliente (se disponível)
        </p>
      </div>

      {/* Depoimento */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Depoimento *
        </label>
        <textarea
          value={formData.testimonial}
          onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
          placeholder="Escreva o depoimento do cliente..."
          required
          rows={4}
          className="w-full px-4 py-3 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
        />
      </div>

      {/* Avaliação (Estrelas) */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Avaliação *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className="focus:outline-none"
            >
              <Star
                size={32}
                className={star <= formData.rating ? 'fill-warning text-warning' : 'text-text-muted'}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-text-secondary mt-2">
          Avaliação: {formData.rating} estrela{formData.rating !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ID do Imóvel (opcional) */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          ID do Imóvel (opcional)
        </label>
        <Input
          type="text"
          value={formData.property_id}
          onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
          placeholder="Cole o ID do imóvel se o depoimento for específico"
        />
        <p className="text-xs text-text-muted mt-1">
          Deixe vazio para depoimento geral da imobiliária
        </p>
      </div>

      {/* Ativo/Inativo */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-4 h-4 text-accent-primary bg-background-secondary border-background-tertiary rounded focus:ring-accent-primary"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-text-primary">
          Depoimento ativo (visível no site)
        </label>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="p-4 bg-error/10 border border-error rounded-lg">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-success/10 border border-success rounded-lg">
          <p className="text-success text-sm">Depoimento salvo com sucesso!</p>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Salvando...' : submitText}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}