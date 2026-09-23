// lib/slots-cleanup.ts
import 'server-only';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Automatically delete past dates' slots (where slot_date < today in Asia/Kolkata timezone).
 * Before deleting, safely detaches any appointment referencing those slot IDs so
 * historical appointments and medical records remain completely intact.
 */
export async function cleanupPastSlots(): Promise<{ deleted: number; today: string }> {
  try {
    const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    // 1. Fetch IDs of slots strictly before today's date
    const { data: pastSlots, error: fetchErr } = await supabaseAdmin
      .from('doctor_slots')
      .select('id')
      .lt('slot_date', todayIST);

    if (fetchErr) {
      console.error('Error fetching past slots for cleanup:', fetchErr);
      return { deleted: 0, today: todayIST };
    }

    if (!pastSlots || pastSlots.length === 0) {
      return { deleted: 0, today: todayIST };
    }

    const pastIds = pastSlots.map((s) => s.id);

    // 2. Safely detach slot_id on any appointments that reference these past slots
    const { error: detachErr } = await supabaseAdmin
      .from('appointments')
      .update({ slot_id: null })
      .in('slot_id', pastIds);

    if (detachErr) {
      console.error('Error detaching slot_id from appointments during cleanup:', detachErr);
    }

    // 3. Delete past slots from doctor_slots
    const { error: delErr } = await supabaseAdmin
      .from('doctor_slots')
      .delete()
      .in('id', pastIds);

    if (delErr) {
      console.error('Error deleting past slots:', delErr);
      return { deleted: 0, today: todayIST };
    }

    return { deleted: pastIds.length, today: todayIST };
  } catch (error) {
    console.error('Failed to cleanup past slots:', error);
    return { deleted: 0, today: new Date().toISOString().split('T')[0] };
  }
}
