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
    'from-warning to-warning/70'
  ]

  const iconColors = [
    'text-accent-primary',
    'text-success',
    'text-warning'
  ]

  // Determine grid layout based on number of owners
  const getGridCols = () => {
    if (owners.length === 1) return 'grid-cols-1 max-w-2xl mx-auto'
    if (owners.length === 2) return 'grid-cols-1 lg:grid-cols-2'
    return 'grid-cols-1 lg:grid-cols-3'
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
            <Card key={owner.id} className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Photo */}
                <div className="flex-shrink-0">
                  {owner.photo_url ? (
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden">
                      <Image
                        src={owner.photo_url}
                        alt={owner.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  ) : (
                    <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${gradientColors[index % 3]} flex items-center justify-center`}>
                      <Users size={48} className="text-white" />
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    {owner.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="success" size="sm">{owner.role}</Badge>
                  </div>
                  
                  {owner.bio && (
                    <p className="text-text-secondary mb-4">
                      {owner.bio}
                    </p>
                  )}
                  
                  {owner.achievements && owner.achievements.length > 0 && (
                    <div className="space-y-2">
                      {owner.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-text-secondary">
                          <CheckCircle size={16} className={iconColors[index % 3]} />
                          <span>{achievement}</span>
                        </div>
                      ))}
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