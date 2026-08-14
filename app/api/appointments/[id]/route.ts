import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: appointment, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctors (
          id,
          name,
          designation,
          photo_url,
          speciality_bold,
          speciality_light
        ),
        hospitals (
          id,
          name,
          address,
          city,
          state
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, note, cancellation_reason } = await request.json()

    // Get current appointment status
    const { data: currentAppointment, error: fetchError } = await supabase
      .from('appointments')
      .select('status, slot_id')
      .eq('id', params.id)
      .single()

    if (fetchError) throw fetchError

    // Prepare update data
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    // Add timestamp based on status
    if (status === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString()
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    } else if (status === 'cancelled') {
      updateData.cancelled_at = new Date().toISOString()
      updateData.cancellation_reason = cancellation_reason || null
    }

    // Update appointment status
    const { data: updatedAppointment, error: updateError } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) throw updateError

    // If cancelling, release the slot
    if (status === 'cancelled' && currentAppointment.slot_id) {
      await supabase
        .rpc('decrement_slot_bookings', { 
          slot_id: currentAppointment.slot_id 
        })
    }

    // Add to status history
    await supabase
      .from('appointment_status_history')
      .insert({
        appointment_id: params.id,
        old_status: currentAppointment.status,
        new_status: status,
        note: note || `Status changed to ${status}`
      })

    return NextResponse.json({ 
      message: 'Appointment updated successfully',
      appointment: updatedAppointment 
    })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}