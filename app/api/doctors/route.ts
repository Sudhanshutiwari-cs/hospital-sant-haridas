// app/api/doctors/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let query = supabaseAdmin
      .from('doctors')
      .select('*')
      .order('created_at', { ascending: false });

    const isActive = searchParams.get('is_active');
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    const specialization = searchParams.get('specialization');
    if (specialization) {
      query = query.eq('specialization', specialization);
    }

    const { data: doctors, error } = await query;

    if (error) throw error;

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Get the role_id for doctor
    const { data: roleData } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('role_name', 'doctor')
      .single();

    const doctorData = {
      ...body,
      role_id: roleData?.id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: doctor, error } = await supabaseAdmin
      .from('doctors')
      .insert([doctorData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}