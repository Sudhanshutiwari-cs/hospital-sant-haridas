// app/dashboard/appointments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';

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

  const [newAppointment, setNewAppointment] = useState({
    doctor_id: '',
    patient_id: '',
    appointment_date: '',
    appointment_time: '',
    appointment_type: 'consultation',
    symptoms: '',
    payment_amount: 0,
    payment_method: 'cash',
  });

  const [newPatient, setNewPatient] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    city: '',
    state: '',
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
          id: session.user.id,
          role: 'doctor',
          doctorId: doctorData.id,
        });

        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('*')
          .eq('doctor_id', doctorData.id)
          .order('appointment_date', { ascending: false });

        setAppointments(appointmentsData || []);
        
        const patientIds = [...new Set((appointmentsData || []).map(a => a.patient_id).filter(Boolean))];
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
        setCurrentUser({
          id: session.user.id,
          role: staffData.roles?.role_name || 'receptionist',
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
      setNewAppointment({...newAppointment, patient_id: data.id});
      setShowNewPatientForm(false);
      setNewPatient({
        full_name: '',
        phone: '',
        email: '',
        date_of_birth: '',
        gender: '',
        blood_group: '',
        address: '',
        city: '',
        state: '',
      });
      
      fetchData();
    } catch (error) {
      console.error('Error creating patient:', error);
      alert('Failed to create patient: ' + (error as any).message);
    }
  };

  const createAppointment = async () => {
    try {
      if (!newAppointment.doctor_id || !newAppointment.patient_id || !newAppointment.appointment_date || !newAppointment.appointment_time) {
        alert('Please fill in all required fields');
        return;
      }

      // Generate appointment number (13 characters: APT + YYMMDD + 4 random)
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const appointmentNumber = `APT${year}${month}${day}${random}`;

      const { data, error } = await supabase
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
      fetchData();
      setNewAppointment({
        doctor_id: '',
        patient_id: '',
        appointment_date: '',
        appointment_time: '',
        appointment_type: 'consultation',
        symptoms: '',
        payment_amount: 0,
        payment_method: 'cash',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment: ' + (error as any).message);
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

      const { error } = await supabase
        .from('appointments')
        .update({ payment_status: newStatus })
        .eq('id', id);

      if (error) throw error;

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
    return patient.full_name.toLowerCase().includes(search) ||
           patient.phone?.toLowerCase().includes(search) ||
           patient.email?.toLowerCase().includes(search);
  });

  const printOPD = (appointment: Appointment) => {
    const doctor = doctors.find(d => d.id === appointment.doctor_id);
    const patient = patients.find(p => p.id === appointment.patient_id);
    
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>OPD Slip - ${appointment.appointment_number}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Arial, sans-serif; padding: 20px; background: #fff; }
              .opd-container { max-width: 850px; margin: 0 auto; border: 2px solid #333; padding: 15px; min-height: 100vh; display: flex; flex-direction: column; }
              .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 12px; margin-bottom: 15px; }
              .hospital-name { font-size: 28px; font-weight: bold; color: #1a56db; margin: 0 0 3px 0; letter-spacing: 1px; text-transform: uppercase; }
              .hospital-tagline { font-size: 12px; color: #6b7280; margin: 0 0 8px 0; }
              .opd-title { font-size: 18px; font-weight: bold; margin: 5px 0; text-transform: uppercase; letter-spacing: 2px; }
              .appointment-info { display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-top: 8px; }
              .doctor-info { text-align: center; margin-bottom: 15px; padding: 10px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; }
              .doctor-name { font-size: 18px; font-weight: bold; color: #1e40af; }
              .doctor-specialization { font-size: 14px; color: #4b5563; margin-top: 2px; }
              .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; }
              .info-item { margin-bottom: 5px; }
              .info-label { font-size: 11px; color: #6b7280; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
              .info-value { font-size: 14px; font-weight: bold; color: #111827; }
              .symptoms-section { margin-bottom: 12px; padding: 10px; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 4px; }
              .symptoms-label { font-size: 12px; font-weight: bold; color: #92400e; margin-bottom: 4px; text-transform: uppercase; }
              .symptoms-text { font-size: 14px; color: #78350f; }
              .vitals-section { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px; padding: 8px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 4px; }
              .vital-item { text-align: center; }
              .vital-label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
              .vital-value { font-size: 13px; font-weight: bold; margin-top: 2px; }
              .advice-section { flex: 1; display: flex; flex-direction: column; margin: 10px 0; }
              .advice-header { display: flex; gap: 20px; margin-bottom: 8px; }
              .advice-label { font-size: 14px; font-weight: bold; color: #374151; text-transform: uppercase; letter-spacing: 1px; }
              .advice-line { flex: 1; border-bottom: 1px solid #9ca3af; }
              .advice-content { flex: 1; border: 1px dashed #d1d5db; background: #fefefe; min-height: 400px; padding: 10px; margin-bottom: 5px; }
              .followup-section { margin: 5px 0; padding: 8px; border: 1px solid #e5e7eb; background: #fafafa; }
              .followup-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
              .followup-content { min-height: 60px; }
              .footer { text-align: center; border-top: 2px solid #333; padding-top: 10px; margin-top: auto; font-size: 11px; color: #6b7280; }
              .footer-line { margin: 2px 0; }
              @media print { body { padding: 0; } .opd-container { border: none; padding: 0; min-height: auto; } }
              @page { size: A4; margin: 10mm; }
            </style>
          </head>
          <body>
            <div class="opd-container">
              <div class="header">
                <h1 class="hospital-name">Sant Haridas Hospital</h1>
                <p class="hospital-tagline">Compassionate Care, Advanced Medicine</p>
                <p class="opd-title">Out Patient Department (OPD) Slip</p>
                <div class="appointment-info">
                  <span>Appointment #: ${appointment.appointment_number}</span>
                  <span>Date: ${appointment.appointment_date}</span>
                  <span>Time: ${appointment.appointment_time}</span>
                </div>
              </div>

              <div class="doctor-info">
                <p class="doctor-name">Dr. ${doctor?.full_name || 'N/A'}</p>
                <p class="doctor-specialization">${doctor?.specialization || ''} ${doctor?.degree ? '- ' + doctor.degree : ''}</p>
              </div>

              <div class="patient-info">
                <div class="info-item">
                  <div class="info-label">Patient Name</div>
                  <div class="info-value">${patient?.full_name || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Age / Gender</div>
                  <div class="info-value">${patient?.date_of_birth ? calculateAge(patient.date_of_birth) + ' years' : 'N/A'} / ${patient?.gender || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone</div>
                  <div class="info-value">${patient?.phone || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Blood Group</div>
                  <div class="info-value">${patient?.blood_group || 'N/A'}</div>
                </div>
                <div class="info-item" style="grid-column: 1 / -1;">
                  <div class="info-label">Address</div>
                  <div class="info-value">${[patient?.address, patient?.city, patient?.state].filter(Boolean).join(', ') || 'N/A'}</div>
                </div>
              </div>

              ${appointment.symptoms ? `
                <div class="symptoms-section">
                  <div class="symptoms-label">Chief Complaints / Symptoms</div>
                  <div class="symptoms-text">${appointment.symptoms}</div>
                </div>
              ` : ''}

              <div class="vitals-section">
                <div class="vital-item"><div class="vital-label">BP</div><div class="vital-value">________</div></div>
                <div class="vital-item"><div class="vital-label">Pulse</div><div class="vital-value">________</div></div>
                <div class="vital-item"><div class="vital-label">Temp</div><div class="vital-value">________</div></div>
                <div class="vital-item"><div class="vital-label">Weight</div><div class="vital-value">________</div></div>
              </div>

              <div class="advice-section">
                <div class="advice-header">
                  <span class="advice-label">Doctor's Advice / Prescription</span>
                  <span class="advice-line"></span>
                </div>
                <div class="advice-content"><div style="min-height: 380px;"></div></div>
              </div>

              <div class="followup-section">
                <div class="followup-label">Follow-up Instructions:</div>
                <div class="followup-content"></div>
              </div>

              <div class="footer">
                <p class="footer-line">This is a computer generated OPD slip</p>
                <p class="footer-line"><strong>Sant Haridas Hospital</strong> | Contact: +91-XXXXXXXXXX | Email: info@santharidas.com</p>
                <p class="footer-line">Address: [Hospital Address], [City], [State] - [PIN Code]</p>
                <p class="footer-line" style="margin-top: 5px;">© ${new Date().getFullYear()} Sant Haridas Hospital. All Rights Reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || app.payment_status === filterPayment;
    const matchesSearch = searchTerm === '' || 
      app.appointment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctors.find(d => d.id === app.doctor_id)?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patients.find(p => p.id === app.patient_id)?.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPayment && matchesSearch;
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {currentUser?.role === 'doctor' ? 'My Appointments' : 'Appointments'}
        </h1>
        {(currentUser?.role === 'admin' || currentUser?.role === 'receptionist') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            + New Appointment
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appointment #</th>
                {currentUser?.role !== 'doctor' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{appointment.appointment_number}</td>
                  {currentUser?.role !== 'doctor' && (
                    <td className="px-6 py-4">
                      {doctors.find(d => d.id === appointment.doctor_id)?.full_name}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    {patients.find(p => p.id === appointment.patient_id)?.full_name}
                  </td>
                  <td className="px-6 py-4">
                    <div>{appointment.appointment_date}</div>
                    <div className="text-sm text-gray-500">{appointment.appointment_time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={appointment.status}
                      onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                      className={`border rounded px-2 py-1 text-xs font-medium ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-300' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                        appointment.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        'bg-red-100 text-red-800 border-red-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">${appointment.payment_amount || 0}</div>
                      <button
                        onClick={() => togglePaymentStatus(appointment.id, appointment.payment_status)}
                        disabled={updatingPaymentId === appointment.id}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                          appointment.payment_status === 'paid' ? 'bg-green-500' : 'bg-gray-300'
                        } ${updatingPaymentId === appointment.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`inline-block w-4 h-4 transform rounded-full bg-white shadow transition-transform ${
                            appointment.payment_status === 'paid' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`text-xs font-medium ${
                        appointment.payment_status === 'paid' ? 'text-green-600' :
                        appointment.payment_status === 'unpaid' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {appointment.payment_status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => printOPD(appointment)}
                        className="text-green-600 hover:text-green-900"
                        title="Print OPD"
                      >
                        🖨️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          
          <div 
            className="relative bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">New Appointment</h2>
            <div className="space-y-4">
              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                <select
                  value={newAppointment.doctor_id}
                  onChange={(e) => {
                    const doctorId = e.target.value;
                    const selectedDoctor = doctors.find(d => d.id === doctorId);
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
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.full_name} - {doc.specialization} (₹{doc.consultation_fee})
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
                
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewPatientForm(false);
                      setSelectedPatient(null);
                      setNewAppointment({...newAppointment, patient_id: ''});
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                      !showNewPatientForm ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Existing Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewPatientForm(true);
                      setSelectedPatient(null);
                      setNewAppointment({...newAppointment, patient_id: ''});
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg ${
                      showNewPatientForm ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    + New Patient
                  </button>
                </div>

                {!showNewPatientForm && (
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search patient by name, phone, or email..."
                        value={patientSearchTerm}
                        onChange={(e) => {
                          setPatientSearchTerm(e.target.value);
                          setShowPatientSearch(true);
                        }}
                        onFocus={() => setShowPatientSearch(true)}
                        className="w-full border rounded px-3 py-2 pl-10"
                      />
                      <span className="absolute left-3 top-2.5">🔍</span>
                    </div>
                    
                    {showPatientSearch && patientSearchTerm && (
                      <div className="mt-1 border rounded-lg max-h-40 overflow-y-auto">
                        {filteredPatients.length > 0 ? (
                          filteredPatients.map(patient => (
                            <button
                              key={patient.id}
                              type="button"
                              onClick={() => {
                                setSelectedPatient(patient);
                                setNewAppointment({...newAppointment, patient_id: patient.id});
                                setPatientSearchTerm(patient.full_name);
                                setShowPatientSearch(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium">{patient.full_name}</p>
                                <p className="text-xs text-gray-500">{patient.phone} | {patient.email}</p>
                              </div>
                              {selectedPatient?.id === patient.id && (
                                <span className="text-green-500">✓</span>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No patients found. Click "New Patient" to create one.
                          </div>
                        )}
                      </div>
                    )}

                    {selectedPatient && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="font-medium text-green-800">{selectedPatient.full_name}</p>
                        <p className="text-sm text-green-600">{selectedPatient.phone}</p>
                      </div>
                    )}
                  </div>
                )}

                {showNewPatientForm && (
                  <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={newPatient.full_name}
                      onChange={(e) => setNewPatient({...newPatient, full_name: e.target.value})}
                      className="border rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Phone *"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
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
                      <option value="">Gender</option>
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
                      className="border rounded px-3 py-2 col-span-2"
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
                    <button
                      type="button"
                      onClick={createPatient}
                      className="col-span-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save Patient
                    </button>
                  </div>
                )}
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={newAppointment.appointment_date}
                    onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={newAppointment.appointment_time}
                    onChange={(e) => setNewAppointment({...newAppointment, appointment_time: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newAppointment.appointment_type}
                    onChange={(e) => {
                      const type = e.target.value;
                      const selectedDoctor = doctors.find(d => d.id === newAppointment.doctor_id);
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
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fees (Auto-calculated)</label>
                  <input
                    type="number"
                    value={newAppointment.payment_amount}
                    onChange={(e) => setNewAppointment({...newAppointment, payment_amount: parseFloat(e.target.value)})}
                    className="w-full border rounded px-3 py-2 bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={newAppointment.payment_method}
                  onChange={(e) => setNewAppointment({...newAppointment, payment_method: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
                <textarea
                  placeholder="Symptoms"
                  value={newAppointment.symptoms}
                  onChange={(e) => setNewAppointment({...newAppointment, symptoms: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedPatient(null);
                    setShowNewPatientForm(false);
                    setPatientSearchTerm('');
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createAppointment}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setShowDetailsModal(false)}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          
          <div 
            className="relative bg-white rounded-lg p-6 w-full max-w-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Appointment Number</p>
                <p className="font-medium">{selectedAppointment.appointment_number}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-medium">{selectedAppointment.payment_status}</p>
                </div>
                <button
                  onClick={() => togglePaymentStatus(selectedAppointment.id, selectedAppointment.payment_status)}
                  disabled={updatingPaymentId === selectedAppointment.id}
                  className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors ${
                    selectedAppointment.payment_status === 'paid' ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform ${
                      selectedAppointment.payment_status === 'paid' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Amount</p>
                <p className="font-medium">₹{selectedAppointment.payment_amount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{selectedAppointment.payment_method || 'N/A'}</p>
              </div>
              {selectedAppointment.symptoms && (
                <div>
                  <p className="text-sm text-gray-500">Symptoms</p>
                  <p>{selectedAppointment.symptoms}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => printOPD(selectedAppointment)}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                🖨️ Print OPD
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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