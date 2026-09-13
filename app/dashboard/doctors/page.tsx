// app/dashboard/doctors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  UserCircle,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
  DollarSign,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Key,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  EyeOff,
  Lock,
  IndianRupee,
} from 'lucide-react';

interface Doctor {
  id: string;
  user_id: string | null;
  role_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  degree: string | null;
  specialization: string | null;
  experience_years: number | null;
  about: string | null;
  profile_image_url: string | null;
  consultation_fee: number | null;
  follow_up_fee: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function DoctorsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');

  const [newDoctor, setNewDoctor] = useState({
    full_name: '',
    email: '',
    phone: '',
    degree: '',
    specialization: '',
    experience_years: 0,
    about: '',
    consultation_fee: 0,
    follow_up_fee: 0,
    password: '',
    create_account: true,
  });

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Account modal state (for existing doctors or resetting password)
  const [accountModalDoctor, setAccountModalDoctor] = useState<Doctor | null>(null);
  const [accountPassword, setAccountPassword] = useState('');
  const [showAccountPassword, setShowAccountPassword] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Success credentials modal state
  const [credentialsModal, setCredentialsModal] = useState<{
    doctorName: string;
    email: string;
    password: string;
    isNew: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const [editDoctor, setEditDoctor] = useState({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    degree: '',
    specialization: '',
    experience_years: 0,
    about: '',
    consultation_fee: 0,
    follow_up_fee: 0,
  });

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const openAccountModal = (doctor: Doctor) => {
    setAccountModalDoctor(doctor);
    setAccountPassword(generateRandomPassword());
    setShowAccountPassword(true);
    setAccountError(null);
  };

  const handleAccountSubmit = async () => {
    if (!accountModalDoctor) return;
    if (!accountPassword || accountPassword.length < 6) {
      setAccountError('Password must be at least 6 characters long');
      return;
    }

    try {
      setAccountLoading(true);
      setAccountError(null);

      const res = await fetch('/api/doctors/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor_id: accountModalDoctor.id,
          password: accountPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to configure login credentials');
      }

      const isNew = !accountModalDoctor.user_id;
      const savedDocName = accountModalDoctor.full_name;
      const savedEmail = accountModalDoctor.email;
      const savedPass = accountPassword;

      setAccountModalDoctor(null);
      await fetchData();

      setCredentialsModal({
        doctorName: savedDocName,
        email: savedEmail,
        password: savedPass,
        isNew,
      });
    } catch (err: any) {
      console.error('Error setting doctor account:', err);
      setAccountError(err.message || 'Failed to configure login credentials');
    } finally {
      setAccountLoading(false);
    }
  };

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

      // Check if doctor (doctors can't access doctors page)
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

        // Fetch all doctors
        const { data: doctorsData } = await supabase
          .from('doctors')
          .select('*')
          .order('created_at', { ascending: false });

        setDoctors(doctorsData || []);
        setLoading(false);
        return;
      }

