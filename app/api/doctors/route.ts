import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const speciality = searchParams.get('speciality') || ''
    const hospitalId = searchParams.get('hospital_id') || ''

    let query = supabase
      .from('doctors')
      .select(`
        *,
        hospitals (
          id,
          name,
          address,
          city,
          state
        ),
        specialities (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (search) {
      const searchTerm = `%${search}%`
      query = query.or(`name.ilike.${searchTerm},designation.ilike.${searchTerm},speciality_bold.ilike.${searchTerm}`)
    }

    if (speciality && speciality !== 'All') {
      query = query.eq('speciality_bold', speciality)
    }

    if (hospitalId) {
      query = query.eq('hospital_id', hospitalId)
    }

    const { data: doctors, error } = await query

    if (error) throw error

    return NextResponse.json({ doctors })
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    )
  }
}