// app/api/appointments/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let query = supabaseAdmin
      .from('appointments')
      .select(`
        *,
        doctors:doctor_id (full_name, specialization),
        patients:patient_id (full_name, phone)
      `)
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: true });

    const doctorId = searchParams.get('doctor_id');
    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    const patientId = searchParams.get('patient_id');
    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    const status = searchParams.get('status');
    if (status) {
      query = query.eq('status', status);
    }

    const appointmentDate = searchParams.get('appointment_date');
    if (appointmentDate) {
      query = query.eq('appointment_date', appointmentDate);
    }

    const { data: appointments, error } = await query;

    if (error) throw error;

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate appointment number
    const appointmentNumber = `APT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const appointmentData = {
      ...body,
      appointment_number: appointmentNumber,
      status: 'pending',
      payment_status: 'unpaid',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();

    if (error) throw error;

    // Update slot as booked if slot_id is provided
    if (body.slot_id) {
      await supabaseAdmin
        .from('doctor_slots')
        .update({ is_booked: true })
        .eq('id', body.slot_id);
    }

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}