// app/api/receptionists/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: member, error } = await supabaseAdmin
      .from('staff')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    return NextResponse.json(member);
  } catch (error: any) {
    console.error('Error fetching receptionist:', error);
    return NextResponse.json({ error: 'Failed to fetch receptionist' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { data: member, error } = await supabaseAdmin
      .from('staff')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(member);
  } catch (error: any) {
    console.error('Error updating receptionist:', error);
    return NextResponse.json({ error: 'Failed to update receptionist' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('staff')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ message: 'Receptionist deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting receptionist:', error);
    return NextResponse.json({ error: 'Failed to delete receptionist' }, { status: 500 });
  }
}
