// app/dashboard/appointments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { formatDoctorName } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  Printer,
  Eye,
  X,
  Check,
  AlertCircle,
  CheckCircle2,
  User,
  Stethoscope,
  Phone,
  Mail,
  IndianRupee,
  CreditCard,
  ChevronDown,
  Sparkles,
  Building2,
  UserPlus,
  Activity,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface CurrentUser {
  id: string;
  role: string;
  doctorId?: string;
}

interface Doctor {
  id: string;
  full_name: string;
  specialization: string | null;
  degree: string | null;
  phone: string | null;
  consultation_fee: number | null;
  follow_up_fee: number | null;
}

interface Patient {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
}

interface Appointment {
  id: string;
  appointment_number: string;
  doctor_id: string | null;
  patient_id: string | null;
  slot_id: string | null;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: string;
  symptoms: string | null;
  notes: string | null;
  diagnosis: string | null;
  prescription: string | null;
  payment_status: string;
  payment_amount: number | null;
  payment_method: string | null;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);

  // Patient selection state
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  const emptyAppointment = {
    doctor_id: '',
    patient_id: '',
    appointment_date: '',
    appointment_time: '',
    appointment_type: 'consultation',
    symptoms: '',
    payment_amount: 0,
    payment_method: 'cash',
  };

  const emptyPatient = {
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    city: '',
    state: '',
  };

  const [newAppointment, setNewAppointment] = useState(emptyAppointment);
  const [newPatient, setNewPatient] = useState(emptyPatient);

  useEffect(() => {
    fetchData();
  }, []);

  // Close modals on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setShowDetailsModal(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (doctorData) {
        setCurrentUser({
          id: session.user.id,
          role: 'doctor',
          doctorId: doctorData.id,
        });

        // Load this doctor's appointments + ALL doctors (for OPD sidebar)
        const [appointmentsRes, doctorsRes] = await Promise.all([
          supabase
            .from('appointments')
            .select('*')
            .eq('doctor_id', doctorData.id)
            .order('appointment_date', { ascending: false }),
          supabase.from('doctors').select('*'),
        ]);

        setAppointments(appointmentsRes.data || []);
        setDoctors(doctorsRes.data || []);

        const patientIds = [
          ...new Set((appointmentsRes.data || []).map(a => a.patient_id).filter(Boolean)),
        ];
        if (patientIds.length > 0) {
          const { data: patientsData } = await supabase
            .from('patients')
            .select('*')
            .in('id', patientIds);
          setPatients(patientsData || []);
        }

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
        const roleName = Array.isArray((staffData as any).roles)
          ? (staffData as any).roles[0]?.role_name
          : (staffData as any).roles?.role_name;

        setCurrentUser({
          id: session.user.id,
          role: roleName || 'receptionist',
        });

        const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
          supabase.from('appointments').select('*').order('appointment_date', { ascending: false }),
          supabase.from('doctors').select('*'),
          supabase.from('patients').select('*'),
        ]);

        setAppointments(appointmentsRes.data || []);
        setDoctors(doctorsRes.data || []);
        setPatients(patientsRes.data || []);
        setLoading(false);
        return;
      }

      router.push('/login');
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };

  const createPatient = async () => {
    try {
      if (!newPatient.full_name || !newPatient.phone) {
        alert('Please fill in patient name and phone number');
        return;
      }

      const { data, error } = await supabase
        .from('patients')
        .insert([newPatient])
        .select()
        .single();

      if (error) throw error;

      setSelectedPatient(data);
      setNewAppointment({ ...newAppointment, patient_id: data.id });
      setShowNewPatientForm(false);
      setNewPatient(emptyPatient);

      fetchData();
    } catch (error) {
      console.error('Error creating patient:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to create patient: ' + message);
    }
  };

  const createAppointment = async () => {
    try {
      if (
        !newAppointment.doctor_id ||
        !newAppointment.patient_id ||
        !newAppointment.appointment_date ||
        !newAppointment.appointment_time
      ) {
        alert('Please fill in all required fields');
        return;
      }

      // Generate appointment number (APT + YYMMDD + 4 random = 13 chars)
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const appointmentNumber = `APT${year}${month}${day}${random}`;

      const { error } = await supabase
        .from('appointments')
        .insert([{
          ...newAppointment,
          appointment_number: appointmentNumber,
          status: 'pending',
          payment_status: 'unpaid',
        }])
        .select()
        .single();

      if (error) throw error;

      setShowAddModal(false);
      setSelectedPatient(null);
      setShowNewPatientForm(false);
      setPatientSearchTerm('');
      setNewAppointment(emptyAppointment);
      fetchData();
    } catch (error) {
      console.error('Error creating appointment:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to create appointment: ' + message);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const togglePaymentStatus = async (id: string, currentStatus: string) => {
    setUpdatingPaymentId(id);
    try {
      const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
      const updatePayload: { payment_status: string; status?: string; updated_at: string } = {
        payment_status: newStatus,
        updated_at: new Date().toISOString(),
      };

      // When payment status is changed to paid, automatically change status to confirmed
      if (newStatus === 'paid') {
        updatePayload.status = 'confirmed';
      }

      const { error } = await supabase
        .from('appointments')
        .update(updatePayload)
        .eq('id', id);

      if (error) throw error;

      setSelectedAppointment(prev =>
        prev && prev.id === id
          ? {
              ...prev,
              payment_status: newStatus,
              ...(newStatus === 'paid' ? { status: 'confirmed' } : {}),
            }
          : prev
      );

      fetchData();
    } catch (error) {
      console.error('Error updating payment status:', error);
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter(patient => {
    const search = patientSearchTerm.toLowerCase();
    return (
      patient.full_name.toLowerCase().includes(search) ||
      patient.phone?.toLowerCase().includes(search) ||
      patient.email?.toLowerCase().includes(search)
    );
  });

  /**
   * Print OPD slip — shows ALL hospital doctors in the sidebar,
   * grouped by specialization, with the current doctor highlighted.
   * Patient, appointment, and complaints data come from the DB.
   */
  const printOPD = (appointment: Appointment) => {
    const patient = patients.find(p => p.id === appointment.patient_id);
    const currentDoctorId = appointment.doctor_id;

    const escapeHtml = (value: unknown) =>
      String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const age = patient?.date_of_birth
      ? `${calculateAge(patient.date_of_birth)} years`
      : '';
    const gender = patient?.gender || '';
    const ageAndGender = [age, gender].filter(Boolean).join(' / ');
    const address =
      [patient?.address, patient?.city, patient?.state].filter(Boolean).join(', ') || '';

    // Fallback static departments (used if the DB has no doctors)
    const fallbackDepartments = [
      { department: 'Eye', doctor: { name: 'Dr. Prateek Sehrawat', qualifications: ['MBBS, MS', 'Consultant', 'Ophthalmologist'] } },
      { department: 'Obs & Gynae', doctor: { name: 'Dr. Mayura Baliyan', qualifications: ['MBBS, MS', 'Fellowship in Gynae', 'Laparoscopy', 'Consultant Gynaecologist'] } },
      { department: 'Medicine', doctor: { name: 'Dr. Ajay Kumar', qualifications: ['MBBS, DNB', 'Consultant Physician'] } },
      { department: 'Child', doctor: { name: 'Dr. Nitish Lavania', qualifications: ['MBBS, DCH', 'Child Specialist'] } },
    ];

    type SidebarDepartment = {
      department: string;
      doctors: { id: string; name: string; qualifications: string[]; isCurrent: boolean }[];
    };

    let sidebarDepartments: SidebarDepartment[] = [];

    if (doctors.length > 0) {
      const grouped = new Map<string, SidebarDepartment>();
      doctors.forEach(doc => {
        const dept = (doc.specialization || 'Consultant').trim();
        const key = dept.toLowerCase();
        if (!grouped.has(key)) {
          grouped.set(key, { department: dept, doctors: [] });
        }
        const quals: string[] = [];
        if (doc.degree) quals.push(doc.degree);
        quals.push('Consultant');
        grouped.get(key)!.doctors.push({
          id: doc.id,
          name: formatDoctorName(doc.full_name),
          qualifications: quals,
          isCurrent: doc.id === currentDoctorId,
        });
      });

      sidebarDepartments = Array.from(grouped.values()).sort((a, b) => {
        const aHasCurrent = a.doctors.some(d => d.isCurrent);
        const bHasCurrent = b.doctors.some(d => d.isCurrent);
        if (aHasCurrent && !bHasCurrent) return -1;
        if (!aHasCurrent && bHasCurrent) return 1;
        return a.department.localeCompare(b.department);
      });
    } else {
      sidebarDepartments = fallbackDepartments.map(fd => ({
        department: fd.department,
        doctors: [{
          id: '',
          name: fd.doctor.name,
          qualifications: fd.doctor.qualifications,
          isCurrent: false,
        }],
      }));
    }

    const sidebarHtml = sidebarDepartments.map(dept => `
      <section class="department">
        <h2>${escapeHtml(dept.department)}</h2>
        ${dept.doctors.map(doc => `
          <div class="doctor-block ${doc.isCurrent ? 'current-doctor' : ''}">
            <p class="doctor-name">${escapeHtml(doc.name)}</p>
            ${doc.qualifications.map(q => `<p>${escapeHtml(q)}</p>`).join('')}
          </div>
        `).join('')}
      </section>
    `).join('');

    const printWindow = window.open('', '_blank', 'width=900,height=1100');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OPD Slip - ${escapeHtml(appointment.appointment_number)}</title>
        <style>
          :root {
            --paper: #ffffff;
            --ink: #171717;
            --brown: #814b38;
            --green: #12634e;
          }

          * { box-sizing: border-box; }

          html, body {
            margin: 0;
            min-height: 100%;
            background: #d8d8d8;
            color: var(--ink);
            font-family: Arial, Helvetica, sans-serif;
          }

          body { padding: 24px; }

          .opd-sheet {
            position: relative;
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            overflow: hidden;
            background: var(--paper);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
          }

          .letterhead {
            position: relative;
            display: grid;
            grid-template-columns: 43mm 1fr;
            min-height: 43mm;
            padding: 7mm 8mm 0;
          }

          .brand-mark {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 1mm;
          }

          .exact-logo {
            width: 38mm;
            height: 29mm;
            background: var(--paper);
          }

          .exact-logo img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          .hospital-details {
            position: relative;
            padding-top: 2mm;
          }

          .mobile {
            position: absolute;
            top: -5mm;
            right: 0;
            font-size: 12pt;
            font-weight: 700;
          }

          h1 {
            margin: 0;
            padding-bottom: 1mm;
            border-bottom: 0.7mm solid var(--green);
            color: var(--brown);
            font-family: Georgia, "Times New Roman", serif;
            font-size: 27pt;
            font-weight: 700;
            letter-spacing: 0.4mm;
            line-height: 1.15;
            text-align: center;
            white-space: nowrap;
          }

          .address {
            margin: 1.5mm 0 0;
            font-size: 11.5pt;
            font-weight: 700;
            line-height: 1.35;
            text-align: center;
          }

          .record-fields {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 3mm;
            margin-top: 3mm;
            font-size: 10.5pt;
            font-weight: 700;
          }

          .field {
            display: flex;
            align-items: flex-end;
            gap: 1.5mm;
          }

          .field-line {
            display: inline-block;
            width: 34mm;
            min-height: 5mm;
            border-bottom: 0.4mm dotted var(--ink);
          }

          .form-body {
            display: grid;
            grid-template-columns: 53mm 1fr;
            min-height: 247mm;
            margin-top: 0;
          }

          .sidebar {
            padding: 6mm 4mm 10mm 3.5mm;
            border-right: 0.8mm solid var(--green);
          }

          .department { margin-bottom: 6mm; }

          .department h2,
          .facilities h2 {
            display: inline-block;
            margin: 0 0 1.2mm;
            border-bottom: 0.4mm solid var(--brown);
            color: var(--brown);
            font-size: 12pt;
            font-weight: 500;
            line-height: 1.1;
            text-transform: uppercase;
          }

          .department p {
            margin: 0;
            font-size: 8.6pt;
            font-weight: 700;
            line-height: 1.2;
            text-transform: uppercase;
          }

          .department .doctor-name {
            text-transform: none;
            font-size: 9.2pt;
          }

          .doctor-block { margin-bottom: 2mm; }
          .doctor-block:last-child { margin-bottom: 0; }

          .doctor-block.current-doctor {
            padding: 1mm 1.5mm;
            margin-left: -1.5mm;
            background: #fdf6d8;
            border-left: 0.8mm solid var(--brown);
            border-radius: 0.8mm;
          }

          .facilities { margin-top: 4mm; }

          .facilities ul {
            display: flex;
            flex-direction: column;
            gap: 4mm;
            margin: 3mm 0 0;
            padding: 0;
            list-style: none;
          }

          .facilities li {
            font-size: 12pt;
            font-weight: 700;
            line-height: 1.15;
            text-transform: uppercase;
          }

          .facilities li small {
            display: block;
            margin-top: 1mm;
            font-size: 8pt;
          }

          .writing-area {
            min-height: 247mm;
            padding: 6mm 6mm 16mm;
          }

          .patient-card {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            gap: 0.8mm 4mm;
            padding: 1.2mm 2mm;
            border: 0.35mm solid #c9c9c9;
            border-radius: 1.5mm;
          }

          .patient-field {
            display: flex;
            flex-direction: column;
            gap: 0.4mm;
            min-width: 0;
          }

          .patient-field.address-field { grid-column: 1 / -1; }

          .patient-field label,
          .complaints-box label {
            color: #414141;
            font-size: 7pt;
            font-weight: 600;
            letter-spacing: 0.15mm;
            text-transform: uppercase;
          }

          .patient-field .value {
            min-height: 3.5mm;
            padding: 0;
            color: #161616;
            font-size: 8pt;
            font-weight: 700;
            line-height: 1.35;
            overflow-wrap: anywhere;
          }

          .complaints-box {
            display: flex;
            flex-direction: column;
            gap: 0.8mm;
            min-height: 13mm;
            margin-top: 2mm;
            padding: 1.5mm 2mm;
            border: 0.4mm solid #d9a321;
            border-radius: 1.5mm;
          }

          .complaints-box label {
            color: var(--brown);
            font-weight: 700;
          }

          .complaints-text {
            flex: 1;
            min-height: 6mm;
            color: #161616;
            font-size: 8pt;
            line-height: 1.5;
            white-space: pre-wrap;
          }

          .prescription-notes {
            min-height: 174mm;
            padding-top: 5mm;
          }

          .sheet-footer {
            position: absolute;
            right: 8mm;
            bottom: 5mm;
            left: 61mm;
            padding-top: 2mm;
            border-top: 0.4mm solid var(--green);
            color: var(--brown);
            font-size: 8.5pt;
            font-weight: 700;
            letter-spacing: 0.2mm;
            text-align: center;
          }

          @page {
            size: A4 portrait;
            margin: 0;
          }

          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
              background: var(--paper);
            }
            body { padding: 0; }
            .opd-sheet {
              margin: 0;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <main class="opd-sheet" aria-label="Sant Haridas Hospital OPD form">
          <header class="letterhead">
            <div class="brand-mark">
              <div class="exact-logo">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sant%20haridas%20hospital%20logo_page-0001-9QC5utiID4qsGhzBl3IFnOffdM5PBD.jpg" alt="Sant Haridas Hospital logo">
              </div>
            </div>

            <div class="hospital-details">
              <div class="mobile">Mob. : 9540740947</div>
              <h1>SANT HARIDAS HOSPITAL</h1>
              <p class="address">Opp. Air Force Station, Bani Camp, Najafgarh, New Delhi - 110043</p>
              <div class="record-fields">
                <div class="field">Rec. No. <span class="field-line">${escapeHtml(appointment.appointment_number)}</span></div>
                <div class="field">Date <span class="field-line">${escapeHtml(appointment.appointment_date)}</span></div>
              </div>
            </div>
          </header>

          <section class="form-body">
            <aside class="sidebar" aria-label="Hospital departments and facilities">
              ${sidebarHtml}

              <section class="facilities">
                <h2>Facilities</h2>
                <ul>
                  <li>Smartlens<small>Optical Shop</small></li>
                  <li>Path Lab</li>
                  <li>Pharmacy</li>
                  <li>Physiotherapy</li>
                </ul>
              </section>
            </aside>

            <div class="writing-area">
              <section class="patient-card" aria-label="Patient details">
                <div class="patient-field">
                  <label>Patient name</label>
                  <div class="value">${escapeHtml(patient?.full_name || '')}</div>
                </div>
                <div class="patient-field">
                  <label>Age / Gender</label>
                  <div class="value">${escapeHtml(ageAndGender)}</div>
                </div>
                <div class="patient-field">
                  <label>Phone</label>
                  <div class="value">${escapeHtml(patient?.phone || '')}</div>
                </div>
                <div class="patient-field">
                  <label>Blood group</label>
                  <div class="value">${escapeHtml(patient?.blood_group || '')}</div>
                </div>
                <div class="patient-field address-field">
                  <label>Address</label>
                  <div class="value">${escapeHtml(address)}</div>
                </div>
              </section>

              <section class="complaints-box" aria-label="Chief complaints and symptoms">
                <label>Chief complaints / symptoms</label>
                <div class="complaints-text">${escapeHtml(appointment.symptoms || '')}</div>
              </section>

              <div class="prescription-notes" aria-label="OPD prescription writing area"></div>
            </div>
          </section>

          <footer class="sheet-footer">
            Sant Haridas Hospital &nbsp;|&nbsp; Mob.: 9540740947
          </footer>
        </main>
      </body>
      </html>
    `);
    printWindow.document.close();

    const templateImage = printWindow.document.querySelector<HTMLImageElement>('.exact-logo img');
    const openPrintDialog = () => {
      printWindow.focus();
      printWindow.print();
    };

    if (templateImage?.complete) {
      window.setTimeout(openPrintDialog, 150);
    } else if (templateImage) {
      templateImage.addEventListener('load', openPrintDialog, { once: true });
      templateImage.addEventListener('error', openPrintDialog, { once: true });
    } else {
      openPrintDialog();
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || app.payment_status === filterPayment;

    const patient = patients.find(p => p.id === app.patient_id);
    const doctor = doctors.find(d => d.id === app.doctor_id);

    const matchesSearch =
      searchTerm === '' ||
      app.appointment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPayment && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalCount = appointments.length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {currentUser?.role === 'doctor' ? 'My Consultations' : 'Appointments Desk'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              Live Dispatch
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {currentUser?.role === 'doctor'
              ? 'View patient queue, consulting schedule, and print clinical OPD slips.'
              : 'Review upcoming visits, patient bookings, payment statuses, and OPD printouts.'}
          </p>
        </div>

        {(currentUser?.role === 'admin' || currentUser?.role === 'receptionist') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        )}
      </div>

      {/* ── 4 KPI Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Action</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{confirmedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-teal-600 mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Search and Filter Toolbar ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name, phone, token #, or doctor..."
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

          {/* Status Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">🟡 Pending</option>
              <option value="confirmed">🟢 Confirmed</option>
              <option value="completed">🔵 Completed</option>
              <option value="cancelled">🔴 Cancelled</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Payment Filter */}
          <div className="relative min-w-[160px]">
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">All Payments</option>
              <option value="paid">✓ Paid</option>
              <option value="unpaid">✕ Unpaid</option>
              <option value="refunded">↺ Refunded</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Active search/filter info strip */}
        {(searchTerm || filterStatus !== 'all' || filterPayment !== 'all') && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong>{filteredAppointments.length}</strong> matching results
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterPayment('all');
              }}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Appointments Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                <th className="py-3.5 px-5">Token / Booking #</th>
                {currentUser?.role !== 'doctor' && (
                  <th className="py-3.5 px-5">Attending Doctor</th>
                )}
                <th className="py-3.5 px-5">Patient Details</th>
                <th className="py-3.5 px-5">Consulting Slot</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Payment Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAppointments.map((appointment) => {
                const patient = patients.find((p) => p.id === appointment.patient_id);
                const doctor = doctors.find((d) => d.id === appointment.doctor_id);
                const patientName = patient?.full_name || 'Patient Record';
                const initials = patientName
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <tr key={appointment.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Token / Booking # */}
                    <td className="py-4 px-5">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs font-bold">
                        #{appointment.appointment_number}
                      </div>
                    </td>

                    {/* Doctor */}
                    {currentUser?.role !== 'doctor' && (
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-sm truncate">
                              {formatDoctorName(doctor?.full_name)}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {doctor?.specialization || 'OPD Consultant'}
                            </p>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Patient */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-teal-700 text-xs shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{patientName}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {patient?.phone || 'No phone recorded'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-700 font-medium text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{appointment.appointment_date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                    </td>

                    {/* Status dropdown */}
                    <td className="py-4 px-5">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                        className={`border rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer appearance-none transition-colors ${
                          appointment.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                            : appointment.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70'
                            : appointment.status === 'completed'
                            ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100/70'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/70'
                        }`}
                      >
                        <option value="pending">🟡 Pending</option>
                        <option value="confirmed">🟢 Confirmed</option>
                        <option value="completed">🔵 Completed</option>
                        <option value="cancelled">🔴 Cancelled</option>
                      </select>
                    </td>

                    {/* Payment Status with toggle */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-slate-900 text-sm">
                          ₹{appointment.payment_amount || 0}
                        </span>

                        <button
                          onClick={() => togglePaymentStatus(appointment.id, appointment.payment_status)}
                          disabled={updatingPaymentId === appointment.id}
                          className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors focus:outline-none ${
                            appointment.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-slate-300'
                          } ${updatingPaymentId === appointment.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          title="Click to toggle payment status (Paid automatically confirms)"
                        >
                          <span
                            className={`inline-block w-3.5 h-3.5 transform rounded-full bg-white shadow transition-transform ${
                              appointment.payment_status === 'paid' ? 'translate-x-4.5' : 'translate-x-1'
                            }`}
                          />
                        </button>

                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                            appointment.payment_status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : appointment.payment_status === 'unpaid'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {appointment.payment_status}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Print OPD Slip */}
                        <button
                          onClick={() => printOPD(appointment)}
                          className="p-1.5 rounded-lg text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                          title="Print Hospital OPD Slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAppointments.length === 0 && (
                <tr>
                  <td
                    colSpan={currentUser?.role !== 'doctor' ? 7 : 6}
                    className="py-12 text-center text-slate-500"
                  >
                    <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No appointments found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search query or filter criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Appointment Modal ── */}
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
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">New Consultation Appointment</h2>
                  <p className="text-xs text-slate-500">Book patient visit into the OPD system</p>
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
              {/* Doctor Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Consulting Doctor *
                </label>
                <select
                  value={newAppointment.doctor_id}
                  onChange={(e) => {
                    const doctorId = e.target.value;
                    const selectedDoctor = doctors.find((d) => d.id === doctorId);
                    let fee = 0;

                    if (selectedDoctor) {
                      if (newAppointment.appointment_type === 'follow_up') {
                        fee = selectedDoctor.follow_up_fee || selectedDoctor.consultation_fee || 0;
                      } else {
                        fee = selectedDoctor.consultation_fee || 0;
                      }
                    }

                    setNewAppointment({
                      ...newAppointment,
                      doctor_id: doctorId,
                      payment_amount: fee,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {formatDoctorName(doc.full_name)} — {doc.specialization || 'Consultant'} (Fee: ₹{doc.consultation_fee || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Patient *
                </label>

                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewPatientForm(false);
                      setSelectedPatient(null);
                      setNewAppointment({ ...newAppointment, patient_id: '' });
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      !showNewPatientForm
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Existing Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewPatientForm(true);
                      setSelectedPatient(null);
                      setNewAppointment({ ...newAppointment, patient_id: '' });
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      showNewPatientForm
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    + Register New Patient
                  </button>
                </div>

                {!showNewPatientForm && (
                  <div>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search patient by full name, phone number, or email..."
                        value={patientSearchTerm}
                        onChange={(e) => {
                          setPatientSearchTerm(e.target.value);
                          setShowPatientSearch(true);
                        }}
                        onFocus={() => setShowPatientSearch(true)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>

                    {showPatientSearch && patientSearchTerm && (
                      <div className="mt-1 border border-slate-200 rounded-xl max-h-40 overflow-y-auto bg-white shadow-lg divide-y divide-slate-100">
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map((patient) => (
                            <button
                              key={patient.id}
                              type="button"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setNewAppointment({ ...newAppointment, patient_id: patient.id });
                                setPatientSearchTerm(patient.full_name);
                                setShowPatientSearch(false);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-teal-50/60 flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-semibold text-slate-900">{patient.full_name}</p>
                                <p className="text-slate-500">{patient.phone} | {patient.email || 'No email'}</p>
                              </div>
                              {selectedPatient?.id === patient.id && (
                                <span className="text-teal-600 font-bold">✓</span>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3.5 py-3 text-xs text-slate-500">
                            No patients found. Click &quot;Register New Patient&quot; above to create one.
                          </div>
                        )}
                      </div>
                    )}

                    {selectedPatient && (
                      <div className="mt-2 p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-teal-900 text-sm">{selectedPatient.full_name}</p>
                          <p className="text-xs text-teal-700">{selectedPatient.phone || 'No phone'}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                          Selected
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {showNewPatientForm && (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={newPatient.full_name}
                      onChange={(e) => setNewPatient({ ...newPatient, full_name: e.target.value })}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Phone *"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-xs"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-xs"
                    />
                    <input
                      type="date"
                      placeholder="Date of Birth"
                      value={newPatient.date_of_birth}
                      onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-xs"
                    />
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Blood Group (e.g. B+)"
                      value={newPatient.blood_group}
                      onChange={(e) => setNewPatient({ ...newPatient, blood_group: e.target.value })}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={newPatient.address}
                      onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-xs col-span-2"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newPatient.city}
                      onChange={(e) => setNewPatient({ ...newPatient, city: e.target.value })}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newPatient.state}
                      onChange={(e) => setNewPatient({ ...newPatient, state: e.target.value })}
                      className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={createPatient}
                      className="col-span-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs"
                    >
                      Save & Select Patient
                    </button>
                  </div>
                )}
              </div>

              {/* Appointment Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newAppointment.appointment_date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newAppointment.appointment_time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Type & Fees */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Visit Type
                  </label>
                  <select
                    value={newAppointment.appointment_type}
                    onChange={(e) => {
                      const type = e.target.value;
                      const selectedDoctor = doctors.find((d) => d.id === newAppointment.doctor_id);
                      let fee = 0;

                      if (selectedDoctor) {
                        if (type === 'follow_up') {
                          fee = selectedDoctor.follow_up_fee || selectedDoctor.consultation_fee || 0;
                        } else {
                          fee = selectedDoctor.consultation_fee || 0;
                        }
                      }

                      setNewAppointment({
                        ...newAppointment,
                        appointment_type: type,
                        payment_amount: fee,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="consultation">Initial Consultation</option>
                    <option value="follow_up">Follow-up Visit</option>
                    <option value="emergency">Emergency OPD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={newAppointment.payment_amount}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800"
                    readOnly
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Payment Method
                </label>
                <select
                  value={newAppointment.payment_method}
                  onChange={(e) => setNewAppointment({ ...newAppointment, payment_method: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="cash">Cash (Counter)</option>
                  <option value="upi">UPI / QR Code</option>
                  <option value="card">Debit / Credit Card</option>
                  <option value="insurance">TPA / Health Insurance</option>
                </select>
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Presenting Symptoms / Chief Complaints
                </label>
                <textarea
                  placeholder="e.g. Fever, coughing, routine follow-up"
                  value={newAppointment.symptoms}
                  onChange={(e) => setNewAppointment({ ...newAppointment, symptoms: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  rows={2}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedPatient(null);
                    setShowNewPatientForm(false);
                    setPatientSearchTerm('');
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={createAppointment}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-xs transition-colors"
                >
                  Create Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Details Modal ── */}
      {showDetailsModal && selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs"></div>

          <div
            className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Appointment Overview</h2>
                <p className="text-xs text-slate-500">Token #{selectedAppointment.appointment_number}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500">Token Number</p>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">#{selectedAppointment.appointment_number}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Date & Time</p>
                  <p className="font-medium text-slate-800 mt-0.5">
                    {selectedAppointment.appointment_date} at {selectedAppointment.appointment_time}
                  </p>
                </div>
              </div>

              {/* Payment toggle */}
              <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-emerald-800">Payment Status</p>
                  <p className="font-bold text-emerald-900 text-sm mt-0.5 capitalize">
                    {selectedAppointment.payment_status} (₹{selectedAppointment.payment_amount || 0})
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Marking Paid automatically confirms booking
                  </p>
                </div>
                <button
                  onClick={() => togglePaymentStatus(selectedAppointment.id, selectedAppointment.payment_status)}
                  disabled={updatingPaymentId === selectedAppointment.id}
                  className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors cursor-pointer ${
                    selectedAppointment.payment_status === 'paid' ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform rounded-full bg-white shadow transition-transform ${
                      selectedAppointment.payment_status === 'paid' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Payment Method</p>
                  <p className="font-semibold text-slate-800 mt-0.5 capitalize">{selectedAppointment.payment_method || 'N/A'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Appointment Type</p>
                  <p className="font-semibold text-slate-800 mt-0.5 capitalize">{selectedAppointment.appointment_type || 'Consultation'}</p>
                </div>
              </div>

              {selectedAppointment.symptoms && (
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Symptoms</p>
                  <p className="text-slate-800 text-xs mt-1">{selectedAppointment.symptoms}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2.5 mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={() => printOPD(selectedAppointment)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print OPD Slip</span>
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}