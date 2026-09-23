// app/dashboard/schedules/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { formatDoctorName, cleanDoctorName } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pencil,
  Trash2,
  Coffee,
  Stethoscope,
  X,
  Check,
  CalendarDays,
  Sparkles,
  Info,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface DoctorSchedule {
  id: string;
  doctor_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  break_start_time: string | null;
  break_end_time: string | null;
  is_available: boolean;
  created_at: string;
}

interface Doctor {
  id: string;
  full_name: string;
}

const DAYS = [
  { label: 'Sunday', short: 'Sun', value: 0 },
  { label: 'Monday', short: 'Mon', value: 1 },
  { label: 'Tuesday', short: 'Tue', value: 2 },
  { label: 'Wednesday', short: 'Wed', value: 3 },
  { label: 'Thursday', short: 'Thu', value: 4 },
  { label: 'Friday', short: 'Fri', value: 5 },
  { label: 'Saturday', short: 'Sat', value: 6 },
];

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export default function SchedulesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  // Multi-day bulk schedule state
  const [bulk, setBulk] = useState({
    doctor_id: '',
    days_of_week: [1, 2, 3, 4, 5] as number[],
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 30,
    use_break: false,
    break_start_time: '13:00',
    break_end_time: '14:00',
    is_available: true,
    overwrite: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Auto-purge past slots in background on schedules page visit
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

        const { data: schedulesData } = await supabase
          .from('doctor_schedules')
          .select('*')
          .eq('doctor_id', doctorData.id)
          .order('day_of_week', { ascending: true });

        setSchedules(schedulesData || []);
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

        const [schedulesRes, doctorsRes] = await Promise.all([
          supabase.from('doctor_schedules').select('*').order('day_of_week', { ascending: true }),
          supabase.from('doctors').select('id, full_name'),
        ]);

        setSchedules(schedulesRes.data || []);
        setDoctors(doctorsRes.data || []);
        setLoading(false);
        return;
      }

      router.push('/login');
    } catch (error) {
      console.error('Error fetching schedules:', error);
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

  const openAddModal = () => {
    setEditingId(null);
    setBulk({
      doctor_id: currentUser?.role === 'doctor' ? currentUser.doctorId : '',
      days_of_week: [1, 2, 3, 4, 5],
      start_time: '09:00',
      end_time: '17:00',
      slot_duration_minutes: 30,
      use_break: false,
      break_start_time: '13:00',
      break_end_time: '14:00',
      is_available: true,
      overwrite: false,
    });
    setShowAddModal(true);
  };

  const openEditModal = (schedule: DoctorSchedule) => {
    setEditingId(schedule.id);
    setBulk({
      doctor_id: schedule.doctor_id || '',
      days_of_week: [schedule.day_of_week],
      start_time: schedule.start_time.slice(0, 5),
      end_time: schedule.end_time.slice(0, 5),
      slot_duration_minutes: schedule.slot_duration_minutes,
      use_break: !!(schedule.break_start_time && schedule.break_end_time),
      break_start_time: schedule.break_start_time?.slice(0, 5) || '13:00',
      break_end_time: schedule.break_end_time?.slice(0, 5) || '14:00',
      is_available: schedule.is_available,
      overwrite: false,
    });
    setShowAddModal(true);
  };

  const validateBulk = (): string | null => {
    const doctorId = currentUser?.role === 'doctor' ? currentUser.doctorId : bulk.doctor_id;
    if (!doctorId) return 'Please select a doctor';
    if (bulk.days_of_week.length === 0) return 'Pick at least one day of the week';
    if (toMin(bulk.end_time) <= toMin(bulk.start_time)) return 'End time must be after start time';
    if (bulk.slot_duration_minutes < 5 || bulk.slot_duration_minutes > 240) {
      return 'Slot duration must be between 5 and 240 minutes';
    }
    if (bulk.use_break) {
      if (toMin(bulk.break_end_time) <= toMin(bulk.break_start_time)) {
        return 'Break end must be after break start';
      }
      if (toMin(bulk.break_start_time) < toMin(bulk.start_time) ||
          toMin(bulk.break_end_time) > toMin(bulk.end_time)) {
        return 'Break must be inside the working hours';
      }
    }
    return null;
  };

  const saveSchedule = async () => {
    if (saving) return;

    const err = validateBulk();
    if (err) { alert(err); return; }

    const doctorId = currentUser?.role === 'doctor' ? currentUser.doctorId : bulk.doctor_id;
    setSaving(true);

    try {
      if (editingId) {
        const updateData: any = {
          day_of_week: bulk.days_of_week[0],
          start_time: bulk.start_time,
          end_time: bulk.end_time,
          slot_duration_minutes: bulk.slot_duration_minutes,
          break_start_time: bulk.use_break ? bulk.break_start_time : null,
          break_end_time: bulk.use_break ? bulk.break_end_time : null,
          is_available: bulk.is_available,
        };

        const { error } = await supabase
          .from('doctor_schedules')
          .update(updateData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { data: existing } = await supabase
          .from('doctor_schedules')
          .select('id, day_of_week')
          .eq('doctor_id', doctorId)
          .in('day_of_week', bulk.days_of_week);

        const existingByDay = new Map<number, string>();
        (existing || []).forEach(e => existingByDay.set(e.day_of_week, e.id));

        const conflictingDays = bulk.days_of_week.filter(d => existingByDay.has(d));

        if (conflictingDays.length > 0 && !bulk.overwrite) {
          const names = conflictingDays.map(d => DAYS.find(x => x.value === d)?.label).join(', ');
          const ok = confirm(
            `A schedule already exists for: ${names}.\n\nOverwrite them?`
          );
          if (!ok) {
            setSaving(false);
            return;
          }
        }

        const rows = bulk.days_of_week.map(dow => ({
          doctor_id: doctorId,
          day_of_week: dow,
          start_time: bulk.start_time,
          end_time: bulk.end_time,
          slot_duration_minutes: bulk.slot_duration_minutes,
          break_start_time: bulk.use_break ? bulk.break_start_time : null,
          break_end_time: bulk.use_break ? bulk.break_end_time : null,
          is_available: bulk.is_available,
        }));

        if (conflictingDays.length > 0 && bulk.overwrite) {
          const ids = conflictingDays.map(d => existingByDay.get(d)!).filter(Boolean);
          const { error: delErr } = await supabase
            .from('doctor_schedules')
            .delete()
            .in('id', ids);
          if (delErr) throw delErr;
        }

        const { error: insErr } = await supabase
          .from('doctor_schedules')
          .insert(rows);

        if (insErr) throw insErr;
      }

      setShowAddModal(false);
      setEditingId(null);
      fetchData();
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      alert('Failed to save schedule: ' + (error?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const deleteSchedule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule? Existing slots will remain intact.')) return;

    setActionId(id);
    try {
      const { error } = await supabase
        .from('doctor_schedules')
        .delete()
        .eq('id', id);

      if (!error) {
        setSchedules(prev => prev.filter(s => s.id !== id));
      }
    } finally {
      setActionId(null);
    }
  };

  const toggleScheduleAvailability = async (id: string, currentStatus: boolean) => {
    setActionId(id);
    try {
      const { error } = await supabase
        .from('doctor_schedules')
        .update({ is_available: !currentStatus })
        .eq('id', id);

      if (!error) {
        setSchedules(prev => prev.map(s => s.id === id ? { ...s, is_available: !currentStatus } : s));
      }
    } finally {
      setActionId(null);
    }
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule =>
      filterDoctor === 'all' || schedule.doctor_id === filterDoctor
    );
  }, [schedules, filterDoctor]);

  // Metrics
  const metrics = useMemo(() => {
    const total = filteredSchedules.length;
    const active = filteredSchedules.filter(s => s.is_available).length;
    const inactive = filteredSchedules.filter(s => !s.is_available).length;
    const uniqueDays = new Set(filteredSchedules.map(s => s.day_of_week)).size;
    return { total, active, inactive, uniqueDays };
  }, [filteredSchedules]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 border-t-transparent"></div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Loading schedules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {currentUser?.role === 'doctor' ? 'My Weekly Schedule' : 'Doctor Schedules & Roster'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure weekly recurring clinical shifts, consult durations, and break intervals.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Schedule</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Shifts</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{metrics.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Shifts</p>
            <p className="text-2xl font-bold text-emerald-600 mt-0.5">{metrics.active}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Off-Duty / Inactive</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{metrics.inactive}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Covered Days</p>
            <p className="text-2xl font-bold text-purple-600 mt-0.5">{metrics.uniqueDays} / 7</p>
          </div>
        </div>
      </div>

      {/* Filter Selector */}
      {currentUser?.role !== 'doctor' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between gap-3">
          <div className="relative min-w-[240px]">
            <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              aria-label="Filter roster by doctor"
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="all">All Doctors Roster</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.full_name}</option>
              ))}
            </select>
          </div>

          {filterDoctor !== 'all' && (
            <button
              onClick={() => setFilterDoctor('all')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Show all doctors
            </button>
          )}
        </div>
      )}

      {/* Weekly Visual Roster Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Weekly Timetable Overview</h2>
          </div>
          <span className="text-[11px] text-slate-400">Recurring 7-Day Cycle</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {DAYS.map(day => {
            const daySchedules = filteredSchedules.filter(s => s.day_of_week === day.value);
            const isWeekend = day.value === 0 || day.value === 6;

            return (
              <div
                key={day.value}
                className={`rounded-2xl border p-3 min-h-[140px] flex flex-col transition-all ${
                  isWeekend
                    ? 'border-slate-200 bg-slate-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-900">{day.short}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                    daySchedules.length > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {daySchedules.length}
                  </span>
                </div>

                {daySchedules.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-4">
                    <span className="text-[11px] font-medium italic">Off Day</span>
                  </div>
                ) : (
                  <div className="space-y-2 flex-1">
                    {daySchedules.map(s => {
                      const docName = currentUser?.role === 'doctor'
                        ? null
                        : doctors.find(d => d.id === s.doctor_id)?.full_name;

                      return (
                        <div
                          key={s.id}
                          className={`rounded-xl p-2 border text-[11px] transition-all ${
                            s.is_available
                              ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                              : 'bg-slate-100 border-slate-200 text-slate-400 line-through opacity-70'
                          }`}
                        >
                          {docName && (
                            <div className="font-bold text-[11px] truncate mb-0.5 text-slate-900">
                              {docName}
                            </div>
                          )}
                          <div className="flex items-center gap-1 font-semibold text-emerald-800 font-mono text-[10px]">
                            <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}</span>
                          </div>
                          {s.break_start_time && s.break_end_time && (
                            <div className="flex items-center gap-1 text-[9px] text-emerald-700/80 mt-1">
                              <Coffee className="w-2.5 h-2.5" />
                              <span>{s.break_start_time.slice(0, 5)} - {s.break_end_time.slice(0, 5)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Schedules Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Shift Rosters List
          </h3>
          <span className="text-xs text-slate-400">{filteredSchedules.length} shifts configured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                {currentUser?.role !== 'doctor' && (
                  <th className="py-3 px-4">Doctor</th>
                )}
                <th className="py-3 px-4">Day of Week</th>
                <th className="py-3 px-4">Shift Hours</th>
                <th className="py-3 px-4">Slot Duration</th>
                <th className="py-3 px-4">Daily Break</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No schedules configured</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Click "+ Add Schedule" to set recurring doctor shifts.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule) => {
                  const doc = doctors.find(d => d.id === schedule.doctor_id);
                  const dayObj = DAYS.find(d => d.value === schedule.day_of_week);

                  return (
                    <tr key={schedule.id} className="hover:bg-slate-50/60 transition-colors">
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

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800">{dayObj?.label}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md font-medium text-[11px] bg-blue-50 text-blue-700 border border-blue-200/50">
                          {schedule.slot_duration_minutes} min
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {schedule.break_start_time && schedule.break_end_time ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-amber-50 text-amber-800 border border-amber-200/50 font-mono">
                            <Coffee className="w-3 h-3 text-amber-600" />
                            <span>{schedule.break_start_time.slice(0, 5)} - {schedule.break_end_time.slice(0, 5)}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No break</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {schedule.is_available ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(schedule)}
                            title="Edit Schedule"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleScheduleAvailability(schedule.id, schedule.is_available)}
                            disabled={actionId === schedule.id}
                            title={schedule.is_available ? 'Deactivate Shift' : 'Activate Shift'}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              schedule.is_available
                                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {actionId === schedule.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : schedule.is_available ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteSchedule(schedule.id)}
                            disabled={actionId === schedule.id}
                            title="Delete Schedule"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingId ? 'Edit Doctor Shift Schedule' : 'Add Weekly Shift Schedule'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingId ? 'Modify shift parameters for this single day' : 'Configure recurring consultation hours'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowAddModal(false); setEditingId(null); }}
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
                    disabled={!!editingId}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{formatDoctorName(doc.full_name)}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Days of week */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Days of Week
                  {!editingId && (
                    <span className="text-[10px] text-slate-400 font-normal ml-2">
                      (A recurring schedule will be configured for each selected day)
                    </span>
                  )}
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {DAYS.map(d => {
                    const isSelected = bulk.days_of_week.includes(d.value);
                    return (
                      <button
                        key={d.value}
                        type="button"
                        disabled={!!editingId}
                        onClick={() => toggleDay(d.value)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        } ${editingId ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Shift Start Time
                  </label>
                  <input
                    type="time"
                    value={bulk.start_time}
                    onChange={(e) => setBulk({ ...bulk, start_time: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Shift End Time
                  </label>
                  <input
                    type="time"
                    value={bulk.end_time}
                    onChange={(e) => setBulk({ ...bulk, end_time: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Slot Duration */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Slot Duration
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[15, 20, 30, 45, 60].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setBulk({ ...bulk, slot_duration_minutes: m })}
                      className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        bulk.slot_duration_minutes === m
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m} min
                    </button>
                  ))}
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
                  Configure Daily Lunch / Break Interval
                </label>
                {bulk.use_break && (
                  <div className="grid grid-cols-2 gap-3 mt-2.5">
                    <div>
                      <span className="text-[10px] text-slate-500">Break Start</span>
                      <input
                        type="time"
                        value={bulk.break_start_time}
                        onChange={(e) => setBulk({ ...bulk, break_start_time: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500">Break End</span>
                      <input
                        type="time"
                        value={bulk.break_end_time}
                        onChange={(e) => setBulk({ ...bulk, break_end_time: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bulk.is_available}
                    onChange={(e) => setBulk({ ...bulk, is_available: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  Mark schedule as active / available immediately
                </label>

                {!editingId && (
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bulk.overwrite}
                      onChange={(e) => setBulk({ ...bulk, overwrite: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    Overwrite existing schedules if days overlap
                  </label>
                )}
              </div>

              {/* Preview Card */}
              {bulk.days_of_week.length > 0 && toMin(bulk.end_time) > toMin(bulk.start_time) && (
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-blue-900">
                      {editingId ? 'Updating' : 'Creating'} {bulk.days_of_week.length} schedule shift
                      {bulk.days_of_week.length !== 1 ? 's' : ''} for:{' '}
                      <span className="font-extrabold text-blue-950">
                        {bulk.days_of_week.map(d => DAYS.find(x => x.value === d)?.short).join(', ')}
                      </span>
                    </p>
                    <p className="text-blue-700 mt-0.5">
                      Shift Window: <b>{bulk.start_time} → {bulk.end_time}</b>
                      {bulk.use_break && ` (Break: ${bulk.break_start_time}–${bulk.break_end_time})`}
                      {' · '}{bulk.slot_duration_minutes} min per slot
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setShowAddModal(false); setEditingId(null); }}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveSchedule}
                disabled={saving || bulk.days_of_week.length === 0}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs shadow-sm transition-all disabled:opacity-50 inline-flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : editingId ? (
                  'Update Schedule'
                ) : (
                  `Create ${bulk.days_of_week.length} Schedule${bulk.days_of_week.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}