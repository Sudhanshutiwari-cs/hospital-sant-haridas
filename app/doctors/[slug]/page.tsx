"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
      <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 7h14" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 2v3M12 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function RupeeIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
      <path d="M5 4h8M5 8h8M9 8l-4 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 6c0 0 0 2 4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
      <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
      <path d="M10 3L2 7l8 4 8-4-8-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6 9v5c0 1.657 1.791 3 4 3s4-1.343 4-3V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M18 7v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500">
      <circle cx="10" cy="8" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 13l-2 5 5-2 5 2-2-5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

// ── Nav ────────────────────────────────────────────────────────────────────────

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
            <a key={item} href={getNavLink(item)} className="px-2 py-5 text-[15px] font-semibold text-gray-700 hover:text-[#1a9fa8] transition-colors">
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

// ── Types ─────────────────────────────────────────────────────────────────────

type Doctor = {
  id: string;
  slug: string;
  name: string;
  designation: string;
  hospital_name: string;
  hospital_id: string;
  specialtyBold: string;
  specialtyLight: string;
  experience: number;
  fees: number;
  image: string;
  about: string;
  consultation_mode: 'both' | 'hospital_visit' | 'video_consult';
};

type Education = {
  id: string;
  degree: string;
  institution: string;
  university: string | null;
  year: number | null;
};

type Award = {
  id: string;
  title: string;
  awarded_by: string | null;
  year: number | null;
};

type TimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
  status: string;
  current_bookings: number;
  max_bookings: number;
};

// ── Calendar helpers ──────────────────────────────────────────────────────────

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function buildWeek(anchor: Date): Date[] {
  const week: Date[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() + i);
    week.push(d);
  }
  return week;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// ── FAQ Section ───────────────────────────────────────────────────────────────

const doctorFaqItems = [
  {
    id: "find",
    label: "How do I find the right doctor?",
    content: "Use the search bar and specialty filters at the top of this page to browse doctors by name or speciality. Each doctor card shows their experience, consultation fees, and hospital. Click 'View Full Profile' for a detailed bio, education, and awards.",
  },
  {
    id: "appointment",
    label: "How do I book an appointment?",
    content: "Click 'Book An Appointment' on any doctor card or on the doctor's profile page. Select your preferred consultation type (Hospital Visit or Video Consult), choose an available date and time slot, and confirm your booking details.",
  },
  {
    id: "fees",
    label: "Are consultation fees displayed accurate?",
    content: "The fees shown are indicative consultation charges. Actual charges may vary based on the type of consultation, investigations required, and the hospital facility. Final billing will be confirmed at the time of booking.",
  },
  {
    id: "video",
    label: "Is video consultation available for all doctors?",
    content: "Video consultation availability varies by doctor and speciality. Look for the 'Book Video Consult' tab on a doctor's profile page to confirm availability. Our team is also available 24/7 on +91 926 888 0303 to assist you.",
  },
];

function DoctorsFaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  return (
    <section className="w-full bg-white py-12 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-5">Feel Free to ask us</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative w-full" style={{ height: 240 }}>
              <img src="/faq-woman.png" alt="Ask us anything" className="w-full h-full object-cover object-top" />
            </div>
            <div className="px-4 py-3 bg-white">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 focus-within:border-[#1a9fa8] transition-colors">
                <input
                  type="text"
                  placeholder="Ask your question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1 text-[14px] text-gray-600 placeholder-gray-400 outline-none bg-transparent"
                />
                <button aria-label="Submit" className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-[#1a9fa8] flex items-center justify-center transition-colors flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 pt-[68px]">
          {doctorFaqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-semibold text-[#1a1a1a]">{item.label}</span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 bg-white">
                    <p className="text-[14px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{item.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Doctor profile page ────────────────────────────────────────────────────────

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  const [expandAbout, setExpandAbout] = useState(false);
  const [consultTab, setConsultTab] = useState<"hospital" | "video">("hospital");
  const [weekAnchor, setWeekAnchor] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  });
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Fetch doctor data
  useEffect(() => {
    if (slug) {
      fetchDoctorData();
    }
  }, [slug]);

  // Fetch available slots when date or consultation type changes
  useEffect(() => {
    if (doctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [doctor, selectedDate, consultTab]);

  const fetchDoctorData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data: docData, error: docError } = await supabase
        .from('doctors')
        .select(`
          *,
          hospitals (
            id,
            name
          ),
          doctor_education (
            id,
            degree,
            institution,
            university,
            year,
            sort_order
          ),
          doctor_awards (
            id,
            title,
            awarded_by,
            year,
            sort_order
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (docError) throw docError;

      const transformedDoctor: Doctor = {
        id: docData.id,
        slug: docData.slug,
        name: docData.name,
        designation: docData.designation,
        hospital_id: docData.hospital_id,
        hospital_name: docData.hospitals?.name || 'Sant Haridas Hospital',
        specialtyBold: docData.speciality_bold,
        specialtyLight: docData.speciality_light,
        experience: docData.experience_years,
        fees: docData.consultation_fee,
        image: docData.photo_url || '',
        about: docData.about_full || docData.about_short || 'No information available.',
        consultation_mode: docData.consultation_mode,
      };

      setDoctor(transformedDoctor);
      setEducation(docData.doctor_education || []);
      setAwards(docData.doctor_awards || []);

      // Set consultation tab based on doctor's mode
      if (docData.consultation_mode === 'video_consult') {
        setConsultTab('video');
      } else {
        setConsultTab('hospital');
      }

    } catch (err: any) {
      console.error('Error fetching doctor:', err);
      setError(err.message || 'Failed to fetch doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!doctor || !selectedDate) return;

    setIsLoadingSlots(true);

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const consultationMode = consultTab === 'hospital' ? 'hospital_visit' : 'video_consult';
      
      let query = supabase
        .from('doctor_slots')
        .select('*')
        .eq('doctor_id', doctor.id)
        .eq('slot_date', dateStr)
        .eq('consultation_mode', consultationMode)
        .eq('status', 'available')
        .order('start_time', { ascending: true });

      if (doctor.hospital_id) {
        query = query.eq('hospital_id', doctor.hospital_id);
      }

      const { data: slots, error: slotsError } = await query;

      if (slotsError) throw slotsError;

      const availableSlotsData = (slots || []).filter(
        slot => slot.current_bookings < slot.max_bookings
      );

      setAvailableSlots(availableSlotsData);
      setSelectedSlot(null);
    } catch (err: any) {
      console.error('Error fetching slots:', err);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const week = buildWeek(weekAnchor);

  function prevWeek() {
    const d = new Date(weekAnchor);
    d.setDate(d.getDate() - 6);
    setWeekAnchor(d);
  }

  function nextWeek() {
    const d = new Date(weekAnchor);
    d.setDate(d.getDate() + 6);
    setWeekAnchor(d);
  }

  const currentMonthLabel = `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ABOUT_CUTOFF = 220;

  const handleBookAppointment = () => {
    if (!doctor || !selectedSlot) return;

    sessionStorage.setItem('bookingData', JSON.stringify({
      doctor: {
        id: doctor.id,
        slug: doctor.slug,
        name: doctor.name,
        designation: doctor.designation,
        hospital_id: doctor.hospital_id,
        hospital_name: doctor.hospital_name,
        specialtyBold: doctor.specialtyBold,
        specialtyLight: doctor.specialtyLight,
        experience: doctor.experience,
        fees: doctor.fees,
        image: doctor.image,
        consultation_mode: doctor.consultation_mode,
      },
      slot: {
        id: selectedSlot.id,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
      },
      consultationType: consultTab === 'hospital' ? 'hospital_visit' : 'video_consult',
      date: selectedDate.toISOString().split('T')[0],
    }));

    router.push('/book-appointment');
  };

  const handleFindNextSlot = () => {
    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + i);
      
      if (nextDate >= today) {
        setSelectedDate(nextDate);
        setWeekAnchor(nextDate);
        break;
      }
    }
  };

  const handleRequestCallback = () => {
    alert('Callback request feature coming soon. Please call +91 926 888 0303 for immediate assistance.');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <TopBar />
        <MainNav />
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9fa8]"></div>
        </div>
      </main>
    );
  }

  if (error || !doctor) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <TopBar />
        <MainNav />
        <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
          <p className="text-red-500 mb-4">{error || 'Doctor not found'}</p>
          <Link href="/doctors" className="text-[#1a9fa8] hover:underline">
            Back to Doctors List
          </Link>
        </div>
      </main>
    );
  }

  const shortAbout = doctor.about.length > ABOUT_CUTOFF ? doctor.about.slice(0, ABOUT_CUTOFF) + "..." : doctor.about;

  return (
    <>
      <main className="min-h-screen bg-[#f7f8fa]">
        <TopBar />
        <MainNav />

        {/* Profile header strip */}
        <div className="w-full bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 py-6">
            <div className="flex items-start gap-6">
              {/* Photo */}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-sm">
                {doctor.image ? (
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    width={96}
                    height={96}
                    className="object-cover object-top w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">
                    {doctor.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Name block */}
              <div className="flex-1 min-w-0">
                <h1 className="text-[22px] font-bold text-[#1a1a1a] leading-snug">{doctor.name}</h1>
                <p className="text-[14px] text-gray-500 mt-1">{doctor.designation} | {doctor.hospital_name}</p>
                <div className="mt-2 inline-flex items-center border border-gray-200 rounded overflow-hidden text-[12px]">
                  <span className="bg-[#f0edf8] text-[#4a3880] font-semibold px-2.5 py-1">{doctor.specialtyBold}</span>
                  <span className="text-gray-400 px-1">|</span>
                  <span className="text-gray-500 px-2.5 py-1">{doctor.specialtyLight}</span>
                </div>
              </div>

              {/* Stats card */}
              <div className="hidden md:block flex-shrink-0 w-[280px] border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                  <CalendarIcon />
                  <div>
                    <p className="text-[16px] font-bold text-[#1a1a1a] leading-none">{doctor.experience} Years</p>
                    <p className="text-[12px] text-[#1a9fa8] mt-0.5">Experience</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4 bg-[#f8f7fd]">
                  <RupeeIcon />
                  <div>
                    <p className="text-[16px] font-bold text-[#1a1a1a] leading-none">&#8377; {doctor.fees.toLocaleString("en-IN")}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">Fees</p>
                  </div>
                </div>
              </div>

              {/* Share button */}
              <button
                aria-label="Share profile"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: doctor.name,
                      text: `${doctor.name} - ${doctor.designation}`,
                      url: window.location.href,
                    });
                  }
                }}
                className="flex-shrink-0 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1a9fa8] hover:text-[#1a9fa8] transition-colors"
              >
                <ShareIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Main two-col body */}
        <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT: info cards */}
          <div className="flex-1 flex flex-col gap-5 min-w-0">
            {/* About */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <UserIcon />
                <h2 className="text-[16px] font-bold text-[#1a1a1a]">About</h2>
              </div>
              <p className="text-[14px] leading-relaxed text-gray-600">
                {expandAbout ? doctor.about : shortAbout}
              </p>
              {doctor.about.length > ABOUT_CUTOFF && (
                <button
                  onClick={() => setExpandAbout(!expandAbout)}
                  className="mt-3 text-[13px] font-semibold text-[#e85d26] hover:underline"
                >
                  {expandAbout ? "Read Less" : "Read More"}
                </button>
              )}
            </div>

            {/* Education */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationIcon />
                <h2 className="text-[16px] font-bold text-[#1a1a1a]">Education</h2>
              </div>
              {education.length > 0 ? (
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1a9fa8] mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="text-[14px] font-semibold text-gray-800">{edu.degree}</p>
                        <p className="text-[13px] text-gray-600">
                          {edu.institution}
                          {edu.university && `, ${edu.university}`}
                          {edu.year && ` (${edu.year})`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-gray-600">Education information not available.</p>
              )}
            </div>

            {/* Awards */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <AwardIcon />
                <h2 className="text-[16px] font-bold text-[#1a1a1a]">Awards &amp; Accolades</h2>
              </div>
              {awards.length > 0 ? (
                <div className="space-y-3">
                  {awards.map((award) => (
                    <div key={award.id} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#e85d26] mt-1.5 flex-shrink-0"></div>
                      <div>
                        <p className="text-[14px] font-semibold text-gray-800">{award.title}</p>
                        <p className="text-[13px] text-gray-600">
                          {award.awarded_by && `${award.awarded_by}`}
                          {award.year && ` (${award.year})`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-gray-600">Awards information not available.</p>
              )}
            </div>
          </div>

          {/* RIGHT: appointment scheduler */}
          <div className="w-full lg:w-[420px] flex-shrink-0">
            <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-5">Schedule Appointment</h2>

            {/* Hospital / Video tabs */}
            <div className="flex rounded-lg border border-[#e8bbb0] overflow-hidden mb-6">
              {doctor.consultation_mode !== 'video_consult' && (
                <button
                  onClick={() => setConsultTab("hospital")}
                  className={`flex-1 py-3 text-[14px] font-semibold transition-colors ${
                    consultTab === "hospital"
                      ? "bg-[#fae3de] text-[#c0604a]"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Book Hospital Visit
                </button>
              )}
              {doctor.consultation_mode !== 'hospital_visit' && (
                <button
                  onClick={() => setConsultTab("video")}
                  className={`flex-1 py-3 text-[14px] font-semibold transition-colors ${
                    consultTab === "video"
                      ? "bg-[#fae3de] text-[#c0604a]"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Book Video Consult
                </button>
              )}
            </div>

            {/* Month navigator */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setMonth(d.getMonth() - 1);
                  setSelectedDate(d);
                  setWeekAnchor(d);
                }}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1a9fa8] hover:text-[#1a9fa8] transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="text-[15px] font-semibold text-[#1a1a1a]">{currentMonthLabel}</span>
              <button
                onClick={() => {
                  const d = new Date(selectedDate);
                  d.setMonth(d.getMonth() + 1);
                  setSelectedDate(d);
                  setWeekAnchor(d);
                }}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1a9fa8] hover:text-[#1a9fa8] transition-colors"
                aria-label="Next month"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Day strip */}
            <div className="flex items-center gap-1 mb-5">
              <button
                onClick={prevWeek}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1a9fa8] hover:text-[#1a9fa8] transition-colors flex-shrink-0"
                aria-label="Previous days"
              >
                <ChevronLeftIcon className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 flex gap-1 overflow-hidden">
                {week.map((date) => {
                  const isPast = date < today;
                  const isSelected = isSameDay(date, selectedDate);
                  return (
                    <button
                      key={date.toISOString()}
                      disabled={isPast}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-1 flex flex-col items-center py-2 rounded-lg text-[11px] font-semibold transition-colors border
                        ${isPast ? "text-gray-300 border-gray-100 cursor-not-allowed" : ""}
                        ${isSelected && !isPast ? "bg-[#fae3de] border-[#e8bbb0] text-[#c0604a]" : ""}
                        ${!isSelected && !isPast ? "bg-white border-gray-200 text-gray-600 hover:border-[#1a9fa8] hover:text-[#1a9fa8]" : ""}
                      `}
                    >
                      <span className="uppercase tracking-wide">{DAYS[date.getDay()]}</span>
                      <span className="text-[13px] font-bold mt-0.5 leading-none">{String(date.getDate()).padStart(2, "0")}</span>
                      <span className="uppercase">{MONTHS[date.getMonth()].slice(0, 3)}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={nextWeek}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1a9fa8] hover:text-[#1a9fa8] transition-colors flex-shrink-0"
                aria-label="Next days"
              >
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Time slots */}
            {isLoadingSlots ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a9fa8]"></div>
              </div>
            ) : availableSlots.length > 0 ? (
              <div className="mb-6">
                <p className="text-[13px] font-semibold text-gray-700 mb-3">Available Time Slots</p>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSlot?.id === slot.id
                          ? 'bg-[#1a9fa8] text-white'
                          : 'bg-white border border-gray-200 hover:border-[#1a9fa8] text-gray-700'
                      }`}
                    >
                      {slot.start_time.slice(0, 5)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#fdf0ed] border border-[#f0c8be] rounded-lg px-4 py-3 mb-6 text-center">
                <p className="text-[13px] text-gray-600">
                  No slots available for the{" "}
                  <span className="text-[#1a6fa8] font-medium">selected date.</span>
                </p>
              </div>
            )}

            {/* CTA buttons */}
            <div className="grid grid-cols-2 gap-3">
              {selectedSlot ? (
                <button 
                  onClick={handleBookAppointment}
                  className="col-span-2 bg-[#1a9fa8] hover:bg-[#158791] text-white font-semibold text-[14px] py-3.5 rounded-lg transition-colors"
                >
                  Book Appointment
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleFindNextSlot}
                    className="bg-[#fae3de] hover:bg-[#f5d3ca] text-[#c0604a] font-semibold text-[14px] py-3.5 rounded-lg transition-colors"
                  >
                    Find Next Slot
                  </button>
                  <button 
                    onClick={handleRequestCallback}
                    className="bg-[#fae3de] hover:bg-[#f5d3ca] text-[#c0604a] font-semibold text-[14px] py-3.5 rounded-lg transition-colors"
                  >
                    Request A Call Back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FAQ */}
      <DoctorsFaqSection />

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