// app/api/doctor-schedules/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let query = supabaseAdmin
      .from('doctor_schedules')
      .select('*')
      .order('day_of_week', { ascending: true });

    const doctorId = searchParams.get('doctor_id');
    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    const isAvailable = searchParams.get('is_available');
    if (isAvailable !== null) {
      query = query.eq('is_available', isAvailable === 'true');
    }

    const { data: schedules, error } = await query;

    if (error) throw error;

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: schedule, error } = await supabaseAdmin
      .from('doctor_schedules')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}