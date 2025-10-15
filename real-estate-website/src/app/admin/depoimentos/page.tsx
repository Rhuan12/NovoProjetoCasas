'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, Button } from '@/components/ui/Button'
import { TestimonialForm } from '@/components/admin/TestimonialForm'
import { useTestimonials } from '@/hooks/useTestimonials'
import { MessageSquare, Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import type { Testimonial } from '@/types/testimonial'

export default function DepoimentosPage() {
  const { testimonials, loading, createTestimonial, updateTestimonial, deleteTestimonial, toggleActive } = useTestimonials()
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)

  const handleCreate = async (data: any) => {
    const result = await createTestimonial(data)
    if (result.success) {
      setShowForm(false)
    }
    return result
  }

  const handleUpdate = async (data: any) => {
    if (!editingTestimonial) return { success: false }
    const result = await updateTestimonial(editingTestimonial.id, data)
    if (result.success) {
      setEditingTestimonial(null)
    }
    return result
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este depoimento?')) {
      await deleteTestimonial(id)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await toggleActive(id, !isActive)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <MessageSquare size={32} className="text-accent-primary" />
              Depoimentos
            </h1>
            <p className="text-text-secondary mt-1">
              Gerencie os depoimentos dos clientes
            </p>
          </div>

          {!showForm && !editingTestimonial && (
            <Button onClick={() => setShowForm(true)}>
              <Plus size={20} className="mr-2" />
              Novo Depoimento
            </Button>
          )}
        </div>

        {/* Formulário de Criação */}
        {showForm && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Novo Depoimento
            </h2>
            <TestimonialForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              submitText="Criar Depoimento"
            />
          </Card>
        )}

        {/* Formulário de Edição */}
        {editingTestimonial && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">
              Editar Depoimento
            </h2>
            <TestimonialForm
              testimonial={editingTestimonial}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTestimonial(null)}
              submitText="Salvar Alterações"
            />
          </Card>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-primary/10 rounded-lg">
                <MessageSquare size={20} className="text-accent-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{testimonials.length}</p>
                <p className="text-sm text-text-secondary">Total de Depoimentos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Eye size={20} className="text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {testimonials.filter(t => t.is_active).length}
                </p>
                <p className="text-sm text-text-secondary">Ativos</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Star size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {testimonials.length > 0 
                    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                    : '0.0'
                  }
                </p>
                <p className="text-sm text-text-secondary">Média de Avaliação</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Lista de Depoimentos */}
        {!showForm && !editingTestimonial && (
          <div className="space-y-4">
            {testimonials.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageSquare size={48} className="mx-auto text-text-muted mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Nenhum depoimento cadastrado
                </h3>
                <p className="text-text-secondary mb-6">
                  Comece adicionando o primeiro depoimento de cliente!
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus size={20} className="mr-2" />
                  Adicionar Primeiro Depoimento
                </Button>
              </Card>
            ) : (
              testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6">
                  <div className="flex gap-6">
                    {/* Foto do Cliente */}
                    <div className="flex-shrink-0">
                      {testimonial.client_photo_url ? (
                        <img
                          src={testimonial.client_photo_url}
                          alt={testimonial.client_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-accent-primary">
                            {testimonial.client_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">
                            {testimonial.client_name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < testimonial.rating ? 'fill-warning text-warning' : 'text-text-muted'}
                              />
                            ))}
                            <span className="text-sm text-text-secondary ml-2">
                              {testimonial.rating} estrela{testimonial.rating !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2">
                          {testimonial.is_active ? (
                            <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                              Ativo
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-text-muted/10 text-text-muted text-xs font-medium rounded-full">
                              Inativo
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-text-secondary mb-4 italic">
                        "{testimonial.testimonial}"
                      </p>

                      {testimonial.property_id && (
                        <p className="text-xs text-text-muted mb-4">
                          Vinculado ao imóvel: {testimonial.property_id}
                        </p>
                      )}

                      <p className="text-xs text-text-muted">
                        Criado em: {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
                      </p>

                      {/* Ações */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                        >
                          {testimonial.is_active ? (
                            <>
                              <EyeOff size={16} className="mr-2" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Eye size={16} className="mr-2" />
                              Ativar
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTestimonial(testimonial)}
                        >
                          <Pencil size={16} className="mr-2" />
                          Editar
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(testimonial.id)}
                          className="text-error hover:bg-error/10"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}