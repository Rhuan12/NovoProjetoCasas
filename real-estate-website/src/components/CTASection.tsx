'use client'

import { useState } from 'react'
import { Card, Button } from '@/components/ui/Button'
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Zap
} from 'lucide-react'

interface CTASectionProps {
  className?: string
  variant?: 'primary' | 'secondary' | 'gradient'
}

export function CTASection({ className = '', variant = 'gradient' }: CTASectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envio
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
      
      // Reset após 3 segundos
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', phone: '', message: '' })
      }, 3000)
    }, 1500)
  }

  const handleWhatsApp = () => {
    const message = formData.name && formData.message 
      ? `Olá! Meu nome é ${formData.name}. ${formData.message}`
      : 'Olá! Tenho interesse em conhecer os imóveis disponíveis.'
    
    const url = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  if (variant === 'primary') {
    return (
      <section className={`py-20 bg-accent-primary ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap size={16} />
              <span>Atendimento Imediato</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto Para Encontrar Sua Casa dos Sonhos?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Entre em contato agora e descubra como podemos ajudar você a realizar o sonho da casa própria.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-accent-primary hover:bg-white/90 gap-2 text-lg px-8 py-4"
              onClick={handleWhatsApp}
            >
              <MessageCircle size={20} />
              WhatsApp: (11) 99999-9999
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 gap-2 text-lg px-8 py-4"
              onClick={() => window.open('tel:+5511999999999', '_self')}
            >
              <Phone size={20} />
              Ligar Agora
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Resposta em até 2h</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} />
              <span>Atendimento 5 estrelas</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'secondary') {
    return (
      <section className={`py-20 bg-background-secondary ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
                Não Perca Tempo Procurando. 
                <span className="text-accent-primary block">Encontre Conosco!</span>
              </h2>
              
              <p className="text-xl text-text-secondary mb-8">
                Mais de 10 anos conectando pessoas aos seus lares ideais. 
                Experiência, agilidade e os melhores resultados do mercado.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle size={16} className="text-success" />
                  </div>
                  <span className="text-text-primary">15 dias tempo médio</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle size={16} className="text-success" />
                  </div>
                  <span className="text-text-primary">500+ famílias atendidas</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle size={16} className="text-success" />
                  </div>
                  <span className="text-text-primary">98% de satisfação</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <CheckCircle size={16} className="text-success" />
                  </div>
                  <span className="text-text-primary">Suporte completo</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2" onClick={handleWhatsApp}>
                  <MessageCircle size={18} />
                  Falar no WhatsApp
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Phone size={18} />
                  (11) 99999-9999
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  Consulta Gratuita
                </h3>
                <p className="text-text-secondary">
                  Deixe seus dados e entraremos em contato em até 2 horas
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-success" />
                  </div>
                  <h4 className="text-xl font-bold text-success mb-2">Mensagem Enviada!</h4>
                  <p className="text-text-secondary">
                    Entraremos em contato em breve. Obrigado!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      placeholder="Seu WhatsApp"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      className="w-full px-4 py-3 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Como podemos ajudar? (opcional)"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gap-2" 
                    size="lg"
                    loading={isSubmitting}
                    disabled={isSubmitting || !formData.name || !formData.phone}
                  >
                    {isSubmitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        <Mail size={18} />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-text-muted text-sm">
                      <Clock size={14} />
                      <span>Resposta garantida em até 2 horas</span>
                    </div>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>
    )
  }

  // Gradient variant (default)
  return (
    <section className={`py-20 bg-gradient-to-r from-accent-primary via-accent-primary to-accent-light ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Zap size={16} />
            <span>Oportunidade Única</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Sua Casa dos Sonhos
            <span className="block">Está Esperando por Você!</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
            Não deixe para amanhã o que pode ser seu hoje. 
            Entre em contato agora e descubra as melhores oportunidades do mercado imobiliário.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-accent-primary hover:bg-white/90 gap-3 text-lg px-8 py-4 shadow-lg"
              onClick={handleWhatsApp}
            >
              <MessageCircle size={22} />
              <div className="text-left">
                <div className="font-bold">WhatsApp Imediato</div>
                <div className="text-sm opacity-80">(11) 99999-9999</div>
              </div>
              <ArrowRight size={20} />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 gap-3 text-lg px-8 py-4 backdrop-blur-sm"
              onClick={() => window.open('tel:+5511999999999', '_self')}
            >
              <Phone size={22} />
              <div className="text-left">
                <div className="font-bold">Ligar Agora</div>
                <div className="text-sm opacity-80">Atendimento direto</div>
              </div>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white/90 mb-2">
                <Clock size={20} />
                <span className="font-semibold">Resposta Rápida</span>
              </div>
              <p className="text-white/70 text-sm">Atendemos em até 2 horas úteis</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white/90 mb-2">
                <CheckCircle size={20} />
                <span className="font-semibold">Sem Compromisso</span>
              </div>
              <p className="text-white/70 text-sm">Consultoria gratuita e transparente</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white/90 mb-2">
                <Star size={20} />
                <span className="font-semibold">98% Satisfação</span>
              </div>
              <p className="text-white/70 text-sm">Clientes recomendam nosso trabalho</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}