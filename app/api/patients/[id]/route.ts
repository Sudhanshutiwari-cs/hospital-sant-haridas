// app/api/patients/[id]/route.ts
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
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    const { data: patient, error } = await supabaseAdmin
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(patient);
  } catch (error: any) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch patient' }, { status: 500 });
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

    if (!id) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    const body = await request.json();

    // Prevent modifying primary key or created_at
    const { id: _ignoredId, created_at: _ignoredCreated, ...updateData } = body;

    const { data: patient, error } = await supabaseAdmin
      .from('patients')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(patient);
  } catch (error: any) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update patient' }, { status: 500 });
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
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('patients')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting patient:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete patient' }, { status: 500 });
  }
}