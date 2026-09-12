// app/api/patients/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let query = supabaseAdmin
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    const gender = searchParams.get('gender');
    if (gender) {
      query = query.eq('gender', gender);
    }

    const city = searchParams.get('city');
    if (city) {
      query = query.eq('city', city);
    }

    const { data: patients, error } = await query;

    if (error) throw error;

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const patientData = {
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: patient, error } = await supabaseAdmin
      .from('patients')
      .insert([patientData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}