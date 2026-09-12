// app/api/appointments/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        doctors:doctor_id (full_name, specialization),
        patients:patient_id (full_name, phone)
      `)
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ error: 'Failed to fetch appointment' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    // If appointment is cancelled, free up the slot
    if (body.status === 'cancelled' && appointment.slot_id) {
      await supabaseAdmin
        .from('doctor_slots')
        .update({ is_booked: false })
        .eq('id', appointment.slot_id);
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get appointment to find slot_id
    const { data: appointment, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('slot_id')
      .eq('id', params.id)
      .single();

    if (fetchError) throw fetchError;

    // Delete appointment
    const { error: deleteError } = await supabaseAdmin
      .from('appointments')
      .delete()
      .eq('id', params.id);

    if (deleteError) throw deleteError;

    // Free up slot if exists
    if (appointment?.slot_id) {
      await supabaseAdmin
        .from('doctor_slots')
        .update({ is_booked: false })
        .eq('id', appointment.slot_id);
    }

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: 'Failed to delete appointment' }, { status: 500 });
  }
}