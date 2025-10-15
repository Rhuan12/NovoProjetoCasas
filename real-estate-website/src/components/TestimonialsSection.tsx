'use client'

import { useTestimonials } from '@/hooks/useTestimonials'
import { Card } from '@/components/ui/Button'
import { Star, Quote } from 'lucide-react'
import { useState, useEffect } from 'react'

export function TestimonialsSection() {
  const { testimonials, loading } = useTestimonials(true) // Only active
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  if (loading) {
    return (
      <section className="py-20 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent-primary border-t-transparent"></div>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null // Don't show section if there are no testimonials
  }

  return (
    <section className="py-20 bg-background-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            What Our Clients Say
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Check out the experience of those who have already achieved the dream of homeownership with us
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto relative">
          {/* Current Testimonial */}
          <Card className="p-8 md:p-12 relative overflow-hidden">
            {/* Quote Icon */}
            <Quote 
              size={80} 
              className="absolute top-4 left-4 text-accent-primary/10" 
            />

            <div className="relative z-10">
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={
                      i < testimonials[currentIndex].rating
                        ? 'fill-warning text-warning'
                        : 'text-text-muted'
                    }
                  />
                ))}
              </div>

              {/* Testimonial */}
              <blockquote className="text-center mb-8">
                <p className="text-xl md:text-2xl text-text-primary italic leading-relaxed">
                  "{testimonials[currentIndex].testimonial}"
                </p>
              </blockquote>

              {/* Client */}
              <div className="flex items-center justify-center gap-4">
                {testimonials[currentIndex].client_photo_url ? (
                  <img
                    src={testimonials[currentIndex].client_photo_url}
                    alt={testimonials[currentIndex].client_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-accent-primary"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center border-2 border-accent-primary">
                    <span className="text-2xl font-bold text-accent-primary">
                      {testimonials[currentIndex].client_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="text-left">
                  <p className="font-semibold text-text-primary text-lg">
                    {testimonials[currentIndex].client_name}
                  </p>
                  <p className="text-text-secondary text-sm">
                    Satisfied Customer
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Indicators (dots) */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-accent-primary'
                      : 'w-2 bg-text-muted/30 hover:bg-text-muted/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Navigation (arrows) - only if there's more than 1 testimonial */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-background-primary hover:bg-accent-primary text-text-primary hover:text-white p-3 rounded-full shadow-lg transition-all"
                aria-label="Previous testimonial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-background-primary hover:bg-accent-primary text-text-primary hover:text-white p-3 rounded-full shadow-lg transition-all"
                aria-label="Next testimonial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Reviews Summary */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-background-primary px-8 py-4 rounded-full">
            <div className="text-center">
              <p className="text-3xl font-bold text-text-primary">
                {testimonials.length}
              </p>
              <p className="text-sm text-text-secondary">
                Testimonial{testimonials.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="w-px h-12 bg-background-tertiary" />

            <div className="text-center">
              <div className="flex items-center gap-1">
                <p className="text-3xl font-bold text-text-primary">
                  {(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)}
                </p>
                <Star size={24} className="fill-warning text-warning" />
              </div>
              <p className="text-sm text-text-secondary">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}