import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const VALID_CATEGORIES = ['electrical', 'plumbing', 'hvac', 'general']
const VALID_PRIORITIES = ['emergency', 'high', 'medium', 'slow']
const VALID_TIMES = ['morning', 'afternoon', 'evening', 'anytime']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      phone_number,
      property_address,
      maintenance_category,
      priority_level,
      description,
      preferred_visit_time,
      photos,
    } = body

    if (!phone_number || !property_address || !maintenance_category || !priority_level || !description || !preferred_visit_time) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!VALID_CATEGORIES.includes(maintenance_category)) {
      return NextResponse.json({ error: 'Invalid maintenance category' }, { status: 400 })
    }
    if (!VALID_PRIORITIES.includes(priority_level)) {
      return NextResponse.json({ error: 'Invalid priority level' }, { status: 400 })
    }
    if (!VALID_TIMES.includes(preferred_visit_time)) {
      return NextResponse.json({ error: 'Invalid preferred visit time' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert({
        phone_number: phone_number.trim(),
        property_address: property_address.trim(),
        maintenance_category,
        priority_level,
        description: description.trim(),
        preferred_visit_time,
        photos: photos || [],
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'manager'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')

    let query = supabase
      .from('maintenance_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') query = query.eq('status', status)
    if (category && category !== 'all') query = query.eq('maintenance_category', category)
    if (priority && priority !== 'all') query = query.eq('priority_level', priority)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ requests: data || [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
