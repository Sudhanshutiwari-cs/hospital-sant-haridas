// app/book-appointment/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

// ── Shared Icons ──────────────────────────────────────────────────────────────

function SiteLogo() {
  return (
    <img
      src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
      alt="Sant Haridas Hospital"
      className="h-12 w-auto object-contain"
    />
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
      <circle cx="11" cy="11" r="7" stroke="#374151" strokeWidth="2" />
      <path d="M20 20l-3-3" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="white" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.4.1-.1.2-.3.3-.4.1-.2.1-.3 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.4.1-.7.3C7.4 8 7 8.9 7 9.9c0 1 .7 2 .8 2.2.1.1 1.5 2.3 3.6 3.2.5.2.9.4 1.2.5.5.2 1 .1 1.3.1.4-.1 1.3-.5 1.5-1s.2-.9.1-1z" fill="white" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block text-gray-500">
      <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 7h14" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 2v3M12 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="6" cy="11" r="1" fill="currentColor" />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="12" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

function RupeeIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block text-gray-500">
      <path d="M5 4h8M5 8h8M9 8l-4 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 6c0 0 0 2 4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" fill="#10b981" />
      <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
      <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Nav Components ───────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-sm">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-end gap-6 h-10">
        <a href="#" className="flex items-center gap-1.5 hover:underline whitespace-nowrap font-medium">
          <WhatsAppIcon /> WhatsApp Us (24/7)
        </a>
        <a href="tel:+919268880303" className="flex items-center gap-1.5 hover:underline whitespace-nowrap font-medium">
          <PhoneIcon /> +91 926 888 0303 (24/7)
        </a>
      </div>
    </div>
  );
}

