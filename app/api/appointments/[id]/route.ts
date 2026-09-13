// app/api/appointments/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await Promise.resolve(props.params);
    let id = params?.id;
    if (!id) {
      const url = new URL(request.url);
      const parts = url.pathname.split('/').filter(Boolean);
      id = parts[parts.length - 1];
    }

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        doctors:doctor_id (full_name, specialization),
        patients:patient_id (full_name, phone)
      `)
      .eq('id', id)
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
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await Promise.resolve(props.params);
    let id = params?.id;
    if (!id) {
      const url = new URL(request.url);
      const parts = url.pathname.split('/').filter(Boolean);
      id = parts[parts.length - 1];
    }

    const body = await request.json();
    const { id: bodyId, doctors, patients, ...cleanBody } = body;
    const targetId = id || bodyId;

    if (!targetId) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {
      ...cleanBody,
      updated_at: new Date().toISOString(),
    };

    // Automatically confirm appointment if payment status is changed to paid
    if (updatePayload.payment_status?.toLowerCase() === 'paid') {
      updatePayload.status = 'confirmed';
    }

    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .update(updatePayload)
      .eq('id', targetId)
      .select()
      .single();

    if (error) throw error;

    // If appointment is cancelled, free up the slot
    if (updatePayload.status === 'cancelled' && appointment.slot_id) {
      await supabaseAdmin
        .from('doctor_slots')
        .update({ is_booked: false })
        .eq('id', appointment.slot_id);
    }

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update appointment' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await Promise.resolve(props.params);
    let id = params?.id;
    if (!id) {
      const url = new URL(request.url);
      const parts = url.pathname.split('/').filter(Boolean);
      id = parts[parts.length - 1];
    }

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    // Get appointment to find slot_id
    const { data: appointment, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('slot_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete appointment
    const { error: deleteError } = await supabaseAdmin
      .from('appointments')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // Free up slot if exists
    if (appointment?.slot_id) {
      await supabaseAdmin
        .from('doctor_slots')
        .update({ is_booked: false })
        .eq('id', appointment.slot_id);
    }

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete appointment' }, { status: 500 });
  }
}