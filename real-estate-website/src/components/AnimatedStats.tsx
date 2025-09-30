'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/Button'
import { TrendingUp, Users, Clock, Award, Building, CheckCircle } from 'lucide-react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  isVisible: boolean
}

function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '', isVisible }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!isVisible) return
    
    let startTime: number
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function para suavizar a animação
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(end * easeOut))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isVisible])
  
  return (
    <span className="font-bold text-3xl md:text-4xl">
      {prefix}{count.toLocaleString('pt-BR')}{suffix}
    </span>
  )
}

interface StatItemProps {
  icon: React.ReactNode
  value: number
  label: string
  sublabel?: string
  suffix?: string
  prefix?: string
  color?: 'blue' | 'green' | 'yellow' | 'purple'
  isVisible: boolean
}

function StatItem({ 
  icon, 
  value, 
  label, 
  sublabel, 
  suffix = '', 
  prefix = '',
  color = 'blue',
  isVisible 
}: StatItemProps) {
  const colorClasses = {
    blue: 'text-accent-primary',
    green: 'text-success', 
    yellow: 'text-warning',
    purple: 'text-purple-400'
  }
  
  return (
    <div className="text-center group">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-current/10 mb-4 group-hover:scale-110 transition-transform duration-300 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className={`mb-2 ${colorClasses[color]}`}>
        <AnimatedCounter 
          end={value} 
          suffix={suffix} 
          prefix={prefix}
          isVisible={isVisible}
        />
      </div>
      <div className="text-text-primary font-semibold mb-1">{label}</div>
      {sublabel && (
        <div className="text-text-muted text-sm">{sublabel}</div>
      )}
    </div>
  )
}

interface AnimatedStatsProps {
  availableCount: number
  soldCount: number
  averageDays?: number
  satisfactionRate?: number
  className?: string
}

export function AnimatedStats({ 
  availableCount, 
  soldCount, 
  averageDays = 15,
  satisfactionRate = 98,
  className = ''
}: AnimatedStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={sectionRef} className={className}>
      {/* Stats Grid Simples */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <StatItem
          icon={<Building size={24} />}
          value={availableCount}
          label="Disponíveis"
          sublabel="Imóveis ativos"
          color="blue"
          isVisible={isVisible}
        />
        
        <StatItem
          icon={<CheckCircle size={24} />}
          value={soldCount}
          label="Vendidos"
          sublabel="Este ano"
          color="green"
          isVisible={isVisible}
        />
        
        <StatItem
          icon={<Clock size={24} />}
          value={averageDays}
          label="Dias"
          sublabel="Tempo médio"
          color="yellow"
          isVisible={isVisible}
        />
        
        <StatItem
          icon={<Award size={24} />}
          value={satisfactionRate}
          label="Satisfação"
          sublabel="Dos clientes"
          suffix="%"
          color="purple"
          isVisible={isVisible}
        />
      </div>
    </div>
  )
}

interface AdvancedStatsProps {
  stats: {
    totalProperties: number
    soldThisYear: number
    averageDaysToSell: number
    satisfactionRate: number
    experienceYears: number
    familiesHelped: number
  }
  className?: string
}

export function AdvancedStats({ stats, className = '' }: AdvancedStatsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <section ref={sectionRef} className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Números Que Falam Por Si
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Nossa experiência e resultados comprovam a excelência do nosso trabalho no mercado imobiliário.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:bg-background-tertiary/50 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp size={32} className="text-accent-primary" />
            </div>
            <div className="text-accent-primary mb-2">
              <AnimatedCounter 
                end={stats.soldThisYear} 
                isVisible={isVisible}
              />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Vendas em 2024</h3>
            <p className="text-text-secondary text-sm">
              Cada venda representa uma família realizada e um sonho conquistado
            </p>
          </Card>

          <Card className="p-8 text-center hover:bg-background-tertiary/50 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock size={32} className="text-success" />
            </div>
            <div className="text-success mb-2">
              <AnimatedCounter 
                end={stats.averageDaysToSell} 
                isVisible={isVisible}
              />
              <span className="text-3xl md:text-4xl font-bold"> dias</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Tempo Médio</h3>
            <p className="text-text-secondary text-sm">
              Velocidade de venda 3x superior à média do mercado nacional
            </p>
          </Card>

          <Card className="p-8 text-center hover:bg-background-tertiary/50 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award size={32} className="text-warning" />
            </div>
            <div className="text-warning mb-2">
              <AnimatedCounter 
                end={stats.satisfactionRate} 
                suffix="%"
                isVisible={isVisible}
              />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Satisfação</h3>
            <p className="text-text-secondary text-sm">
              Avaliação média dos nossos clientes em todas as plataformas
            </p>
          </Card>

          <Card className="p-8 text-center hover:bg-background-tertiary/50 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-purple-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building size={32} className="text-purple-400" />
            </div>
            <div className="text-purple-400 mb-2">
              <AnimatedCounter 
                end={stats.totalProperties} 
                isVisible={isVisible}
              />
              <span className="text-xl font-bold">+</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Imóveis Vendidos</h3>
            <p className="text-text-secondary text-sm">
              Total de propriedades comercializadas desde nossa fundação
            </p>
          </Card>

          <Card className="p-8 text-center hover:bg-background-tertiary/50 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users size={32} className="text-accent-primary" />
            </div>
            <div className="text-accent-primary mb-2">
              <AnimatedCounter 
                end={stats.familiesHelped} 
                isVisible={isVisible}
              />
              <span className="text-xl font-bold">+</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Famílias Atendidas</h3>
            <p className="text-text-secondary text-sm">
              Relacionamentos construídos com base na confiança e transparência
            </p>
          </Card>

          <Card className="p-8 text-center hover:bg-background-tertiary/50 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-success" />
            </div>
            <div className="text-success mb-2">
              <AnimatedCounter 
                end={stats.experienceYears} 
                isVisible={isVisible}
              />
              <span className="text-xl font-bold"> anos</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">De Experiência</h3>
            <p className="text-text-secondary text-sm">
              Tradição no mercado imobiliário com constante inovação
            </p>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-6 py-3 rounded-full text-lg font-medium">
            <TrendingUp size={20} />
            <span>Resultados que Impressionam, Serviço que Conquista</span>
          </div>
        </div>
      </div>
    </section>
  )
}