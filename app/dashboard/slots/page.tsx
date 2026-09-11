// app/dashboard/slots/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

interface DoctorSlot {
  id: string;
  doctor_id: string | null;
  schedule_id: string | null;
  slot_date: string;
  start_time: string;
  end_time: string;
  slot_type: string;
  is_booked: boolean;
  is_available: boolean;
  created_at: string;
}

interface Doctor {
  id: string;
  full_name: string;
}

interface DoctorSchedule {
  id: string;
  doctor_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  break_start_time: string | null;
  break_end_time: string | null;
  is_available: boolean;
}

const DOW = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const toHHMM = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export default function SlotsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [generating, setGenerating] = useState(false);

  const [bulk, setBulk] = useState({
    doctor_id: '',
    slot_type: 'consultation',
    duration_minutes: 30,
    start_date: '',
    end_date: '',
    days_of_week: [1, 2, 3, 4, 5] as number[],
    day_start: '09:00',
    day_end: '13:00',
    use_break: false,
    break_start: '11:00',
    break_end: '11:15',
    skip_existing: true,
  });

  const [preview, setPreview] = useState({ count: 0, perDay: 0, invalidDays: [] as number[] });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    computePreview();
  }, [bulk, schedules]);

  useEffect(() => {
    if (bulk.doctor_id) {
      fetchSchedules(bulk.doctor_id);
    } else {
      setSchedules([]);
    }
  }, [bulk.doctor_id]);

  const fetchSchedules = async (doctorId: string) => {
    const { data, error } = await supabase
      .from('doctor_schedules')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('is_available', true);

    if (error) {
      console.error('Error fetching schedules:', error);
      setSchedules([]);
      return;
    }
    setSchedules(data || []);
  };

  // Compute effective day window = intersection of user input and doctor's schedule
  // Also exclude doctor's break window
  const computeDayWindow = (dow: number) => {
    const sch = schedules.find(s => s.day_of_week === dow);
    if (!sch) return null;

    const inputStart = toMin(bulk.day_start);
    const inputEnd = toMin(bulk.day_end);
    const schStart = toMin(sch.start_time);
    const schEnd = toMin(sch.end_time);

    // Working window = intersection
    const winStart = Math.max(inputStart, schStart);
    const winEnd = Math.min(inputEnd, schEnd);

    if (winStart >= winEnd) return null;

    // Merge breaks: doctor's own break + user's optional break
    const breaks: Array<{ start: number; end: number }> = [];
    if (sch.break_start_time && sch.break_end_time) {
      breaks.push({ start: toMin(sch.break_start_time), end: toMin(sch.break_end_time) });
    }
    if (bulk.use_break) {
      breaks.push({ start: toMin(bulk.break_start), end: toMin(bulk.break_end) });
    }

    return { winStart, winEnd, breaks };
  };

  const computePreview = () => {
    const { start_date, end_date, days_of_week, duration_minutes } = bulk;
    if (!start_date || !end_date || !duration_minutes) {
      setPreview({ count: 0, perDay: 0, invalidDays: [] });
      return;
    }

    // Per selected day, compute how many slots would be created
    const perDayMap: Record<number, number> = {};
    const invalidDays: number[] = [];

    for (const dow of days_of_week) {
      const window = computeDayWindow(dow);
      if (!window) {
        perDayMap[dow] = 0;
        invalidDays.push(dow);
        continue;
      }

      let count = 0;
      let cur = window.winStart;
      while (cur + duration_minutes <= window.winEnd) {
        const slotEnd = cur + duration_minutes;
        const inBreak = window.breaks.some(b => cur < b.end && slotEnd > b.start);
        if (inBreak) {
          // jump to end of the break that overlaps
          const overlapping = window.breaks.find(b => cur < b.end && slotEnd > b.start);
          cur = overlapping ? overlapping.end : slotEnd;
          continue;
        }
        count++;
        cur = slotEnd;
      }
      perDayMap[dow] = count;
    }

    // Total across date range
    const start = new Date(start_date + 'T00:00:00');
    const end = new Date(end_date + 'T00:00:00');
    let total = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dow = d.getDay();
      if (!days_of_week.includes(dow)) continue;
      total += perDayMap[dow] || 0;
    }

    // Show the *smallest* per-day count as "perDay" for display, or 0 if any invalid
    const validCounts = days_of_week
      .filter(d => !invalidDays.includes(d))
      .map(d => perDayMap[d] || 0);
    const minPerDay = validCounts.length > 0 ? Math.min(...validCounts) : 0;

    setPreview({ count: total, perDay: minPerDay, invalidDays });
  };

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (doctorData) {
        setCurrentUser({ role: 'doctor', doctorId: doctorData.id });
        setBulk(prev => ({ ...prev, doctor_id: doctorData.id }));

        const [slotsRes, schedulesRes] = await Promise.all([
          supabase.from('doctor_slots')
            .select('*')
            .eq('doctor_id', doctorData.id)
            .order('slot_date', { ascending: true })
            .order('start_time', { ascending: true }),
          supabase.from('doctor_schedules')
            .select('*')
            .eq('doctor_id', doctorData.id)
            .eq('is_available', true),
        ]);

        setSlots(slotsRes.data || []);
        setSchedules(schedulesRes.data || []);
        setLoading(false);
        return;
      }

      const { data: staffData } = await supabase
        .from('staff')
        .select('id, roles(role_name)')
        .eq('user_id', session.user.id)
        .single();

      if (staffData) {
        setCurrentUser({ role: staffData.roles?.role_name || 'receptionist' });

        const [slotsRes, doctorsRes] = await Promise.all([
          supabase.from('doctor_slots').select('*')
            .order('slot_date', { ascending: true })
            .order('start_time', { ascending: true }),
          supabase.from('doctors').select('id, full_name'),
        ]);

        setSlots(slotsRes.data || []);
        setDoctors(doctorsRes.data || []);
        setLoading(false);
        return;
      }

      router.push('/login');
    } catch (error) {
      console.error('Error fetching slots:', error);
      setLoading(false);
    }
  };

  const toggleDay = (dow: number) => {
    const hasSchedule = schedules.some(s => s.day_of_week === dow);
    if (!hasSchedule) return;

    setBulk(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(dow)
        ? prev.days_of_week.filter(d => d !== dow)
        : [...prev.days_of_week, dow].sort(),
    }));
  };

  // Adjust working hours to fit inside doctor's schedule for the selected days
  const applySuggestionForDay = (dow: number) => {
    const sch = schedules.find(s => s.day_of_week === dow);
    if (!sch) return;

    setBulk(prev => ({
      ...prev,
      day_start: sch.start_time.slice(0, 5),
      day_end: sch.end_time.slice(0, 5),
      use_break: !!(sch.break_start_time && sch.break_end_time),
      break_start: sch.break_start_time?.slice(0, 5) || prev.break_start,
      break_end: sch.break_end_time?.slice(0, 5) || prev.break_end,
    }));
  };

  const generateSlots = async () => {
    if (generating) return;

    if (!bulk.start_date || !bulk.end_date) {
      alert('Please pick a date range'); return;
    }
    if (bulk.end_date < bulk.start_date) {
      alert('End date must be after start date'); return;
    }
    if (bulk.days_of_week.length === 0) {
      alert('Pick at least one day of the week'); return;
    }
    if (toMin(bulk.day_end) <= toMin(bulk.day_start)) {
      alert('End time must be after start time'); return;
    }

    const doctorId = currentUser?.role === 'doctor' ? currentUser.doctorId : bulk.doctor_id;
    if (!doctorId) { alert('Please select a doctor'); return; }

    const scheduleDays = new Set(schedules.map(s => s.day_of_week));
    const validDays = bulk.days_of_week.filter(d => scheduleDays.has(d));

    if (validDays.length === 0) {
      alert('The doctor has no schedules for the selected days. Please add a schedule first.');
      return;
    }

    // Ensure each selected day actually has at least 1 slot after intersections
    const zeroDays: number[] = [];
    for (const d of validDays) {
      const w = computeDayWindow(d);
      if (!w) { zeroDays.push(d); continue; }
      let count = 0;
      let cur = w.winStart;
      while (cur + bulk.duration_minutes <= w.winEnd) {
        const slotEnd = cur + bulk.duration_minutes;
        const inBreak = w.breaks.some(b => cur < b.end && slotEnd > b.start);
        if (inBreak) {
          const overlapping = w.breaks.find(b => cur < b.end && slotEnd > b.start);
          cur = overlapping ? overlapping.end : slotEnd;
          continue;
        }
        count++;
        cur = slotEnd;
      }
      if (count === 0) zeroDays.push(d);
    }

    if (zeroDays.length > 0) {
      const names = zeroDays.map(d => DOW.find(x => x.value === d)?.label).join(', ');
      alert(`These days don't overlap with the doctor's schedule or have no room for slots: ${names}`);
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.rpc('bulk_create_slots', {
        p_doctor_id: doctorId,
        p_slot_type: bulk.slot_type,
        p_duration_minutes: bulk.duration_minutes,
        p_start_date: bulk.start_date,
        p_end_date: bulk.end_date,
        p_days_of_week: validDays,
        p_day_start: bulk.day_start,
        p_day_end: bulk.day_end,
        p_break_start: bulk.use_break ? bulk.break_start : null,
        p_break_end: bulk.use_break ? bulk.break_end : null,
        p_skip_existing: bulk.skip_existing,
      });

      if (error) throw error;

      const result = data?.[0];
      alert(`✅ Inserted ${result?.inserted_count ?? 0} slots. Skipped ${result?.skipped_count ?? 0} duplicates.`);

      setShowAddModal(false);
      fetchData();
    } catch (err) {
      console.error('Bulk generate error:', err);
      alert('Failed: ' + (err as any).message);
    } finally {
      setGenerating(false);
    }
  };

  const toggleSlotAvailability = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('doctor_slots')
      .update({ is_available: !currentStatus })
      .eq('id', id);
    if (!error) fetchData();
  };

  const filteredSlots = slots.filter(slot => {
    const matchesDoctor = filterDoctor === 'all' || slot.doctor_id === filterDoctor;
    const matchesDate = filterDate === '' || slot.slot_date === filterDate;
    return matchesDoctor && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {currentUser?.role === 'doctor' ? 'My Time Slots' : 'Time Slots'}
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Generate Slots
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          {currentUser?.role !== 'doctor' && (
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Doctors</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.full_name}</option>
              ))}
            </select>
          )}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {currentUser?.role !== 'doctor' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSlots.map((slot) => (
                <tr key={slot.id} className="hover:bg-gray-50">
                  {currentUser?.role !== 'doctor' && (
                    <td className="px-6 py-4">
                      {doctors.find(d => d.id === slot.doctor_id)?.full_name}
                    </td>
                  )}
                  <td className="px-6 py-4">{slot.slot_date}</td>
                  <td className="px-6 py-4">{slot.start_time}</td>
                  <td className="px-6 py-4">{slot.end_time}</td>
                  <td className="px-6 py-4">{slot.slot_type}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`px-2 py-1 rounded text-xs ${
                        slot.is_booked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {slot.is_booked ? 'Booked' : 'Available'}
                      </span>
                      {!slot.is_available && (
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800 block w-fit">
                          Disabled
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {!slot.is_booked && (
                      <button
                        onClick={() => toggleSlotAvailability(slot.id, slot.is_available)}
                        className={`text-sm ${
                          slot.is_available ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {slot.is_available ? 'Disable' : 'Enable'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredSlots.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No slots found. Click <b>Generate Slots</b> to create a batch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Generate Time Slots</h2>

            <div className="space-y-4">
              {currentUser?.role !== 'doctor' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor</label>
                  <select
                    value={bulk.doctor_id}
                    onChange={(e) => setBulk({ ...bulk, doctor_id: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                    ))}
                  </select>
                </div>
              )}

              {bulk.doctor_id && (
                <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs">
                  <div className="font-medium text-gray-700 mb-2">Doctor's Weekly Schedule</div>
                  {schedules.length === 0 ? (
                    <div className="text-red-600">
                      ⚠️ No schedules found for this doctor. Please add a schedule first.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {DOW.map(d => {
                        const sch = schedules.find(s => s.day_of_week === d.value);
                        return (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => sch && applySuggestionForDay(d.value)}
                            disabled={!sch}
                            title={sch ? 'Click to auto-fill working hours from this day' : 'No schedule'}
                            className={`px-2 py-1 rounded text-left ${
                              sch
                                ? 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <span className="font-medium">{d.label}</span>
                            {sch && (
                              <span className="ml-1">
                                {sch.start_time.slice(0, 5)}-{sch.end_time.slice(0, 5)}
                                {sch.break_start_time && sch.break_end_time && (
                                  <span className="ml-1 text-green-600">
                                    (break {sch.break_start_time.slice(0, 5)}-{sch.break_end_time.slice(0, 5)})
                                  </span>
                                )}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="mt-2 text-gray-500">
                    Tip: click a day to auto-fill the working hours below.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Slot Type</label>
                  <select
                    value={bulk.slot_type}
                    onChange={(e) => setBulk({ ...bulk, slot_type: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <select
                    value={bulk.duration_minutes}
                    onChange={(e) => setBulk({ ...bulk, duration_minutes: Number(e.target.value) })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={bulk.start_date}
                    onChange={(e) => setBulk({ ...bulk, start_date: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={bulk.end_date}
                    onChange={(e) => setBulk({ ...bulk, end_date: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Days of Week
                  <span className="text-xs text-gray-500 ml-2">
                    (only days with schedules are selectable)
                  </span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {DOW.map(d => {
                    const hasSchedule = schedules.some(s => s.day_of_week === d.value);
                    const isSelected = bulk.days_of_week.includes(d.value);
                    return (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => toggleDay(d.value)}
                        disabled={!hasSchedule}
                        title={!hasSchedule ? 'No schedule for this day' : ''}
                        className={`px-3 py-1 rounded border text-sm ${
                          isSelected
                            ? 'bg-blue-500 text-white border-blue-500'
                            : hasSchedule
                              ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Working Hours From</label>
                  <input
                    type="time"
                    value={bulk.day_start}
                    onChange={(e) => setBulk({ ...bulk, day_start: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Working Hours To</label>
                  <input
                    type="time"
                    value={bulk.day_end}
                    onChange={(e) => setBulk({ ...bulk, day_end: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={bulk.use_break}
                    onChange={(e) => setBulk({ ...bulk, use_break: e.target.checked })}
                  />
                  Add a break window
                </label>
                {bulk.use_break && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="time"
                      value={bulk.break_start}
                      onChange={(e) => setBulk({ ...bulk, break_start: e.target.value })}
                      className="border rounded px-3 py-2"
                    />
                    <input
                      type="time"
                      value={bulk.break_end}
                      onChange={(e) => setBulk({ ...bulk, break_end: e.target.value })}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={bulk.skip_existing}
                  onChange={(e) => setBulk({ ...bulk, skip_existing: e.target.checked })}
                />
                Skip slots that already exist (recommended)
              </label>

              {bulk.doctor_id && schedules.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs">
                  <div className="font-medium text-amber-900 mb-2">
                    Effective windows (intersection of your input & doctor's schedule)
                  </div>
                  <div className="space-y-1">
                    {bulk.days_of_week.map(dow => {
                      const w = computeDayWindow(dow);
                      const label = DOW.find(x => x.value === dow)?.label;
                      if (!w) {
                        return (
                          <div key={dow} className="text-red-600">
                            <b>{label}:</b> no overlap — 0 slots
                          </div>
                        );
                      }
                      const breakStr = w.breaks.length
                        ? w.breaks.map(b => `${toHHMM(b.start)}-${toHHMM(b.end)}`).join(', ')
                        : 'none';
                      return (
                        <div key={dow} className="text-amber-800">
                          <b>{label}:</b> {toHHMM(w.winStart)} → {toHHMM(w.winEnd)}
                          <span className="text-amber-600"> (breaks: {breakStr})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                <div className="font-medium text-blue-900">
                  Preview: ~{preview.perDay} slot{preview.perDay !== 1 ? 's' : ''} per selected day
                </div>
                <div className="text-blue-700">
                  Total ~<b>{preview.count}</b> slots will be generated.
                </div>
                {preview.invalidDays.length > 0 && (
                  <div className="text-red-600 mt-1">
                    ⚠️ No valid window on:{' '}
                    {preview.invalidDays.map(d => DOW.find(x => x.value === d)?.label).join(', ')}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
                disabled={generating}
              >
                Cancel
              </button>
              <button
                onClick={generateSlots}
                disabled={generating || preview.count === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {generating ? 'Generating...' : `Generate ${preview.count} Slots`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}