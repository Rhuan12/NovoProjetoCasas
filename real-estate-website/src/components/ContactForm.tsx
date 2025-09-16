import { useState } from 'react'
import { Card, Input, Button } from '@/components/ui/Button'
import { Mail } from 'lucide-react'

interface ContactFormProps {
  propertyId: string
  propertyTitle: string
  onSuccess?: () => void
}

export function ContactForm({ propertyId, propertyTitle, onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    max_budget: '',
    desired_bedrooms: '',
    desired_bathrooms: '',
    message: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          property_id: propertyId,
          max_budget: formData.max_budget ? parseInt(formData.max_budget) : null,
          desired_bedrooms: formData.desired_bedrooms ? parseInt(formData.desired_bedrooms) : null,
          desired_bathrooms: formData.desired_bathrooms ? parseInt(formData.desired_bathrooms) : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar mensagem')
      }

      setSuccess(true)
      onSuccess?.()
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false)
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          max_budget: '',
          desired_bedrooms: '',
          desired_bathrooms: '',
          message: ''
        })
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (success) {
    return (
      <Card className="p-6 text-center">
        <div className="text-success mb-4">
          <Mail size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Mensagem enviada!
        </h3>
        <p className="text-text-secondary text-sm">
          Entraremos em contato em até 2 horas úteis.
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Demonstrar Interesse
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Informações pessoais */}
        <div className="space-y-3">
          <Input
            label="Nome completo"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            placeholder="Seu nome completo"
          />
          
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="seu@email.com"
          />
          
          <Input
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
          />
        </div>

        {/* Mensagem */}
        <div>
          <label className="block text-sm text-text-muted mb-1">Mensagem (opcional)</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={`Tenho interesse no imóvel "${propertyTitle}". Gostaria de agendar uma visita.`}
            className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none text-sm"
            rows={4}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="text-danger text-sm bg-danger/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full" 
          loading={loading}
          disabled={!formData.full_name || !formData.email}
        >
          {loading ? 'Enviando...' : 'Enviar Mensagem'}
        </Button>

        <p className="text-xs text-text-muted text-center">
          Ao enviar, você concorda em ser contatado sobre este imóvel.
        </p>
      </form>
    </Card>
  )
}