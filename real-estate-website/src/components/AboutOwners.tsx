'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Button'
import { Heart, Shield, Award } from 'lucide-react'
import Image from 'next/image'

interface Owner {
  id: string
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  achievements: string[]
  display_order: number
  is_active: boolean
}

interface AboutOwnersProps {
  className?: string
}

export function AboutOwners({ className = '' }: AboutOwnersProps) {
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    try {
      const response = await fetch('/api/owners')
      const data = await response.json()
      setOwners(data.owners || [])
    } catch (error) {
      console.error('Error loading owners:', error)
    } finally {
      setLoading(false)
    }
  }

  // Determine grid layout based on number of owners
  const getGridCols = () => {
    if (owners.length === 1) return 'grid-cols-1 max-w-2xl mx-auto'
    if (owners.length === 2) return 'grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto'
    if (owners.length === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    // Para 4 donos: 2x2
    return 'grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto'
  }

  if (loading) {
    return (
      <section className={`py-20 bg-background-primary ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-background-tertiary rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-12 bg-background-tertiary rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-warning/20 rounded-2xl p-8 h-96"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (owners.length === 0) {
    return null
  }

  return (
    <section className={`py-20 bg-background-primary ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-primary mb-4">
            Who We Are
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            A story of dedication, professionalism and commitment to making dreams come true.
          </p>
        </div>

        {/* Owners Grid - ESTILO PDF COM FUNDO LARANJA */}
        <div className={`grid ${getGridCols()} gap-8 mb-16`}>
          {owners.map((owner, index) => (
            <div 
              key={owner.id} 
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning to-warning/80 p-8 hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Photo - Grande e centralizada */}
                <div className="mb-6">
                  {owner.photo_url ? (
                    <div className="relative w-40 h-40 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl">
                      <Image
                        src={owner.photo_url}
                        alt={owner.name}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-2xl bg-white/20 flex items-center justify-center ring-4 ring-white shadow-xl">
                      <span className="text-6xl text-white font-bold">
                        {owner.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Name & Role */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {owner.name}
                  </h3>
                  <div className="inline-block bg-white/90 px-4 py-1 rounded-full">
                    <span className="text-sm font-semibold text-warning">
                      {owner.role}
                    </span>
                  </div>
                </div>
                
                {/* Bio */}
                {owner.bio && (
                  <p className="text-white/90 text-sm leading-relaxed max-w-md">
                    {owner.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Company Values - ESTILO PDF */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-background-secondary border-2 border-accent-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Passion */}
              <div className="text-center">
                <div className="w-16 h-16 bg-warning/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart size={32} className="text-warning" />
                </div>
                <h4 className="text-lg font-bold text-text-primary mb-2">Passion</h4>
                <p className="text-text-secondary text-sm">
                  We love what we do and it shows in every service, 
                  every negotiation and every dream fulfilled.
                </p>
              </div>

              {/* Transparency */}
              <div className="text-center">
                <div className="w-16 h-16 bg-warning/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} className="text-warning" />
                </div>
                <h4 className="text-lg font-bold text-text-primary mb-2">Transparency</h4>
                <p className="text-text-secondary text-sm">
                  We believe in relationships based on honesty and clarity. 
                  No surprises, just mutual trust.
                </p>
              </div>

              {/* Excellence */}
              <div className="text-center">
                <div className="w-16 h-16 bg-warning/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award size={32} className="text-warning" />
                </div>
                <h4 className="text-lg font-bold text-text-primary mb-2">Excellence</h4>
                <p className="text-text-secondary text-sm">
                  We always seek to exceed expectations, deliver more 
                  than we promise and create memorable experiences.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}