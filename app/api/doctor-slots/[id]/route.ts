// app/api/doctor-slots/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const { data: slot, error } = await supabaseAdmin
      .from('doctor_slots')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(slot);
  } catch (error) {
    console.error('Error updating slot:', error);
    return NextResponse.json({ error: 'Failed to update slot' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('doctor_slots')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
  }
}