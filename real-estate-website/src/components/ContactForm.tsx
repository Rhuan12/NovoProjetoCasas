// src/components/ContactForm.tsx - ENGLISH VERSION

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

  // Basic validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Name is required'
    } else if (formData.full_name.trim().length < 3) {
      newErrors.full_name = 'Name must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save lead in database AND redirect to WhatsApp
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // 1. Save lead in database
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
        throw new Error(errorData.error || 'Error sending message')
      }

      // 2. Prepare data for WhatsApp
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

      // 3. Generate message and open WhatsApp
      const message = createPropertyInterestMessage(propertyData, userData)
      openWhatsApp(message)

      // 4. Success callback
      onSuccess?.()

      // 5. Clear form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        message: ''
      })

      // 6. User feedback
      alert('✅ Your information has been saved! Redirecting to WhatsApp...')

    } catch (err) {
      console.error('Error:', err)
      alert(err instanceof Error ? err.message : 'Error processing request')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Format location for preview
  const propertyLocation = [propertyNeighborhood, propertyCity].filter(Boolean).join(', ')

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
          <MessageCircle size={24} className="text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Show Interest
          </h3>
          <p className="text-text-secondary text-sm">
            You'll be redirected to WhatsApp
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Full name *
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-3 text-text-muted" />
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Your full name"
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
            Email *
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-text-muted" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
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
        
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Phone/WhatsApp *
          </label>
          <div className="relative">
            <Phone size={18} className="absolute left-3 top-3 text-text-muted" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (816) 890-1804"
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

        {/* Message (optional) */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Additional message (optional)
          </label>
          <div className="relative">
            <MessageSquare size={18} className="absolute left-3 top-3 text-text-muted" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g., I'd like to schedule a visit on Friday afternoon..."
              className="block w-full pl-10 pr-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
              rows={3}
              disabled={loading}
            />
          </div>
        </div>

        {/* Property information (preview) */}
        <div className="p-3 bg-accent-primary/5 border border-accent-primary/20 rounded-lg">
          <p className="text-xs font-semibold text-accent-primary mb-2">
            📋 INFORMATION TO BE SENT:
          </p>
          <div className="text-xs text-text-secondary space-y-1">
            <p>• Property: {propertyTitle}</p>
            {propertyLocation && <p>• Location: {propertyLocation}</p>}
            {propertyPrice && <p>• Price: {formatPrice(propertyPrice)}</p>}
            <p>• Your contact information</p>
            <p>• Property link</p>
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
            'Processing...'
          ) : (
            <>
              <MessageCircle size={18} />
              Send via WhatsApp
            </>
          )}
        </Button>

        <p className="text-xs text-text-muted text-center">
          By submitting, you'll be redirected to WhatsApp with a pre-filled message. 
          Your information will also be saved so we can contact you.
        </p>
      </form>
    </Card>
  )
}

// ============================================
// DIRECT WHATSAPP BUTTON (without form)
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
      Direct WhatsApp
    </Button>
  )
}