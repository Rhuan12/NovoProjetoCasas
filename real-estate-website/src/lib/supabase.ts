import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para uso geral (client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para componentes do cliente
export const createSupabaseClient = () => 
  createBrowserClient(supabaseUrl, supabaseAnonKey)

// Cliente para componentes do servidor
export const createSupabaseServerClient = () =>
  createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
      },
    }
  )

// Cliente com service role (para operações administrativas)
export const createSupabaseServiceClient = () => 
  createClient(
    supabaseUrl, 
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

// Tipos das tabelas (serão atualizados com os tipos gerados)
export type Tables = {
  properties: {
    Row: {
      id: string
      title: string
      description: string | null
      price: number | null
      bedrooms: number | null
      bathrooms: number | null
      area_sqm: number | null
      address: string | null
      neighborhood: string | null
      city: string | null
      state: string | null
      status: 'available' | 'sold' | 'reserved'
      sold_date: string | null
      days_to_sell: number | null
      main_photo_url: string | null
      photo_2_url: string | null
      photo_3_url: string | null
      created_at: string
      updated_at: string
      created_by: string | null
    }
    Insert: {
      id?: string
      title: string
      description?: string | null
      price?: number | null
      bedrooms?: number | null
      bathrooms?: number | null
      area_sqm?: number | null
      address?: string | null
      neighborhood?: string | null
      city?: string | null
      state?: string | null
      status?: 'available' | 'sold' | 'reserved'
      sold_date?: string | null
      days_to_sell?: number | null
      main_photo_url?: string | null
      photo_2_url?: string | null
      photo_3_url?: string | null
      created_by?: string | null
    }
    Update: {
      id?: string
      title?: string
      description?: string | null
      price?: number | null
      bedrooms?: number | null
      bathrooms?: number | null
      area_sqm?: number | null
      address?: string | null
      neighborhood?: string | null
      city?: string | null
      state?: string | null
      status?: 'available' | 'sold' | 'reserved'
      sold_date?: string | null
      days_to_sell?: number | null
      main_photo_url?: string | null
      photo_2_url?: string | null
      photo_3_url?: string | null
      updated_at?: string
      created_by?: string | null
    }
  }
  leads: {
    Row: {
      id: string
      property_id: string | null
      full_name: string
      email: string
      phone: string | null
      max_budget: number | null
      desired_bedrooms: number | null
      desired_bathrooms: number | null
      message: string | null
      status: 'new' | 'contacted' | 'interested' | 'closed'
      created_at: string
    }
    Insert: {
      id?: string
      property_id?: string | null
      full_name: string
      email: string
      phone?: string | null
      max_budget?: number | null
      desired_bedrooms?: number | null
      desired_bathrooms?: number | null
      message?: string | null
      status?: 'new' | 'contacted' | 'interested' | 'closed'
    }
    Update: {
      id?: string
      property_id?: string | null
      full_name?: string
      email?: string
      phone?: string | null
      max_budget?: number | null
      desired_bedrooms?: number | null
      desired_bathrooms?: number | null
      message?: string | null
      status?: 'new' | 'contacted' | 'interested' | 'closed'
    }
  }
  profiles: {
    Row: {
      id: string
      role: 'admin' | 'photographer' | 'viewer'
      full_name: string | null
      avatar_url: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id: string
      role?: 'admin' | 'photographer' | 'viewer'
      full_name?: string | null
      avatar_url?: string | null
    }
    Update: {
      id?: string
      role?: 'admin' | 'photographer' | 'viewer'
      full_name?: string | null
      avatar_url?: string | null
      updated_at?: string
    }
  }
}

// Tipos de conveniência
export type Property = Tables['properties']['Row']
export type PropertyInsert = Tables['properties']['Insert']
export type PropertyUpdate = Tables['properties']['Update']
export type Lead = Tables['leads']['Row']
export type Profile = Tables['profiles']['Row']