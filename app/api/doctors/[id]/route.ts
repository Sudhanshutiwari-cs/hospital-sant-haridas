import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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
          year
        ),
        doctor_awards (
          id,
          title,
          awarded_by,
          year
        )
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (error) throw error

    // Get doctor's hospitals (including secondary)
    const { data: doctorHospitals } = await supabase
      .from('doctor_hospitals')
      .select(`
        hospital_id,
        is_primary,
        hospitals (
          id,
          name,
          address,
          city,
          state
        )
      `)
      .eq('doctor_id', params.id)

    return NextResponse.json({ 
      doctor,
      hospitals: doctorHospitals?.map(dh => dh.hospitals) || []
    })
  } catch (error) {
    console.error('Error fetching doctor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctor' },
      { status: 500 }
    )
  }
}