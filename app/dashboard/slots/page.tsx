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

export default function SlotsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<DoctorSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  const [newSlot, setNewSlot] = useState({
    doctor_id: '',
    schedule_id: '',
    slot_date: '',
    start_time: '',
    end_time: '',
    slot_type: 'consultation',
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

        const { data: slotsData } = await supabase
          .from('doctor_slots')
          .select('*')
          .eq('doctor_id', doctorData.id)
          .order('slot_date', { ascending: true })
          .order('start_time', { ascending: true });

        setSlots(slotsData || []);
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

        const [slotsRes, doctorsRes] = await Promise.all([
          supabase.from('doctor_slots').select('*').order('slot_date', { ascending: true }).order('start_time', { ascending: true }),
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

  const createSlot = async () => {
    try {
      // Validate required fields
      if (!newSlot.slot_date || !newSlot.start_time || !newSlot.end_time) {
        alert('Please fill in all required fields');
        return;
      }

      // Determine doctor_id
      const doctorId = currentUser?.role === 'doctor' ? currentUser.doctorId : newSlot.doctor_id;

      if (!doctorId) {
        alert('Please select a doctor');
        return;
      }

      // Build slot data with only non-empty fields
      const slotData: any = {
        doctor_id: doctorId,
        slot_date: newSlot.slot_date,
        start_time: newSlot.start_time,
        end_time: newSlot.end_time,
        slot_type: newSlot.slot_type || 'consultation',
        is_booked: false,
        is_available: true,
      };

      // Only add schedule_id if it's not empty
      if (newSlot.schedule_id) {
        slotData.schedule_id = newSlot.schedule_id;
      }

      const { data, error } = await supabase
        .from('doctor_slots')
        .insert([slotData])
        .select()
        .single();

      if (error) throw error;

      setShowAddModal(false);
      fetchData();
      setNewSlot({
        doctor_id: '',
        schedule_id: '',
        slot_date: '',
        start_time: '',
        end_time: '',
        slot_type: 'consultation',
      });
    } catch (error) {
      console.error('Error creating slot:', error);
      alert('Failed to create slot: ' + (error as any).message);
    }
  };

  const toggleSlotAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('doctor_slots')
        .update({ is_available: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      fetchData();
    } catch (error) {
      console.error('Error updating slot:', error);
    }
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
          + Add Slot
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
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
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Time Slot</h2>
            <div className="space-y-4">
              {currentUser?.role !== 'doctor' && (
                <select
                  value={newSlot.doctor_id}
                  onChange={(e) => setNewSlot({...newSlot, doctor_id: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                  ))}
                </select>
              )}
              <input
                type="date"
                value={newSlot.slot_date}
                onChange={(e) => setNewSlot({...newSlot, slot_date: e.target.value})}
                className="w-full border rounded px-3 py-2"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={newSlot.start_time}
                  onChange={(e) => setNewSlot({...newSlot, start_time: e.target.value})}
                  className="border rounded px-3 py-2"
                  required
                />
                <input
                  type="time"
                  value={newSlot.end_time}
                  onChange={(e) => setNewSlot({...newSlot, end_time: e.target.value})}
                  className="border rounded px-3 py-2"
                  required
                />
              </div>
              <select
                value={newSlot.slot_type}
                onChange={(e) => setNewSlot({...newSlot, slot_type: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="consultation">Consultation</option>
                <option value="follow_up">Follow-up</option>
                <option value="emergency">Emergency</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createSlot}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}