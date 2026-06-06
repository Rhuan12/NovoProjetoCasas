'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Phone, MapPin, AlertTriangle, Upload, X,
  CheckCircle, Wrench, Zap, Droplets, Wind, Settings,
} from 'lucide-react'
import Link from 'next/link'
import { Button, Card } from '@/components/ui/Button'
import { Header } from '@/components/Header'

type Category = 'electrical' | 'plumbing' | 'hvac' | 'general'
type Priority = 'emergency' | 'high' | 'medium' | 'slow'
type VisitTime = 'morning' | 'afternoon' | 'evening' | 'anytime'

const CATEGORIES = [
  { value: 'electrical' as Category, label: 'Electrical', icon: Zap },
  { value: 'plumbing' as Category, label: 'Plumbing', icon: Droplets },
  { value: 'hvac' as Category, label: 'Mechanical / HVAC', icon: Wind },
  { value: 'general' as Category, label: 'General Maintenance', icon: Settings },
]

const PRIORITIES: { value: Priority; label: string; activeClass: string }[] = [
  { value: 'emergency', label: 'Emergency', activeClass: 'border-danger bg-danger/10 text-danger' },
  { value: 'high', label: 'High', activeClass: 'border-orange-400 bg-orange-400/10 text-orange-400' },
  { value: 'medium', label: 'Medium', activeClass: 'border-warning bg-warning/10 text-warning' },
  { value: 'slow', label: 'Slow', activeClass: 'border-success bg-success/10 text-success' },
]

const VISIT_TIMES = [
  { value: 'morning' as VisitTime, label: 'Morning' },
  { value: 'afternoon' as VisitTime, label: 'Afternoon' },
  { value: 'evening' as VisitTime, label: 'Evening' },
  { value: 'anytime' as VisitTime, label: 'Anytime' },
]

