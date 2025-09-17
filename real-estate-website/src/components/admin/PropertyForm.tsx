'use client'

import { useState, useEffect } from 'react'
import { Property } from '@/lib/supabase'
import { Card, Input, Button } from '@/components/ui/Button'
import { AlertCircle, Save, MapPin } from 'lucide-react'

interface PropertyFormProps {
  property?: Property | null
  onSubmit: (data: any) => Promise<void>
  loading?: boolean
  error?: string | null
  submitText?: string
}

export function PropertyForm({ 
  property, 
  onSubmit, 
  loading = false, 
  error, 
  submitText = "Salvar" 
}: PropertyFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area_sqm: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    status: 'available' as 'available' | 'sold' | 'reserved'
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price?.toString() || '',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        area_sqm: property.area_sqm?.toString() || '',
        address: property.address || '',
        neighborhood: property.neighborhood || '',
        city: property.city || '',
        state: property.state || '',
        status: property.status || 'available'
      })
    }
  }, [property])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro específico quando o usuário começa a digitar
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.title.trim()) {
      errors.title = 'Título é obrigatório'
    }

    if (!formData.city.trim()) {
      errors.city = 'Cidade é obrigatória'
    }

    if (formData.price && isNaN(Number(formData.price))) {
      errors.price = 'Preço deve ser um número'
    }

    if (formData.bedrooms && isNaN(Number(formData.bedrooms))) {
      errors.bedrooms = 'Quartos deve ser um número'
    }

    if (formData.bathrooms && isNaN(Number(formData.bathrooms))) {
      errors.bathrooms = 'Banheiros deve ser um número'
    }

    if (formData.area_sqm && isNaN(Number(formData.area_sqm))) {
      errors.area_sqm = 'Área deve ser um número'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      price: formData.price ? Number(formData.price) : null,
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
      area_sqm: formData.area_sqm ? Number(formData.area_sqm) : null,
      address: formData.address.trim() || null,
      neighborhood: formData.neighborhood.trim() || null,
      city: formData.city.trim(),
      state: formData.state.trim() || null,
      status: formData.status
    }

    await onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Informações Básicas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Título do Imóvel *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={formErrors.title}
              placeholder="Ex: Casa Moderna com Piscina"
              required
            />
          </div>

          <Input
            label="Preço (R$)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={formErrors.price}
            placeholder="850000"
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            >
              <option value="available">Disponível</option>
              <option value="reserved">Reservado</option>
              <option value="sold">Vendido</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">
              Descrição
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva as principais características do imóvel..."
              className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
              rows={4}
            />
          </div>
        </div>
      </Card>

      {/* Características */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Características
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Quartos"
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
            error={formErrors.bedrooms}
            placeholder="3"
            min="0"
          />

          <Input
            label="Banheiros"
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
            error={formErrors.bathrooms}
            placeholder="2"
            min="0"
          />

          <Input
            label="Área Total (m²)"
            name="area_sqm"
            type="number"
            value={formData.area_sqm}
            onChange={handleChange}
            error={formErrors.area_sqm}
            placeholder="150"
            min="0"
          />
        </div>
      </Card>

      {/* Localização */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <MapPin size={20} />
          Localização
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Endereço Completo"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Rua das Flores, 123"
            />
          </div>

          <Input
            label="Bairro"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            placeholder="Centro"
          />

          <Input
            label="Cidade *"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={formErrors.city}
            placeholder="São Paulo"
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Estado"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="SP"
            />
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="p-4 border-danger/20 bg-danger/5">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-danger" />
            <div>
              <h4 className="font-semibold text-danger">Erro ao salvar</h4>
              <p className="text-danger text-sm">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Submit */}
      <div className="flex justify-end gap-4 pt-6 border-t border-background-tertiary">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="gap-2"
        >
          <Save size={16} />
          {loading ? 'Salvando...' : submitText}
        </Button>
      </div>
    </form>
  )
}