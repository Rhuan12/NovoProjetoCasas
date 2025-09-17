'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { PhotoUploadInterface } from '@/components/admin/PhotoUploadInterface'
import { useProperties } from '@/hooks/useProperties'
import { Card, Input, Button } from '@/components/ui/Button'
import { Camera, Search, Building, Image as ImageIcon } from 'lucide-react'

export default function PhotosUploadPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const { properties, loading, error } = useProperties()

  // Filtrar propriedades baseado na busca
  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Estatísticas das fotos
  const propertiesWithPhotos = properties.filter(p => 
    p.main_photo_url || p.photo_2_url || p.photo_3_url
  ).length

  const totalPhotos = properties.reduce((count, p) => {
    return count + 
      (p.main_photo_url ? 1 : 0) + 
      (p.photo_2_url ? 1 : 0) + 
      (p.photo_3_url ? 1 : 0)
  }, 0)

  const propertiesNeedingPhotos = properties.filter(p => 
    !p.main_photo_url && !p.photo_2_url && !p.photo_3_url
  ).length

  const selectedPropertyData = properties.find(p => p.id === selectedProperty)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <Camera size={32} className="text-accent-primary" />
              Sistema de Fotos
            </h1>
            <p className="text-text-secondary mt-1">
              Interface especializada para upload e gerenciamento de imagens dos imóveis
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-primary/10 rounded-lg">
                <Building size={20} className="text-accent-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{properties.length}</p>
                <p className="text-sm text-text-muted">Total Imóveis</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <ImageIcon size={20} className="text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{totalPhotos}</p>
                <p className="text-sm text-text-muted">Fotos Enviadas</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Camera size={20} className="text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{propertiesWithPhotos}</p>
                <p className="text-sm text-text-muted">Com Fotos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Camera size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{propertiesNeedingPhotos}</p>
                <p className="text-sm text-text-muted">Precisam Fotos</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Imóveis */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Selecionar Imóvel
              </h3>
              
              {/* Busca */}
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-3 text-text-muted" />
                <Input
                  placeholder="Buscar imóvel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="h-16 bg-background-tertiary rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProperties.map((property) => {
                    const photoCount = [
                      property.main_photo_url,
                      property.photo_2_url,
                      property.photo_3_url
                    ].filter(Boolean).length

                    return (
                      <button
                        key={property.id}
                        onClick={() => setSelectedProperty(property.id)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedProperty === property.id
                            ? 'bg-accent-primary text-white'
                            : 'hover:bg-background-tertiary'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium truncate ${
                              selectedProperty === property.id ? 'text-white' : 'text-text-primary'
                            }`}>
                              {property.title}
                            </h4>
                            <p className={`text-sm truncate ${
                              selectedProperty === property.id ? 'text-white/80' : 'text-text-secondary'
                            }`}>
                              {property.city}{property.neighborhood && `, ${property.neighborhood}`}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              selectedProperty === property.id 
                                ? 'bg-white/20 text-white'
                                : photoCount === 3 
                                  ? 'bg-success/10 text-success'
                                  : photoCount > 0
                                    ? 'bg-warning/10 text-warning'
                                    : 'bg-background-tertiary text-text-muted'
                            }`}>
                              {photoCount}/3
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })}

                  {filteredProperties.length === 0 && (
                    <div className="text-center py-8">
                      <Building size={32} className="mx-auto text-text-muted mb-2" />
                      <p className="text-text-secondary">
                        {searchTerm ? 'Nenhum imóvel encontrado' : 'Carregando imóveis...'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Interface de Upload */}
          <div className="lg:col-span-2">
            {selectedPropertyData ? (
              <PhotoUploadInterface
                property={selectedPropertyData}
                onPhotosUpdate={() => {
                  // Recarregar dados após upload
                  window.location.reload()
                }}
              />
            ) : (
              <Card className="p-12 text-center">
                <Camera size={64} className="mx-auto text-text-muted mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Selecione um Imóvel
                </h3>
                <p className="text-text-secondary">
                  Escolha um imóvel da lista ao lado para gerenciar suas fotos
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Dicas para Fotógrafos */}
        <Card className="p-6 bg-accent-primary/5 border-accent-primary/20">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Camera size={20} />
            📸 Guia Rápido para Fotógrafos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-text-primary mb-2">🏠 Foto Principal</h4>
              <ul className="text-text-secondary text-sm space-y-1">
                <li>• Fachada ou entrada principal</li>
                <li>• Melhor ângulo do imóvel</li>
                <li>• Boa iluminação natural</li>
                <li>• Alta resolução (min. 1200px)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-text-primary mb-2">🖼️ Fotos Adicionais</h4>
              <ul className="text-text-secondary text-sm space-y-1">
                <li>• Ambiente interno principal</li>
                <li>• Área externa/quintal</li>
                <li>• Detalhes importantes</li>
                <li>• Diferentes ângulos</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-text-primary mb-2">⚡ Dicas Técnicas</h4>
              <ul className="text-text-secondary text-sm space-y-1">
                <li>• JPEG, PNG ou WebP</li>
                <li>• Máximo 5MB por foto</li>
                <li>• Upload automático</li>
                <li>• Drag & drop funcional</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}