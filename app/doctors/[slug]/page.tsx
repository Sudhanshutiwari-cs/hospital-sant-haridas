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
      className="h-9 sm:h-10 md:h-12 w-auto object-contain"
    />
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
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500 flex-shrink-0">
      <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 7h14" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 2v3M12 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function RupeeIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500 flex-shrink-0">
      <path d="M5 4h8M5 8h8M9 8l-4 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 6c0 0 0 2 4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500">
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

// ── Nav ────────────────────────────────────────────────────────────────────────

const mainNavItems = [
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

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

function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 flex items-center justify-between h-14 sm:h-16">
        <Link href="/" className="flex-shrink-0">
          <SiteLogo />
        </Link>

        {/* Desktop nav */}
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

        <div className="flex items-center gap-2 sm:gap-4">
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

      {/* Mobile nav */}
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
              href="/book-appointment"
              onClick={() => setMobileOpen(false)}
              className="mt-3 mb-2 bg-[#e85d26] hover:bg-[#d14e1c] text-white font-semibold text-sm px-5 py-2.5 rounded transition-colors text-center"
            >
              Book an Appointment
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Doctor = {
  id: string;
  slug: string;
  name: string;
  degree: string;
  specialization: string;
  experience: number;
  fees: number;
  image: string;
  about: string;
  email: string;
  phone: string;
};

// ── Doctor profile page ────────────────────────────────────────────────────────

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandAbout, setExpandAbout] = useState(false);

  const extractDoctorId = (slug: string): string | null => {
    if (!slug) return null;

    const parts = slug.split('-');
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1];
      if (lastPart.length === 8 && /^[0-9a-f]+$/i.test(lastPart)) {
        return lastPart;
      }
    }
    return null;
  };

  useEffect(() => {
    if (slug) {
      fetchDoctorData();
    }
  }, [slug]);

  const fetchDoctorData = async () => {
    setIsLoading(true);
    setError("");

    try {
      let doctorRecord = null;
      const doctorIdFragment = extractDoctorId(slug);

      if (doctorIdFragment) {
        const { data: allDoctors, error: errorAll } = await supabase
          .from('doctors')
          .select(`
            id, full_name, email, phone, degree, specialization,
            experience_years, consultation_fee, profile_image_url, is_active, about
          `)
          .eq('is_active', true)
          .limit(100);

        if (!errorAll && allDoctors && allDoctors.length > 0) {
          doctorRecord = allDoctors.find(doc =>
            doc.id && doc.id.toLowerCase().startsWith(doctorIdFragment.toLowerCase())
          );
        }
      }

      if (!doctorRecord) {
        const nameFromSlug = slug.replace(/-/g, ' ').replace(/\s+[0-9a-f]{8}$/i, '').trim();

        const { data: dataByName, error: errorByName } = await supabase
          .from('doctors')
          .select(`
            id, full_name, email, phone, degree, specialization,
            experience_years, consultation_fee, profile_image_url, is_active, about
          `)
          .eq('is_active', true)
          .ilike('full_name', `%${nameFromSlug}%`)
          .limit(1);

        if (!errorByName && dataByName && dataByName.length > 0) {
          doctorRecord = dataByName[0];
        }
      }

      if (!doctorRecord) {
        throw new Error('Doctor not found');
      }

      const transformedDoctor: Doctor = {
        id: doctorRecord.id,
        slug: slug,
        name: doctorRecord.full_name || 'Unknown Doctor',
        degree: doctorRecord.degree || 'Doctor',
        specialization: doctorRecord.specialization || 'General',
        experience: doctorRecord.experience_years || 0,
        fees: doctorRecord.consultation_fee || 0,
        image: doctorRecord.profile_image_url || '',
        about: doctorRecord.about || 'No information available.',
        email: doctorRecord.email || '',
        phone: doctorRecord.phone || '',
      };

      setDoctor(transformedDoctor);
    } catch (err: any) {
      console.error('Error fetching doctor:', err);
      setError(err.message || 'Failed to fetch doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = () => {
    if (!doctor) return;

    sessionStorage.setItem('selectedDoctor', JSON.stringify({
      id: doctor.id,
      name: doctor.name,
      degree: doctor.degree,
      specialization: doctor.specialization,
      experience: doctor.experience,
      fees: doctor.fees,
      image: doctor.image,
    }));

    router.push('/book-appointment');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <TopBar />
        <MainNav />
        <div className="flex justify-center py-16 sm:py-20">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#1a9fa8]"></div>
        </div>
      </main>
    );
  }

  if (error || !doctor) {
    return (
      <main className="min-h-screen bg-[#f7f8fa]">
        <TopBar />
        <MainNav />
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-16 sm:py-20 text-center">
          <p className="text-red-500 mb-4 text-[14px] sm:text-[15px]">{error || 'Doctor not found'}</p>
          <Link href="/doctors" className="text-[#1a9fa8] hover:underline text-[14px] sm:text-[15px]">
            Back to Doctors List
          </Link>
        </div>
      </main>
    );
  }

  const ABOUT_CUTOFF = 220;
  const shortAbout = doctor.about.length > ABOUT_CUTOFF ? doctor.about.slice(0, ABOUT_CUTOFF) + "..." : doctor.about;

  return (
    <>
      <main className="min-h-screen bg-[#f7f8fa]">
        <TopBar />
        <MainNav />

        {/* Profile header strip */}
        <div className="w-full bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-5 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Photo + Share row on mobile */}
              <div className="flex items-center sm:items-start gap-4 w-full sm:w-auto">
                {/* Photo */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-sm">
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

                {/* Name block (mobile: next to photo) */}
                <div className="flex-1 min-w-0 sm:hidden">
                  <h1 className="text-[18px] font-bold text-[#1a1a1a] leading-snug">{doctor.name}</h1>
                  <p className="text-[13px] text-gray-500 mt-1">{doctor.degree} | Sant Haridas Hospital</p>
                  <div className="mt-2 inline-flex items-center border border-gray-200 rounded overflow-hidden text-[11px]">
                    <span className="bg-[#f0edf8] text-[#4a3880] font-semibold px-2.5 py-1">{doctor.specialization}</span>
                  </div>
                </div>

                {/* Share button (mobile: top right) */}
                <button
                  aria-label="Share profile"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: doctor.name,
                        text: `${doctor.name} - ${doctor.degree}`,
                        url: window.location.href,
                      });
                    }
                  }}
                  className="sm:hidden flex-shrink-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1a9fa8] transition-colors"
                >
                  <ShareIcon />
                </button>
              </div>

              {/* Name block (desktop) */}
              <div className="hidden sm:block flex-1 min-w-0">
                <h1 className="text-[22px] font-bold text-[#1a1a1a] leading-snug">{doctor.name}</h1>
                <p className="text-[14px] text-gray-500 mt-1">{doctor.degree} | Sant Haridas Hospital</p>
                <div className="mt-2 inline-flex items-center border border-gray-200 rounded overflow-hidden text-[12px]">
                  <span className="bg-[#f0edf8] text-[#4a3880] font-semibold px-2.5 py-1">{doctor.specialization}</span>
                </div>
              </div>

              {/* Stats card (desktop only) */}
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

              {/* Share button (desktop) */}
              <button
                aria-label="Share profile"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: doctor.name,
                      text: `${doctor.name} - ${doctor.degree}`,
                      url: window.location.href,
                    });
                  }
                }}
                className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-full border border-gray-300 items-center justify-center hover:border-[#1a9fa8] hover:text-[#1a9fa8] transition-colors"
              >
                <ShareIcon />
              </button>
            </div>

            {/* Mobile stats row */}
            <div className="sm:hidden mt-4 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 px-4 py-3 border border-gray-200 rounded-lg bg-white">
                <CalendarIcon />
                <div>
                  <p className="text-[14px] font-bold text-[#1a1a1a] leading-none">{doctor.experience} Years</p>
                  <p className="text-[11px] text-[#1a9fa8] mt-0.5">Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-3 border border-gray-200 rounded-lg bg-[#f8f7fd]">
                <RupeeIcon />
                <div>
                  <p className="text-[14px] font-bold text-[#1a1a1a] leading-none">&#8377; {doctor.fees.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* LEFT: info cards */}
            <div className="flex-1 w-full flex flex-col gap-4 sm:gap-5 min-w-0">
              {/* About */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <UserIcon />
                  <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1a1a1a]">About</h2>
                </div>
                <p className="text-[13px] sm:text-[14px] leading-relaxed text-gray-600">
                  {expandAbout ? doctor.about : shortAbout}
                </p>
                {doctor.about.length > ABOUT_CUTOFF && (
                  <button
                    onClick={() => setExpandAbout(!expandAbout)}
                    className="mt-3 text-[12px] sm:text-[13px] font-semibold text-[#e85d26] hover:underline"
                  >
                    {expandAbout ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* Qualifications */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <GraduationIcon />
                  <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1a1a1a]">Qualifications</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a9fa8] mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-[13px] sm:text-[14px] font-semibold text-gray-800">{doctor.degree}</p>
                      <p className="text-[12px] sm:text-[13px] text-gray-600">{doctor.specialization}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              {(doctor.email || doctor.phone) && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <UserIcon />
                    <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1a1a1a]">Contact Information</h2>
                  </div>
                  <div className="space-y-2">
                    {doctor.email && (
                      <p className="text-[13px] sm:text-[14px] text-gray-600 break-all">
                        <span className="font-semibold">Email:</span> {doctor.email}
                      </p>
                    )}
                    {doctor.phone && (
                      <p className="text-[13px] sm:text-[14px] text-gray-600">
                        <span className="font-semibold">Phone:</span> {doctor.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Book Appointment CTA */}
            <div className="w-full lg:w-[320px] flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-24">
                <h3 className="text-[16px] sm:text-lg font-bold text-[#1a3a5c] mb-3">Book Appointment</h3>
                <p className="text-[13px] sm:text-sm text-gray-600 mb-4">
                  Schedule your consultation with {doctor.name}
                </p>
                <div className="space-y-3 mb-5 sm:mb-6">
                  <div className="flex justify-between text-[13px] sm:text-sm">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-semibold">₹{doctor.fees}</span>
                  </div>
                  <div className="flex justify-between text-[13px] sm:text-sm">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold">{doctor.experience} Years</span>
                  </div>
                </div>
                <button
                  onClick={handleBookAppointment}
                  className="w-full bg-[#1a9fa8] hover:bg-[#158791] text-white font-semibold py-3 rounded-lg transition-colors text-[14px] sm:text-[15px]"
                >
                  Book Appointment
                </button>
                <div className="mt-4 p-3 bg-[#f0faf5] rounded-lg">
                  <p className="text-[11px] sm:text-xs text-gray-600">
                    <span className="font-semibold">Emergency Helpline:</span>{" "}
                    <a href="tel:+919540740947" className="text-[#1a9fa8] font-semibold">
                      +91 95407 40947
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
                      <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-docp)" strokeWidth="1.8" />
                      <circle cx="12" cy="12" r="4.5" stroke="url(#ig-docp)" strokeWidth="1.8" />
                      <circle cx="17.5" cy="6.5" r="1" fill="#e6683c" />
                      <defs>
                        <linearGradient id="ig-docp" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
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
            <p className="text-[11px] sm:text-[12px] text-gray-500 text-center">
              &copy; {new Date().getFullYear()} Sant Haridas Hospital. All Rights Reserved.
            </p>
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