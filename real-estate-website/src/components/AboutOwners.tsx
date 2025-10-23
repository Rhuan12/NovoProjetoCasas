'use client'

import { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui/Button'
import { Award, Briefcase, Users, Heart, Shield, TrendingUp, CheckCircle } from 'lucide-react'
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

  // Gradient colors for each owner
  const gradientColors = [
    'from-accent-primary to-accent-light',
    'from-success to-success/70',
    'from-warning to-warning/70',
    'from-purple-500 to-purple-300' // Nova cor para o 4º dono
  ]

  const iconColors = [
    'text-accent-primary',
    'text-success',
    'text-warning',
    'text-purple-500' // Nova cor para o 4º dono
  ]

  // Determine grid layout based on number of owners
  const getGridCols = () => {
    if (owners.length === 1) return 'grid-cols-1 max-w-2xl mx-auto'
    if (owners.length === 2) return 'grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto'
    if (owners.length === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    // Para 4 donos: 2x2 em todos os tamanhos
    return 'grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto'
  }

  if (loading) {
    return (
      <section className={`py-20 bg-background-secondary ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-8 bg-background-tertiary rounded w-48 mx-auto mb-4"></div>
            <div className="h-12 bg-background-tertiary rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <Card className="p-8">
                  <div className="h-32 bg-background-tertiary rounded-2xl w-32 mb-4"></div>
                  <div className="h-6 bg-background-tertiary rounded w-48 mb-2"></div>
                  <div className="h-4 bg-background-tertiary rounded w-32 mb-4"></div>
                  <div className="h-20 bg-background-tertiary rounded"></div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // If there are no owners, don't render the section
  if (owners.length === 0) {
    return null
  }

  return (
    <section className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <Badge>Meet Our Story</Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Who We Are
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            A story of dedication, professionalism and commitment to making dreams come true.
          </p>
        </div>

        {/* Owners Grid - Responsive based on number */}
        <div className={`grid ${getGridCols()} gap-8 mb-16`}>
          {owners.map((owner, index) => (
            <Card key={owner.id} className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                {/* Photo */}
                <div className="mb-4">
                  {owner.photo_url ? (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-background-tertiary">
                      <Image
                        src={owner.photo_url}
                        alt={owner.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradientColors[index % 4]} flex items-center justify-center ring-4 ring-background-tertiary`}>
                      <Users size={36} className="text-white" />
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="w-full">
                  <h3 className="text-xl font-bold text-text-primary mb-1">
                    {owner.name}
                  </h3>
                  <Badge variant="success" size="sm" className="mb-3">{owner.role}</Badge>
                  
                  {owner.bio && (
                    <p className="text-text-secondary text-sm mb-4">
                      {owner.bio}
                    </p>
                  )}
                  
                  {owner.achievements && owner.achievements.length > 0 && (
                    <div className="space-y-2">
                      {owner.achievements.slice(0, 3).map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                          <CheckCircle size={14} className={`${iconColors[index % 4]} flex-shrink-0 mt-0.5`} />
                          <span className="text-left">{achievement}</span>
                        </div>
                      ))}
                      {owner.achievements.length > 3 && (
                        <p className="text-xs text-text-muted italic">
                          +{owner.achievements.length - 3} more achievements
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Company Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart size={24} className="text-accent-primary" />
            </div>
            <h4 className="text-lg font-bold text-text-primary mb-2">Passion</h4>
            <p className="text-text-secondary text-sm">
              We love what we do and it shows in every service, 
              every negotiation and every dream fulfilled.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-success" />
            </div>
            <h4 className="text-lg font-bold text-text-primary mb-2">Transparency</h4>
            <p className="text-text-secondary text-sm">
              We believe in relationships based on honesty and clarity. 
              No surprises, just mutual trust.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award size={24} className="text-warning" />
            </div>
            <h4 className="text-lg font-bold text-text-primary mb-2">Excellence</h4>
            <p className="text-text-secondary text-sm">
              We always seek to exceed expectations, deliver more than we promise 
              and create memorable experiences.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}