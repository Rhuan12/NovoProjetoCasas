import { Button, Card, Badge } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header simples */}
      <header className="border-b border-background-tertiary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gradient">
              Imóveis Premium
            </h1>
            <Button variant="outline">Login</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            Encontre sua
            <span className="text-gradient block">Casa dos Sonhos</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            Especialistas em imóveis de alto padrão com atendimento personalizado 
            e as melhores oportunidades do mercado.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Ver Imóveis</Button>
            <Button variant="outline" size="lg">Falar Conosco</Button>
          </div>
        </div>

        {/* Teste dos componentes */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6" hover>
            <div className="w-full h-48 bg-background-tertiary rounded-lg mb-4 flex items-center justify-center">
              <span className="text-text-muted">Foto do Imóvel</span>
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-text-primary">Casa Moderna</h3>
              <Badge variant="success">Disponível</Badge>
            </div>
            <p className="text-text-secondary mb-3">Belo Horizonte, MG</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-text-primary">R$ 850.000</span>
              <div className="flex gap-2 text-sm text-text-muted">
                <span>3 quartos</span>
                <span>•</span>
                <span>2 banheiros</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">Ver Detalhes</Button>
          </Card>

          <Card className="p-6" hover>
            <div className="w-full h-48 bg-background-tertiary rounded-lg mb-4 flex items-center justify-center filter-sold">
              <span className="text-text-muted">Foto do Imóvel</span>
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-text-primary">Apartamento Luxo</h3>
              <Badge variant="sold">Vendido</Badge>
            </div>
            <p className="text-text-secondary mb-3">São Paulo, SP</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-sold">R$ 1.200.000</span>
              <div className="flex gap-2 text-sm text-text-muted">
                <span>4 quartos</span>
                <span>•</span>
                <span>3 banheiros</span>
              </div>
            </div>
            <p className="text-sm text-success">Vendido em 15 dias</p>
          </Card>

          <Card className="p-6" hover>
            <div className="w-full h-48 bg-background-tertiary rounded-lg mb-4 flex items-center justify-center">
              <span className="text-text-muted">Foto do Imóvel</span>
            </div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-text-primary">Casa com Piscina</h3>
              <Badge variant="warning">Reservado</Badge>
            </div>
            <p className="text-text-secondary mb-3">Rio de Janeiro, RJ</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-text-primary">R$ 2.100.000</span>
              <div className="flex gap-2 text-sm text-text-muted">
                <span>5 quartos</span>
                <span>•</span>
                <span>4 banheiros</span>
              </div>
            </div>
            <Button className="w-full" variant="outline">Ver Detalhes</Button>
          </Card>
        </div>

        {/* Status do projeto */}
        <Card className="p-8 text-center">
          <h3 className="text-2xl font-bold text-text-primary mb-4">Status do Projeto</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Badge variant="success" size="md">✅ Setup Completo</Badge>
              <p className="text-sm text-text-muted mt-2">Next.js + Tailwind + Componentes</p>
            </div>
            <div>
              <Badge variant="warning" size="md">⏳ Supabase</Badge>
              <p className="text-sm text-text-muted mt-2">Aguardando configuração</p>
            </div>
            <div>
              <Badge variant="default" size="md">📝 CRUD Imóveis</Badge>
              <p className="text-sm text-text-muted mt-2">Próximo passo</p>
            </div>
            <div>
              <Badge variant="default" size="md">📸 Sistema Fotos</Badge>
              <p className="text-sm text-text-muted mt-2">Em desenvolvimento</p>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer simples */}
      <footer className="border-t border-background-tertiary mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-text-muted">
            <p>&copy; 2024 Imóveis Premium. Projeto em desenvolvimento.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}