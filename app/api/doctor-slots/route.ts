// app/api/doctor-slots/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let query = supabaseAdmin
      .from('doctor_slots')
      .select('*')
      .order('slot_date', { ascending: true })
      .order('start_time', { ascending: true });

    const doctorId = searchParams.get('doctor_id');
    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    const slotDate = searchParams.get('slot_date');
    if (slotDate) {
      query = query.eq('slot_date', slotDate);
    }

    const isBooked = searchParams.get('is_booked');
    if (isBooked !== null) {
      query = query.eq('is_booked', isBooked === 'true');
    }

    const { data: slots, error } = await query;

    if (error) throw error;

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: slot, error } = await supabaseAdmin
      .from('doctor_slots')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(slot, { status: 201 });
  } catch (error) {
    console.error('Error creating slot:', error);
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 });
  }
}