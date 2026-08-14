import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: Request) {
  try {
    const appointmentData = await request.json()

    // Validate required fields
    const requiredFields = [
      'patient_name',
      'patient_phone',
      'doctor_id',
      'appointment_type',
      'appointment_date',
      'appointment_time'
    ]

    for (const field of requiredFields) {
      if (!appointmentData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if slot is still available
    if (appointmentData.slot_id) {
      const { data: slot, error: slotCheckError } = await supabase
        .from('doctor_slots')
        .select('status, current_bookings, max_bookings')
        .eq('id', appointmentData.slot_id)
        .single()

      if (slotCheckError) throw slotCheckError

      if (slot.status !== 'available' || slot.current_bookings >= slot.max_bookings) {
        return NextResponse.json(
          { error: 'Selected slot is no longer available' },
          { status: 409 }
        )
      }
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_name: appointmentData.patient_name,
        patient_phone: appointmentData.patient_phone,
        patient_email: appointmentData.patient_email || null,
        patient_age: appointmentData.patient_age || null,
        patient_gender: appointmentData.patient_gender || null,
        patient_message: appointmentData.patient_message || null,
        doctor_id: appointmentData.doctor_id,
        slot_id: appointmentData.slot_id || null,
        hospital_id: appointmentData.hospital_id || null,
        appointment_type: appointmentData.appointment_type,
        appointment_date: appointmentData.appointment_date,
        appointment_time: appointmentData.appointment_time,
        status: 'pending',
        user_id: appointmentData.user_id || null,
      })
      .select()
      .single()

    if (appointmentError) throw appointmentError

    // Update slot booking count
    if (appointmentData.slot_id) {
      const { error: slotUpdateError } = await supabase
        .rpc('increment_slot_bookings', { 
          slot_id: appointmentData.slot_id 
        })

      if (slotUpdateError) throw slotUpdateError
    }

    // Add to status history
    await supabase
      .from('appointment_status_history')
      .insert({
        appointment_id: appointment.id,
        old_status: null,
        new_status: 'pending',
        note: 'Appointment created'
      })

    return NextResponse.json({ 
      message: 'Appointment created successfully',
      appointment 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const doctorId = searchParams.get('doctor_id')
    const status = searchParams.get('status')
    const date = searchParams.get('date')

    let query = supabase
      .from('appointments')
      .select(`
        *,
        doctors (
          id,
          name,
          designation,
          photo_url,
          speciality_bold
        ),
        hospitals (
          id,
          name,
          address
        )
      `)
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (doctorId) {
      query = query.eq('doctor_id', doctorId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (date) {
      query = query.eq('appointment_date', date)
    }

    const { data: appointments, error } = await query

    if (error) throw error

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}