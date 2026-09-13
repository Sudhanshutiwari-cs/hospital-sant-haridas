// app/api/receptionists/[id]/route.ts
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
      return NextResponse.json({ error: 'Receptionist ID is required' }, { status: 400 });
    }

    const { data: member, error } = await supabaseAdmin
      .from('staff')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return NextResponse.json(member);
  } catch (error: any) {
    console.error('Error fetching receptionist:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch receptionist' }, { status: 500 });
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
    const { id: bodyId, roles: _roles, ...cleanBody } = body;
    const targetId = id || bodyId;

    if (!targetId) {
      return NextResponse.json({ error: 'Receptionist ID is required' }, { status: 400 });
    }

    // Check if receptionist exists and sync email with auth if needed
    const { data: existingMember } = await supabaseAdmin
      .from('staff')
      .select('*')
      .eq('id', targetId)
      .maybeSingle();

    if (!existingMember) {
      return NextResponse.json({ error: 'Receptionist not found' }, { status: 404 });
    }

    if (cleanBody.email && existingMember.user_id && cleanBody.email !== existingMember.email) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(existingMember.user_id, {
          email: cleanBody.email.trim().toLowerCase(),
          email_confirm: true,
        });
      } catch (authErr) {
        console.warn('Could not update auth email:', authErr);
      }
    }

    const { data: member, error } = await supabaseAdmin
      .from('staff')
      .update({
        ...cleanBody,
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(member);
  } catch (error: any) {
    console.error('Error updating receptionist:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update receptionist' }, { status: 500 });
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
      return NextResponse.json({ error: 'Receptionist ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Receptionist deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting receptionist:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete receptionist' }, { status: 500 });
  }
}
