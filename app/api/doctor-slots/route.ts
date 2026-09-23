// app/api/doctor-slots/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { cleanupPastSlots } from '@/lib/slots-cleanup';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    // Automatically clean up past slots in background
    cleanupPastSlots().catch((err) => console.error('Auto cleanup past slots error:', err));
    
    let query = supabaseAdmin
      .from('doctor_slots')
      .select('*')
      .order('slot_date', { ascending: true })
      .order('start_time', { ascending: true });

    const includePast = searchParams.get('include_past') === 'true';
    if (!includePast && !searchParams.get('slot_date')) {
      query = query.gte('slot_date', todayIST);
    }

    const doctorId = searchParams.get('doctor_id');
    if (doctorId) {
      query = query.eq('doctor_id', doctorId);
    }

    const slotDate = searchParams.get('slot_date');
    if (slotDate) {
      query = query.eq('slot_date', slotDate);
    }

    const isBooked = searchParams.get('is_booked');
    if (isBooked !== null) {
      query = query.eq('is_booked', isBooked === 'true');
    }

    const { data: slots, error } = await query;

    if (error) throw error;

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data: slot, error } = await supabaseAdmin
      .from('doctor_slots')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(slot, { status: 201 });
  } catch (error) {
    console.error('Error creating slot:', error);
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cleanupPast = searchParams.get('cleanup_past');

    if (cleanupPast === 'true') {
      const result = await cleanupPastSlots();
      return NextResponse.json({
        success: true,
        message: `Deleted ${result.deleted} past slots.`,
        ...result,
      });
    }

    const slotId = searchParams.get('id');
    if (slotId) {
      const { error } = await supabaseAdmin
        .from('doctor_slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Slot deleted successfully' });
    }

    return NextResponse.json({ error: 'Missing slot id or cleanup_past flag' }, { status: 400 });
  } catch (error: any) {
    console.error('Error deleting slot:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete slot' }, { status: 500 });
  }
}