'use client'

import { useState, useEffect } from 'react'
import { useProperties } from '@/hooks/useProperties'
import { Header } from '@/components/Header'
import { PropertyCard } from '@/components/PropertyCard'
import { AboutOwners } from '@/components/AboutOwners'
import { Button, Card, Badge } from '@/components/ui/Button'
import { 
  Search, 
  MapPin, 
  BedDouble, 
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Star,
  ArrowRight,
  CheckCircle,
  Building
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SiteSettings {
  owner_name: string
  owner_photo_url: string
  owner_bio: string
  company_name: string
  company_logo_url: string
  contact_phone: string
  contact_email: string
  contact_address: string
  google_reviews_link: string
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const { properties, loading } = useProperties({ status: 'available' })

  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true)

  // Buscar configurações do site
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        if (response.ok) {
          const data = await response.json()
          setSettings(data)
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      } finally {
        setSettingsLoading(false)
      }
    }
    
    fetchSettings()
  }, [])
  
  // Pegar imóveis em destaque (primeiros 6 disponíveis)
  const featuredProperties = properties.slice(0, 6)
  
  // Estatísticas
  const availableCount = properties.filter(p => p.status === 'available').length
  const soldCount = properties.filter(p => p.status === 'sold').length
  
  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      
      {/* Hero Section */}
      <section className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-light/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            {/* Badge de credibilidade */}
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Award size={16} />
              <span>Especialistas em Imóveis Premium</span>
            </div>
            
            {/* Título principal */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 leading-tight">
              {settings?.company_name || 'Real Estate McSilva & Wiggit'}
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto mb-12 leading-relaxed">
              Atendimento personalizado, imóveis selecionados e a experiência que você merece 
              para encontrar o lar perfeito para sua família.
            </p>
            
            {/* Busca rápida */}
            <div className="max-w-2xl mx-auto mb-12">
              <Card className="p-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Busque por cidade, bairro ou características..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-transparent border-none text-text-primary placeholder-text-muted focus:outline-none text-lg"
                    />
                  </div>
                  <Link href={`/imoveis${searchTerm ? `?search=${searchTerm}` : ''}`}>
                    <Button size="lg" className="px-8">
                      Buscar
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
            
            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-text-primary mb-1">
                  {availableCount}
                </div>
                <div className="text-text-secondary text-sm md:text-base">
                  Imóveis Disponíveis
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-success mb-1">
                  {soldCount}
                </div>
                <div className="text-text-secondary text-sm md:text-base">
                  Imóveis Vendidos
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent-primary mb-1">
                  15
                </div>
                <div className="text-text-secondary text-sm md:text-base">
                  Dias em Média
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-warning mb-1">
                  98%
                </div>
                <div className="text-text-secondary text-sm md:text-base">
                  Satisfação
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Imóveis em Destaque */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Oportunidades Únicas</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Imóveis em Destaque
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Selecionamos cuidadosamente os melhores imóveis disponíveis no mercado. 
              Cada propriedade passa por rigorosa análise de qualidade.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <Card className="overflow-hidden">
                    <div className="h-64 bg-background-tertiary"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-background-tertiary rounded w-3/4"></div>
                      <div className="h-3 bg-background-tertiary rounded w-1/2"></div>
                      <div className="h-6 bg-background-tertiary rounded w-1/3"></div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="text-center">
                <Link href="/imoveis">
                  <Button size="lg" variant="outline" className="gap-2">
                    Ver Todos os Imóveis
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Por Que Escolher */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Nossa Diferença</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Por Que Escolher Nossa Imobiliária?
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Experiência, transparência e resultado. Transformamos o sonho da casa própria em realidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:bg-background-tertiary/50 transition-colors">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp size={32} className="text-accent-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Vendas Rápidas
              </h3>
              <p className="text-text-secondary mb-6">
                Tempo médio de venda de apenas 15 dias. Nossa estratégia de marketing 
                digital garante máxima visibilidade para seu imóvel.
              </p>
              <ul className="text-text-secondary text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Marketing digital avançado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Fotografia profissional</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Precificação estratégica</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 text-center hover:bg-background-tertiary/50 transition-colors">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-success" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Atendimento Personalizado
              </h3>
              <p className="text-text-secondary mb-6">
                Cada cliente é único. Nossa equipe especializada oferece consultoria 
                personalizada para suas necessidades específicas.
              </p>
              <ul className="text-text-secondary text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Consultor dedicado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Acompanhamento 24/7</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>Suporte jurídico incluso</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 text-center hover:bg-background-tertiary/50 transition-colors">
              <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award size={32} className="text-warning" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Experiência Comprovada
              </h3>
              <p className="text-text-secondary mb-6">
                Mais de 500 famílias já realizaram o sonho da casa própria conosco. 
                Tradição e inovação em cada negócio.
              </p>
              <ul className="text-text-secondary text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>+10 anos no mercado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>500+ famílias atendidas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span>98% de satisfação</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Depoimentos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              O Que Nossos Clientes Dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-warning fill-current" />
                ))}
              </div>
              <p className="text-text-secondary mb-6">
                "Experiência incrível! Em apenas 12 dias venderam minha casa pelo valor que eu queria. 
                Atendimento excepcional e muito profissionalismo."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-accent-primary" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary">Maria Silva</div>
                  <div className="text-text-muted text-sm">Vendeu casa em Copacabana</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-warning fill-current" />
                ))}
              </div>
              <p className="text-text-secondary mb-6">
                "Encontrei o apartamento dos meus sonhos! A equipe foi super atenciosa e me ajudou 
                em todo o processo de financiamento. Recomendo demais!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-success" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary">João Santos</div>
                  <div className="text-text-muted text-sm">Comprou apt. em Ipanema</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-warning fill-current" />
                ))}
              </div>
              <p className="text-text-secondary mb-6">
                "Profissionalismo do início ao fim. Negociaram o melhor preço e cuidaram de toda 
                a documentação. Não poderia ter escolhido melhor."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-warning" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary">Ana Costa</div>
                  <div className="text-text-muted text-sm">Comprou casa na Barra</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <AboutOwners />

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-accent-primary to-accent-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto Para Encontrar Sua Casa dos Sonhos?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Entre em contato agora e descubra como podemos ajudar você a realizar o sonho da casa própria.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className=""
              onClick={() => {
                const phone = settings?.contact_phone?.replace(/\D/g, '') || '5585991288998'
                window.open(`https://wa.me/${phone}`, '_blank')
              }}
            >
              <MessageCircle size={20} />
              WhatsApp: {settings?.contact_phone || '(85) 99128-8998'}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 gap-2"
              onClick={() => {
                const phone = settings?.contact_phone?.replace(/\D/g, '') || '5585991288998'
                window.open(`tel:+${phone}`, '_self')
              }}
            >
              <Phone size={20} />
              Ligar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-secondary border-t border-background-tertiary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                {settings?.company_logo_url ? (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={settings.company_logo_url}
                      alt={settings.company_name || 'Logo'}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-light rounded-lg flex items-center justify-center">
                    <Building size={24} className="text-white" />
                  </div>
                )}
                <span className="text-2xl font-bold text-gradient">
                  {settings?.company_name || 'Imóveis Premium'}
                </span>
              </div>
              <p className="text-text-secondary mb-6 max-w-md">
                Especialistas em imóveis de alto padrão. Realizamos sonhos e construímos futuros há mais de 10 anos.
              </p>
              <div className="flex items-center gap-4">
                <Badge>Desde 2014</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-4">Contato</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Phone size={16} />
                  <span>{settings?.contact_phone || '(85) 99128-8998'}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail size={16} />
                  <span>{settings?.contact_email || 'contato@imoveis.com'}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin size={16} />
                  <span>{settings?.contact_address || 'Fortaleza, CE'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-background-tertiary mt-12 pt-8 text-center text-text-muted">
            <p>&copy; 2024 {settings?.company_name || 'Imóveis Premium'}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}