// app/dashboard/slots/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { formatDoctorName, cleanDoctorName } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Sparkles,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Layers,
  ChevronRight,
  Stethoscope,
  X,
  Check,
  CalendarDays,
  SlidersHorizontal,
  Info,
  Trash2,
} from 'lucide-react';

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
  { label: 'Sun', full: 'Sunday', value: 0 },
  { label: 'Mon', full: 'Monday', value: 1 },
  { label: 'Tue', full: 'Tuesday', value: 2 },
  { label: 'Wed', full: 'Wednesday', value: 3 },
  { label: 'Thu', full: 'Thursday', value: 4 },
  { label: 'Fri', full: 'Friday', value: 5 },
  { label: 'Sat', full: 'Saturday', value: 6 },
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'booked' | 'disabled'>('all');
  const [generating, setGenerating] = useState(false);
  const [actionSlotId, setActionSlotId] = useState<string | null>(null);
  const todayIST = useMemo(() => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }), []);
  const [cleaningPast, setCleaningPast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Default start_date and end_date to today on mount
  useEffect(() => {
    setBulk(prev => ({
      ...prev,
      start_date: prev.start_date || todayIST,
      end_date: prev.end_date || todayIST,
    }));
  }, [todayIST]);

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
  const computeDayWindow = (dow: number) => {
    const sch = schedules.find(s => s.day_of_week === dow);
    const inputStart = toMin(bulk.day_start);
    const inputEnd = toMin(bulk.day_end);

    const winStart = inputStart;
    const winEnd = inputEnd;

    if (winStart >= winEnd) return null;

    // Merge breaks: doctor's own break + user's optional break
    const breaks: Array<{ start: number; end: number }> = [];
    if (sch?.break_start_time && sch?.break_end_time) {
      breaks.push({ start: toMin(sch.break_start_time), end: toMin(sch.break_end_time) });
    }
    if (bulk.use_break && bulk.break_start && bulk.break_end) {
      breaks.push({ start: toMin(bulk.break_start), end: toMin(bulk.break_end) });
    }

    return { winStart, winEnd, breaks };
  };

  const computePreview = () => {
    const { start_date, end_date, days_of_week, duration_minutes } = bulk;
    if (!start_date || !end_date || days_of_week.length === 0 || !duration_minutes) {
      setPreview({ count: 0, perDay: 0, invalidDays: [] });
      return;
    }

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
          const overlapping = window.breaks.find(b => cur < b.end && slotEnd > b.start);
          cur = overlapping ? overlapping.end : slotEnd;
          continue;
        }
        count++;
        cur = slotEnd;
      }
      perDayMap[dow] = count;
    }

    // Total across date range (skipping any dates in the past)
    const start = new Date(start_date + 'T00:00:00');
    const end = new Date(end_date + 'T00:00:00');
    let total = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dStr = `${yyyy}-${mm}-${dd}`;
      if (dStr < todayIST) continue; // Skip past dates

      const dow = d.getDay();
      if (!days_of_week.includes(dow)) continue;
      total += perDayMap[dow] || 0;
    }

    const validCounts = days_of_week
      .filter(d => !invalidDays.includes(d))
      .map(d => perDayMap[d] || 0);
    const minPerDay = validCounts.length > 0 ? Math.min(...validCounts) : 0;

    setPreview({ count: total, perDay: minPerDay, invalidDays });
  };

  const handleCleanPastSlots = async (quiet = false) => {
    try {
      setCleaningPast(true);
      const res = await fetch('/api/doctor-slots/cleanup', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (!quiet) {
          setToastMessage(
            data.deleted > 0
              ? `Cleaned up ${data.deleted} past date slot(s).`
              : 'All slots are up to date. No past slots found.'
          );
          setTimeout(() => setToastMessage(null), 3500);
        }
        fetchData();
      }
    } catch (err) {
      console.error('Error cleaning past slots:', err);
    } finally {
      setCleaningPast(false);
    }
  };

  const fetchData = async () => {
    try {
      // Auto-purge past slots in background on page visit
      fetch('/api/doctor-slots/cleanup', { method: 'POST' }).catch((e) =>
        console.error('Auto cleanup error:', e)
      );

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
            .gte('slot_date', todayIST)
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
          supabase.from('doctor_slots')
            .select('*')
            .gte('slot_date', todayIST)
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
    setBulk(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(dow)
        ? prev.days_of_week.filter(d => d !== dow)
        : [...prev.days_of_week, dow].sort(),
    }));
  };

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
      alert('Please select a valid start and end date'); return;
    }
    if (bulk.end_date < bulk.start_date) {
      alert('End date must be after start date'); return;
    }
    if (bulk.days_of_week.length === 0) {
      alert('Please pick at least one day of the week'); return;
    }
    if (toMin(bulk.day_end) <= toMin(bulk.day_start)) {
      alert('End time must be later than start time'); return;
    }

    const doctorId = currentUser?.role === 'doctor' ? currentUser.doctorId : bulk.doctor_id;
    if (!doctorId) { alert('Please select a doctor'); return; }

    const validDays = bulk.days_of_week;
    if (validDays.length === 0) {
      alert('Please select at least one day of the week');
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/doctor-slots/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor_id: doctorId,
          slot_type: bulk.slot_type,
          duration_minutes: bulk.duration_minutes,
          start_date: bulk.start_date,
          end_date: bulk.end_date,
          days_of_week: validDays,
          day_start: bulk.day_start,
          day_end: bulk.day_end,
          use_break: bulk.use_break,
          break_start: bulk.use_break ? bulk.break_start : null,
          break_end: bulk.use_break ? bulk.break_end : null,
          skip_existing: bulk.skip_existing,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to generate slots');
      }

      alert(`Successfully generated ${result?.inserted_count ?? 0} slots. (${result?.skipped_count ?? 0} duplicates skipped)`);

      setShowAddModal(false);
      fetchData();
    } catch (err: any) {
      console.error('Bulk generate error:', err);
      alert('Generation failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setGenerating(false);
    }
  };

  const toggleSlotAvailability = async (id: string, currentStatus: boolean) => {
    setActionSlotId(id);
    try {
      const { error } = await supabase
        .from('doctor_slots')
        .update({ is_available: !currentStatus })
        .eq('id', id);

      if (!error) {
        setSlots(prev => prev.map(s => s.id === id ? { ...s, is_available: !currentStatus } : s));
      }
    } finally {
      setActionSlotId(null);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = slots.length;
    const booked = slots.filter(s => s.is_booked).length;
    const available = slots.filter(s => !s.is_booked && s.is_available).length;
    const disabled = slots.filter(s => !s.is_booked && !s.is_available).length;
    return { total, booked, available, disabled };
  }, [slots]);

  const filteredSlots = useMemo(() => {
    return slots.filter(slot => {
      const matchesDoctor = filterDoctor === 'all' || slot.doctor_id === filterDoctor;
      const matchesDate = filterDate === '' || slot.slot_date === filterDate;
      let matchesStatus = true;
      if (filterStatus === 'booked') matchesStatus = slot.is_booked;
      else if (filterStatus === 'available') matchesStatus = !slot.is_booked && slot.is_available;
      else if (filterStatus === 'disabled') matchesStatus = !slot.is_booked && !slot.is_available;

      return matchesDoctor && matchesDate && matchesStatus;
    });
  }, [slots, filterDoctor, filterDate, filterStatus]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 border-t-transparent"></div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loading slots...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {currentUser?.role === 'doctor' ? 'My Time Slots' : 'Time Slots Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate, monitor, and regulate appointment availability windows.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCleanPastSlots(false)}
            disabled={cleaningPast}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm shadow-xs transition-all active:scale-[0.99] disabled:opacity-50"
            title="Purge past dates' slots that are prior to today"
          >
            <Trash2 className={`w-4 h-4 text-slate-500 ${cleaningPast ? 'animate-spin' : ''}`} />
            <span>{cleaningPast ? 'Cleaning...' : 'Clean Past Slots'}</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Slots</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Slots</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{metrics.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Available</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{metrics.available}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Booked</p>
            <p className="text-2xl font-bold text-rose-600 mt-0.5">{metrics.booked}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Disabled</p>
            <p className="text-2xl font-bold text-slate-700 mt-0.5">{metrics.disabled}</p>
          </div>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {currentUser?.role !== 'doctor' && (
            <div className="relative min-w-[200px]">
              <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                aria-label="Filter by doctor"
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="all">All Doctors</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="relative min-w-[170px]">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              aria-label="Filter by slot date"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Quick status tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs">
            {(['all', 'available', 'booked', 'disabled'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  filterStatus === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {(filterDoctor !== 'all' || filterDate !== '' || filterStatus !== 'all') && (
          <button
            onClick={() => {
              setFilterDoctor('all');
              setFilterDate('');
              setFilterStatus('all');
            }}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 self-center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset filters
          </button>
        )}
      </div>

      {/* Slots Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                {currentUser?.role !== 'doctor' && (
                  <th className="py-3 px-4">Doctor</th>
                )}
                <th className="py-3 px-4">Slot Date</th>
                <th className="py-3 px-4">Time Window</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Toggle Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSlots.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No matching time slots found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Adjust your date or doctor filters, or generate a new batch of slots.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSlots.map((slot) => {
                  const doc = doctors.find(d => d.id === slot.doctor_id);

                  return (
                    <tr key={slot.id} className="hover:bg-slate-50/60 transition-colors">
                      {currentUser?.role !== 'doctor' && (
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                              {cleanDoctorName(doc?.full_name).charAt(0) || 'D'}
                            </div>
                            <span className="font-semibold text-slate-800">
                              {formatDoctorName(doc?.full_name, 'Unassigned')}
                            </span>
                          </div>
                        </td>
                      )}

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {new Date(slot.slot_date + 'T00:00:00').toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium text-[11px] capitalize ${
                          slot.slot_type === 'consultation'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                            : slot.slot_type === 'emergency'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/50'
                            : 'bg-purple-50 text-purple-700 border border-purple-200/50'
                        }`}>
                          {slot.slot_type.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {slot.is_booked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Booked
                          </span>
                        ) : slot.is_available ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Disabled
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {slot.is_booked ? (
                          <span className="text-[11px] text-slate-400 italic">Locked (Booked)</span>
                        ) : (
                          <button
                            onClick={() => toggleSlotAvailability(slot.id, slot.is_available)}
                            disabled={actionSlotId === slot.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              slot.is_available
                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/60'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                            }`}
                          >
                            {actionSlotId === slot.id ? (
                              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : slot.is_available ? (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                Disable
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Enable
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Generate Slots Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Generate Time Slots Batch</h2>
                  <p className="text-xs text-slate-500">Auto-create multi-day consultation availability</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 pt-4">
              {currentUser?.role !== 'doctor' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Doctor <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={bulk.doctor_id}
                    onChange={(e) => setBulk({ ...bulk, doctor_id: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{formatDoctorName(doc.full_name)}</option>
                    ))}
                  </select>
                </div>
              )}

              {bulk.doctor_id && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800">Doctor's Active Weekly Schedules</span>
                    <span className="text-[11px] text-slate-500">Click a day to sync hours</span>
                  </div>
                  {schedules.length === 0 ? (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-amber-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>No active schedules found for this doctor. Please configure weekly schedule first.</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {DOW.map(d => {
                        const sch = schedules.find(s => s.day_of_week === d.value);
                        return (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => sch && applySuggestionForDay(d.value)}
                            disabled={!sch}
                            className={`px-2.5 py-1.5 rounded-xl text-left border transition-all text-[11px] ${
                              sch
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer'
                                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <span className="font-bold">{d.label}</span>
                            {sch && (
                              <span className="ml-1 text-[10px] text-emerald-700 font-mono">
                                {sch.start_time.slice(0, 5)}-{sch.end_time.slice(0, 5)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Slot Type
                  </label>
                  <select
                    value={bulk.slot_type}
                    onChange={(e) => setBulk({ ...bulk, slot_type: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Slot Duration
                  </label>
                  <select
                    value={bulk.duration_minutes}
                    onChange={(e) => setBulk({ ...bulk, duration_minutes: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={todayIST}
                    value={bulk.start_date}
                    onChange={(e) => setBulk({ ...bulk, start_date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={bulk.start_date || todayIST}
                    value={bulk.end_date}
                    onChange={(e) => setBulk({ ...bulk, end_date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Days of Week
                  <span className="text-[10px] text-slate-400 font-normal ml-2">
                    (Days with schedules are highlighted)
                  </span>
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {DOW.map(d => {
                    const hasSchedule = schedules.some(s => s.day_of_week === d.value);
                    const isSelected = bulk.days_of_week.includes(d.value);
                    return (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => toggleDay(d.value)}
                        disabled={!hasSchedule}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : hasSchedule
                            ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Shift Start Time
                  </label>
                  <input
                    type="time"
                    value={bulk.day_start}
                    onChange={(e) => setBulk({ ...bulk, day_start: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Shift End Time
                  </label>
                  <input
                    type="time"
                    value={bulk.day_end}
                    onChange={(e) => setBulk({ ...bulk, day_end: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Break Window */}
              <div className="bg-slate-50/75 p-3 rounded-2xl border border-slate-200/60">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bulk.use_break}
                    onChange={(e) => setBulk({ ...bulk, use_break: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  Exclude Break Window from Slots
                </label>
                {bulk.use_break && (
                  <div className="grid grid-cols-2 gap-3 mt-2.5">
                    <div>
                      <span className="text-[10px] text-slate-500">Break Start</span>
                      <input
                        type="time"
                        value={bulk.break_start}
                        onChange={(e) => setBulk({ ...bulk, break_start: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Break End</span>
                      <input
                        type="time"
                        value={bulk.break_end}
                        onChange={(e) => setBulk({ ...bulk, break_end: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bulk.skip_existing}
                  onChange={(e) => setBulk({ ...bulk, skip_existing: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                Skip slots that already exist in the database (avoid duplicates)
              </label>

              {/* Preview card */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-blue-900">
                    Estimated Output: ~{preview.perDay} slots per active day
                  </p>
                  <p className="text-blue-700 mt-0.5">
                    Total of approximately <b className="text-blue-950 font-extrabold">{preview.count} slots</b> will be added.
                  </p>
                  {preview.invalidDays.length > 0 && (
                    <p className="text-rose-600 font-medium mt-1">
                      ⚠️ No schedule overlap on:{' '}
                      {preview.invalidDays.map(d => DOW.find(x => x.value === d)?.label).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                disabled={generating}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={generateSlots}
                disabled={generating || preview.count === 0}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate {preview.count} Slots
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-medium border border-slate-700/50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}