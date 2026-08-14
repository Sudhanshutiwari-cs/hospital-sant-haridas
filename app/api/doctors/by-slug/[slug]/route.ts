import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { data: doctor, error } = await supabase
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
        ),
        doctor_education (
          id,
          degree,
          institution,
          university,
          year,
          sort_order
        ),
        doctor_awards (
          id,
          title,
          awarded_by,
          year,
          sort_order
        )
      `)
      .eq('slug', params.slug)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Doctor not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Sort education and awards by year (descending) then by sort_order
    if (doctor.doctor_education) {
      doctor.doctor_education.sort((a: any, b: any) => 
        (b.year || 0) - (a.year || 0) || (a.sort_order || 0) - (b.sort_order || 0)
      )
    }

    if (doctor.doctor_awards) {
      doctor.doctor_awards.sort((a: any, b: any) => 
        (b.year || 0) - (a.year || 0) || (a.sort_order || 0) - (b.sort_order || 0)
      )
    }

    return NextResponse.json({ doctor })
  } catch (error) {
    console.error('Error fetching doctor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctor' },
      { status: 500 }
    )
  }
}