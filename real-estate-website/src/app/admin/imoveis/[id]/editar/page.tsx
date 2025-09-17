'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/AdminLayout'
import { PropertyForm } from '@/components/admin/PropertyForm'
import { PropertyPhotosManager } from '@/components/admin/PropertyPhotosManager'
import { useProperty, usePropertyMutations } from '@/hooks/useProperties'
import { Card, Button, Badge } from '@/components/ui/Button'
import { ArrowLeft, Eye, AlertCircle, Trash2, Save } from 'lucide-react'
import Link from 'next/link'

interface EditPropertyPageProps {
  params: {
    id: string
  }
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const router = useRouter()
  const { property, loading: propertyLoading, error: propertyError } = useProperty(params.id)
  const { updateProperty, deleteProperty, loading: mutationLoading, error: mutationError } = usePropertyMutations()
  const [activeTab, setActiveTab] = useState<'info' | 'photos'>('info')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleUpdateProperty = async (propertyData: any) => {
    try {
      await updateProperty(params.id, propertyData)
      // Mostrar feedback de sucesso
      alert('Imóvel atualizado com sucesso!')
    } catch (err) {
      console.error('Erro ao atualizar imóvel:', err)
    }
  }

  const handleDeleteProperty = async () => {
    try {
      await deleteProperty(params.id)
      router.push('/admin/imoveis')
    } catch (err) {
      console.error('Erro ao deletar imóvel:', err)
      alert('Erro ao deletar imóvel. Tente novamente.')
    }
  }

  const getStatusBadge = () => {
    if (!property) return null
    
    switch (property.status) {
      case 'available':
        return <Badge variant="success">Disponível</Badge>
      case 'sold':
        return <Badge variant="sold">Vendido</Badge>
      case 'reserved':
        return <Badge variant="warning">Reservado</Badge>
      default:
        return <Badge>-</Badge>
    }
  }

  if (propertyLoading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-background-tertiary rounded w-1/3"></div>
            <div className="h-96 bg-background-tertiary rounded"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (propertyError || !property) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <Card className="p-8">
            <AlertCircle size={48} className="mx-auto text-danger mb-4" />
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              Imóvel não encontrado
            </h1>
            <p className="text-text-secondary mb-6">
              {propertyError || 'O imóvel que você está procurando não existe ou foi removido.'}
            </p>
            <Link href="/admin/imoveis">
              <Button>
                <ArrowLeft size={16} className="mr-2" />
                Voltar para Lista
              </Button>
            </Link>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
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
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-text-primary">
                  {property.title}
                </h1>
                {getStatusBadge()}
              </div>
              <p className="text-text-secondary">
                {property.city}{property.neighborhood && `, ${property.neighborhood}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/imoveis/${property.id}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye size={16} className="mr-2" />
                Ver no Site
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-danger hover:bg-danger/10"
            >
              <Trash2 size={16} className="mr-2" />
              Deletar
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted">
          <Link href="/admin" className="hover:text-text-primary">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/imoveis" className="hover:text-text-primary">Imóveis</Link>
          <span>/</span>
          <span className="text-text-primary">Editar</span>
        </nav>

        {/* Tabs */}
        <Card className="p-1">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
              }`}
            >
              📝 Informações
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'photos'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
              }`}
            >
              📸 Fotos ({[property.main_photo_url, property.photo_2_url, property.photo_3_url].filter(Boolean).length}/3)
            </button>
          </div>
        </Card>

        {/* Tab Content */}
        {activeTab === 'info' && (
          <PropertyForm
            property={property}
            onSubmit={handleUpdateProperty}
            loading={mutationLoading}
            error={mutationError}
            submitText="Atualizar Imóvel"
          />
        )}

        {activeTab === 'photos' && (
          <PropertyPhotosManager
            property={property}
            onPhotosUpdate={() => {
              // Atualizar a propriedade após upload de fotos
              window.location.reload()
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Confirmar Exclusão
              </h3>
              <p className="text-text-secondary mb-6">
                Tem certeza que deseja deletar o imóvel <strong>"{property.title}"</strong>? 
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={mutationLoading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDeleteProperty}
                  loading={mutationLoading}
                  className="bg-danger hover:bg-danger/90"
                >
                  Deletar Imóvel
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}