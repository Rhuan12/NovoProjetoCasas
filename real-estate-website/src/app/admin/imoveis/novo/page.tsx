'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { usePropertyMutations } from '@/hooks/useProperties'
import { Card, Button } from '@/components/ui/Button'
import { ArrowLeft, Building } from 'lucide-react'
import Link from 'next/link'

export default function NewPropertyPage() {
  const router = useRouter()
  const { createProperty, loading, error } = usePropertyMutations()
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (propertyData: any) => {
    try {
      const newProperty = await createProperty(propertyData)
      setSuccess(true)
      
      // Redirecionar após 2 segundos para a página de edição para continuar com fotos
      setTimeout(() => {
        router.push(`/admin/imoveis/${newProperty.id}/editar`)
      }, 2000)
    } catch (err) {
      console.error('Erro ao criar imóvel:', err)
    }
  }

  if (success) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <Card className="p-8">
            <div className="text-success mb-4">
              <Building size={48} className="mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Imóvel criado com sucesso!
            </h1>
            <p className="text-text-secondary mb-6">
              Redirecionando para a página de edição para adicionar fotos...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent-primary border-t-transparent mx-auto"></div>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/imoveis">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Voltar para Lista
              </Button>
            </Link>
            
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Novo Imóvel</h1>
              <p className="text-text-secondary mt-1">
                Adicione um novo imóvel ao seu portfólio
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted">
          <Link href="/admin" className="hover:text-text-primary">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/imoveis" className="hover:text-text-primary">Imóveis</Link>
          <span>/</span>
          <span className="text-text-primary">Novo</span>
        </nav>

        {/* Form */}
        <PropertyForm
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitText="Criar Imóvel"
        />

        {/* Info Card */}
        <Card className="p-6 bg-accent-primary/5 border-accent-primary/20">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            📸 Próximo passo: Fotos
          </h3>
          <p className="text-text-secondary">
            Após criar o imóvel, você será redirecionado para a página de edição 
            onde poderá fazer upload de até 10 fotos para o imóvel.
          </p>
        </Card>
      </div>
    </AdminLayout>
  )
}