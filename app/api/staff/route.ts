// app/api/staff/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    let query = supabaseAdmin
      .from('staff')
      .select(`
        *,
        roles:role_id (role_name)
      `)
      .order('created_at', { ascending: false });

    const roleId = searchParams.get('role_id');
    if (roleId) {
      query = query.eq('role_id', roleId);
    }

    const isActive = searchParams.get('is_active');
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: staff, error } = await query;

    if (error) throw error;

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const staffData = {
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: staff, error } = await supabaseAdmin
      .from('staff')
      .insert([staffData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}