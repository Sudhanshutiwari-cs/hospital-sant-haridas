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

export default function SchedulesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState('all');

  const [newSchedule, setNewSchedule] = useState({
    doctor_id: '',
    day_of_week: 1,
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 30,
    break_start_time: '',
    break_end_time: '',
    is_available: true,
  });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Check if doctor
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (doctorData) {
        setCurrentUser({
          role: 'doctor',
          doctorId: doctorData.id,
        });

        // Fetch doctor's schedules
        const { data: schedulesData } = await supabase
          .from('doctor_schedules')
          .select('*')
          .eq('doctor_id', doctorData.id)
          .order('day_of_week', { ascending: true });

        setSchedules(schedulesData || []);
        setLoading(false);
        return;
      }

      // Check if staff
      const { data: staffData } = await supabase
        .from('staff')
        .select('id, roles(role_name)')
        .eq('user_id', session.user.id)
        .single();

      if (staffData) {
        setCurrentUser({
          role: staffData.roles?.role_name || 'receptionist',
        });

        // Fetch all schedules and doctors
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

  const createSchedule = async () => {
    try {
      const scheduleData = {
        ...newSchedule,
        doctor_id: currentUser?.role === 'doctor' ? currentUser.doctorId : newSchedule.doctor_id,
      };

      const { data, error } = await supabase
        .from('doctor_schedules')
        .insert([scheduleData])
        .select()
        .single();

      if (error) throw error;

      setShowAddModal(false);
      fetchData();
      setNewSchedule({
        doctor_id: '',
        day_of_week: 1,
        start_time: '09:00',
        end_time: '17:00',
        slot_duration_minutes: 30,
        break_start_time: '',
        break_end_time: '',
        is_available: true,
      });
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Failed to create schedule');
    }
  };

  const toggleScheduleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('doctor_schedules')
        .update({ is_available: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      fetchData();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const filteredSchedules = schedules.filter(schedule => 
    filterDoctor === 'all' || schedule.doctor_id === filterDoctor
  );

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
          onClick={() => setShowAddModal(true)}
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {currentUser?.role !== 'doctor' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
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
                  <td className="px-6 py-4">{daysOfWeek[schedule.day_of_week]}</td>
                  <td className="px-6 py-4">{schedule.start_time}</td>
                  <td className="px-6 py-4">{schedule.end_time}</td>
                  <td className="px-6 py-4">{schedule.slot_duration_minutes} min</td>
                  <td className="px-6 py-4">
                    {schedule.break_start_time && schedule.break_end_time ? 
                      `${schedule.break_start_time} - ${schedule.break_end_time}` : 
                      'No break'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      schedule.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {schedule.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleScheduleAvailability(schedule.id, schedule.is_available)}
                      className={`text-sm ${
                        schedule.is_available ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {schedule.is_available ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Schedule</h2>
            <div className="space-y-4">
              {currentUser?.role !== 'doctor' && (
                <select
                  value={newSchedule.doctor_id}
                  onChange={(e) => setNewSchedule({...newSchedule, doctor_id: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                  ))}
                </select>
              )}
              <select
                value={newSchedule.day_of_week}
                onChange={(e) => setNewSchedule({...newSchedule, day_of_week: parseInt(e.target.value)})}
                className="w-full border rounded px-3 py-2"
              >
                {daysOfWeek.map((day, index) => (
                  <option key={day} value={index}>{day}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={newSchedule.start_time}
                  onChange={(e) => setNewSchedule({...newSchedule, start_time: e.target.value})}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="time"
                  value={newSchedule.end_time}
                  onChange={(e) => setNewSchedule({...newSchedule, end_time: e.target.value})}
                  className="border rounded px-3 py-2"
                />
              </div>
              <input
                type="number"
                placeholder="Slot Duration (minutes)"
                value={newSchedule.slot_duration_minutes}
                onChange={(e) => setNewSchedule({...newSchedule, slot_duration_minutes: parseInt(e.target.value)})}
                className="w-full border rounded px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={newSchedule.break_start_time}
                  onChange={(e) => setNewSchedule({...newSchedule, break_start_time: e.target.value})}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="time"
                  value={newSchedule.break_end_time}
                  onChange={(e) => setNewSchedule({...newSchedule, break_end_time: e.target.value})}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createSchedule}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}