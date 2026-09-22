// app/api/doctor-slots/generate/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

interface GenerateRequest {
  doctor_id: string;
  slot_type?: string;
  duration_minutes: number;
  start_date: string;
  end_date: string;
  days_of_week: number[];
  day_start: string;
  day_end: string;
  use_break?: boolean;
  break_start?: string | null;
  break_end?: string | null;
  skip_existing?: boolean;
}

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const toHHMMSS = (min: number) => {
  const h = Math.floor(min / 60).toString().padStart(2, '0');
  const m = (min % 60).toString().padStart(2, '0');
  return `${h}:${m}:00`;
};

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();
    const {
      doctor_id,
      slot_type = 'consultation',
      duration_minutes,
      start_date,
      end_date,
      days_of_week,
      day_start,
      day_end,
      use_break = false,
      break_start = null,
      break_end = null,
      skip_existing = true,
    } = body;

    if (!doctor_id) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }
    if (!start_date || !end_date) {
      return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 });
    }
    if (!days_of_week || days_of_week.length === 0) {
      return NextResponse.json({ error: 'At least one day of the week must be selected' }, { status: 400 });
    }
    if (!duration_minutes || duration_minutes <= 0) {
      return NextResponse.json({ error: 'Invalid duration minutes' }, { status: 400 });
    }

    // 1. Fetch active weekly schedules for doctor (used for breaks and linking schedule_id)
    const { data: schedules } = await supabaseAdmin
      .from('doctor_schedules')
      .select('*')
      .eq('doctor_id', doctor_id)
      .eq('is_available', true);

    // 2. Fetch existing slots in the date range if skip_existing is enabled
    const existingSet = new Set<string>();
    if (skip_existing) {
      const { data: existingSlots, error: existErr } = await supabaseAdmin
        .from('doctor_slots')
        .select('slot_date, start_time')
        .eq('doctor_id', doctor_id)
        .gte('slot_date', start_date)
        .lte('slot_date', end_date);

      if (existErr) throw existErr;

      (existingSlots || []).forEach((s) => {
        const timeFormatted = s.start_time.slice(0, 5);
        existingSet.add(`${s.slot_date}_${timeFormatted}`);
      });
    }

    // 3. Generate slots for requested days and hours
    const start = new Date(start_date + 'T00:00:00');
    const end = new Date(end_date + 'T00:00:00');

    const slotsToInsert: any[] = [];
    let totalGenerated = 0;
    let skippedCount = 0;

    const winStart = toMin(day_start);
    const winEnd = toMin(day_end);

    if (winStart >= winEnd) {
      return NextResponse.json({ error: 'Shift end time must be after start time' }, { status: 400 });
    }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dow = d.getDay();
      if (!days_of_week.includes(dow)) continue;

      const sch = (schedules || []).find((s) => s.day_of_week === dow);

      const breaks: Array<{ start: number; end: number }> = [];
      if (sch?.break_start_time && sch?.break_end_time) {
        breaks.push({
          start: toMin(sch.break_start_time),
          end: toMin(sch.break_end_time),
        });
      }
      if (use_break && break_start && break_end) {
        breaks.push({
          start: toMin(break_start),
          end: toMin(break_end),
        });
      }

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      let cur = winStart;
      while (cur + duration_minutes <= winEnd) {
        const slotEnd = cur + duration_minutes;
        const overlapping = breaks.find((b) => cur < b.end && slotEnd > b.start);
        if (overlapping) {
          cur = overlapping.end;
          continue;
        }

        totalGenerated++;
        const timeFormatted = toHHMMSS(cur).slice(0, 5);
        const timeKey = `${dateStr}_${timeFormatted}`;

        if (skip_existing && existingSet.has(timeKey)) {
          skippedCount++;
        } else {
          slotsToInsert.push({
            doctor_id,
            schedule_id: sch?.id || null,
            slot_date: dateStr,
            start_time: toHHMMSS(cur),
            end_time: toHHMMSS(slotEnd),
            slot_type,
            is_booked: false,
            is_available: true,
          });
          existingSet.add(timeKey);
        }

        cur = slotEnd;
      }
    }

    // 4. Batch insert slots in chunks
    let insertedCount = 0;
    const chunkSize = 100;
    for (let i = 0; i < slotsToInsert.length; i += chunkSize) {
      const chunk = slotsToInsert.slice(i, i + chunkSize);
      const { error: insertErr } = await supabaseAdmin
        .from('doctor_slots')
        .insert(chunk);

      if (insertErr) throw insertErr;
      insertedCount += chunk.length;
    }

    return NextResponse.json({
      success: true,
      inserted_count: insertedCount,
      skipped_count: skippedCount,
      total_count: totalGenerated,
    });
  } catch (error: any) {
    console.error('Error generating slots:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate slots' },
      { status: 500 }
    );
  }
}