function MainNav() {
  const mainNavItems = ["Doctors", "Services", "Blogs", "About Us", "Contact Us"];
  
  const getNavLink = (item: string): string => {
    switch (item) {
      case "Doctors": return "/doctors";
      case "Services": return "/services";
      case "Blogs": return "/blogs";
      case "About Us": return "/about";
      case "Contact Us": return "#contact";
      default: return "#";
    }
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-16">
        <a href="/" className="flex-shrink-0">
          <SiteLogo />
        </a>
        <nav className="flex items-center gap-6">
          {mainNavItems.map((item) => (
            <a
              key={item}
              href={getNavLink(item)}
              className="px-2 py-5 text-[15px] font-semibold text-gray-700 hover:text-[#1a9fa8] transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/book-appointment" className="bg-[#e85d26] hover:bg-[#d14e1c] text-white font-semibold text-sm px-5 py-2.5 rounded transition-colors whitespace-nowrap">
            Book an Appointment
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

type Doctor = {
  id: string;
  name: string;
  degree: string;
  specialization: string;
  experience: number;
  fees: number;
  image: string;
};

type TimeSlot = {
  id: string;
  doctor_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  slot_type: string;
  is_booked: boolean;
  is_available: boolean;
};

// ── Main Component ──────────────────────────────────────────────────────────

export default function BookAppointmentPage() {
  const router = useRouter();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    patient_age: '',
    patient_gender: 'male',
    patient_message: '',
  });

  // Load pre-selected doctor from session storage
  useEffect(() => {
    const selectedDoctorData = sessionStorage.getItem('selectedDoctor');
    const bookingData = sessionStorage.getItem('bookingData');
    
    if (selectedDoctorData) {
      try {
        const doctor = JSON.parse(selectedDoctorData);
        setSelectedDoctor(doctor);
        sessionStorage.setItem('selectedDoctorBackup', JSON.stringify(doctor));
        setCurrentStep(2);
        sessionStorage.removeItem('selectedDoctor');
      } catch (err) {
        console.error('Error parsing selected doctor:', err);
      }
    }
    
    if (bookingData) {
      try {
        const booking = JSON.parse(bookingData);
        setSelectedDoctor(booking.doctor);
        sessionStorage.setItem('selectedDoctorBackup', JSON.stringify(booking.doctor));
        setSelectedDate(booking.date);
        sessionStorage.setItem('selectedDate', booking.date);
        if (booking.slot) {
          setSelectedSlot(booking.slot);
          sessionStorage.setItem('selectedSlot', JSON.stringify(booking.slot));
        }
        setCurrentStep(3);
        sessionStorage.removeItem('bookingData');
      } catch (err) {
        console.error('Error parsing booking data:', err);
      }
    }
  }, []);

  // Restore state when moving to step 3
  useEffect(() => {
    if (currentStep === 3) {
      if (!selectedSlot) {
        const savedSlot = sessionStorage.getItem('selectedSlot');
        if (savedSlot) {
          try {
            const slot = JSON.parse(savedSlot);
            setSelectedSlot(slot);
          } catch (err) {
            console.error('Error parsing saved slot:', err);
          }
        }
      }
      
      if (!selectedDate) {
        const savedDate = sessionStorage.getItem('selectedDate');
        if (savedDate) {
          setSelectedDate(savedDate);
        }
      }
      
      if (!selectedDoctor) {
        const savedDoctor = sessionStorage.getItem('selectedDoctorBackup');
        if (savedDoctor) {
          try {
            const doctor = JSON.parse(savedDoctor);
            setSelectedDoctor(doctor);
          } catch (err) {
            console.error('Error parsing saved doctor:', err);
          }
        }
      }
    }
  }, [currentStep]);

  // Fetch initial data
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch available slots when doctor, date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    setIsLoadingDoctors(true);
    setError('');
    
    try {
      let query = supabase
        .from('doctors')
        .select(`
          id, full_name, email, phone, degree, specialization,
          experience_years, consultation_fee, profile_image_url, is_active, about
        `)
        .eq('is_active', true)
        .order('full_name', { ascending: true });

      if (searchTerm.trim()) {
        const searchPattern = `%${searchTerm.trim()}%`;
        query = query.or(`full_name.ilike.${searchPattern},degree.ilike.${searchPattern},specialization.ilike.${searchPattern}`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const transformedDoctors: Doctor[] = (data || []).map((doc: any) => ({
        id: doc.id,
        name: doc.full_name,
        degree: doc.degree || 'Doctor',
        specialization: doc.specialization || 'General',
        experience: doc.experience_years || 0,
        fees: doc.consultation_fee || 0,
        image: doc.profile_image_url || '',
      }));

      setDoctors(transformedDoctors);
    } catch (err: any) {
      console.error('Error fetching doctors:', err);
      setError(err.message || 'Failed to fetch doctors');
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const { data: slots, error: slotsError } = await supabase
        .from('doctor_slots')
        .select('*')
        .eq('doctor_id', selectedDoctor.id)
        .eq('slot_date', selectedDate)
        .eq('is_booked', false)
        .eq('is_available', true)
        .order('start_time', { ascending: true });

      if (slotsError) throw slotsError;

      setAvailableSlots(slots || []);
      setSelectedSlot(null);
    } catch (err: any) {
      console.error('Error fetching slots:', err);
      setError(err.message || 'Failed to fetch slots');
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate days for the selected month
  const generateMonthDays = (monthDate: Date) => {
    const days: { date: string; dayName: string; dayNumber: number; month: string; isPast: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      date.setHours(0, 0, 0, 0);
      
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: i,
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isPast: date < today,
      });
    }
    
    return days;
  };

  const monthDays = generateMonthDays(currentMonth);

  const goToPreviousMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };

  const goToNextMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  const canGoPreviousMonth = () => {
    const today = new Date();
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return prevMonth.getMonth() >= today.getMonth() && prevMonth.getFullYear() >= today.getFullYear();
  };

  const canGoNextMonth = () => {
    const today = new Date();
    const maxMonth = new Date(today);
    maxMonth.setMonth(maxMonth.getMonth() + 3);
    return currentMonth < maxMonth;
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    sessionStorage.setItem('selectedDoctorBackup', JSON.stringify(doctor));
    setSelectedSlot(null);
    sessionStorage.removeItem('selectedSlot');
    setSelectedDate('');
    sessionStorage.removeItem('selectedDate');
    setAvailableSlots([]);
    setCurrentStep(2);
  };

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    sessionStorage.setItem('selectedDate', date);
    setSelectedSlot(null);
    sessionStorage.removeItem('selectedSlot');
    
    const selectedDateObj = new Date(date);
    setCurrentMonth(selectedDateObj);
  };

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    sessionStorage.setItem('selectedSlot', JSON.stringify(slot));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.patient_name.trim()) {
      errors.patient_name = 'Patient name is required';
    }
    
    if (!formData.patient_phone.trim()) {
      errors.patient_phone = 'Phone number is required';
    } else {
      const phoneDigits = formData.patient_phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        errors.patient_phone = 'Please enter a valid 10-digit phone number';
      }
    }
    
    if (formData.patient_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patient_email)) {
      errors.patient_email = 'Please enter a valid email address';
    }
    
    if (formData.patient_age) {
      const age = parseInt(formData.patient_age);
      if (isNaN(age) || age < 0 || age > 150) {
        errors.patient_age = 'Please enter a valid age';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit booking
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!selectedDoctor || !selectedSlot || !selectedDate) {
      setError('Please complete all booking steps');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      let patientId = null;
      
      const { data: existingPatient, error: patientLookupError } = await supabase
        .from('patients')
        .select('id')
        .eq('phone', formData.patient_phone)
        .limit(1);

      if (patientLookupError) throw patientLookupError;

      if (existingPatient && existingPatient.length > 0) {
        patientId = existingPatient[0].id;
      } else {
        const patientData: any = {
          full_name: formData.patient_name,
          phone: formData.patient_phone,
          email: formData.patient_email || null,
          gender: formData.patient_gender || null,
        };

        if (formData.patient_age) {
          const birthYear = new Date().getFullYear() - parseInt(formData.patient_age);
          patientData.date_of_birth = `${birthYear}-01-01`;
        }

        const { data: newPatient, error: patientCreateError } = await supabase
          .from('patients')
          .insert(patientData)
          .select()
          .single();

        if (patientCreateError) throw patientCreateError;
        patientId = newPatient.id;
      }

      const { data: slotCheck, error: slotCheckError } = await supabase
        .from('doctor_slots')
        .select('is_booked, is_available')
        .eq('id', selectedSlot.id)
        .single();

      if (slotCheckError) throw slotCheckError;

      if (slotCheck.is_booked || !slotCheck.is_available) {
        setError('Selected slot is no longer available. Please choose another slot.');
        setIsSubmitting(false);
        return;
      }

      const appointmentData = {
        doctor_id: selectedDoctor.id,
        patient_id: patientId,
        slot_id: selectedSlot.id,
        appointment_date: selectedDate,
        appointment_time: selectedSlot.start_time,
        appointment_type: 'consultation',
        status: 'pending',
        symptoms: formData.patient_message || null,
        notes: formData.patient_message || null,
        payment_status: 'unpaid',
        payment_amount: selectedDoctor.fees,
      };

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      const { error: slotUpdateError } = await supabase
        .from('doctor_slots')
        .update({ is_booked: true })
        .eq('id', selectedSlot.id);

      if (slotUpdateError) {
        console.error('Slot update error:', slotUpdateError);
      }

      setBookingReference(appointment.id);
      setBookingSuccess(true);
      
      sessionStorage.removeItem('selectedSlot');
      sessionStorage.removeItem('selectedDate');
      sessionStorage.removeItem('selectedDoctorBackup');
      
    } catch (err: any) {
      console.error('Error booking appointment:', err);
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset booking
  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setSelectedDate('');
    setAvailableSlots([]);
    setFormData({
      patient_name: '',
      patient_phone: '',
      patient_email: '',
      patient_age: '',
      patient_gender: 'male',
      patient_message: '',
    });
    setBookingSuccess(false);
    setBookingReference('');
    setFormErrors({});
    setError('');
    setSearchTerm('');
    
    sessionStorage.removeItem('selectedSlot');
    sessionStorage.removeItem('selectedDate');
    sessionStorage.removeItem('selectedDoctorBackup');
    
    fetchDoctors();
  };

  // Search doctors
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(() => {
      fetchDoctors();
    }, 300);
  };

  return (
    <>
      <main className="min-h-screen bg-[#f7f8fa]">
        <TopBar />
        <MainNav />

        {/* Page Header */}
        <div className="w-full bg-gradient-to-r from-[#1a3a5c] to-[#1a9fa8] text-white">
          <div className="max-w-[1200px] mx-auto px-4 py-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Book an Appointment</h1>
            <p className="text-white/90 text-[15px] max-w-2xl">
              Schedule your consultation with our expert doctors. Choose your preferred mode of consultation and time slot.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="w-full bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 py-6">
            <div className="flex items-center justify-center gap-4">
              {['Select Doctor', 'Choose Schedule', 'Patient Details'].map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    currentStep > index + 1 ? 'bg-green-500 text-white' :
                    currentStep === index + 1 ? 'bg-[#1a9fa8] text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className={`text-sm font-semibold ${
                    currentStep === index + 1 ? 'text-[#1a3a5c]' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                  {index < 2 && <div className="w-16 h-px bg-gray-300 mx-2" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-[1200px] mx-auto px-4 mt-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {/* Booking Content */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {bookingSuccess ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <CheckIcon />
              </div>
              <h2 className="text-2xl font-bold text-[#1a3a5c] mb-3">Appointment Booked Successfully!</h2>
              <p className="text-gray-600 mb-2">
                Your appointment with {selectedDoctor?.name} has been requested.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Booking Reference: <span className="font-mono font-semibold">{bookingReference}</span>
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Doctor</p>
                    <p className="font-semibold text-[#1a3a5c]">{selectedDoctor?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-semibold text-[#1a3a5c]">
                      {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-semibold text-[#1a3a5c]">{selectedSlot?.start_time.slice(0, 5)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fees</p>
                    <p className="font-semibold text-[#1a3a5c]">₹{selectedDoctor?.fees}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={resetBooking}
                className="bg-[#1a9fa8] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#158791] transition-colors"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Doctor Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#1a3a5c] mb-4">Select a Doctor</h2>
                    
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <SearchIcon />
                        <input
                          type="text"
                          placeholder="Search doctors by name or specialty..."
                          value={searchTerm}
                          onChange={handleSearch}
                          className="flex-1 text-[14px] text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                        />
                        {searchTerm && (
                          <button 
                            onClick={() => {
                              setSearchTerm('');
                              fetchDoctors();
                            }}
                            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    </div>

                    {isLoadingDoctors ? (
                      <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9fa8]"></div>
                      </div>
                    ) : (
                      <>
                        {doctors.length === 0 ? (
                          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                            <p className="text-gray-500">No doctors found. Please try different search criteria.</p>
                          </div>
                        ) : (
                          doctors.map((doctor) => (
                            <div key={doctor.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                              <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
                                  {doctor.image ? (
                                    <Image
                                      src={doctor.image}
                                      alt={doctor.name}
                                      width={80}
                                      height={80}
                                      className="object-cover object-center w-full h-full"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">
                                      {doctor.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-[#1a1a1a]">{doctor.name}</h3>
                                  <p className="text-sm text-gray-600">{doctor.degree} | {doctor.specialization}</p>
                                  <div className="flex items-center gap-4 mt-3 text-sm">
                                    <span className="flex items-center gap-1 text-gray-600">
                                      <CalendarIcon /> {doctor.experience} Years
                                    </span>
                                    <span className="flex items-center gap-1 text-gray-600">
                                      <RupeeIcon /> ₹{doctor.fees}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDoctorSelect(doctor)}
                                  className="bg-[#1a9fa8] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#158791] transition-colors text-sm whitespace-nowrap"
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Step 2: Schedule Selection */}
                {currentStep === 2 && selectedDoctor && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="text-gray-500 hover:text-[#1a9fa8] transition-colors"
                        >
                          <ArrowLeftIcon />
                        </button>
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          {selectedDoctor.image ? (
                            <Image
                              src={selectedDoctor.image}
                              alt={selectedDoctor.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold">
                              {selectedDoctor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1a3a5c]">{selectedDoctor.name}</h3>
                          <p className="text-sm text-gray-600">{selectedDoctor.degree} | {selectedDoctor.specialization}</p>
                        </div>
                      </div>

                      {/* Date Selection with Month Navigation */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-base font-semibold text-[#1a3a5c]">Select Date</h4>
                          {selectedDate && (
                            <span className="text-sm text-[#1a9fa8] font-medium">
                              {new Date(selectedDate).toLocaleDateString('en-US', { 
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                        
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={goToPreviousMonth}
                            disabled={!canGoPreviousMonth()}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#1a9fa8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium text-gray-700"
                          >
                            <ChevronLeftIcon className="w-4 h-4" />
                            Previous
                          </button>
                          <span className="text-lg font-bold text-[#1a3a5c]">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <button
                            onClick={goToNextMonth}
                            disabled={!canGoNextMonth()}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#1a9fa8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium text-gray-700"
                          >
                            Next
                            <ChevronLeftIcon className="w-4 h-4 rotate-180" />
                          </button>
                        </div>
                        
                        {/* Day Names */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }, (_, i) => (
                            <div key={`empty-${i}`} className="py-2" />
                          ))}
                          
                          {monthDays.map((day) => {
                            const isSelected = selectedDate === day.date;
                            const isToday = day.date === new Date().toISOString().split('T')[0];
                            
                            return (
                              <button
                                key={day.date}
                                disabled={day.isPast}
                                onClick={() => handleDateSelect(day.date)}
                                className={`relative flex flex-col items-center py-2 px-1 rounded-lg transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-[#1a9fa8] text-white shadow-md transform scale-105'
                                    : day.isPast
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                {isToday && !isSelected && (
                                  <span className="absolute -top-1 w-2 h-2 bg-[#e85d26] rounded-full"></span>
                                )}
                                <span className={`text-sm font-semibold ${isSelected ? 'text-white' : ''}`}>
                                  {day.dayNumber}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-[#e85d26] rounded-full"></span> Today
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-[#1a9fa8] rounded-full"></span> Selected
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span> Not Available
                          </span>
                        </div>
                      </div>

                      {/* Time Slots */}
                      {selectedDate && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-base font-semibold text-[#1a3a5c]">Available Time Slots</h4>
                            {availableSlots.length > 0 && (
                              <span className="text-sm text-gray-500">
                                {availableSlots.length} slots available
                              </span>
                            )}
                          </div>
                          
                          {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a9fa8]"></div>
                            </div>
                          ) : availableSlots.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                                <CalendarIcon />
                              </div>
                              <p className="text-gray-600 font-medium">No slots available for this date</p>
                              <p className="text-sm text-gray-500 mt-1">Please select another date</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                              {availableSlots.map((slot) => {
                                const isSelected = selectedSlot?.id === slot.id;
                                const timeLabel = slot.start_time.slice(0, 5);
                                
                                return (
                                  <button
                                    key={slot.id}
                                    onClick={() => handleSlotSelect(slot)}
                                    className={`relative py-3 px-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                      isSelected
                                        ? 'bg-[#1a9fa8] text-white shadow-md transform scale-105'
                                        : 'bg-white border-2 border-gray-200 hover:border-[#1a9fa8] text-gray-700 hover:bg-gray-50'
                                    }`}
                                  >
                                    {isSelected && (
                                      <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-0.5">
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      </span>
                                    )}
                                    <span className="block">{timeLabel}</span>
                                    <span className={`block text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                      {slot.slot_type === 'video' ? 'Video' : 'Visit'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Selected Slot Summary */}
                      {selectedSlot && selectedDate && (
                        <div className="mt-6 p-4 bg-[#f0faf5] border border-[#1a9fa8] rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-[#1a3a5c]">Selected Appointment</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(selectedDate).toLocaleDateString('en-US', { 
                                  weekday: 'long', day: 'numeric', month: 'long' 
                                })} at {selectedSlot.start_time.slice(0, 5)}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedSlot(null);
                                sessionStorage.removeItem('selectedSlot');
                              }}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Continue Button */}
                      {selectedSlot && (
                        <div className="mt-6">
                          <button
                            onClick={() => {
                              if (selectedSlot) {
                                sessionStorage.setItem('selectedSlot', JSON.stringify(selectedSlot));
                                sessionStorage.setItem('selectedDate', selectedDate);
                                setCurrentStep(3);
                              }
                            }}
                            className="w-full bg-[#1a9fa8] text-white font-semibold py-4 rounded-lg hover:bg-[#158791] transition-colors text-base"
                          >
                            Continue to Patient Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Patient Details */}
                {currentStep === 3 && selectedDoctor && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-gray-500 hover:text-[#1a9fa8] transition-colors mb-4"
                    >
                      <ArrowLeftIcon />
                    </button>
                    
                    <h2 className="text-xl font-bold text-[#1a3a5c] mb-6">Patient Details</h2>
                    
                    {selectedSlot ? (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Selected Slot:</span> {selectedSlot.start_time.slice(0, 5)} on {selectedDate}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          No slot selected. Please go back and select a time slot.
                        </p>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="mt-2 text-[#1a9fa8] hover:underline"
                        >
                          Go back to schedule
                        </button>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="patient_name"
                          value={formData.patient_name}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] ${
                            formErrors.patient_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {formErrors.patient_name && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.patient_name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="patient_phone"
                          value={formData.patient_phone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] ${
                            formErrors.patient_phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="10-digit mobile number"
                        />
                        {formErrors.patient_phone && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.patient_phone}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="patient_email"
                          value={formData.patient_email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] ${
                            formErrors.patient_email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
                        />
                        {formErrors.patient_email && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.patient_email}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                          <input
                            type="number"
                            name="patient_age"
                            value={formData.patient_age}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] ${
                              formErrors.patient_age ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Age"
                          />
                          {formErrors.patient_age && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.patient_age}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                          <select
                            name="patient_gender"
                            value={formData.patient_gender}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8]"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Symptoms / Message</label>
                        <textarea
                          name="patient_message"
                          value={formData.patient_message}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8]"
                          placeholder="Any specific concerns or symptoms..."
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedSlot}
                        className="w-full bg-[#1a9fa8] text-white font-semibold py-3 rounded-lg hover:bg-[#158791] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-[#1a3a5c] mb-4">Booking Summary</h3>
                  
                  {selectedDoctor ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          {selectedDoctor.image ? (
                            <Image
                              src={selectedDoctor.image}
                              alt={selectedDoctor.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-lg font-bold">
                              {selectedDoctor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{selectedDoctor.name}</p>
                          <p className="text-xs text-gray-500">{selectedDoctor.degree} | {selectedDoctor.specialization}</p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Consultation Fee</span>
                          <span className="font-medium">₹{selectedDoctor.fees}</span>
                        </div>
                        {selectedDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date</span>
                            <span className="font-medium">
                              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        )}
                        {selectedSlot && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time</span>
                            <span className="font-medium">{selectedSlot.start_time.slice(0, 5)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Select a doctor to see booking summary</p>
                  )}
                </div>

                <div className="bg-[#1a3a5c] text-white rounded-xl p-5">
                  <h3 className="font-bold mb-2">Emergency Contact</h3>
                  <p className="text-sm text-white/80 mb-3">24/7 Emergency Services Available</p>
                  <a href="tel:+919268880303" className="text-xl font-bold text-[#1a9fa8]">
                    +91 926 888 0303
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f0faf5] border-t border-gray-200">
        <div className="w-full" style={{ height: 200 }}>
          <iframe
            title="Sant Haridas Hospital Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.2536096392!2d77.2088!3d28.5494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce1c9af8e7ad3%3A0x5e1c3a2a2a2a2a2a!2sMAX%20Super%20Speciality%20Hospital%2C%20Saket!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <img
              src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
              alt="Sant Haridas Hospital"
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-[11px] font-bold tracking-widest text-[#1a3a5c] uppercase">Stay in Touch</p>
            <div className="flex items-center gap-3">
              {['Instagram', 'Facebook', 'X', 'YouTube'].map((label) => (
                <a key={label} href="#" aria-label={label} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow">
                  <span className="text-gray-400 text-xs font-bold">{label[0]}</span>
                </a>
              ))}
            </div>
            <p className="text-[12px] text-gray-500">&copy; {new Date().getFullYear()} Sant Haridas Hospital. All Rights Reserved.</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 text-right">
            <p className="text-[12px] font-semibold text-[#1a3a5c]">24/7 Emergency</p>
            <a href="tel:+919268880303" className="text-[15px] font-bold text-[#1a9fa8] hover:text-[#1a3a5c] transition-colors">+91 926 888 0303</a>
            <Link href="/book-appointment" className="mt-1 inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-[12px] font-semibold px-4 py-2 rounded hover:bg-[#122b47] transition-colors">
              Book an Appointment
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}