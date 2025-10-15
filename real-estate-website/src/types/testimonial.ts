export interface Testimonial {
  id: string
  client_name: string
  client_photo_url: string | null
  testimonial: string
  rating: number
  property_id: string | null
  is_active: boolean
  created_at: string
}

export interface TestimonialFormData {
  client_name: string
  client_photo_url?: string
  testimonial: string
  rating: number
  property_id?: string
  is_active: boolean
}