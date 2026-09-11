// app/dashboard/schedules/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

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
        // Editing a single schedule
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
        // Creating for multiple days
        // First, find which of the selected days already have schedules for this doctor
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
          // Delete conflicting then insert fresh
          const ids = conflictingDays.map(d => existingByDay.get(d)!).filter(Boolean);
          const { error: delErr } = await supabase
            .from('doctor_schedules')
            .delete()
            .in('id', ids);
          if (delErr) throw delErr;
        }

        // Only insert rows for days that are NOT conflicting (if overwrite=false, we already returned)
        // After deletion, all selected days are safe to insert
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
    if (!confirm('Delete this schedule? Existing slots won\'t be affected.')) return;

    const { error } = await supabase
      .from('doctor_schedules')
      .delete()
      .eq('id', id);

    if (!error) fetchData();
  };

  const toggleScheduleAvailability = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('doctor_schedules')
      .update({ is_available: !currentStatus })
      .eq('id', id);

    if (!error) fetchData();
  };

  const filteredSchedules = schedules.filter(schedule =>
    filterDoctor === 'all' || schedule.doctor_id === filterDoctor
  );

  // Group schedules by doctor for a nicer summary
  const groupedByDoctor = filteredSchedules.reduce((acc, s) => {
    const key = s.doctor_id || 'unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {} as Record<string, DoctorSchedule[]>);

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
          {currentUser?.role === 'doctor' ? 'My Schedule' : 'Doctor Schedules'}
        </h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Schedule
        </button>
      </div>

      {currentUser?.role !== 'doctor' && (
        <div className="bg-white rounded-lg shadow p-4">
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
        </div>
      )}

      {/* Weekly grid overview */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">Weekly Overview</div>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map(day => {
            const daySchedules = filteredSchedules.filter(s => s.day_of_week === day.value);
            return (
              <div key={day.value} className="border rounded p-2 min-h-[80px] bg-gray-50">
                <div className="text-xs font-semibold text-gray-700 mb-1">{day.short}</div>
                {daySchedules.length === 0 ? (
                  <div className="text-xs text-gray-400 italic">No schedule</div>
                ) : (
                  <div className="space-y-1">
                    {daySchedules.map(s => {
                      const docName = currentUser?.role === 'doctor'
                        ? null
                        : doctors.find(d => d.id === s.doctor_id)?.full_name;
                      return (
                        <div
                          key={s.id}
                          className={`text-xs rounded p-1 ${
                            s.is_available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-200 text-gray-500 line-through'
                          }`}
                        >
                          {docName && <div className="font-medium truncate">{docName}</div>}
                          <div>
                            {s.start_time.slice(0, 5)}-{s.end_time.slice(0, 5)}
                          </div>
                          {s.break_start_time && s.break_end_time && (
                            <div className="text-[10px] opacity-75">
                              break {s.break_start_time.slice(0, 5)}-{s.break_end_time.slice(0, 5)}
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

      {/* Table view */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {currentUser?.role !== 'doctor' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Break</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  {currentUser?.role !== 'doctor' && (
                    <td className="px-6 py-4">
                      {doctors.find(d => d.id === schedule.doctor_id)?.full_name}
                    </td>
                  )}
                  <td className="px-6 py-4">{DAYS.find(d => d.value === schedule.day_of_week)?.label}</td>
                  <td className="px-6 py-4">{schedule.start_time.slice(0, 5)}</td>
                  <td className="px-6 py-4">{schedule.end_time.slice(0, 5)}</td>
                  <td className="px-6 py-4">{schedule.slot_duration_minutes} min</td>
                  <td className="px-6 py-4">
                    {schedule.break_start_time && schedule.break_end_time
                      ? `${schedule.break_start_time.slice(0, 5)} - ${schedule.break_end_time.slice(0, 5)}`
                      : <span className="text-gray-400">No break</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      schedule.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {schedule.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(schedule)}
                        className="text-sm text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleScheduleAvailability(schedule.id, schedule.is_available)}
                        className={`text-sm ${
                          schedule.is_available ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {schedule.is_available ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => deleteSchedule(schedule.id)}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSchedules.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No schedules yet. Click <b>Add Schedule</b> to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Schedule' : 'Add Schedule'}
            </h2>

            <div className="space-y-4">
              {currentUser?.role !== 'doctor' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Doctor</label>
                  <select
                    value={bulk.doctor_id}
                    onChange={(e) => setBulk({ ...bulk, doctor_id: e.target.value })}
                    disabled={!!editingId}
                    className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Days of week (multi-select) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Days of Week
                  {!editingId && (
                    <span className="text-xs text-gray-500 ml-2">
                      (click to toggle — one schedule will be created per day)
                    </span>
                  )}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map(d => {
                    const isSelected = bulk.days_of_week.includes(d.value);
                    return (
                      <button
                        key={d.value}
                        type="button"
                        disabled={!!editingId}
                        onClick={() => toggleDay(d.value)}
                        className={`px-3 py-1 rounded border text-sm ${
                          isSelected
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        } ${editingId ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        {d.short}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    value={bulk.start_time}
                    onChange={(e) => setBulk({ ...bulk, start_time: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    value={bulk.end_time}
                    onChange={(e) => setBulk({ ...bulk, end_time: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-1">Slot Duration</label>
                <div className="flex gap-2 flex-wrap">
                  {[15, 20, 30, 45, 60].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setBulk({ ...bulk, slot_duration_minutes: m })}
                      className={`px-3 py-1 rounded border text-sm ${
                        bulk.slot_duration_minutes === m
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Break */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <input
                    type="checkbox"
                    checked={bulk.use_break}
                    onChange={(e) => setBulk({ ...bulk, use_break: e.target.checked })}
                  />
                  Add a daily break
                </label>
                {bulk.use_break && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="time"
                      value={bulk.break_start_time}
                      onChange={(e) => setBulk({ ...bulk, break_start_time: e.target.value })}
                      className="border rounded px-3 py-2"
                    />
                    <input
                      type="time"
                      value={bulk.break_end_time}
                      onChange={(e) => setBulk({ ...bulk, break_end_time: e.target.value })}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                )}
              </div>

              {/* Available flag */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={bulk.is_available}
                  onChange={(e) => setBulk({ ...bulk, is_available: e.target.checked })}
                />
                Mark schedule as available
              </label>

              {/* Overwrite flag (only when creating) */}
              {!editingId && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={bulk.overwrite}
                    onChange={(e) => setBulk({ ...bulk, overwrite: e.target.checked })}
                  />
                  Overwrite existing schedules for selected days
                </label>
              )}

              {/* Preview */}
              {bulk.days_of_week.length > 0 && toMin(bulk.end_time) > toMin(bulk.start_time) && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs space-y-2">
                  <div className="font-medium text-blue-900">Preview</div>
                  <div className="text-blue-800">
                    {editingId ? 'Updating' : 'Creating'} {bulk.days_of_week.length} schedule
                    {bulk.days_of_week.length !== 1 ? 's' : ''} for{' '}
                    {bulk.days_of_week.map(d => DAYS.find(x => x.value === d)?.short).join(', ')}
                  </div>
                  <div className="text-blue-700">
                    {bulk.start_time} → {bulk.end_time}
                    {bulk.use_break && ` (break ${bulk.break_start_time}–${bulk.break_end_time})`}
                    {' · '}slot every {bulk.slot_duration_minutes} min
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => { setShowAddModal(false); setEditingId(null); }}
                className="px-4 py-2 border rounded hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={saveSchedule}
                disabled={saving || bulk.days_of_week.length === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Schedule' : `Create ${bulk.days_of_week.length} Schedule${bulk.days_of_week.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}