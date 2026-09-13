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
      className="h-9 sm:h-10 md:h-12 w-auto object-contain"
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
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
      <circle cx="11" cy="11" r="7" stroke="#374151" strokeWidth="2" />
      <path d="M20 20l-3-3" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="white" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block">
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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#1a3a5c]">
      {open ? (
        <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

// ── Nav Components ───────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-[11px] sm:text-sm">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 flex items-center justify-center sm:justify-end gap-3 sm:gap-6 h-9 sm:h-10">
        <a
          href="https://wa.me/919540740947"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:underline whitespace-nowrap font-medium"
        >
          <WhatsAppIcon />
          <span className="hidden xs:inline">WhatsApp Us</span>
          <span className="xs:hidden">WhatsApp</span>
        </a>
        <a href="tel:+919540740947" className="flex items-center gap-1.5 hover:underline whitespace-nowrap font-medium">
          <PhoneIcon />
          <span className="hidden sm:inline">+91 95407 40947</span>
          <span className="sm:hidden">Call</span>
        </a>
      </div>
    </div>
  );
}

const mainNavItems = [
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 flex items-center justify-between h-14 sm:h-16">
        <Link href="/" className="flex-shrink-0">
          <SiteLogo />
        </Link>

        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-2 py-5 text-[14px] xl:text-[15px] font-semibold text-gray-700 hover:text-[#1a9fa8] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/patient/login"
            className="inline-flex items-center gap-1.5 border border-[#1a3a5c] text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded transition-colors whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Patient Login</span>
          </Link>

          <Link
            href="/book-appointment"
            className="hidden sm:inline-block bg-[#e85d26] hover:bg-[#d14e1c] text-white font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded transition-colors whitespace-nowrap"
          >
            Book Appointment
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-1"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-100 shadow-md">
          <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-2 flex flex-col">
            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 px-2 text-[15px] font-semibold text-gray-700 hover:text-[#1a9fa8] border-b border-gray-50 last:border-0 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/patient/login"
              onClick={() => setMobileOpen(false)}
              className="mt-3 mb-1.5 border border-[#1a3a5c] text-[#1a3a5c] hover:bg-[#1a3a5c] hover:text-white font-semibold text-sm px-5 py-2.5 rounded transition-colors text-center flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Patient Login
            </Link>
            <Link
              href="/book-appointment"
              onClick={() => setMobileOpen(false)}
              className="mt-1 mb-2 bg-[#e85d26] hover:bg-[#d14e1c] text-white font-semibold text-sm px-5 py-2.5 rounded transition-colors text-center"
            >
              Book an Appointment
            </Link>
          </div>
        </nav>
      )}
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

// ── Date Helpers (timezone-safe) ─────────────────────────────────────────────

/**
 * Format a Date object to a local YYYY-MM-DD string.
 * Using toISOString() would shift the date backwards by timezone offset.
 */
function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse a YYYY-MM-DD string as a LOCAL date (not UTC). */
function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function BookAppointmentPage() {
  const router = useRouter();

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
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    patient_age: '',
    patient_gender: 'male',
    patient_message: '',
  });

  // Load pre-selected doctor
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

  useEffect(() => {
    if (currentStep === 3) {
      if (!selectedSlot) {
        const savedSlot = sessionStorage.getItem('selectedSlot');
        if (savedSlot) {
          try { setSelectedSlot(JSON.parse(savedSlot)); } catch {}
        }
      }
      if (!selectedDate) {
        const savedDate = sessionStorage.getItem('selectedDate');
        if (savedDate) setSelectedDate(savedDate);
      }
      if (!selectedDoctor) {
        const savedDoctor = sessionStorage.getItem('selectedDoctorBackup');
        if (savedDoctor) {
          try { setSelectedDoctor(JSON.parse(savedDoctor)); } catch {}
        }
      }
    }
  }, [currentStep]);

  useEffect(() => { fetchDoctors(); }, []);

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
          id, full_name, email, phone, degree,
          specialization, speciality, specialty,
          experience_years, consultation_fee, profile_image_url, is_active, about
        `)
        .eq('is_active', true)
        .order('full_name', { ascending: true });

      if (searchTerm.trim()) {
        const searchPattern = `%${searchTerm.trim()}%`;
        query = query.or(`full_name.ilike.${searchPattern},degree.ilike.${searchPattern},specialization.ilike.${searchPattern}`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        // Fallback: minimal columns if some don't exist
        console.warn('Primary doctor query failed, retrying with minimal columns:', fetchError.message);
        const fallback = await supabase
          .from('doctors')
          .select('id, full_name, degree, specialization, experience_years, consultation_fee, profile_image_url')
          .eq('is_active', true)
          .order('full_name', { ascending: true });

        if (fallback.error) throw fallback.error;

        const transformed: Doctor[] = (fallback.data || []).map((doc: any) => ({
          id: doc.id,
          name: doc.full_name || 'Unknown Doctor',
          degree: doc.degree || 'Doctor',
          specialization: doc.specialization || 'General Physician',
          experience: doc.experience_years || 0,
          fees: doc.consultation_fee || 0,
          image: doc.profile_image_url || '',
        }));

        setDoctors(transformed);
        return;
      }

      const transformedDoctors: Doctor[] = (data || []).map((doc: any) => {
        // Try multiple possible column names for speciality
        const spec =
          doc.specialization ||
          doc.speciality ||
          doc.specialty ||
          (doc.degree ? String(doc.degree).split(',')[0].trim() : '') ||
          'General Physician';

        return {
          id: doc.id,
          name: doc.full_name || 'Unknown Doctor',
          degree: doc.degree || 'Doctor',
          specialization: spec,
          experience: doc.experience_years || 0,
          fees: doc.consultation_fee || 0,
          image: doc.profile_image_url || '',
        };
      });

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

  // ── Calendar generation ────────────────────────────────────────────────────

  /** Returns number of blank cells to insert before day 1 (0–6, Sun-first). */
  const getLeadingBlanks = (monthDate: Date): number => {
    return new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();
  };

  /** Returns all day numbers for the given month. */
  const getMonthDays = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = toLocalDateString(new Date());

    const days: { date: string; dayNumber: number; isPast: boolean }[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const dateStr = toLocalDateString(dateObj);
      days.push({
        date: dateStr,
        dayNumber: i,
        isPast: dateStr < todayStr,
      });
    }
    return days;
  };

  const leadingBlanks = getLeadingBlanks(currentMonth);
  const monthDays = getMonthDays(currentMonth);
  const todayStr = toLocalDateString(new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const canGoPreviousMonth = () => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return currentMonth > thisMonth;
  };

  const canGoNextMonth = () => {
    const today = new Date();
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    return currentMonth < maxMonth;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

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

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    sessionStorage.setItem('selectedDate', date);
    setSelectedSlot(null);
    sessionStorage.removeItem('selectedSlot');

    const d = parseLocalDate(date);
    // Keep the month view in sync when a day is picked
    if (d.getMonth() !== currentMonth.getMonth() || d.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    sessionStorage.setItem('selectedSlot', JSON.stringify(slot));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.patient_name.trim()) errors.patient_name = 'Patient name is required';

    if (!formData.patient_phone.trim()) {
      errors.patient_phone = 'Phone number is required';
    } else {
      const phoneDigits = formData.patient_phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) errors.patient_phone = 'Please enter a valid 10-digit phone number';
    }

    if (formData.patient_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patient_email)) {
      errors.patient_email = 'Please enter a valid email address';
    }

    if (formData.patient_age) {
      const age = parseInt(formData.patient_age);
      if (isNaN(age) || age < 0 || age > 150) errors.patient_age = 'Please enter a valid age';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!selectedDoctor || !selectedSlot || !selectedDate) {
      setError("Please complete all booking steps");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const normalizePhone = (input: string) => {
        const digits = (input || "").replace(/\D/g, "");
        if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
        if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
        return digits;
      };
      const phone = normalizePhone(formData.patient_phone);

      let patientId: string | null = null;

      const { data: existingPatient, error: patientLookupError } = await supabase
        .from("patients")
        .select("id, user_id")
        .eq("phone", phone)
        .limit(1);

      if (patientLookupError) throw patientLookupError;

      if (existingPatient && existingPatient.length > 0) {
        patientId = existingPatient[0].id;
      } else {
        const patientData: any = {
          full_name: formData.patient_name,
          phone,
          email: formData.patient_email || null,
          gender: formData.patient_gender || null,
        };
        if (formData.patient_age) {
          const birthYear = new Date().getFullYear() - parseInt(formData.patient_age);
          patientData.date_of_birth = `${birthYear}-01-01`;
        }

        const { data: newPatient, error: patientCreateError } = await supabase
          .from("patients")
          .insert(patientData)
          .select()
          .single();

        if (patientCreateError) throw patientCreateError;
        patientId = newPatient.id;
      }

      if (!patientId) throw new Error("Could not resolve patient record");

      const { data: slotCheck, error: slotCheckError } = await supabase
        .from("doctor_slots")
        .select("is_booked, is_available")
        .eq("id", selectedSlot.id)
        .single();

      if (slotCheckError) throw slotCheckError;

      if (slotCheck.is_booked || !slotCheck.is_available) {
        setError("Selected slot is no longer available. Please choose another slot.");
        setIsSubmitting(false);
        return;
      }

      const appointmentData = {
        doctor_id: selectedDoctor.id,
        patient_id: patientId,
        slot_id: selectedSlot.id,
        appointment_date: selectedDate,
        appointment_time: selectedSlot.start_time,
        appointment_type: "consultation",
        status: "pending",
        symptoms: formData.patient_message || null,
        notes: formData.patient_message || null,
        payment_status: "unpaid",
        payment_amount: selectedDoctor.fees,
      };

      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .insert(appointmentData)
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      const { error: slotUpdateError } = await supabase
        .from("doctor_slots")
        .update({ is_booked: true })
        .eq("id", selectedSlot.id);

      if (slotUpdateError) console.error("Slot update error:", slotUpdateError);

      try {
        const res = await fetch("/api/patients/ensure-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: formData.patient_name,
            phone,
            email: formData.patient_email || null,
            gender: formData.patient_gender || null,
            date_of_birth: formData.patient_age
              ? `${new Date().getFullYear() - parseInt(formData.patient_age)}-01-01`
              : null,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) console.warn("Patient account creation failed:", json?.error);
        else console.log("Patient account ready:", json);
      } catch (accErr) {
        console.warn("ensure-account network error:", accErr);
      }

      setBookingReference(appointment.id);
      setBookingSuccess(true);

      sessionStorage.removeItem("selectedSlot");
      sessionStorage.removeItem("selectedDate");
      sessionStorage.removeItem("selectedDoctorBackup");
    } catch (err: any) {
      console.error("Error booking appointment:", err);
      setError(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(() => { fetchDoctors(); }, 300);
  };

  return (
    <>
      <main className="min-h-screen bg-[#f7f8fa]">
        <TopBar />
        <MainNav />

        <div className="w-full bg-gradient-to-r from-[#1a3a5c] to-[#1a9fa8] text-white">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Book an Appointment</h1>
            <p className="text-white/90 text-[13px] sm:text-[15px] max-w-2xl">
              Schedule your consultation with our expert doctors. Choose your preferred mode of consultation and time slot.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="w-full bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              {['Select Doctor', 'Choose Schedule', 'Patient Details'].map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[11px] sm:text-sm font-bold ${
                    currentStep > index + 1 ? 'bg-green-500 text-white' :
                    currentStep === index + 1 ? 'bg-[#1a9fa8] text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className={`text-[11px] sm:text-sm font-semibold ${
                    currentStep === index + 1 ? 'text-[#1a3a5c]' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                  {index < 2 && <div className="hidden sm:block w-10 md:w-16 h-px bg-gray-300 mx-1 md:mx-2" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 mt-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-[13px] sm:text-[14px]">
              {error}
            </div>
          </div>
        )}

        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {bookingSuccess ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8 text-center max-w-2xl mx-auto">
              <div className="flex justify-center mb-4 sm:mb-6">
                <CheckIcon />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a5c] mb-3">Appointment Booked Successfully!</h2>
              <p className="text-[13px] sm:text-[14px] text-gray-600 mb-2">
                Your appointment with {selectedDoctor?.name} has been requested.
              </p>
              <p className="text-[12px] sm:text-sm text-gray-500 mb-5 sm:mb-6">
                Booking Reference: <span className="font-mono font-semibold">{bookingReference}</span>
              </p>

              <div className="bg-[#f0faf9] border border-[#cbecee] rounded-lg p-3 sm:p-4 mb-5 sm:mb-6 text-left">
                <p className="text-[12px] sm:text-[13px] font-semibold text-[#1a3a5c] mb-1">
                  🔐 You can now log in to track your appointment
                </p>
                <p className="text-[11px] sm:text-[12px] text-gray-600">
                  Use your mobile number{" "}
                  <span className="font-semibold">{formData.patient_phone}</span> as both your
                  login ID and password at{" "}
                  <Link href="/patient/login" className="text-[#1a9fa8] font-semibold hover:underline">
                    /patient/login
                  </Link>.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-5 sm:mb-6 text-left">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-[12px] sm:text-sm">
                  <div>
                    <p className="text-gray-500">Doctor</p>
                    <p className="font-semibold text-[#1a3a5c]">{selectedDoctor?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-semibold text-[#1a3a5c]">
                      {selectedDate && parseLocalDate(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                className="bg-[#1a9fa8] text-white font-semibold px-5 sm:px-6 py-2.5 rounded-lg hover:bg-[#158791] transition-colors text-[13px] sm:text-[14px]"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1 */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1a3a5c] mb-4">Select a Doctor</h2>

                    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <SearchIcon />
                        <input
                          type="text"
                          placeholder="Search doctors by name or specialty..."
                          value={searchTerm}
                          onChange={handleSearch}
                          className="flex-1 min-w-0 text-[13px] sm:text-[14px] text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                        />
                        {searchTerm && (
                          <button
                            onClick={() => { setSearchTerm(''); fetchDoctors(); }}
                            className="text-gray-400 hover:text-gray-600 text-lg leading-none flex-shrink-0"
                            aria-label="Clear search"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    </div>

                    {isLoadingDoctors ? (
                      <div className="flex justify-center py-16 sm:py-20">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#1a9fa8]"></div>
                      </div>
                    ) : (
                      <>
                        {doctors.length === 0 ? (
                          <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 text-center">
                            <p className="text-gray-500 text-[13px] sm:text-[14px]">No doctors found. Please try different search criteria.</p>
                          </div>
                        ) : (
                          doctors.map((doctor) => (
                            <div key={doctor.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
                              <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
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
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-[15px] sm:text-lg font-bold text-[#1a1a1a]">{doctor.name}</h3>
                                  <p className="text-[12px] sm:text-sm text-gray-600">
                                    {doctor.degree}
                                    {doctor.specialization && ` | ${doctor.specialization}`}
                                  </p>
                                  <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-[12px] sm:text-sm flex-wrap">
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
                                  className="bg-[#1a9fa8] text-white font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-[#158791] transition-colors text-[12px] sm:text-sm whitespace-nowrap"
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

                {/* Step 2 */}
                {currentStep === 2 && selectedDoctor && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="text-gray-500 hover:text-[#1a9fa8] transition-colors flex-shrink-0"
                          aria-label="Back to doctor selection"
                        >
                          <ArrowLeftIcon />
                        </button>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
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
                        <div className="min-w-0">
                          <h3 className="font-bold text-[#1a3a5c] text-[14px] sm:text-base">{selectedDoctor.name}</h3>
                          <p className="text-[12px] sm:text-sm text-gray-600 truncate">
                            {selectedDoctor.degree}
                            {selectedDoctor.specialization && ` | ${selectedDoctor.specialization}`}
                          </p>
                        </div>
                      </div>

                      {/* Date Selection */}
                      <div className="mb-6 sm:mb-8">
                        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                          <h4 className="text-[14px] sm:text-base font-semibold text-[#1a3a5c]">Select Date</h4>
                          {selectedDate && (
                            <span className="text-[11px] sm:text-sm text-[#1a9fa8] font-medium">
                              {parseLocalDate(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                              })}
                            </span>
                          )}
                        </div>

                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <button
                            onClick={goToPreviousMonth}
                            disabled={!canGoPreviousMonth()}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 hover:border-[#1a9fa8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[12px] sm:text-sm font-medium text-gray-700"
                          >
                            <ChevronLeftIcon className="w-4 h-4" />
                            <span className="hidden xs:inline">Previous</span>
                          </button>
                          <span className="text-[14px] sm:text-lg font-bold text-[#1a3a5c]">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <button
                            onClick={goToNextMonth}
                            disabled={!canGoNextMonth()}
                            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 hover:border-[#1a9fa8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[12px] sm:text-sm font-medium text-gray-700"
                          >
                            <span className="hidden xs:inline">Next</span>
                            <ChevronLeftIcon className="w-4 h-4 rotate-180" />
                          </button>
                        </div>

                        {/* Day Names */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-[10px] sm:text-xs font-semibold text-gray-500 py-1">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar Grid — with proper leading blanks */}
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: leadingBlanks }).map((_, i) => (
                            <div key={`blank-${i}`} className="py-2" aria-hidden="true" />
                          ))}

                          {monthDays.map((day) => {
                            const isSelected = selectedDate === day.date;
                            const isToday = day.date === todayStr;

                            return (
                              <button
                                key={day.date}
                                disabled={day.isPast}
                                onClick={() => handleDateSelect(day.date)}
                                className={`relative flex flex-col items-center justify-center aspect-square rounded-lg transition-all duration-200 ${
                                  isSelected
                                    ? 'bg-[#1a9fa8] text-white shadow-md'
                                    : day.isPast
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                {isToday && !isSelected && (
                                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#e85d26] rounded-full" />
                                )}
                                <span className={`text-[12px] sm:text-sm font-semibold ${isSelected ? 'text-white' : ''}`}>
                                  {day.dayNumber}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-3 sm:gap-4 mt-3 text-[10px] sm:text-xs text-gray-500 flex-wrap">
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
                          <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                            <h4 className="text-[14px] sm:text-base font-semibold text-[#1a3a5c]">Available Time Slots</h4>
                            {availableSlots.length > 0 && (
                              <span className="text-[11px] sm:text-sm text-gray-500">
                                {availableSlots.length} slots available
                              </span>
                            )}
                          </div>

                          {isLoading ? (
                            <div className="flex items-center justify-center py-10 sm:py-12">
                              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#1a9fa8]"></div>
                            </div>
                          ) : availableSlots.length === 0 ? (
                            <div className="text-center py-6 sm:py-8">
                              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3">
                                <CalendarIcon />
                              </div>
                              <p className="text-[13px] sm:text-[14px] text-gray-600 font-medium">No slots available for this date</p>
                              <p className="text-[11px] sm:text-sm text-gray-500 mt-1">Please select another date</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                              {availableSlots.map((slot) => {
                                const isSelected = selectedSlot?.id === slot.id;
                                const timeLabel = slot.start_time.slice(0, 5);

                                return (
                                  <button
                                    key={slot.id}
                                    onClick={() => handleSlotSelect(slot)}
                                    className={`relative py-2 sm:py-3 px-1.5 sm:px-2 rounded-lg text-[12px] sm:text-sm font-semibold transition-all duration-200 ${
                                      isSelected
                                        ? 'bg-[#1a9fa8] text-white shadow-md'
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
                                    <span className={`block text-[10px] sm:text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                      {slot.slot_type === 'video' ? 'Video' : 'Visit'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedSlot && selectedDate && (
                        <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-[#f0faf5] border border-[#1a9fa8] rounded-lg">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[12px] sm:text-sm font-semibold text-[#1a3a5c]">Selected Appointment</p>
                              <p className="text-[11px] sm:text-sm text-gray-600 mt-1">
                                {parseLocalDate(selectedDate).toLocaleDateString('en-US', {
                                  weekday: 'long', day: 'numeric', month: 'long'
                                })} at {selectedSlot.start_time.slice(0, 5)}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedSlot(null);
                                sessionStorage.removeItem('selectedSlot');
                              }}
                              className="text-red-500 hover:text-red-700 text-[12px] sm:text-sm font-medium flex-shrink-0"
                            >
                              Change
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedSlot && (
                        <div className="mt-5 sm:mt-6">
                          <button
                            onClick={() => {
                              if (selectedSlot) {
                                sessionStorage.setItem('selectedSlot', JSON.stringify(selectedSlot));
                                sessionStorage.setItem('selectedDate', selectedDate);
                                setCurrentStep(3);
                              }
                            }}
                            className="w-full bg-[#1a9fa8] text-white font-semibold py-3 sm:py-4 rounded-lg hover:bg-[#158791] transition-colors text-[14px] sm:text-base"
                          >
                            Continue to Patient Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && selectedDoctor && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-gray-500 hover:text-[#1a9fa8] transition-colors mb-4"
                      aria-label="Back to schedule"
                    >
                      <ArrowLeftIcon />
                    </button>

                    <h2 className="text-lg sm:text-xl font-bold text-[#1a3a5c] mb-5 sm:mb-6">Patient Details</h2>

                    {selectedSlot ? (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-[12px] sm:text-sm text-gray-600">
                          <span className="font-semibold">Selected Slot:</span> {selectedSlot.start_time.slice(0, 5)} on {selectedDate}
                        </p>
                      </div>
                    ) : (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-[12px] sm:text-sm text-yellow-700">
                          No slot selected. Please go back and select a time slot.
                        </p>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="mt-2 text-[#1a9fa8] hover:underline text-[12px] sm:text-sm"
                        >
                          Go back to schedule
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-[12px] sm:text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="patient_name"
                          value={formData.patient_name}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] text-[13px] sm:text-[14px] ${
                            formErrors.patient_name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                        {formErrors.patient_name && (
                          <p className="text-red-500 text-[11px] sm:text-xs mt-1">{formErrors.patient_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[12px] sm:text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="patient_phone"
                          value={formData.patient_phone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] text-[13px] sm:text-[14px] ${
                            formErrors.patient_phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="10-digit mobile number"
                        />
                        {formErrors.patient_phone && (
                          <p className="text-red-500 text-[11px] sm:text-xs mt-1">{formErrors.patient_phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[12px] sm:text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="patient_email"
                          value={formData.patient_email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] text-[13px] sm:text-[14px] ${
                            formErrors.patient_email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter your email"
                        />
                        {formErrors.patient_email && (
                          <p className="text-red-500 text-[11px] sm:text-xs mt-1">{formErrors.patient_email}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[12px] sm:text-sm font-semibold text-gray-700 mb-1">Age</label>
                          <input
                            type="number"
                            name="patient_age"
                            value={formData.patient_age}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] text-[13px] sm:text-[14px] ${
                              formErrors.patient_age ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Age"
                          />
                          {formErrors.patient_age && (
                            <p className="text-red-500 text-[11px] sm:text-xs mt-1">{formErrors.patient_age}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-[12px] sm:text-sm font-semibold text-gray-700 mb-1">Gender</label>
                          <select
                            name="patient_gender"
                            value={formData.patient_gender}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] text-[13px] sm:text-[14px]"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[12px] sm:text-sm font-semibold text-gray-700 mb-1">Symptoms / Message</label>
                        <textarea
                          name="patient_message"
                          value={formData.patient_message}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a9fa8] text-[13px] sm:text-[14px]"
                          placeholder="Any specific concerns or symptoms..."
                        />
                      </div>
                    </div>

                    <div className="mt-5 sm:mt-6">
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedSlot}
                        className="w-full bg-[#1a9fa8] text-white font-semibold py-3 rounded-lg hover:bg-[#158791] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[14px] sm:text-[15px]"
                      >
                        {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Sidebar */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
                  <h3 className="font-bold text-[#1a3a5c] mb-4 text-[14px] sm:text-base">Booking Summary</h3>

                  {selectedDoctor ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
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
                        <div className="min-w-0">
                          <p className="font-semibold text-[13px] sm:text-sm truncate">{selectedDoctor.name}</p>
                          <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                            {selectedDoctor.degree}
                            {selectedDoctor.specialization && ` | ${selectedDoctor.specialization}`}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3 space-y-2 text-[12px] sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Consultation Fee</span>
                          <span className="font-medium">₹{selectedDoctor.fees}</span>
                        </div>
                        {selectedDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date</span>
                            <span className="font-medium">
                              {parseLocalDate(selectedDate).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
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
                    <p className="text-gray-500 text-[12px] sm:text-sm">Select a doctor to see booking summary</p>
                  )}
                </div>

                <div className="bg-[#1a3a5c] text-white rounded-xl p-4 sm:p-5">
                  <h3 className="font-bold mb-2 text-[14px] sm:text-base">Emergency Contact</h3>
                  <p className="text-[12px] sm:text-sm text-white/80 mb-3">Emergency services available round the clock</p>
                  <a href="tel:+919540740947" className="text-[16px] sm:text-xl font-bold text-[#1a9fa8]">
                    +91 95407 40947
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full bg-[#f0faf5] border-t border-gray-200">
        <div className="w-full" style={{ height: 180 }}>
          <iframe
            title="Sant Haridas Hospital Location Map"
            src="https://www.google.com/maps?q=Sant+Haridas+Hospital,+Ram+Nagar,+Najafgarh,+Delhi+110043&output=embed"
            width="100%"
            height="180"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-5 flex flex-col lg:flex-row items-center justify-between gap-5 lg:gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <img
              src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
              alt="Sant Haridas Hospital"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-3 order-last lg:order-none">
            <p className="text-[10px] sm:text-[11px] font-bold tracking-widest text-[#1a3a5c] uppercase">Stay in Touch</p>
            <div className="flex items-center gap-2 sm:gap-3">
              {[
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/santharidashospital?stkn=MWN5bDAycm9qc2Zqag==",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-ba)" strokeWidth="1.8" />
                      <circle cx="12" cy="12" r="4.5" stroke="url(#ig-ba)" strokeWidth="1.8" />
                      <circle cx="17.5" cy="6.5" r="1" fill="#e6683c" />
                      <defs>
                        <linearGradient id="ig-ba" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#f09433" /><stop offset="0.5" stopColor="#dc2743" /><stop offset="1" stopColor="#bc1888" />
                        </linearGradient>
                      </defs>
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  href: "https://www.facebook.com/100090027224112/",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 2h-3a5 5 0 00-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="#1877f2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  label: "YouTube",
                  href: "http://www.youtube.com/@SantHaridashospital",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="5" width="20" height="14" rx="4" stroke="#ff0000" strokeWidth="1.8" />
                      <path d="M10 9l5 3-5 3V9z" fill="#ff0000" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <p className="text-[11px] sm:text-[12px] text-gray-500 text-center">&copy; {new Date().getFullYear()} Sant Haridas Hospital. All Rights Reserved.</p>
          </div>
          <div className="flex flex-col items-center lg:items-end gap-1.5 text-center lg:text-right">
            <p className="text-[11px] sm:text-[12px] font-semibold text-[#1a3a5c]">Emergency Helpline</p>
            <a href="tel:+919540740947" className="text-[14px] sm:text-[15px] font-bold text-[#1a9fa8] hover:text-[#1a3a5c] transition-colors">
              +91 95407 40947
            </a>
            <Link
              href="/book-appointment"
              className="mt-1 inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-[11px] sm:text-[12px] font-semibold px-4 py-2 rounded hover:bg-[#122b47] transition-colors"
            >
              Book an Appointment
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}