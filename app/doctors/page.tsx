"use client";

import { useState, useEffect, useCallback } from "react";
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

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

function LocationIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block text-gray-400">
      <path d="M9 2a5 5 0 00-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

const topNavLinks: string[] = [];
const mainNavItems = ["Doctors", "Services", "Blogs", "About Us", "Contact Us"];

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-sm">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-end gap-6 h-10">
        {topNavLinks.map((link) => (
          <a key={link} href="#" className="hover:underline whitespace-nowrap font-medium hover:opacity-80 transition-opacity">
            {link}
          </a>
        ))}
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
  const getNavLink = (item: string): string => {
    switch (item) {
      case "Doctors":
        return "/doctors";
      case "Services":
        return "/services";
      case "Blogs":
        return "/blogs";
      case "About Us":
        return "/about";
      case "Contact Us":
        return "#contact";
      default:
        return "#";
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
  locations?: number;
  locationName?: string;
  consultation_mode: 'both' | 'hospital_visit' | 'video_consult';
};

type Speciality = {
  id: string;
  name: string;
  slug: string;
};

// ── Doctor Card ───────────────────────────────────────────────────────────────

function DoctorCard({ doctor, onBookAppointment }: { doctor: Doctor; onBookAppointment: (doctor: Doctor) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
      {/* Card body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Top: photo + name */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
            {doctor.image ? (
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={64}
                height={64}
                className="object-cover object-center w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-bold">
                {doctor.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-[#1a1a1a] leading-snug">{doctor.name}</h3>
            <p className="text-[13px] text-gray-500 mt-0.5 leading-snug">
              {doctor.designation} | {doctor.hospital_name}
            </p>
          </div>
        </div>

        {/* Specialty pill */}
        <div className="flex items-center">
          <div className="inline-flex items-center border border-gray-200 rounded overflow-hidden text-[12px]">
            <span className="bg-[#f0edf8] text-[#4a3880] font-semibold px-2 py-0.5 whitespace-nowrap">
              {doctor.specialtyBold}
            </span>
            <span className="text-gray-400 px-1">|</span>
            <span className="text-gray-500 px-2 py-0.5 truncate max-w-[160px]">
              {doctor.specialtyLight}
            </span>
          </div>
        </div>

        {/* Experience + Fees */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1.5">
            <CalendarIcon />
            <div>
              <p className="text-[15px] font-bold text-[#1a1a1a] leading-none">{doctor.experience} Years</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <RupeeIcon />
            <div>
              <p className="text-[15px] font-bold text-[#1a1a1a] leading-none">₹{doctor.fees.toLocaleString("en-IN")}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">Fees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Card footer: action buttons */}
      <div className="flex border-t border-gray-200">
        <Link
          href={`/doctors/${doctor.slug}`}
          className="flex-1 py-3 text-[13px] font-semibold text-[#1a1a1a] hover:bg-gray-50 transition-colors border-r border-gray-200 text-center"
        >
          View Full Profile
        </Link>
        <button
          onClick={() => onBookAppointment(doctor)}
          className="flex-1 py-3 text-[13px] font-semibold text-[#c0604a] bg-[#fdf0ed] hover:bg-[#fae3de] transition-colors text-center"
        >
          Book An Appointment
        </button>
      </div>
    </div>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────

const doctorFaqItems = [
  {
    id: "find",
    label: "How do I find the right doctor?",
    content: "Use the search bar and specialty filters at the top of this page to browse doctors by name or speciality. Each doctor card shows their experience, consultation fees (in ₹), and hospital. Click 'View Full Profile' for a detailed bio, education, and awards.",
  },
  {
    id: "appointment",
    label: "How do I book an appointment?",
    content: "Click 'Book An Appointment' on any doctor card or on the doctor's profile page. Select your preferred consultation type (Hospital Visit or Video Consult), choose an available date and time slot, and confirm your booking details.",
  },
  {
    id: "fees",
    label: "Are consultation fees displayed accurate?",
    content: "The fees shown in ₹ are indicative consultation charges. Actual charges may vary based on the type of consultation, investigations required, and the hospital facility. Final billing will be confirmed at the time of booking.",
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
        {/* Left */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-5">Feel Free to ask us</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative w-full" style={{ height: 240 }}>
              <img
                src="/faq-woman.png"
                alt="Ask us anything"
                className="w-full h-full object-cover object-top"
              />
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

        {/* Right: accordion */}
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
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  >
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

// ── Page ──────────────────────────────────────────────────────────────────────

// Helper function to generate slug from name and ID
const generateSlug = (name: string, id: string): string => {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  // Add first 8 characters of ID to make slug unique
  return `${nameSlug}-${id.substring(0, 8)}`;
};

export default function DoctorsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeSpeciality, setActiveSpeciality] = useState("All");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  // Fetch specialities on mount
  useEffect(() => {
    fetchSpecialities();
  }, []);

  // Fetch doctors when filters change (debounced)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchDoctors();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search, activeSpeciality]);

  const fetchSpecialities = async () => {
    try {
      // Fetch unique specializations from doctors table
      const { data, error } = await supabase
        .from('doctors')
        .select('specialization')
        .eq('is_active', true)
        .not('specialization', 'is', null);

      if (error) throw error;

      // Get unique specializations
      const uniqueSpecialities = [...new Set((data || []).map(d => d.specialization))]
        .filter(Boolean)
        .map(name => ({
          id: name,
          name: name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setSpecialities(uniqueSpecialities);
    } catch (err) {
      console.error('Error fetching specialities:', err);
    }
  };

  const fetchDoctors = async () => {
    setIsLoading(true);
    setError("");

    try {
      let query = supabase
        .from('doctors')
        .select(`
          id,
          full_name,
          email,
          phone,
          degree,
          specialization,
          experience_years,
          consultation_fee,
          profile_image_url,
          is_active,
          about
        `, { count: 'exact' })
        .eq('is_active', true)
        .order('full_name', { ascending: true });

      // Apply search filter
      if (search.trim()) {
        const searchTerm = `%${search.trim()}%`;
        query = query.or(`full_name.ilike.${searchTerm},degree.ilike.${searchTerm},specialization.ilike.${searchTerm}`);
      }

      // Apply speciality filter
      if (activeSpeciality !== "All") {
        query = query.eq('specialization', activeSpeciality);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      // Transform data to match your Doctor type
      const transformedDoctors: Doctor[] = (data || []).map((doc: any) => {
        const fullName = doc.full_name || '';
        const slug = generateSlug(fullName, doc.id);
        
        return {
          id: doc.id,
          slug: slug, // Generate unique slug with ID
          name: fullName,
          designation: doc.degree || 'Doctor',
          hospital_name: 'Sant Haridas Hospital',
          hospital_id: '', // No hospital relation in new schema
          specialtyBold: doc.specialization || 'General',
          specialtyLight: doc.degree || '',
          experience: doc.experience_years || 0,
          fees: doc.consultation_fee || 0,
          image: doc.profile_image_url || '',
          consultation_mode: 'both', // Default value as this column doesn't exist in new schema
        };
      });

      setDoctors(transformedDoctors);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('Error fetching doctors:', err);
      setError(err.message || 'Failed to fetch doctors');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle booking appointment
  const handleBookAppointment = (doctor: Doctor) => {
    // Store selected doctor in session storage
    sessionStorage.setItem('selectedDoctor', JSON.stringify({
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
    }));
    
    // Navigate to booking page
    router.push('/book-appointment');
  };

  return (
    <>
      <main className="min-h-screen bg-[#f7f8fa]">
        <TopBar />
        <MainNav />

        {/* Page header */}
        <div className="w-full bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-[#1a3a5c]">Find a Doctor</h1>
            <p className="text-gray-500 mt-1 text-[15px]">
              Sant Haridas Hospital is home to some of the most eminent doctors in the world.
            </p>

            {/* Search bar */}
            <div className="mt-5 flex items-center gap-3 bg-white border border-gray-300 rounded-xl px-4 py-3 max-w-2xl shadow-sm focus-within:border-[#1a9fa8] transition-colors">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by doctor name, speciality or hospital..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-[14px] text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              />
              {search && (
                <button 
                  onClick={() => setSearch("")} 
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Speciality filter pills */}
        <div className="w-full bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveSpeciality("All")}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors whitespace-nowrap ${
                activeSpeciality === "All"
                  ? "bg-[#1a9fa8] text-white border-[#1a9fa8]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1a9fa8] hover:text-[#1a9fa8]"
              }`}
            >
              All
            </button>
            {specialities.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSpeciality(s.name)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors whitespace-nowrap ${
                  activeSpeciality === s.name
                    ? "bg-[#1a9fa8] text-white border-[#1a9fa8]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#1a9fa8] hover:text-[#1a9fa8]"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor grid */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {/* Result count */}
          <p className="text-[13px] text-gray-500 mb-5">
            {isLoading ? (
              "Loading doctors..."
            ) : (
              <>
                Showing <span className="font-semibold text-[#1a3a5c]">{doctors.length}</span> doctor{doctors.length !== 1 ? "s" : ""}
                {activeSpeciality !== "All" && (
                  <> in <span className="font-semibold text-[#1a9fa8]">{activeSpeciality}</span></>
                )}
              </>
            )}
          </p>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a9fa8]"></div>
            </div>
          )}

          {/* Doctor cards */}
          {!isLoading && !error && doctors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctors.map((doctor) => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor}
                  onBookAppointment={handleBookAppointment}
                />
              ))}
            </div>
          )}

          {/* No results */}
          {!isLoading && !error && doctors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="18" stroke="currentColor" strokeWidth="2.5" />
                <path d="M42 42l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <p className="text-[16px] font-semibold text-gray-400">No doctors found</p>
              <p className="text-[13px] text-gray-400 mt-1">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </main>

      {/* FAQ */}
      <DoctorsFaqSection />

      {/* Footer */}
      <footer className="w-full bg-[#f0faf5] border-t border-gray-200">
        {/* Map */}
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
        {/* Bottom bar */}
        <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <img
              src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
              alt="Sant Haridas Hospital"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Social */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-[11px] font-bold tracking-widest text-[#1a3a5c] uppercase">Stay in Touch</p>
            <div className="flex items-center gap-3">
              {[
                { label: "Instagram", icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-doc)" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="4.5" stroke="url(#ig-doc)" strokeWidth="1.8" />
                    <circle cx="17.5" cy="6.5" r="1" fill="#e6683c" />
                    <defs>
                      <linearGradient id="ig-doc" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#f09433" /><stop offset="0.5" stopColor="#dc2743" /><stop offset="1" stopColor="#bc1888" />
                      </linearGradient>
                    </defs>
                  </svg>
                )},
                { label: "Facebook", icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2h-3a5 5 0 00-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="#1877f2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )},
                { label: "X", icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4l16 16M4 20L20 4" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )},
                { label: "YouTube", icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="5" width="20" height="14" rx="4" stroke="#ff0000" strokeWidth="1.8" />
                    <path d="M10 9l5 3-5 3V9z" fill="#ff0000" />
                  </svg>
                )},
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow">
                  {s.icon}
                </a>
              ))}
            </div>
            <p className="text-[12px] text-gray-500">&copy; {new Date().getFullYear()} Sant Haridas Hospital. All Rights Reserved.</p>
          </div>
          {/* Contact */}
          <div className="flex flex-col items-end gap-1.5 text-right">
            <p className="text-[12px] font-semibold text-[#1a3a5c]">24/7 Emergency</p>
            <a href="tel:+919268880303" className="text-[15px] font-bold text-[#1a9fa8] hover:text-[#1a3a5c] transition-colors">+91 926 888 0303</a>
            <Link href="/book-appointment" className="mt-1 inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-[12px] font-semibold px-4 py-2 rounded hover:bg-[#122b47] transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M1 6h14" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="5" cy="9.5" r="1" fill="currentColor" />
                <circle cx="8" cy="9.5" r="1" fill="currentColor" />
              </svg>
              Book an Appointment
            </Link>
            
          </div>
        </div>
      </footer>
    </>
  );
}