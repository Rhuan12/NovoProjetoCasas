// src/components/ContactForm.tsx - VERSÃO COMPLETA E CORRIGIDA

'use client'

import { useState } from 'react'
import { Card, Button } from '@/components/ui/Button'
import { MessageCircle, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { 
  createPropertyInterestMessage, 
  openWhatsApp, 
  formatPrice,
  type PropertyData,
  type UserData 
} from '@/lib/whatsapp'

interface ContactFormProps {
  propertyId: string
  propertyTitle: string
  propertyPrice?: number | null
  propertyCity?: string | null
  propertyNeighborhood?: string | null
  propertyBedrooms?: number | null
  propertyBathrooms?: number | null
  propertyAreaSqm?: number | null
  onSuccess?: () => void
}

export function ContactForm({ 
  propertyId, 
  propertyTitle,
  propertyPrice,
  propertyCity,
  propertyNeighborhood,
  propertyBedrooms,
  propertyBathrooms,
  propertyAreaSqm,
  onSuccess 
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    message: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validação básica
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nome é obrigatório'
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Salvar lead no banco E redirecionar para WhatsApp
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // 1. Salvar lead no banco de dados
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: propertyId,
          full_name: formData.full_name.trim(),
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim() || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar mensagem')
      }

      // 2. Preparar dados para o WhatsApp
      const propertyData: PropertyData = {
        id: propertyId,
        title: propertyTitle,
        price: propertyPrice,
        city: propertyCity,
        neighborhood: propertyNeighborhood,
        bedrooms: propertyBedrooms,
        bathrooms: propertyBathrooms,
        area_sqm: propertyAreaSqm
      }

      const userData: UserData = {
        name: formData.full_name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim()
      }

      // 3. Gerar mensagem e abrir WhatsApp
      const message = createPropertyInterestMessage(propertyData, userData)
      openWhatsApp(message)

      // 4. Callback de sucesso
      onSuccess?.()

      // 5. Limpar formulário
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        message: ''
      })

      // 6. Feedback ao usuário
      alert('✅ Seus dados foram salvos! Redirecionando para o WhatsApp...')

    } catch (err) {
      console.error('Erro:', err)
      alert(err instanceof Error ? err.message : 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Formatar localização para preview
  const propertyLocation = [propertyNeighborhood, propertyCity].filter(Boolean).join(', ')

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
          <MessageCircle size={24} className="text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Demonstrar Interesse
          </h3>
          <p className="text-text-secondary text-sm">
            Será redirecionado para o WhatsApp
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome completo */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Nome completo *
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-text-muted" />
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className={`block w-full pl-10 pr-3 py-2 bg-background-secondary border ${
                errors.full_name ? 'border-danger' : 'border-background-tertiary'
              } rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary`}
              disabled={loading}
            />
          </div>
          {errors.full_name && (
            <p className="text-danger text-sm mt-1">{errors.full_name}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            E-mail *
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-text-muted" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className={`block w-full pl-10 pr-3 py-2 bg-background-secondary border ${
                errors.email ? 'border-danger' : 'border-background-tertiary'
              } rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary`}
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="text-danger text-sm mt-1">{errors.email}</p>
          )}
        </div>
        
        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Telefone/WhatsApp *
          </label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-3 text-text-muted" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(85) 99999-9999"
              className={`block w-full pl-10 pr-3 py-2 bg-background-secondary border ${
                errors.phone ? 'border-danger' : 'border-background-tertiary'
              } rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary`}
              disabled={loading}
            />
          </div>
          {errors.phone && (
            <p className="text-danger text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Mensagem (opcional) */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Mensagem adicional (opcional)
          </label>
          <div className="relative">
            <MessageSquare size={18} className="absolute left-3 top-3 text-text-muted" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Ex: Gostaria de agendar uma visita na sexta-feira à tarde..."
              className="block w-full pl-10 pr-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
              rows={3}
              disabled={loading}
            />
          </div>
        </div>

        {/* Informações do imóvel (preview) */}
        <div className="p-3 bg-accent-primary/5 border border-accent-primary/20 rounded-lg">
          <p className="text-xs font-semibold text-accent-primary mb-2">
            📋 INFORMAÇÕES QUE SERÃO ENVIADAS:
          </p>
          <div className="text-xs text-text-secondary space-y-1">
            <p>• Imóvel: {propertyTitle}</p>
            {propertyLocation && <p>• Local: {propertyLocation}</p>}
            {propertyPrice && <p>• Valor: {formatPrice(propertyPrice)}</p>}
            <p>• Seus dados de contato</p>
            <p>• Link do imóvel</p>
          </div>
        </div>

        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full gap-2" 
          loading={loading}
          disabled={loading || !formData.full_name || !formData.email || !formData.phone}
        >
          {loading ? (
            'Processando...'
          ) : (
            <>
              <MessageCircle size={18} />
              Enviar via WhatsApp
            </>
          )}
        </Button>

        <p className="text-xs text-text-muted text-center">
          Ao enviar, você será redirecionado para o WhatsApp com a mensagem preenchida. 
          Seus dados também serão salvos para que possamos entrar em contato.
        </p>
      </form>
    </Card>
  )
}

// ============================================
// BOTÃO WHATSAPP DIRETO (sem formulário)
// ============================================

import { createSimpleInterestMessage } from '@/lib/whatsapp'

export function QuickWhatsAppButton({
  propertyId,
  propertyTitle,
  className = ''
}: {
  propertyId: string
  propertyTitle: string
  className?: string
}) {
  const handleClick = () => {
    const message = createSimpleInterestMessage(propertyTitle, propertyId)
    openWhatsApp(message)
  }

  return (
    <Button onClick={handleClick} className={`gap-2 ${className}`}>
      <MessageCircle size={18} />
      WhatsApp Direto
    </Button>
  )
}