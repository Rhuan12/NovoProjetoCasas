'use client'

import { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui/Button'
import { Star, Quote, ChevronLeft, ChevronRight, Users } from 'lucide-react'

interface TestimonialData {
  id: string
  name: string
  location: string
  rating: number
  text: string
  property: string
  avatar?: string
  timeframe?: string
}

interface TestimonialsProps {
  className?: string
}

const testimonials: TestimonialData[] = [
  {
    id: '1',
    name: 'Maria Silva',
    location: 'Copacabana',
    rating: 5,
    text: 'Experiência incrível! Em apenas 12 dias venderam minha casa pelo valor que eu queria. Atendimento excepcional e muito profissionalismo. A equipe esteve presente em cada etapa.',
    property: 'Casa 3 quartos',
    timeframe: 'Vendido em 12 dias'
  },
  {
    id: '2',
    name: 'João Santos',
    location: 'Ipanema',
    rating: 5,
    text: 'Encontrei o apartamento dos meus sonhos! A equipe foi super atenciosa e me ajudou em todo o processo de financiamento. Desde a primeira visita até as chaves, tudo perfeito.',
    property: 'Apartamento 2 quartos',
    timeframe: 'Comprou em 2024'
  },
  {
    id: '3',
    name: 'Ana Costa',
    location: 'Barra da Tijuca',
    rating: 5,
    text: 'Profissionalismo do início ao fim. Negociaram o melhor preço e cuidaram de toda a documentação. Não poderia ter escolhido melhor. Recomendo de olhos fechados!',
    property: 'Casa com piscina',
    timeframe: 'Comprou em 2024'
  },
  {
    id: '4',
    name: 'Carlos Mendes',
    location: 'Leblon',
    rating: 5,
    text: 'Depois de 6 meses tentando vender com outra imobiliária, eles conseguiram em 3 semanas! Marketing diferenciado, fotos profissionais e atendimento nota 10.',
    property: 'Cobertura 4 quartos',
    timeframe: 'Vendido em 21 dias'
  },
  {
    id: '5',
    name: 'Fernanda Lima',
    location: 'Tijuca',
    rating: 5,
    text: 'Primeira experiência comprando imóvel e me senti muito segura. Explicaram cada detalhe, me orientaram sobre financiamento e estiveram sempre disponíveis para dúvidas.',
    property: 'Apartamento 1 quarto',
    timeframe: 'Primeiro imóvel'
  }
]

export function Testimonials({ className = '' }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating ? 'text-warning fill-current' : 'text-background-tertiary'
        }`}
      />
    ))
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-4">
            <Badge>Depoimentos Reais</Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Histórias reais de pessoas que realizaram seus sonhos conosco. 
            Cada depoimento representa nossa dedicação e compromisso.
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <Card 
            className="p-8 md:p-12"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Quote Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center">
                <Quote size={32} className="text-accent-primary" />
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center items-center gap-1 mb-6">
              {renderStars(currentTestimonial.rating)}
              <span className="ml-2 text-text-muted text-sm">
                ({currentTestimonial.rating}/5)
              </span>
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-xl md:text-2xl text-text-primary text-center font-medium leading-relaxed mb-8">
              "{currentTestimonial.text}"
            </blockquote>

            {/* Client Info */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-white" />
              </div>
              
              <div className="font-bold text-text-primary text-lg">
                {currentTestimonial.name}
              </div>
              
              <div className="text-text-secondary">
                {currentTestimonial.property} • {currentTestimonial.location}
              </div>
              
              {currentTestimonial.timeframe && (
                <div className="mt-2">
                  <Badge variant="success">
                    {currentTestimonial.timeframe}
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background-secondary border border-background-tertiary rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-background-tertiary transition-colors"
            aria-label="Depoimento anterior"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background-secondary border border-background-tertiary rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-background-tertiary transition-colors"
            aria-label="Próximo depoimento"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-accent-primary'
                  : 'bg-background-tertiary hover:bg-text-muted'
              }`}
              aria-label={`Ir para depoimento ${index + 1}`}
            />
          ))}
        </div>

        {/* Mini Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:bg-background-tertiary/50 transition-colors">
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              {/* Quote */}
              <p className="text-text-secondary mb-4 line-clamp-3">
                "{testimonial.text.substring(0, 120)}..."
              </p>
              
              {/* Client */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={16} className="text-accent-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-text-primary text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-text-muted text-xs truncate">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-primary mb-2">4.9/5</div>
              <div className="text-text-secondary text-sm">Avaliação Google</div>
              <div className="flex justify-center items-center gap-1 mt-2">
                {renderStars(5)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">98%</div>
              <div className="text-text-secondary text-sm">Recomendariam</div>
              <div className="text-success text-sm mt-1">Pesquisa de satisfação</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">500+</div>
              <div className="text-text-secondary text-sm">Famílias Atendidas</div>
              <div className="text-warning text-sm mt-1">Desde 2014</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-accent-primary/10 to-accent-light/10 border-accent-primary/20">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Quer Ser o Próximo Depoimento de Sucesso?
            </h3>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Junte-se às centenas de famílias que já realizaram o sonho da casa própria conosco. 
              Sua história de sucesso pode ser a próxima!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-accent-primary text-white px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors font-medium"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                Começar Agora no WhatsApp
              </button>
              <button 
                className="border border-accent-primary text-accent-primary px-6 py-3 rounded-lg hover:bg-accent-primary/10 transition-colors font-medium"
                onClick={() => window.open('tel:+5511999999999', '_self')}
              >
                Ligar: (11) 99999-9999
              </button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}