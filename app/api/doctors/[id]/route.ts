// app/api/doctors/[id]/route.ts
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
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const { data: doctor, error } = await supabaseAdmin
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(doctor);
  } catch (error: any) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch doctor' }, { status: 500 });
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
    const { id: bodyId, ...cleanBody } = body;
    const targetId = id || bodyId;

    if (!targetId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    // Check if doctor exists and sync email with auth if needed
    const { data: existingDoctor } = await supabaseAdmin
      .from('doctors')
      .select('*')
      .eq('id', targetId)
      .maybeSingle();

    if (!existingDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    if (cleanBody.email && existingDoctor.user_id && cleanBody.email !== existingDoctor.email) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(existingDoctor.user_id, {
          email: cleanBody.email.trim().toLowerCase(),
          email_confirm: true,
        });
      } catch (authErr) {
        console.warn('Could not update doctor auth email:', authErr);
      }
    }

    const { data: doctor, error } = await supabaseAdmin
      .from('doctors')
      .update({ ...cleanBody, updated_at: new Date().toISOString() })
      .eq('id', targetId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(doctor);
  } catch (error: any) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update doctor' }, { status: 500 });
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
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const { data: doctor, error } = await supabaseAdmin
      .from('doctors')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(doctor);
  } catch (error: any) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete doctor' }, { status: 500 });
  }
}