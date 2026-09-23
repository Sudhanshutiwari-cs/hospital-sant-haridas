// app/dashboard/patients/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Check,
  Loader2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ShieldCheck,
  HeartPulse,
  Plus,
  X,
  ChevronDown,
  Droplet,
  AlertCircle,
  FileText,
  Shield,
} from 'lucide-react';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');

  const [editPatient, setEditPatient] = useState({
    id: '',
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
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      setToastMessage('New patient record registered successfully');
      setTimeout(() => setToastMessage(null), 3500);
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

  const openEditModal = (patient: Patient) => {
    setEditError(null);
    setEditingPatient({
      id: patient.id,
      full_name: patient.full_name || '',
      email: patient.email || '',
      phone: patient.phone || '',
      date_of_birth: patient.date_of_birth || '',
      gender: patient.gender || '',
      blood_group: patient.blood_group || '',
      address: patient.address || '',
      city: patient.city || '',
      state: patient.state || '',
      zip_code: patient.zip_code || '',
      emergency_contact_name: patient.emergency_contact_name || '',
      emergency_contact_phone: patient.emergency_contact_phone || '',
      medical_history: patient.medical_history || '',
      allergies: patient.allergies || '',
      insurance_provider: patient.insurance_provider || '',
      insurance_policy_number: patient.insurance_policy_number || '',
    });
    setShowEditModal(true);
  };

  const updatePatient = async () => {
    try {
      setEditError(null);
      if (!editPatient.full_name.trim()) {
        setEditError('Patient full legal name is required');
        return;
      }

      setEditLoading(true);

      const res = await fetch(`/api/patients/${editPatient.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: editPatient.full_name.trim(),
          email: editPatient.email.trim() || null,
          phone: editPatient.phone.trim() || null,
          date_of_birth: editPatient.date_of_birth || null,
          gender: editPatient.gender || null,
          blood_group: editPatient.blood_group || null,
          address: editPatient.address.trim() || null,
          city: editPatient.city.trim() || null,
          state: editPatient.state.trim() || null,
          zip_code: editPatient.zip_code.trim() || null,
          emergency_contact_name: editPatient.emergency_contact_name.trim() || null,
          emergency_contact_phone: editPatient.emergency_contact_phone.trim() || null,
          medical_history: editPatient.medical_history.trim() || null,
          allergies: editPatient.allergies.trim() || null,
          insurance_provider: editPatient.insurance_provider.trim() || null,
          insurance_policy_number: editPatient.insurance_policy_number.trim() || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update patient record');
      }

      const updatedRecord: Patient = await res.json();

      // Update state locally
      setPatients((prev) =>
        prev.map((p) => (p.id === updatedRecord.id ? { ...p, ...updatedRecord } : p))
      );
      if (selectedPatient && selectedPatient.id === updatedRecord.id) {
        setSelectedPatient((prev) => (prev ? { ...prev, ...updatedRecord } : null));
      }

      setShowEditModal(false);
      setToastMessage('Patient record updated successfully');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error('Error updating patient:', err);
      setEditError(err.message || 'Failed to update patient record');
    } finally {
      setEditLoading(false);
    }
  };

  const deletePatient = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the record for "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete patient');
      }
      setPatients((prev) => prev.filter((p) => p.id !== id));
      if (selectedPatient?.id === id) {
        setShowDetailsModal(false);
        setSelectedPatient(null);
      }
      setToastMessage('Patient record deleted successfully');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error('Error deleting patient:', err);
      alert(err.message || 'Failed to delete patient record');
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

  const calculateAge = (dob: string | null) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const totalPatients = patients.length;
  const maleCount = patients.filter((p) => p.gender?.toLowerCase() === 'male').length;
  const femaleCount = patients.filter((p) => p.gender?.toLowerCase() === 'female').length;
  const insuredCount = patients.filter((p) => !!p.insurance_provider).length;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patients Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              Hospital Database
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Access patient medical histories, contact details, emergency contacts, and insurance profiles.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-[0.99] self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* ── 4 KPI Metric Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Patients</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalPatients}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Male</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{maleCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
            M
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Female</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{femaleCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
            F
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Insured</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{insuredCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients by name, mobile phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Gender Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {(searchTerm || filterGender !== 'all') && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong>{filteredPatients.length}</strong> matching patients
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterGender('all');
              }}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Patients Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                <th className="py-3.5 px-5">Patient Name</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">Age / DOB</th>
                <th className="py-3.5 px-5">Gender</th>
                <th className="py-3.5 px-5">Blood Group</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5">Insurance</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPatients.map((patient) => {
                const initials = patient.full_name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();
                const age = calculateAge(patient.date_of_birth);

                return (
                  <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Patient Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-teal-700 text-xs shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{patient.full_name}</p>
                          <p className="text-[11px] text-slate-400">
                            Reg: {new Date(patient.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-5">
                      {patient.phone ? (
                        <a
                          href={`tel:${patient.phone}`}
                          className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-teal-700"
                        >
                          <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{patient.phone}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No phone</span>
                      )}
                      {patient.email && (
                        <a
                          href={`mailto:${patient.email}`}
                          className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-teal-700 mt-0.5 truncate"
                        >
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{patient.email}</span>
                        </a>
                      )}
                    </td>

                    {/* Age / DOB */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {age !== null ? (
                        <div>
                          <span className="font-semibold text-slate-800 text-xs">{age} yrs</span>
                          <span className="text-[11px] text-slate-400 block">{patient.date_of_birth}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">{patient.date_of_birth || '—'}</span>
                      )}
                    </td>

                    {/* Gender */}
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                        {patient.gender || '—'}
                      </span>
                    </td>

                    {/* Blood Group */}
                    <td className="py-3.5 px-5">
                      {patient.blood_group ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <Droplet className="w-3 h-3 text-rose-600 shrink-0 fill-rose-600" />
                          <span>{patient.blood_group}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {patient.city || patient.state ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{[patient.city, patient.state].filter(Boolean).join(', ')}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Insurance */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {patient.insurance_provider ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            {patient.insurance_provider}
                          </span>
                          {patient.insurance_policy_number && (
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                              #{patient.insurance_policy_number}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Self-pay</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowDetailsModal(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                          title="View Patient Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => openEditModal(patient)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-700 text-xs font-semibold transition-colors shadow-2xs"
                          title="Edit Patient Record"
                        >
                          <Pencil className="w-3.5 h-3.5 text-teal-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deletePatient(patient.id, patient.full_name)}
                          className="p-1.5 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Patient Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No patients found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try searching with different keywords or register a new patient.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Patient Modal ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs"></div>

          <div
            className="relative bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Add New Patient Record</h2>
                  <p className="text-xs text-slate-500">Register new patient in the hospital medical system</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Section 1: Demographics */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2.5">
                  1. Personal & Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Legal Name *"
                    value={newPatient.full_name}
                    onChange={(e) => setNewPatient({ ...newPatient, full_name: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Mobile Phone Number *"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={newPatient.date_of_birth}
                    onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Blood Group (e.g. O+, A+, B-)"
                    value={newPatient.blood_group}
                    onChange={(e) => setNewPatient({ ...newPatient, blood_group: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Section 2: Address */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2.5">
                  2. Residential Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 sm:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newPatient.city}
                    onChange={(e) => setNewPatient({ ...newPatient, city: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newPatient.state}
                    onChange={(e) => setNewPatient({ ...newPatient, state: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Zip / Postal Code"
                    value={newPatient.zip_code}
                    onChange={(e) => setNewPatient({ ...newPatient, zip_code: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Section 3: Emergency & Medical */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2.5">
                  3. Emergency Contact & Clinical History
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Emergency Contact Name"
                    value={newPatient.emergency_contact_name}
                    onChange={(e) => setNewPatient({ ...newPatient, emergency_contact_name: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Emergency Contact Phone"
                    value={newPatient.emergency_contact_phone}
                    onChange={(e) => setNewPatient({ ...newPatient, emergency_contact_phone: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <textarea
                    placeholder="Relevant Medical History (chronic illnesses, previous surgeries)"
                    value={newPatient.medical_history}
                    onChange={(e) => setNewPatient({ ...newPatient, medical_history: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 sm:col-span-2"
                    rows={2}
                  />
                  <textarea
                    placeholder="Known Allergies (drugs, food, environmental)"
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 sm:col-span-2"
                    rows={2}
                  />
                </div>
              </div>

              {/* Section 4: Insurance */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2.5">
                  4. Health Insurance / TPA (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Insurance Provider / TPA Name"
                    value={newPatient.insurance_provider}
                    onChange={(e) => setNewPatient({ ...newPatient, insurance_provider: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Policy / Card Number"
                    value={newPatient.insurance_policy_number}
                    onChange={(e) => setNewPatient({ ...newPatient, insurance_policy_number: e.target.value })}
                    className="border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createPatient}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-xs transition-colors"
                >
                  Save Patient Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Patient Details Modal ── */}
      {showDetailsModal && selectedPatient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs"></div>

          <div
            className="relative bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-teal-700 text-base shadow-xs">
                  {selectedPatient.full_name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">
                    {selectedPatient.full_name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedPatient.phone || 'No phone'} {selectedPatient.email && `• ${selectedPatient.email}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (selectedPatient) {
                      openEditModal(selectedPatient);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              {/* Vitals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Gender</p>
                  <p className="font-semibold text-slate-900 mt-0.5 capitalize">{selectedPatient.gender || '—'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Blood Group</p>
                  <p className="font-bold text-rose-700 mt-0.5">{selectedPatient.blood_group || '—'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Date of Birth</p>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedPatient.date_of_birth || '—'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Calculated Age</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {calculateAge(selectedPatient.date_of_birth) ? `${calculateAge(selectedPatient.date_of_birth)} yrs` : '—'}
                  </p>
                </div>
              </div>

              {/* Location & Emergency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Address / Location
                  </p>
                  <p className="font-medium text-slate-800 text-xs">
                    {selectedPatient.address || 'No street address recorded'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {[selectedPatient.city, selectedPatient.state, selectedPatient.zip_code].filter(Boolean).join(', ') || 'No city/state'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Emergency Contact
                  </p>
                  <p className="font-medium text-slate-800 text-xs">
                    {selectedPatient.emergency_contact_name || 'No contact name'}
                  </p>
                  <p className="text-xs text-teal-700 font-medium mt-0.5">
                    {selectedPatient.emergency_contact_phone || 'No contact phone'}
                  </p>
                </div>
              </div>

              {/* Insurance */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                    Insurance Provider / TPA
                  </p>
                  <p className="font-bold text-emerald-900 text-sm mt-0.5">
                    {selectedPatient.insurance_provider || 'Direct Self-Pay Patient'}
                  </p>
                  {selectedPatient.insurance_policy_number && (
                    <p className="text-xs text-emerald-700 font-mono mt-0.5">
                      Policy #{selectedPatient.insurance_policy_number}
                    </p>
                  )}
                </div>
                <ShieldCheck className="w-8 h-8 text-emerald-600/60 shrink-0" />
              </div>

              {/* Medical History */}
              {selectedPatient.medical_history && (
                <div className="p-3.5 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Medical History
                  </p>
                  <p className="text-xs text-slate-800 leading-relaxed">{selectedPatient.medical_history}</p>
                </div>
              )}

              {/* Allergies */}
              {selectedPatient.allergies && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
                    Known Allergies
                  </p>
                  <p className="text-xs text-amber-900 leading-relaxed">{selectedPatient.allergies}</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  if (selectedPatient) {
                    openEditModal(selectedPatient);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Patient Record</span>
              </button>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Patient Modal ── */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => !editLoading && setShowEditModal(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs"></div>

          <div
            className="relative bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Edit Patient Record</h2>
                  <p className="text-xs text-slate-500">Update medical records, contact info, emergency and insurance details</p>
                </div>
              </div>
              <button
                disabled={editLoading}
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Alert */}
            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{editError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Section 1: Demographics */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2.5">
                  1. Personal & Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      placeholder="Full Legal Name *"
                      value={editPatient.full_name}
                      onChange={(e) => setEditPatient({ ...editPatient, full_name: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile Phone Number</label>
                    <input
                      type="text"
                      placeholder="Mobile Phone Number"
                      value={editPatient.phone}
                      onChange={(e) => setEditPatient({ ...editPatient, phone: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={editPatient.email}
                      onChange={(e) => setEditPatient({ ...editPatient, email: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editPatient.date_of_birth}
                      onChange={(e) => setEditPatient({ ...editPatient, date_of_birth: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                    <select
                      value={editPatient.gender}
                      onChange={(e) => setEditPatient({ ...editPatient, gender: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Blood Group</label>
                    <select
                      value={editPatient.blood_group}
                      onChange={(e) => setEditPatient({ ...editPatient, blood_group: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Address */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2.5">
                  2. Residential Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={editPatient.address}
                      onChange={(e) => setEditPatient({ ...editPatient, address: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={editPatient.city}
                      onChange={(e) => setEditPatient({ ...editPatient, city: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">State</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={editPatient.state}
                      onChange={(e) => setEditPatient({ ...editPatient, state: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Zip / Postal Code</label>
                    <input
                      type="text"
                      placeholder="Zip / Postal Code"
                      value={editPatient.zip_code}
                      onChange={(e) => setEditPatient({ ...editPatient, zip_code: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Emergency & Medical */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2.5">
                  3. Emergency Contact & Clinical History
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Emergency Contact Person</label>
                    <input
                      type="text"
                      placeholder="Emergency Contact Name"
                      value={editPatient.emergency_contact_name}
                      onChange={(e) => setEditPatient({ ...editPatient, emergency_contact_name: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Emergency Contact Phone</label>
                    <input
                      type="text"
                      placeholder="Emergency Contact Phone"
                      value={editPatient.emergency_contact_phone}
                      onChange={(e) => setEditPatient({ ...editPatient, emergency_contact_phone: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Relevant Medical History</label>
                    <textarea
                      placeholder="Relevant Medical History (chronic illnesses, previous surgeries, medications)"
                      value={editPatient.medical_history}
                      onChange={(e) => setEditPatient({ ...editPatient, medical_history: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      rows={2}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Known Allergies</label>
                    <textarea
                      placeholder="Known Allergies (drugs, food, environmental)"
                      value={editPatient.allergies}
                      onChange={(e) => setEditPatient({ ...editPatient, allergies: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Insurance */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2.5">
                  4. Health Insurance / TPA (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Insurance Provider / TPA Name</label>
                    <input
                      type="text"
                      placeholder="Insurance Provider / TPA Name"
                      value={editPatient.insurance_provider}
                      onChange={(e) => setEditPatient({ ...editPatient, insurance_provider: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Policy / Card Number</label>
                    <input
                      type="text"
                      placeholder="Policy / Card Number"
                      value={editPatient.insurance_policy_number}
                      onChange={(e) => setEditPatient({ ...editPatient, insurance_policy_number: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={editLoading}
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={editLoading}
                  onClick={updatePatient}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}