export default function ResidentPortalPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [description, setDescription] = useState('')
  const [visitTime, setVisitTime] = useState<VisitTime | ''>('')
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const clearError = (key: string) =>
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n })

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!phoneNumber.trim()) newErrors.phone_number = 'Phone number is required'
    if (!propertyAddress.trim()) newErrors.property_address = 'Property address is required'
    if (!category) newErrors.category = 'Please select a maintenance category'
    if (!priority) newErrors.priority = 'Please select a priority level'
    if (!description.trim()) newErrors.description = 'Please describe the issue'
    if (!visitTime) newErrors.visitTime = 'Please select a preferred visit time'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
    setPhotos(prev => [...prev, ...files])
    setPhotoPreviewUrls(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
    if (e.target) e.target.value = ''
  }

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviewUrls[index])
    setPhotos(prev => prev.filter((_, i) => i !== index))
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const uploadPhotos = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const file of photos) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('maintenance-photos')
        .upload(fileName, file, { contentType: file.type })
      if (error) throw new Error(`Failed to upload photo: ${error.message}`)
      const { data } = supabase.storage.from('maintenance-photos').getPublicUrl(fileName)
      urls.push(data.publicUrl)
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const uploadedUrls = await uploadPhotos()
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber.trim(),
          property_address: propertyAddress.trim(),
          maintenance_category: category,
          priority_level: priority,
          description: description.trim(),
          preferred_visit_time: visitTime,
          photos: uploadedUrls,
        }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit request')
      }
      setSubmitted(true)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error submitting request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setPhoneNumber('')
    setPropertyAddress('')
    setCategory('')
    setPriority('')
    setDescription('')
    setVisitTime('')
    photoPreviewUrls.forEach(url => URL.revokeObjectURL(url))
    setPhotos([])
    setPhotoPreviewUrls([])
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background-primary">
        <Header />
        <div className="flex items-center justify-center p-4 py-20">
        <Card className="max-w-md w-full p-10 text-center">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={44} className="text-success" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">Request Submitted!</h2>
          <p className="text-text-secondary mb-6">
            Your maintenance request has been received. Our team will review it and contact you shortly.
          </p>
          <Link href="/" className="block">
            <Button className="w-full">
              Back to Home
            </Button>
          </Link>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      <div className="py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary/10 rounded-2xl mb-4">
            <Wrench size={32} className="text-accent-primary" />
          </div>
          <p className="text-accent-primary font-bold text-xs uppercase tracking-widest mb-2">
            Resident Portal
          </p>
          <h1 className="text-3xl font-bold text-text-primary">Maintenance Request</h1>
          <p className="text-text-secondary mt-1">MW Homes KC</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contact Info */}
          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                1. Phone Number *
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => { setPhoneNumber(e.target.value); clearError('phone_number') }}
                  placeholder="(816) 000-0000"
                  className={`block w-full pl-9 pr-3 py-2.5 bg-background-tertiary border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors ${errors.phone_number ? 'border-danger' : 'border-background-tertiary'}`}
                  disabled={loading}
                />
              </div>
              {errors.phone_number && <p className="text-danger text-xs mt-1">{errors.phone_number}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-1.5">
                2. Property Address *
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={e => { setPropertyAddress(e.target.value); clearError('property_address') }}
                  placeholder="123 Main St, Kansas City, MO"
                  className={`block w-full pl-9 pr-3 py-2.5 bg-background-tertiary border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary transition-colors ${errors.property_address ? 'border-danger' : 'border-background-tertiary'}`}
                  disabled={loading}
                />
              </div>
              {errors.property_address && <p className="text-danger text-xs mt-1">{errors.property_address}</p>}
            </div>
          </Card>

          {/* Maintenance Category */}
          <Card className="p-6">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
              Select Maintenance Category *
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon
                const isSelected = category === cat.value
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => { setCategory(cat.value); clearError('category') }}
                    className={`p-3.5 rounded-lg border text-sm font-medium text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                        : 'border-background-tertiary text-text-secondary hover:border-accent-primary/40 hover:text-text-primary'
                    }`}
                    disabled={loading}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-accent-primary border-accent-primary' : 'border-text-muted'}`}>
                      {isSelected && <div className="w-2 h-2 bg-black rounded-sm" />}
                    </div>
                    <Icon size={15} className="flex-shrink-0" />
                    <span className="leading-tight">{cat.label}</span>
                  </button>
                )
              })}
            </div>
            {errors.category && <p className="text-danger text-xs mt-2">{errors.category}</p>}
          </Card>

          {/* Priority Level */}
          <Card className="p-6">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
              Priority Level *
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {PRIORITIES.map(p => {
                const isSelected = priority === p.value
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => { setPriority(p.value); clearError('priority') }}
                    className={`p-3.5 rounded-lg border text-sm font-medium text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? p.activeClass
                        : 'border-background-tertiary text-text-secondary hover:border-background-tertiary/80 hover:text-text-primary'
                    }`}
                    disabled={loading}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-current' : 'border-text-muted'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                    </div>
                    {p.label}
                  </button>
                )
              })}
            </div>
            {errors.priority && <p className="text-danger text-xs mt-2">{errors.priority}</p>}

            {priority === 'emergency' && (
              <div className="mt-4 p-4 bg-danger/10 border border-danger/30 rounded-lg flex gap-3">
                <AlertTriangle size={20} className="text-danger flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-300 font-semibold mb-1">
                    This is an emergency — call us now!
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    If this involves flooding, fire, electrical hazards, or no heat during winter, please call immediately.
                  </p>
                  <a
                    href="tel:+18168901804"
                    className="inline-flex items-center gap-2 mt-3 text-danger font-bold text-sm hover:text-red-300 transition-colors"
                  >
                    <Phone size={14} />
                    (816) 890-1804
                  </a>
                </div>
              </div>
            )}
          </Card>

          {/* Description */}
          <Card className="p-6">
            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
              Describe the Issue *
            </label>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); clearError('description') }}
              placeholder="Please describe the issue in detail..."
              rows={5}
              className={`w-full px-3 py-2.5 bg-background-tertiary border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none transition-colors ${errors.description ? 'border-danger' : 'border-background-tertiary'}`}
              disabled={loading}
            />
            {errors.description && <p className="text-danger text-xs mt-1">{errors.description}</p>}
          </Card>

          {/* Upload Photos */}
          <Card className="p-6">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
              Upload Photos
            </h2>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-background-tertiary rounded-lg p-8 flex flex-col items-center gap-3 hover:border-accent-primary/40 transition-colors group"
              disabled={loading}
            >
              <div className="w-12 h-12 bg-background-tertiary rounded-xl flex items-center justify-center group-hover:bg-accent-primary/10 transition-colors">
                <Upload size={24} className="text-text-muted group-hover:text-accent-primary transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-text-secondary text-sm">Click to upload photos</p>
                <p className="text-text-muted text-xs mt-1">JPEG, PNG or WebP</p>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
            {photoPreviewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {photoPreviewUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-background-tertiary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center hover:bg-black transition-colors"
                      disabled={loading}
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Preferred Visit Time */}
          <Card className="p-6">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
              Preferred Visit Time *
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {VISIT_TIMES.map(vt => {
                const isSelected = visitTime === vt.value
                return (
                  <button
                    key={vt.value}
                    type="button"
                    onClick={() => { setVisitTime(vt.value); clearError('visitTime') }}
                    className={`p-3.5 rounded-lg border text-sm font-medium text-left transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                        : 'border-background-tertiary text-text-secondary hover:border-accent-primary/40 hover:text-text-primary'
                    }`}
                    disabled={loading}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-accent-primary border-accent-primary' : 'border-text-muted'}`}>
                      {isSelected && <div className="w-2 h-2 bg-black rounded-sm" />}
                    </div>
                    {vt.label}
                  </button>
                )
              })}
            </div>
            {errors.visitTime && <p className="text-danger text-xs mt-2">{errors.visitTime}</p>}
          </Card>

          {/* Emergency note */}
          <div className="p-4 bg-background-secondary border border-background-tertiary rounded-lg flex gap-3">
            <AlertTriangle size={15} className="text-warning flex-shrink-0 mt-0.5" />
            <p className="text-xs text-text-muted leading-relaxed">
              <span className="font-semibold text-text-secondary">Note: </span>
              If this is an emergency involving flooding, fire, electrical hazards, or no heat during winter, please call immediately at{' '}
              <a href="tel:+18168901804" className="text-accent-primary font-semibold hover:underline">
                (816) 890-1804
              </a>
            </p>
          </div>

          {/* Privacy disclosure */}
          <p className="text-xs text-text-muted text-center leading-relaxed">
            By submitting this form, you agree to our{' '}
            <Link href="/privacy-policy" className="text-accent-primary hover:underline font-medium">
              Privacy Policy
            </Link>
            . We use your information solely to process and respond to your maintenance request.
          </p>

          <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Maintenance Request'}
          </Button>
        </form>
      </div>
      </div>
    </div>
  )
}