      router.push('/login');
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setLoading(false);
    }
  };

  const createDoctor = async () => {
    try {
      setCreateError(null);
      if (!newDoctor.full_name.trim()) {
        setCreateError('Full name is required');
        return;
      }
      if (!newDoctor.email.trim()) {
        setCreateError('Email is required');
        return;
      }
      if (newDoctor.create_account && (!newDoctor.password || newDoctor.password.length < 6)) {
        setCreateError('Password must be at least 6 characters long to enable login');
        return;
      }

      setCreateLoading(true);

      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newDoctor,
          email: newDoctor.email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create doctor');
      }

      const createdPassword = newDoctor.create_account ? newDoctor.password : '';
      const doctorName = newDoctor.full_name;
      const doctorEmail = newDoctor.email.trim().toLowerCase();

      setShowAddModal(false);
      setNewDoctor({
        full_name: '',
        email: '',
        phone: '',
        degree: '',
        specialization: '',
        experience_years: 0,
        about: '',
        consultation_fee: 0,
        follow_up_fee: 0,
        password: '',
        create_account: true,
      });

      await fetchData();

      if (createdPassword) {
        setCredentialsModal({
          doctorName,
          email: doctorEmail,
          password: createdPassword,
          isNew: true,
        });
      }
    } catch (error: any) {
      console.error('Error creating doctor:', error);
      setCreateError(error.message || 'Failed to create doctor');
    } finally {
      setCreateLoading(false);
    }
  };

  const updateDoctor = async () => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({
          full_name: editDoctor.full_name,
          email: editDoctor.email,
          phone: editDoctor.phone,
          degree: editDoctor.degree,
          specialization: editDoctor.specialization,
          experience_years: editDoctor.experience_years,
          about: editDoctor.about,
          consultation_fee: editDoctor.consultation_fee,
          follow_up_fee: editDoctor.follow_up_fee,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editDoctor.id);

      if (error) throw error;

      setShowEditModal(false);
      fetchData();
      setEditDoctor({
        id: '',
        full_name: '',
        email: '',
        phone: '',
        degree: '',
        specialization: '',
        experience_years: 0,
        about: '',
        consultation_fee: 0,
        follow_up_fee: 0,
      });
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert('Failed to update doctor');
    }
  };

  const deleteDoctor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    
    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchData();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Failed to delete doctor');
    }
  };

  const toggleDoctorStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      fetchData();
    } catch (error) {
      console.error('Error updating doctor:', error);
    }
  };

  const openEditModal = (doctor: Doctor) => {
    setEditDoctor({
      id: doctor.id,
      full_name: doctor.full_name,
      email: doctor.email,
      phone: doctor.phone || '',
      degree: doctor.degree || '',
      specialization: doctor.specialization || '',
      experience_years: doctor.experience_years || 0,
      about: doctor.about || '',
      consultation_fee: doctor.consultation_fee || 0,
      follow_up_fee: doctor.follow_up_fee || 0,
    });
    setShowEditModal(true);
  };

  const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))] as string[];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === '' || 
      doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = filterSpecialization === 'all' || doctor.specialization === filterSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
          <p className="text-sm text-gray-500 mt-1">Manage hospital doctors and their information</p>
        </div>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search doctors by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {doctor.profile_image_url ? (
                    <img src={doctor.profile_image_url} alt={doctor.full_name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl text-white font-bold">{doctor.full_name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{doctor.full_name}</h3>
                  <p className="text-sm text-gray-600 truncate">{doctor.specialization || 'General'}</p>
                  <p className="text-sm text-gray-500 truncate">{doctor.degree}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    Experience
                  </span>
                  <span className="font-medium text-gray-800">{doctor.experience_years} years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    Consultation Fee
                  </span>
                  <span className="font-medium text-gray-800">₹{doctor.consultation_fee ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    Follow-up Fee
                  </span>
                  <span className="font-medium text-gray-800">₹{doctor.follow_up_fee ?? 0}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doctor.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {doctor.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {doctor.user_id ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200" title="Doctor can log in with their email and password">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Login Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200" title="No login account created yet">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      No Login
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {currentUser?.role === 'admin' && (
                    <>
                      {doctor.user_id ? (
                        <button
                          onClick={() => openAccountModal(doctor)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Reset Doctor Login Password"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => openAccountModal(doctor)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                          title="Create Doctor Login Account"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>Setup Login</span>
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setShowDetailsModal(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {currentUser?.role === 'admin' && (
                    <>
                      <button
                        onClick={() => openEditModal(doctor)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDoctor(doctor.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleDoctorStatus(doctor.id, doctor.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          doctor.is_active 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={doctor.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {doctor.is_active ? <ChevronDown className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <UserCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No doctors found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add Doctor Modal with Blur Backdrop */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Add New Doctor</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              {createError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newDoctor.full_name}
                    onChange={(e) => setNewDoctor({...newDoctor, full_name: e.target.value})}
                    placeholder="e.g. Dr. Ramesh Gupta"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                    placeholder="e.g. doctor@hospital.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newDoctor.phone}
                    onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={newDoctor.degree}
                    onChange={(e) => setNewDoctor({...newDoctor, degree: e.target.value})}
                    placeholder="e.g. MBBS, MD"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={newDoctor.specialization}
                    onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}
                    placeholder="e.g. Ophthalmology, Pediatrics"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Years</label>
                  <input
                    type="number"
                    value={newDoctor.experience_years}
                    onChange={(e) => setNewDoctor({...newDoctor, experience_years: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={newDoctor.consultation_fee}
                    onChange={(e) => setNewDoctor({...newDoctor, consultation_fee: parseFloat(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Fee (₹)</label>
                  <input
                    type="number"
                    value={newDoctor.follow_up_fee}
                    onChange={(e) => setNewDoctor({...newDoctor, follow_up_fee: parseFloat(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                  <textarea
                    value={newDoctor.about}
                    onChange={(e) => setNewDoctor({...newDoctor, about: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={2}
                    placeholder="Brief bio or clinical summary..."
                  />
                </div>

                {/* Doctor Portal Login Account Section */}
                <div className="sm:col-span-2 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-200/80 rounded-xl p-4 mt-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">Doctor Login Credentials</span>
                        <span className="text-xs text-gray-500">Allow doctor to log in to dashboard</span>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-blue-700 cursor-pointer select-none bg-white px-2.5 py-1 rounded-md border border-blue-200">
                      <input
                        type="checkbox"
                        checked={newDoctor.create_account}
                        onChange={(e) => setNewDoctor({ ...newDoctor, create_account: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Create Account</span>
                    </label>
                  </div>

                  {newDoctor.create_account ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-semibold text-gray-700">
                          Account Password <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const p = generateRandomPassword();
                            setNewDoctor({ ...newDoctor, password: p });
                            setShowNewPassword(true);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                        >
                          <Key className="w-3 h-3" />
                          <span>Auto-Generate</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newDoctor.password}
                          onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                          placeholder="Enter password (minimum 6 characters)"
                          className="w-full bg-white border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">
                        Doctor will log in with their email (<span className="font-semibold text-gray-800">{newDoctor.email || 'enter email above'}</span>) at the <span className="font-semibold text-blue-700">/login</span> portal.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Login account creation is skipped. You can create a login account for this doctor later.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={createDoctor}
                disabled={createLoading}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium flex items-center gap-2"
              >
                {createLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{createLoading ? 'Creating Doctor...' : 'Create Doctor'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal with Blur Backdrop */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Edit Doctor</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editDoctor.full_name}
                    onChange={(e) => setEditDoctor({...editDoctor, full_name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={editDoctor.email}
                    onChange={(e) => setEditDoctor({...editDoctor, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editDoctor.phone}
                    onChange={(e) => setEditDoctor({...editDoctor, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={editDoctor.degree}
                    onChange={(e) => setEditDoctor({...editDoctor, degree: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={editDoctor.specialization}
                    onChange={(e) => setEditDoctor({...editDoctor, specialization: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Years</label>
                  <input
                    type="number"
                    value={editDoctor.experience_years}
                    onChange={(e) => setEditDoctor({...editDoctor, experience_years: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                  <input
                    type="number"
                    value={editDoctor.consultation_fee}
                    onChange={(e) => setEditDoctor({...editDoctor, consultation_fee: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Fee</label>
                  <input
                    type="number"
                    value={editDoctor.follow_up_fee}
                    onChange={(e) => setEditDoctor({...editDoctor, follow_up_fee: parseFloat(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                  <textarea
                    value={editDoctor.about}
                    onChange={(e) => setEditDoctor({...editDoctor, about: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateDoctor}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Details Modal with Blur Backdrop */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Doctor Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium text-gray-800">{selectedDoctor.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-800">{selectedDoctor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-medium text-gray-800">{selectedDoctor.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Degree</p>
                  <p className="font-medium text-gray-800">{selectedDoctor.degree || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Specialization</p>
                  <p className="font-medium text-gray-800">{selectedDoctor.specialization || 'General'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Experience</p>
                  <p className="font-medium text-gray-800">{selectedDoctor.experience_years} years</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
                  <p className="font-medium text-gray-800">₹{selectedDoctor.consultation_fee ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Follow-up Fee</p>
                  <p className="font-medium text-gray-800">₹{selectedDoctor.follow_up_fee ?? 0}</p>
                </div>

                {/* Account status in details */}
                <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedDoctor.user_id ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedDoctor.user_id ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedDoctor.user_id ? 'Doctor Login Enabled' : 'No Login Account Linked'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Login Email: <span className="font-mono text-gray-700">{selectedDoctor.email}</span>
                      </p>
                    </div>
                  </div>
                  {currentUser?.role === 'admin' && (
                    <button
                      onClick={() => {
                        const doc = selectedDoctor;
                        setShowDetailsModal(false);
                        openAccountModal(doc);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        selectedDoctor.user_id
                          ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>{selectedDoctor.user_id ? 'Reset Password' : 'Setup Login Account'}</span>
                    </button>
                  )}
                </div>

                {selectedDoctor.about && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">About</p>
                    <p className="text-gray-700 text-sm">{selectedDoctor.about}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setup / Reset Doctor Login Account Modal */}
      {accountModalDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !accountLoading && setAccountModalDoctor(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {accountModalDoctor.user_id ? 'Reset Doctor Password' : 'Create Doctor Login'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {accountModalDoctor.full_name}
                  </p>
                </div>
              </div>
              <button
                disabled={accountLoading}
                onClick={() => setAccountModalDoctor(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {accountError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{accountError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Login Email
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono">
                  {accountModalDoctor.email}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  The doctor will use this email address to log in.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    {accountModalDoctor.user_id ? 'New Password' : 'Set Account Password'} <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountPassword(generateRandomPassword());
                      setShowAccountPassword(true);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>Generate Secure</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAccountPassword ? 'text' : 'password'}
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    placeholder="Enter password (minimum 6 characters)"
                    className="w-full border border-gray-300 rounded-lg pl-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccountPassword(!showAccountPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showAccountPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Doctor Access Privileges
                </p>
                <p className="text-blue-700">
                  After saving, the doctor can immediately sign in at the <span className="font-semibold underline">/login</span> portal with their email and this password to view their schedule, slots, and appointments.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50/50">
              <button
                disabled={accountLoading}
                onClick={() => setAccountModalDoctor(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                disabled={accountLoading}
                onClick={handleAccountSubmit}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm font-semibold flex items-center gap-2"
              >
                {accountLoading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>
                  {accountLoading
                    ? 'Saving...'
                    : accountModalDoctor.user_id
                    ? 'Update Password'
                    : 'Create Login Account'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Created/Updated Success Modal */}
      {credentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCredentialsModal(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-center relative">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">
                {credentialsModal.isNew ? 'Doctor Account Created!' : 'Password Updated!'}
              </h3>
              <p className="text-emerald-100 text-xs mt-1">
                Doctor login credentials are active and ready to use
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Doctor</span>
                  <span className="text-sm font-bold text-gray-800">{credentialsModal.doctorName}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Login Email</span>
                  <span className="text-sm font-mono text-gray-800 break-all">{credentialsModal.email}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Password</span>
                  <span className="text-sm font-mono font-bold text-indigo-700 bg-white px-2.5 py-1 rounded border border-indigo-100 inline-block mt-0.5">
                    {credentialsModal.password}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">Login URL</span>
                  <span className="text-xs text-blue-600 underline break-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  const origin = typeof window !== 'undefined' ? window.location.origin : '';
                  const message = `Sant Haridas Hospital - Doctor Portal Credentials\nDoctor: ${credentialsModal.doctorName}\nLogin Portal: ${origin}/login\nEmail: ${credentialsModal.email}\nPassword: ${credentialsModal.password}`;
                  copyToClipboard(message);
                }}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Credentials Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Login Credentials</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCredentialsModal(null)}
                className="w-full py-2 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}