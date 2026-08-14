import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const consultationMode = searchParams.get('consultation_mode') || 'hospital_visit'
    const hospitalId = searchParams.get('hospital_id')

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('doctor_slots')
      .select('*')
      .eq('doctor_id', params.id)
      .eq('slot_date', date)
      .eq('consultation_mode', consultationMode)
      .eq('status', 'available')
      .order('start_time', { ascending: true })

    if (hospitalId) {
      query = query.eq('hospital_id', hospitalId)
    }

    const { data: slots, error } = await query

    if (error) throw error

    // Filter out slots that are fully booked
    const availableSlots = slots?.filter(
      slot => slot.current_bookings < slot.max_bookings
    ) || []

    return NextResponse.json({ slots: availableSlots })
  } catch (error) {
    console.error('Error fetching slots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slots' },
      { status: 500 }
    )
  }
}