'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, Home, ArrowRight } from 'lucide-react'
import { PropertyCard } from '@/components/PropertyCard'
import { Property } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface FeaturedCarouselProps {
  properties: Property[]
  loading: boolean
}

export function FeaturedCarousel({ properties, loading }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  // Quantos cards mostrar dependendo do tamanho da tela
  // Controlado via CSS: no mobile 1, tablet 2, desktop 3
  // Mas para a lógica de dots e navegação usamos o total de steps
  const totalSlides = properties.length
  const maxIndex = Math.max(0, totalSlides - 1)

  // Auto-play a cada 4 segundos
  useEffect(() => {
    if (isPaused || loading || properties.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused, loading, properties.length, maxIndex])

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
  }, [maxIndex])

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? maxIndex : i - 1))
  }, [maxIndex])

  const next = useCallback(() => {
    setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1))
  }, [maxIndex])

  // --- Touch / Swipe ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchEndX(e.touches[0].clientX) // reset
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    const diff = touchStartX - touchEndX
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev()
    }
  }

  // ============================
  // LOADING SKELETON
  // ============================
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="rounded-2xl overflow-hidden border border-background-tertiary">
              <div className="h-64 bg-background-tertiary" />
              <div className="p-5 space-y-3 bg-background-secondary">
                <div className="h-5 bg-background-tertiary rounded w-2/3" />
                <div className="h-3 bg-background-tertiary rounded w-1/2" />
                <div className="h-4 bg-background-tertiary rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // ============================
  // EMPTY STATE — sem casas disponíveis
  // ============================
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        {/* Ícone animado */}
        <div className="w-24 h-24 rounded-full bg-background-secondary border-2 border-warning/40 flex items-center justify-center mb-6 animate-pulse-slow">
          <Home size={44} className="text-warning" />
        </div>

        {/* Título */}
        <h3 className="text-2xl font-bold text-text-primary mb-3">
          No properties available right now
        </h3>

        {/* Descrição */}
        <p className="text-text-secondary max-w-md leading-relaxed mb-8">
          Our listings update frequently. Check back soon or sign up to be notified
          when a new property hits the market.
        </p>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/imoveis">
            <Button variant="primary" size="lg" className="gap-2">
              Browse All Listings
              <ArrowRight size={16} />
            </Button>
          </Link>
          <a
            href="https://wa.me/18168901804"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg">
              Be Notified via WhatsApp
            </Button>
          </a>
        </div>
      </div>
    )
  }

  // ============================
  // CARROSSEL
  // ============================
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Track wrapper — clip overflow */}
      <div className="overflow-hidden rounded-2xl">
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {properties.map((property) => (
            <div
              key={property.id}
              className="w-full flex-shrink-0 px-2"
              style={{ minWidth: '100%' }}
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Setas (prev / next) ── */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous property"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
                       w-10 h-10 rounded-full bg-background-secondary/90 backdrop-blur-sm
                       border border-background-tertiary
                       flex items-center justify-center
                       text-text-primary hover:bg-accent-primary hover:text-white
                       transition-colors duration-200 shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={next}
            aria-label="Next property"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
                       w-10 h-10 rounded-full bg-background-secondary/90 backdrop-blur-sm
                       border border-background-tertiary
                       flex items-center justify-center
                       text-text-primary hover:bg-accent-primary hover:text-white
                       transition-colors duration-200 shadow-lg"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* ── Dots indicadores ── */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {properties.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to property ${i + 1}`}
              className={`
                rounded-full transition-all duration-300
                ${i === currentIndex
                  ? 'w-6 h-2.5 bg-accent-primary'   // dot ativo: mais largo + laranja
                  : 'w-2.5 h-2.5 bg-background-tertiary hover:bg-text-muted'
                }
              `}
            />
          ))}
        </div>
      )}

      {/* ── Contador "1 / 6" ── */}
      <p className="text-center text-text-muted text-sm mt-3">
        {currentIndex + 1} of {totalSlides}
      </p>
    </div>
  )
}
