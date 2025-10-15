import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial, TestimonialFormData } from '@/types/testimonial'

export function useTestimonials(activeOnly: boolean = false) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })

      if (activeOnly) {
        query = query.eq('is_active', true)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setTestimonials(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar depoimentos')
      console.error('Erro ao buscar depoimentos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [activeOnly])

  const createTestimonial = async (data: TestimonialFormData) => {
    try {
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert([data])

      if (insertError) throw insertError

      await fetchTestimonials()
      return { success: true }
    } catch (err) {
      console.error('Erro ao criar depoimento:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao criar depoimento' 
      }
    }
  }

  const updateTestimonial = async (id: string, data: Partial<TestimonialFormData>) => {
    try {
      const { error: updateError } = await supabase
        .from('testimonials')
        .update(data)
        .eq('id', id)

      if (updateError) throw updateError

      await fetchTestimonials()
      return { success: true }
    } catch (err) {
      console.error('Erro ao atualizar depoimento:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao atualizar depoimento' 
      }
    }
  }

  const deleteTestimonial = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      await fetchTestimonials()
      return { success: true }
    } catch (err) {
      console.error('Erro ao excluir depoimento:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro ao excluir depoimento' 
      }
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    return updateTestimonial(id, { is_active: isActive })
  }

  return {
    testimonials,
    loading,
    error,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleActive,
    refetch: fetchTestimonials
  }
}