// app/api/staff/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

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
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    const { data: staff, error } = await supabaseAdmin
      .from('staff')
      .update({ ...cleanBody, updated_at: new Date().toISOString() })
      .eq('id', targetId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(staff);
  } catch (error: any) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update staff' }, { status: 500 });
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
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Staff deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete staff' }, { status: 500 });
  }
}