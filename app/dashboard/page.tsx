// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  CalendarCheck,
  IndianRupee,
  Plus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UserCheck,
  CreditCard,
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
            supabase.from('appointments').select('*').order('appointment_date', { ascending: false }),
          ]);
          setDoctors(doctorsRes.data || []);
          setPatients(patientsRes.data || []);
          setAppointments(appointmentsRes.data || []);
        } else {
          // Receptionist - fetch appointments and patients
          const [patientsRes, appointmentsRes] = await Promise.all([
            supabase.from('patients').select('*'),
            supabase.from('appointments').select('*').order('appointment_date', { ascending: false }),
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
      <div className="flex flex-col justify-center items-center h-80 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-teal-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-5 h-5 text-teal-600 animate-pulse" />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500">Loading hospital data...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  // Calculate stats (revenue is only patients whose payment is complete / paid)
  const paidAppointments = appointments.filter(
    a => a.payment_status?.toLowerCase() === 'paid' || a.payment_status?.toLowerCase() === 'completed'
  );

  const totalRevenue = paidAppointments.reduce(
    (sum, a) => sum + (Number(a.payment_amount) || 0),
    0
  );

  const uniquePaidPatients = new Set(
    paidAppointments.map(a => a.patient_id).filter(Boolean)
  ).size;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointment_date === todayStr);

  const stats = {
    totalDoctors: doctors.length,
    activeDoctors: doctors.filter(d => d.is_active !== false).length,
    totalPatients: patients.length,
    totalAppointments: appointments.length,
    todayCount: todayAppointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    completedAppointments: appointments.filter(a => a.status === 'completed').length,
    cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
    totalRevenue,
    paidAppointmentsCount: paidAppointments.length,
    uniquePaidPatients,
  };

  // -------------------------------------------------------------
  // DOCTOR DASHBOARD VIEW
  // -------------------------------------------------------------
  if (currentUser.role === 'doctor') {
    const docTodayAppointments = appointments.filter(
      a => a.appointment_date === todayStr
    );
    const docUpcomingAppointments = appointments.filter(
      a => a.appointment_date > todayStr && a.status !== 'cancelled'
    );

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-900 p-6 md:p-8 text-white shadow-lg border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-teal-500/20 border border-teal-400/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Stethoscope className="w-7 h-7 text-teal-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                    Attending Physician
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                  Welcome back, Dr. {currentUser.fullName}
                </h1>
                <p className="text-slate-300 text-sm mt-0.5">
                  Sant Haridas Hospital • Department Schedule Overview
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/appointments"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <CalendarCheck className="w-4 h-4" />
                View Patient Schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Doctor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today's Consultations</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{docTodayAppointments.length}</p>
                <p className="text-xs text-slate-400 mt-1">Scheduled for today</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Review</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-2">{stats.pendingAppointments}</p>
                <p className="text-xs text-slate-400 mt-1">Awaiting confirmation</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Upcoming Visits</p>
                <p className="text-3xl font-extrabold text-teal-600 mt-2">{docUpcomingAppointments.length}</p>
                <p className="text-xs text-slate-400 mt-1">Future booked dates</p>
              </div>
              <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Today's Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Today's Appointment Queue</h3>
              <p className="text-xs text-slate-500 mt-0.5">Patients scheduled with you today</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {docTodayAppointments.length} Total
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {docTodayAppointments.map(appointment => (
              <div key={appointment.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-teal-700 font-semibold text-xs">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{appointment.appointment_time}</p>
                      <p className="text-xs text-slate-500">Token #{appointment.appointment_number}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                    appointment.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    appointment.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
            {docTodayAppointments.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-medium text-slate-700">No appointments scheduled for today</p>
                <p className="text-xs text-slate-400 mt-1">Enjoy your day or check upcoming dates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RECEPTIONIST DASHBOARD VIEW
  // -------------------------------------------------------------
  if (currentUser.role === 'receptionist') {
    const recPendingAppointments = appointments.filter(a => a.status === 'pending');

    return (
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-900 p-6 md:p-8 text-white shadow-lg border border-slate-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-teal-500/20 border border-teal-400/30 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-7 h-7 text-teal-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-400/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                    Front Desk Active
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                  Reception Desk • Sant Haridas
                </h1>
                <p className="text-slate-300 text-sm mt-0.5">
                  Welcome, {currentUser.fullName}. Patient check-in and booking desk.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard/appointments/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Book Patient
              </Link>
              <Link
                href="/dashboard/patients"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors border border-white/10"
              >
                <Users className="w-4 h-4" />
                Patients
              </Link>
            </div>
          </div>
        </div>

        {/* Reception Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today's Appointments</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{todayAppointments.length}</p>
                <p className="text-xs text-slate-400 mt-1">Patients arriving today</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Approvals</p>
                <p className="text-3xl font-extrabold text-amber-600 mt-2">{recPendingAppointments.length}</p>
                <p className="text-xs text-slate-400 mt-1">Need front desk action</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Registered Patients</p>
                <p className="text-3xl font-extrabold text-teal-600 mt-2">{stats.totalPatients}</p>
                <p className="text-xs text-slate-400 mt-1">Active hospital records</p>
              </div>
              <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Appointments List */}
        {recPendingAppointments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pending Appointments</h3>
                <p className="text-xs text-slate-500 mt-0.5">Bookings waiting for confirmation</p>
              </div>
              <Link
                href="/dashboard/appointments"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recPendingAppointments.slice(0, 5).map(appointment => (
                <div key={appointment.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-900">Appointment #{appointment.appointment_number}</p>
                      <p className="text-xs text-slate-500">
                        {appointment.appointment_date} at {appointment.appointment_time}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
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

  // -------------------------------------------------------------
  // ADMIN DASHBOARD VIEW
  // -------------------------------------------------------------
  return (
    <div className="space-y-7">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 p-6 md:p-8 text-white shadow-xl border border-slate-800/80">
        {/* Decorative background glow accents */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-400/30">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                Hospital System Active
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline-block">
                • Sant Haridas Hospital Operations Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hospital Executive Overview
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Real-time monitor of patient consultations, medical staffing, doctor availability, and financial performance.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/appointments/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              Book Appointment
            </Link>
            <Link
              href="/dashboard/doctors/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-sm font-semibold transition-all border border-slate-700 shadow-sm"
            >
              <Stethoscope className="w-4 h-4 text-teal-400" />
              Add Doctor
            </Link>
            <Link
              href="/dashboard/receptionists/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-sm font-semibold transition-all border border-slate-700 shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-indigo-300" />
              Add Receptionist
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
              Paid Only
            </span>
            <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500">Total Revenue</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{stats.paidAppointmentsCount} verified payments</span>
            <span className="font-semibold text-emerald-700">{stats.uniquePaidPatients} patients</span>
          </div>
        </div>

        {/* Total Doctors */}
        <Link
          href="/dashboard/doctors"
          className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 relative overflow-hidden group block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
              Specialists
            </span>
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500">Medical Doctors</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {stats.totalDoctors}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{stats.activeDoctors} active on roster</span>
            <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </Link>

        {/* Total Patients */}
        <Link
          href="/dashboard/patients"
          className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 relative overflow-hidden group block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
              Hospital Records
            </span>
            <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500">Total Patients</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {stats.totalPatients}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Registered in database</span>
            <span className="text-teal-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </Link>

        {/* Total Appointments */}
        <Link
          href="/dashboard/appointments"
          className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 relative overflow-hidden group block"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
              Desk Volume
            </span>
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500">All Appointments</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {stats.totalAppointments}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-amber-600 font-medium">{stats.pendingAppointments} pending</span>
            <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
              View <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </Link>

        {/* Completed Visits */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
              Successful
            </span>
            <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500">Completed Visits</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {stats.completedAppointments}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {Math.round((stats.completedAppointments / (stats.totalAppointments || 1)) * 100)}% completion rate
            </span>
            <span className="text-slate-400">{stats.cancelledAppointments} cancelled</span>
          </div>
        </div>
      </div>

      {/* Hospital Command Quick-Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/appointments"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-teal-400/80 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                Appointments Desk
              </h4>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Review upcoming visits, mark status, check payment slips.
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/doctors"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400/80 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                Doctors & Staff
              </h4>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Manage doctor profiles, specializations, credentials, and accounts.
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/receptionists"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-400/80 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
                Receptionist Team
              </h4>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Setup and manage front-desk reception logins and shift assignments.
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/schedules"
          className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-purple-400/80 shadow-sm hover:shadow-md transition-all group flex items-start gap-4"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
                Schedules & Slots
              </h4>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Configure OPD consulting hours, room allocation, and time slots.
            </p>
          </div>
        </Link>
      </div>

      {/* 2-Column: Activity Overview & Completed Revenue Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Completed Patient Payments Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Completed Patient Payments</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Revenue
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Payments recorded strictly from patients whose payment status is complete
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start sm:self-auto">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              <span>₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            {paidAppointments.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                    <th className="py-3 px-5">Token / Patient</th>
                    <th className="py-3 px-5">Assigned Doctor</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paidAppointments.slice(0, 8).map((app) => {
                    const patient = patients.find((p) => p.id === app.patient_id);
                    const doctor = doctors.find((d) => d.id === app.doctor_id);
                    const patientName = patient?.full_name || 'Registered Patient';
                    const initials = patientName
                      .split(' ')
                      .map(w => w[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{patientName}</p>
                              <p className="text-xs text-slate-400">#{app.appointment_number}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="text-sm font-medium text-slate-700">
                            {doctor ? `Dr. ${doctor.full_name}` : 'Assigned Doctor'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500 text-xs whitespace-nowrap">
                          {app.appointment_date}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Paid
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-bold text-emerald-600 text-right whitespace-nowrap">
                          ₹{(Number(app.payment_amount) || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-500">
                <CreditCard className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">No completed payments found</p>
                <p className="text-xs text-slate-400 mt-1">Completed patient payments will appear here in real time.</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing recent {Math.min(paidAppointments.length, 8)} of {paidAppointments.length} paid records</span>
            <Link
              href="/dashboard/appointments"
              className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
            >
              All Appointments <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column (1 Col): Hospital Status & Today's Overview */}
        <div className="space-y-6">
          {/* Operations Snapshot Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Operations Snapshot</h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3.5 bg-slate-50/90 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Today's Visits</span>
                </div>
                <span className="font-bold text-slate-900 text-sm">{stats.todayCount}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-amber-50/70 rounded-xl border border-amber-100/80">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/80 border border-amber-200 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-700" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Pending Actions</span>
                </div>
                <span className="font-bold text-amber-700 text-sm">{stats.pendingAppointments}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100/80">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/80 border border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Completed Visits</span>
                </div>
                <span className="font-bold text-emerald-700 text-sm">{stats.completedAppointments}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/90 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Cancelled</span>
                </div>
                <span className="font-bold text-rose-700 text-sm">{stats.cancelledAppointments}</span>
              </div>
            </div>
          </div>

          {/* Quick Help / Direct Hospital Contact */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700/80 shadow-sm">
            <div className="flex items-center gap-2 text-teal-400 mb-2 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Verified Facility
            </div>
            <h4 className="font-bold text-white text-sm">Sant Haridas Hospital</h4>
            <p className="text-xs text-slate-300 mt-1">
              Main Helpdesk & Emergency Direct Line:
            </p>
            <p className="font-bold text-teal-300 text-base mt-1 tracking-wide">
              +91 95407 40947
            </p>
            <div className="mt-4 pt-4 border-t border-slate-700/70 flex items-center justify-between text-xs text-slate-400">
              <span>Admin Portal v2.4</span>
              <span className="text-teal-400">Secured via Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}