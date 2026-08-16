// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import {
  Users,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  TrendingUp,
  Building2,
  CalendarCheck
} from 'lucide-react';

interface CurrentUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
  doctorId?: string;
}

interface Doctor {
  id: string;
  full_name: string;
  specialization: string | null;
  is_active: boolean;
}

interface Patient {
  id: string;
  full_name: string;
  gender: string | null;
}

interface Appointment {
  id: string;
  appointment_number: string;
  doctor_id: string | null;
  patient_id: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  payment_status: string;
  payment_amount: number | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Check if doctor
      const { data: doctorData } = await supabase
        .from('doctors')
        .select('id, full_name, email')
        .eq('user_id', session.user.id)
        .single();

      if (doctorData) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          role: 'doctor',
          fullName: doctorData.full_name,
          doctorId: doctorData.id,
        });

        // Fetch doctor's appointments
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('*')
          .eq('doctor_id', doctorData.id);

        setAppointments(appointmentsData || []);
        setLoading(false);
        return;
      }

      // Check if staff
      const { data: staffData } = await supabase
        .from('staff')
        .select('id, full_name, email, roles(role_name)')
        .eq('user_id', session.user.id)
        .single();

      if (staffData) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          role: staffData.roles?.role_name || 'receptionist',
          fullName: staffData.full_name,
        });

        if (staffData.roles?.role_name === 'admin') {
          // Admin - fetch all data
          const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
            supabase.from('doctors').select('*'),
            supabase.from('patients').select('*'),
            supabase.from('appointments').select('*'),
          ]);
          setDoctors(doctorsRes.data || []);
          setPatients(patientsRes.data || []);
          setAppointments(appointmentsRes.data || []);
        } else {
          // Receptionist - fetch appointments and patients
          const [patientsRes, appointmentsRes] = await Promise.all([
            supabase.from('patients').select('*'),
            supabase.from('appointments').select('*'),
          ]);
          setPatients(patientsRes.data || []);
          setAppointments(appointmentsRes.data || []);
        }
        setLoading(false);
        return;
      }

      // No role found
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  // Calculate stats
  const stats = {
    totalDoctors: doctors.length,
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    completedAppointments: appointments.filter(a => a.status === 'completed').length,
    cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
  };

  // Doctor Dashboard
  if (currentUser.role === 'doctor') {
    const myAppointments = appointments;
    const todayAppointments = myAppointments.filter(
      a => a.appointment_date === new Date().toISOString().split('T')[0]
    );
    const upcomingAppointments = myAppointments.filter(
      a => a.appointment_date > new Date().toISOString().split('T')[0] && a.status !== 'cancelled'
    );

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, Dr. {currentUser.fullName}</h1>
              <p className="text-blue-100 mt-1">Here's your schedule overview for today</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{todayAppointments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{upcomingAppointments.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Appointments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Today's Appointments</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {todayAppointments.map(appointment => (
              <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{appointment.appointment_time}</p>
                      <p className="text-sm text-gray-500">#{appointment.appointment_number}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
            {todayAppointments.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                No appointments today
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Receptionist Dashboard
  if (currentUser.role === 'receptionist') {
    const todayAppointments = appointments.filter(
      a => a.appointment_date === new Date().toISOString().split('T')[0]
    );
    const pendingAppointments = appointments.filter(a => a.status === 'pending');

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Reception Dashboard</h1>
              <p className="text-blue-100 mt-1">Manage appointments and patients efficiently</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{todayAppointments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending Appointments</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalPatients}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Appointments List */}
        {pendingAppointments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Pending Appointments</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {pendingAppointments.slice(0, 5).map(appointment => (
                <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">#{appointment.appointment_number}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.appointment_date} at {appointment.appointment_time}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-blue-100 mt-1">Overview of hospital operations</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Doctors</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalDoctors}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalPatients}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Appointments</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Completed</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.completedAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-gray-700">Pending Appointments</span>
            </div>
            <span className="font-semibold text-gray-800">{stats.pendingAppointments}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Completed Appointments</span>
            </div>
            <span className="font-semibold text-gray-800">{stats.completedAppointments}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-red-600" />
              <span className="text-gray-700">Cancelled</span>
            </div>
            <span className="font-semibold text-gray-800">{stats.cancelledAppointments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}