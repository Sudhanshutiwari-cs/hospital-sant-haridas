// app/dashboard/patients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

interface Patient {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_history: string | null;
  allergies: string | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  created_at: string;
  updated_at: string;
}

export default function PatientsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');

  const [newPatient, setNewPatient] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: '',
    allergies: '',
    insurance_provider: '',
    insurance_policy_number: '',
  });

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

      // Check if doctor (doctors can't access patients page)
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (doctorData) {
        router.push('/dashboard');
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

        // Fetch patients
        const { data: patientsData } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false });

        setPatients(patientsData || []);
        setLoading(false);
        return;
      }

      router.push('/login');
    } catch (error) {
      console.error('Error fetching patients:', error);
      setLoading(false);
    }
  };

  const createPatient = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([newPatient])
        .select()
        .single();

      if (error) throw error;

      setShowAddModal(false);
      fetchData();
      setNewPatient({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        blood_group: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_history: '',
        allergies: '',
        insurance_provider: '',
        insurance_policy_number: '',
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      alert('Failed to create patient');
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm);
    const matchesGender = filterGender === 'all' || patient.gender === filterGender;
    return matchesSearch && matchesGender;
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
        <h1 className="text-2xl font-bold">Patients</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Patient
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insurance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{patient.full_name}</td>
                  <td className="px-6 py-4">
                    <div>{patient.email}</div>
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4">{patient.date_of_birth}</td>
                  <td className="px-6 py-4">{patient.gender}</td>
                  <td className="px-6 py-4">{patient.blood_group}</td>
                  <td className="px-6 py-4">
                    <div>{patient.city}</div>
                    <div className="text-sm text-gray-500">{patient.state}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>{patient.insurance_provider}</div>
                    <div className="text-sm text-gray-500">{patient.insurance_policy_number}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Patient</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={newPatient.full_name}
                onChange={(e) => setNewPatient({...newPatient, full_name: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={newPatient.email}
                onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={newPatient.date_of_birth}
                onChange={(e) => setNewPatient({...newPatient, date_of_birth: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <select
                value={newPatient.gender}
                onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                className="border rounded px-3 py-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Blood Group"
                value={newPatient.blood_group}
                onChange={(e) => setNewPatient({...newPatient, blood_group: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Address"
                value={newPatient.address}
                onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="City"
                value={newPatient.city}
                onChange={(e) => setNewPatient({...newPatient, city: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="State"
                value={newPatient.state}
                onChange={(e) => setNewPatient({...newPatient, state: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={newPatient.zip_code}
                onChange={(e) => setNewPatient({...newPatient, zip_code: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Emergency Contact Name"
                value={newPatient.emergency_contact_name}
                onChange={(e) => setNewPatient({...newPatient, emergency_contact_name: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Emergency Contact Phone"
                value={newPatient.emergency_contact_phone}
                onChange={(e) => setNewPatient({...newPatient, emergency_contact_phone: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <textarea
                placeholder="Medical History"
                value={newPatient.medical_history}
                onChange={(e) => setNewPatient({...newPatient, medical_history: e.target.value})}
                className="border rounded px-3 py-2 col-span-2"
                rows={3}
              />
              <textarea
                placeholder="Allergies"
                value={newPatient.allergies}
                onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                className="border rounded px-3 py-2 col-span-2"
                rows={2}
              />
              <input
                type="text"
                placeholder="Insurance Provider"
                value={newPatient.insurance_provider}
                onChange={(e) => setNewPatient({...newPatient, insurance_provider: e.target.value})}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Insurance Policy Number"
                value={newPatient.insurance_policy_number}
                onChange={(e) => setNewPatient({...newPatient, insurance_policy_number: e.target.value})}
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createPatient}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showDetailsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Patient Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{selectedPatient.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{selectedPatient.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{selectedPatient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p>{selectedPatient.date_of_birth}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p>{selectedPatient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p>{selectedPatient.blood_group}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Emergency Contact</p>
                <p>{selectedPatient.emergency_contact_name}</p>
                <p className="text-sm text-gray-500">{selectedPatient.emergency_contact_phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Insurance</p>
                <p>{selectedPatient.insurance_provider}</p>
                <p className="text-sm text-gray-500">{selectedPatient.insurance_policy_number}</p>
              </div>
              {selectedPatient.medical_history && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Medical History</p>
                  <p>{selectedPatient.medical_history}</p>
                </div>
              )}
              {selectedPatient.allergies && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Allergies</p>
                  <p>{selectedPatient.allergies}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}