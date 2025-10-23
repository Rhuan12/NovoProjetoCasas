'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Card, Button, Badge, Input } from '@/components/ui/Button'
import { Plus, Edit, Trash2, Upload, Users, AlertCircle, CheckCircle, X } from 'lucide-react'
import Image from 'next/image'

interface Owner {
  id: string
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  achievements: string[]
  display_order: number
  is_active: boolean
}

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photo_url: '',
    achievements: [''],
    display_order: 1,
    is_active: true
  })

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/owners')
      const data = await response.json()
      setOwners(data.owners || [])
    } catch (error) {
      console.error('Erro ao carregar donos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (owner?: Owner) => {
    if (owner) {
      setEditingOwner(owner)
      setFormData({
        name: owner.name,
        role: owner.role,
        bio: owner.bio || '',
        photo_url: owner.photo_url || '',
        achievements: owner.achievements.length > 0 ? owner.achievements : [''],
        display_order: owner.display_order,
        is_active: owner.is_active
      })
    } else {
      setEditingOwner(null)
      setFormData({
        name: '',
        role: '',
        bio: '',
        photo_url: '',
        achievements: [''],
        display_order: owners.length + 1,
        is_active: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingOwner(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingOwner ? `/api/owners/${editingOwner.id}` : '/api/owners'
      const method = editingOwner ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          achievements: formData.achievements.filter(a => a.trim())
        })
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Erro ao salvar')
        return
      }

      await fetchOwners()
      handleCloseModal()
      alert(editingOwner ? 'Dono atualizado!' : 'Dono criado!')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar dono')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar?')) return
    
    try {
      const response = await fetch(`/api/owners/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchOwners()
        alert('Dono deletado!')
      }
    } catch (error) {
      alert('Erro ao deletar')
    }
  }

  const handlePhotoUpload = async (file: File) => {
    if (!file) return
    
    try {
      setUploading(true)
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('folder', 'owners')
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      if (!response.ok) throw new Error('Erro no upload')

      const data = await response.json()
      setFormData(prev => ({ ...prev, photo_url: data.url }))
    } catch (error) {
      alert('Erro ao fazer upload da foto')
    } finally {
      setUploading(false)
    }
  }

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }))
  }

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }

  const updateAchievement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((a, i) => i === index ? value : a)
    }))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Gerenciar Donos</h1>
            <p className="text-text-secondary mt-1">
              Configure as informações dos proprietários da imobiliária (máximo 4)
            </p>
          </div>
          
          <Button
            onClick={() => handleOpenModal()}
            disabled={owners.filter(o => o.is_active).length >= 4}
            className="gap-2"
          >
            <Plus size={16} />
            Adicionar Dono
          </Button>
        </div>

        {/* Info Alert */}
        {owners.filter(o => o.is_active).length >= 4 && (
          <Card className="p-4 border-warning/20 bg-warning/5">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-warning" />
              <p className="text-warning text-sm">
                Limite de 4 donos ativos atingido. Desative um dono para adicionar outro.
              </p>
            </div>
          </Card>
        )}

        {/* Owners List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-32 bg-background-tertiary rounded-lg mb-4"></div>
                <div className="h-4 bg-background-tertiary rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-background-tertiary rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : owners.length === 0 ? (
          <Card className="p-12 text-center">
            <Users size={48} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Nenhum dono cadastrado
            </h3>
            <p className="text-text-secondary mb-6">
              Adicione as informações dos proprietários da imobiliária
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus size={16} className="mr-2" />
              Adicionar Primeiro Dono
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {owners.map((owner) => (
              <Card key={owner.id} className="p-6">
                {/* Photo */}
                <div className="mb-4">
                  {owner.photo_url ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden mx-auto">
                      <Image
                        src={owner.photo_url}
                        alt={owner.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-accent-primary to-accent-light flex items-center justify-center mx-auto">
                      <Users size={48} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-text-primary mb-1">
                    {owner.name}
                  </h3>
                  <p className="text-text-secondary text-sm mb-2">{owner.role}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Badge variant={owner.is_active ? 'success' : 'default'} size="sm">
                      {owner.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Badge size="sm">Ordem: {owner.display_order}</Badge>
                  </div>

                  {owner.bio && (
                    <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                      {owner.bio}
                    </p>
                  )}

                  {owner.achievements.length > 0 && (
                    <div className="text-left mb-3">
                      <p className="text-xs font-semibold text-text-muted mb-1">Conquistas:</p>
                      <ul className="space-y-1">
                        {owner.achievements.slice(0, 2).map((achievement, idx) => (
                          <li key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                            <CheckCircle size={12} className="text-success mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                      {owner.achievements.length > 2 && (
                        <p className="text-xs text-text-muted mt-1">
                          +{owner.achievements.length - 2} mais
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(owner)}
                    className="flex-1"
                  >
                    <Edit size={14} className="mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(owner.id)}
                    className="text-danger hover:bg-danger/10"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text-primary">
                    {editingOwner ? 'Editar Dono' : 'Adicionar Dono'}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                    <X size={20} />
                  </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Foto
                    </label>
                    <div className="flex items-center gap-4">
                      {formData.photo_url ? (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                          <Image
                            src={formData.photo_url}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-background-tertiary flex items-center justify-center">
                          <Users size={32} className="text-text-muted" />
                        </div>
                      )}
                      
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files && handlePhotoUpload(e.target.files[0])}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label htmlFor="photo-upload">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            disabled={uploading}
                            onClick={() => document.getElementById('photo-upload')?.click()}
                          >
                            <Upload size={14} />
                            {uploading ? 'Enviando...' : 'Upload Foto'}
                          </Button>
                        </label>
                        <p className="text-xs text-text-muted mt-1">
                          JPG, PNG ou WebP. Máx 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome Completo *"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      placeholder="Ex: Carlos Eduardo Silva"
                    />

                    <Input
                      label="Cargo *"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      required
                      placeholder="Ex: CEO & Fundador"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Biografia
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Conte um pouco sobre a trajetória..."
                      className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Achievements */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-text-primary">
                        Conquistas/Destaques
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={addAchievement}
                        className="gap-1"
                      >
                        <Plus size={14} />
                        Adicionar
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {formData.achievements.map((achievement, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => updateAchievement(index, e.target.value)}
                            placeholder="Ex: 300+ negociações bem-sucedidas"
                            className="flex-1 px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary"
                          />
                          {formData.achievements.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAchievement(index)}
                              className="text-danger"
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Ordem de Exibição
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="4"
                        value={formData.display_order}
                        onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                        className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Status
                      </label>
                      <select
                        value={formData.is_active ? 'active' : 'inactive'}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'active' }))}
                        className="block w-full px-3 py-2 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      >
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-background-tertiary">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={!formData.name || !formData.role}>
                      {editingOwner ? 'Atualizar' : 'Criar'} Dono
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}