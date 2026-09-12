"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ── SVG Icons ────────────────────────────────────────────────────────────────

function SiteLogo() {
  return (
    <img
      src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
      alt="Sant Haridas Hospital"
      className="h-8 sm:h-10 md:h-12 w-auto object-contain"
    />
  );
}

function PhoneIcon({ color = "#fff" }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        fill={color}
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.4.1-.1.2-.3.3-.4.1-.2.1-.3 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.4.1-.7.3C7.4 8 7 8.9 7 9.9c0 1 .7 2 .8 2.2.1.1 1.5 2.3 3.6 3.2.5.2.9.4 1.2.5.5.2 1 .1 1.3.1.4-.1 1.3-.5 1.5-1s.2-.9.1-1z"
        fill="white"
      />
    </svg>
  );
}

function EmailIcon({ color = "#1a3a5c" }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M2 7l10 7 10-7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon({ color = "#1a3a5c" }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline-block">
      <path d="M12 22s8-7.5 8-13a8 8 0 10-16 0c0 5.5 8 13 8 13z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="3" stroke={color} strokeWidth="1.8" />
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

// ── Medical Service Icons ────────────────────────────────────────────────────

function EyeOpdIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
      <path d="M24 8C12 8 5 19 5 24s7 16 19 16 19-11 19-16-7-16-19-16z" stroke="#1a3a5c" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="7" stroke="#1a9fa8" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="3" fill="#1a9fa8" />
    </svg>
  );
}

function GynecologyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
      <circle cx="24" cy="18" r="9" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M24 27v13M17 33h14" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 15a3 3 0 016 0" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MedicineIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
      <rect x="8" y="18" width="32" height="20" rx="4" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M18 18v-4a6 6 0 1112 0v4" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M24 24v8M20 28h8" stroke="#1a9fa8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PathologyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
      <path d="M18 8h12v6l6 20a4 4 0 01-4 5H16a4 4 0 01-4-5l6-20V8z" stroke="#1a3a5c" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 30h20" stroke="#1a9fa8" strokeWidth="1.5" />
      <circle cx="22" cy="35" r="2" fill="#1a9fa8" opacity="0.6" />
      <circle cx="28" cy="37" r="1.5" fill="#1a9fa8" opacity="0.6" />
    </svg>
  );
}

function PhysiotherapyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
      <circle cx="20" cy="12" r="5" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M12 40V26a8 8 0 0116 0v6" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 32l8 4M28 24l8-4" stroke="#1a9fa8" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="38" cy="20" r="2" fill="#1a9fa8" />
      <circle cx="38" cy="38" r="2" fill="#1a9fa8" />
    </svg>
  );
}

function OpdIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
      <rect x="8" y="10" width="32" height="28" rx="3" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M8 18h32" stroke="#1a3a5c" strokeWidth="1.5" />
      <circle cx="13" cy="14" r="1" fill="#1a3a5c" />
      <circle cx="17" cy="14" r="1" fill="#1a3a5c" />
      <path d="M18 27h12M18 32h8" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WardIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
      <path d="M6 40V14a2 2 0 012-2h32a2 2 0 012 2v26" stroke="#1a3a5c" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 24h36M6 32h36" stroke="#1a9fa8" strokeWidth="1.5" />
      <circle cx="16" cy="19" r="2" fill="#1a9fa8" />
      <circle cx="32" cy="19" r="2" fill="#1a9fa8" />
    </svg>
  );
}

function RoomIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
      <path d="M10 40V12a2 2 0 012-2h24a2 2 0 012 2v28" stroke="#1a3a5c" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 40h36" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="18" y="22" width="12" height="10" rx="1" stroke="#1a9fa8" strokeWidth="1.5" />
      <circle cx="30" cy="27" r="1" fill="#1a9fa8" />
    </svg>
  );
}

function LabIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
      <rect x="8" y="14" width="32" height="26" rx="3" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M16 14V8h16v6" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 24h16M16 30h10" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="34" cy="30" r="2" fill="#1a9fa8" opacity="0.6" />
    </svg>
  );
}

// ── Nav data ────────────────────────────────────────────────────────────────

const mainNavItems = [
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

// ── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-[11px] sm:text-xs md:text-sm">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 flex items-center justify-center sm:justify-end gap-3 sm:gap-4 md:gap-6 h-9 sm:h-10">
        <a
          href="https://wa.me/919415057201"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 sm:gap-1.5 hover:underline whitespace-nowrap font-medium"
        >
          <WhatsAppIcon />
          <span className="hidden xs:inline">WhatsApp Us</span>
          <span className="xs:hidden">WhatsApp</span>
        </a>
        <a
          href="tel:+919540740947"
          className="flex items-center gap-1 sm:gap-1.5 hover:underline whitespace-nowrap font-medium"
        >
          <PhoneIcon />
          <span className="hidden sm:inline">+91 95407 40947</span>
          <span className="sm:hidden">Call</span>
        </a>
      </div>
    </div>
  );
}

// ── Main Nav ────────────────────────────────────────────────────────────────

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
            href="/contact"
            className="hidden sm:inline-block bg-[#e85d26] hover:bg-[#d14e1c] text-white font-semibold text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded transition-colors whitespace-nowrap"
          >
            Book Appointment
          </Link>

          {/* Mobile menu button */}
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

      {/* Mobile nav dropdown */}
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
              href="/contact"
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

// ── Hero ────────────────────────────────────────────────────────────────────

function EmergencyTab() {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex">
      <a
        href="tel:+919540740947"
        className="bg-[#cc0000] text-white font-bold text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] py-3 sm:py-4 px-2 sm:px-2.5 flex flex-col items-center gap-0 cursor-pointer hover:bg-[#b00000] transition-colors"
        style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
      >
        EMERGENCY
      </a>
    </div>
  );
}

function FloatingPhoneBadge() {
  return (
    <a
      href="tel:+919540740947"
      className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 flex items-center gap-2 sm:gap-2.5 bg-[#1a3a5c] hover:bg-[#122b47] text-white rounded-full px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg transition-colors"
    >
      <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
        <PhoneIcon />
      </div>
      <span className="font-semibold text-xs sm:text-sm tracking-wide">+91 95407 40947</span>
    </a>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="relative w-full"
        style={{ height: "calc(100vh - 94px)", minHeight: 360, maxHeight: 680 }}
      >
        <Image
          src="/hospital-hero.png"
          alt="Sant Haridas Hospital building"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-transparent" />
        <EmergencyTab />
        <FloatingPhoneBadge />
      </div>
    </section>
  );
}

// ── Doctor Illustration ─────────────────────────────────────────────────────

function DoctorIllustration() {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="40" y="195" width="240" height="10" rx="3" fill="#c8d8e8" />
      <rect x="55" y="205" width="8" height="40" rx="2" fill="#b0c4d8" />
      <rect x="257" y="205" width="8" height="40" rx="2" fill="#b0c4d8" />
      <rect x="130" y="140" width="80" height="56" rx="4" fill="#1a3a5c" />
      <rect x="134" y="144" width="72" height="46" rx="2" fill="#2a5298" />
      <rect x="140" y="150" width="60" height="4" rx="1" fill="#4a8fd8" opacity="0.7" />
      <rect x="140" y="158" width="48" height="3" rx="1" fill="#4a8fd8" opacity="0.5" />
      <rect x="140" y="165" width="54" height="3" rx="1" fill="#4a8fd8" opacity="0.5" />
      <rect x="140" y="172" width="36" height="3" rx="1" fill="#4a8fd8" opacity="0.3" />
      <rect x="165" y="196" width="10" height="8" rx="1" fill="#1a3a5c" />
      <rect x="155" y="203" width="30" height="4" rx="2" fill="#1a3a5c" />
      <rect x="135" y="198" width="50" height="8" rx="2" fill="#c8d8e8" />
      <rect x="215" y="110" width="70" height="85" rx="3" fill="#d4e4f0" />
      <rect x="220" y="115" width="60" height="12" rx="1" fill="#2a5298" opacity="0.6" />
      <rect x="220" y="130" width="60" height="12" rx="1" fill="#1a9fa8" opacity="0.5" />
      <rect x="220" y="145" width="60" height="12" rx="1" fill="#2a5298" opacity="0.4" />
      <rect x="220" y="160" width="60" height="12" rx="1" fill="#1a9fa8" opacity="0.4" />
      <rect x="220" y="175" width="60" height="12" rx="1" fill="#2a5298" opacity="0.3" />
      <rect x="68" y="148" width="38" height="48" rx="6" fill="white" />
      <path d="M82 148 L87 168 L87 196" stroke="#e0e8f0" strokeWidth="1.5" />
      <path d="M92 148 L87 168" stroke="#e0e8f0" strokeWidth="1.5" />
      <path d="M80 160 C76 165, 74 172, 78 175 C82 178, 86 174, 87 170" stroke="#1a9fa8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="78" cy="176" r="3" fill="#1a9fa8" />
      <circle cx="87" cy="136" r="14" fill="#f5cba7" />
      <path d="M73 132 C73 122, 101 122, 101 132" fill="#5d4037" />
      <circle cx="83" cy="135" r="1.5" fill="#333" />
      <circle cx="91" cy="135" r="1.5" fill="#333" />
      <path d="M84 141 Q87 144 90 141" stroke="#c0845a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M106 162 L128 155" stroke="#f5cba7" strokeWidth="8" strokeLinecap="round" />
      <path d="M128 155 L140 150" stroke="#f5cba7" strokeWidth="6" strokeLinecap="round" />
      <rect x="178" y="152" width="36" height="44" rx="6" fill="#d4e4f0" />
      <circle cx="196" cy="138" r="13" fill="#f5cba7" />
      <path d="M183 132 C183 122, 209 122, 209 132" fill="#333" />
      <circle cx="192" cy="137" r="1.5" fill="#333" />
      <circle cx="199" cy="137" r="1.5" fill="#333" />
      <path d="M193 143 Q196 146 199 143" stroke="#c0845a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M178 172 L148 185" stroke="#d4e4f0" strokeWidth="8" strokeLinecap="round" />
      <path d="M214 172 L230 185" stroke="#d4e4f0" strokeWidth="8" strokeLinecap="round" />
      <rect x="62" y="148" width="6" height="52" rx="3" fill="#9ab0c4" />
      <rect x="174" y="148" width="6" height="52" rx="3" fill="#9ab0c4" />
      <rect x="38" y="185" width="6" height="12" rx="1" fill="#6d8b74" />
      <rect x="34" y="193" width="14" height="6" rx="2" fill="#8b6c5c" />
      <ellipse cx="41" cy="182" rx="8" ry="6" fill="#5d8a6b" />
      <ellipse cx="35" cy="178" rx="6" ry="5" fill="#4a7a5a" />
      <ellipse cx="47" cy="179" rx="6" ry="5" fill="#4a7a5a" />
      <circle cx="270" cy="50" r="22" fill="white" opacity="0.9" />
      <circle cx="270" cy="50" r="20" stroke="#c8d8e8" strokeWidth="2" />
      <path d="M270 50 L270 34" stroke="#1a3a5c" strokeWidth="2" strokeLinecap="round" />
      <path d="M270 50 L282 56" stroke="#1a3a5c" strokeWidth="2" strokeLinecap="round" />
      <circle cx="270" cy="50" r="2.5" fill="#1a3a5c" />
    </svg>
  );
}

// ── Services & Facilities ───────────────────────────────────────────────────

const medicalServices = [
  { name: "Eye OPD", icon: <EyeOpdIcon /> },
  { name: "Gynecology", icon: <GynecologyIcon /> },
  { name: "Medicine OPD", icon: <MedicineIcon /> },
  { name: "Pathology Laboratory", icon: <PathologyIcon /> },
  { name: "Physiotherapy", icon: <PhysiotherapyIcon /> },
  { name: "OPDs Across Multiple Disciplines", icon: <OpdIcon /> },
  { name: "Wards", icon: <WardIcon /> },
  { name: "Semi-Private Rooms", icon: <RoomIcon /> },
  { name: "Private Rooms", icon: <RoomIcon /> },
  { name: "Fully Automated Laboratory", icon: <LabIcon /> },
];

const facilitiesCare = [
  "State-of-the-art medical equipment",
  "State-of-the-art hospital facilities",
  "Fully automated laboratories",
  "Personalized treatment plans",
  "Skilled doctors and medical staff",
  "Compassionate patient care",
  "Multiple OPD disciplines",
  "Inpatient ward facilities",
  "Semi-private and private rooms",
];

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" fill="#1a9fa8" opacity="0.15" />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="#1a9fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServicesSection() {
  const [activeTab, setActiveTab] = useState<"services" | "facilities">("services");

  return (
    <section className="w-full bg-white py-10 sm:py-12 px-3 sm:px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

        {/* Left: Services / Facilities */}
        <div className="flex-1 min-w-0 w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a5c] border-b-2 border-gray-200 pb-3 mb-4 sm:mb-5">
            Our Medical Services &amp; Facilities
          </h2>

          {/* Tabs */}
          <div className="flex gap-6 sm:gap-8 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("services")}
              className={`pb-3 text-[14px] sm:text-[15px] font-semibold transition-colors relative whitespace-nowrap ${
                activeTab === "services" ? "text-[#1a9fa8]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Medical Services
              {activeTab === "services" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a9fa8] rounded-t-sm" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("facilities")}
              className={`pb-3 text-[14px] sm:text-[15px] font-semibold transition-colors relative whitespace-nowrap ${
                activeTab === "facilities" ? "text-[#1a9fa8]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Facilities &amp; Care
              {activeTab === "facilities" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a9fa8] rounded-t-sm" />
              )}
            </button>
          </div>

          {/* Services grid */}
          {activeTab === "services" && (
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-5">
              {medicalServices.map((s) => (
                <Link
                  key={s.name}
                  href="/contact"
                  className="flex items-center gap-3 sm:gap-4 group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-[13px] sm:text-[15px] text-[#1a3a5c] font-medium group-hover:text-[#1a9fa8] transition-colors leading-snug">
                    {s.name}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Facilities list */}
          {activeTab === "facilities" && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {facilitiesCare.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <CheckIcon />
                  <span className="text-[13px] sm:text-[15px] text-[#1a3a5c] font-medium leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/contact"
            className="inline-flex items-center gap-1 mt-6 sm:mt-8 text-[#1a3a5c] font-semibold text-[14px] sm:text-[15px] hover:text-[#1a9fa8] transition-colors"
          >
            Book a Consultation
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right: Looking for an Expert card */}
        <div className="w-full lg:w-[420px] flex-shrink-0">
          <div className="relative rounded-3xl overflow-hidden" style={{ backgroundColor: "#1a9fa8", minHeight: 320 }}>
            <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                Looking for a Specialist?
              </h3>
              <p className="text-white/85 text-[13px] sm:text-[14px] leading-relaxed mb-5 sm:mb-6">
                Sant Haridas Hospital is home to experienced doctors<br className="hidden sm:block" />across multiple medical disciplines.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#1a3a5c] hover:bg-[#122b47] text-white font-semibold text-[14px] sm:text-[15px] px-5 sm:px-6 py-2.5 sm:py-3 rounded transition-colors"
              >
                Contact Us
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative z-10 px-2 pb-2" style={{ height: 200 }}>
              <DoctorIllustration />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ── Health Blogs ────────────────────────────────────────────────────────────

const blogPosts = [
  {
    title: "EYE CARE\nAWARENESS",
    subtitle: "Understanding Symptoms,\nTreatment and Recovery",
    fullTitle: "Eye Care Awareness: Understanding Symptoms, Treatment and Recovery",
    excerpt: "Regular eye check-ups help detect problems early and preserve your vision for years to come...",
    image: "/blog-cataract.png",
    imageAlt: "Eye care consultation",
  },
  {
    title: "WOMEN'S\nHEALTH",
    subtitle: "Gynecology Care and\nWellness Tips",
    fullTitle: "Women's Health: Gynecology Care and Wellness Tips",
    excerpt: "From routine check-ups to specialized care, our gynecology department supports women at every stage...",
    image: "/blog-glaucoma.png",
    imageAlt: "Gynecology consultation",
  },
  {
    title: "GENERAL\nWELLNESS",
    subtitle: "Preventive Medicine\nand Healthy Living",
    fullTitle: "General Wellness: Preventive Medicine and Healthy Living",
    excerpt: "Preventive care and timely medical attention are the cornerstones of a healthy life...",
    image: "/blog-child-eye.png",
    imageAlt: "General health check-up",
  },
];

function HealthBlogsSection() {
  return (
    <section className="w-full bg-white py-10 sm:py-12 px-3 sm:px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-5 sm:mb-6 border-b-2 border-gray-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a5c] underline decoration-[#1a3a5c] underline-offset-4">
            Health Blogs
          </h2>
          <Link
            href="/blogs"
            className="flex items-center gap-1 text-[#1a3a5c] font-semibold text-xs sm:text-sm hover:text-[#1a9fa8] transition-colors"
          >
            View all
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {blogPosts.map((post) => (
            <Link key={post.fullTitle} href="/blogs" className="group flex flex-col">
              <div className="relative rounded-lg overflow-hidden bg-[#d6eef2]" style={{ height: 180 }}>
                <div className="absolute inset-0 z-10 flex flex-col justify-center pl-4 sm:pl-5 pr-[46%]">
                  <p className="text-[#1a3a5c] font-bold text-[13px] sm:text-[15px] leading-tight whitespace-pre-line mb-2 sm:mb-3">
                    {post.title}
                  </p>
                  <div className="w-8 sm:w-10 h-[3px] bg-[#1a9fa8] mb-2 sm:mb-3" />
                  <p className="text-[#1a3a5c] text-[11px] sm:text-[12px] leading-snug whitespace-pre-line">
                    {post.subtitle}
                  </p>
                </div>

                <div className="absolute inset-y-0 right-0 z-10 flex items-center" style={{ width: "52%" }}>
                  <svg viewBox="0 0 120 200" preserveAspectRatio="none" className="absolute left-0 top-0 h-full w-8" xmlns="http://www.w3.org/2000/svg">
                    <path d="M120 0 C60 50, 60 150, 120 200 L0 200 L0 0 Z" fill="#d6eef2" />
                  </svg>
                </div>

                <div className="absolute right-0 top-0 bottom-0 z-0" style={{ width: "52%" }}>
                  <Image src={post.image} alt={post.imageAlt} fill className="object-cover object-center" />
                  <div className="absolute inset-0 bg-[#1a9fa8]/10" />
                </div>

                <svg className="absolute top-0 right-0 z-20" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60 0 Q60 60 0 60" stroke="#1a9fa8" strokeWidth="3" fill="none" />
                </svg>
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                <p className="text-[#1a3a5c] font-semibold text-[12px] sm:text-[13px] leading-snug group-hover:text-[#1a9fa8] transition-colors line-clamp-2">
                  {post.fullTitle}
                </p>
                <p className="text-gray-500 text-[11px] sm:text-[12px] leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ / Feel Free to Ask ──────────────────────────────────────────────────

const faqItems = [
  {
    id: "about",
    label: "About Sant Haridas Hospital",
    content:
      "Sant Haridas Hospital is a multi-speciality healthcare facility located in Ram Nagar, Najafgarh, Delhi. We provide comprehensive medical services across multiple disciplines with a focus on compassionate, patient-centric care.",
  },
  {
    id: "services",
    label: "Our Medical Services",
    content:
      "We offer a wide range of medical services including Eye OPD, Gynecology, Medicine OPD, Pathology Laboratory, Physiotherapy, and OPDs across multiple disciplines. Our inpatient facilities include wards, semi-private rooms, and private rooms.",
  },
  {
    id: "facilities",
    label: "Facilities & Infrastructure",
    content:
      "Our hospital is equipped with state-of-the-art medical equipment and a fully automated laboratory. We provide personalized treatment plans delivered by skilled doctors and medical staff, ensuring the highest standard of patient care.",
  },
  {
    id: "contact",
    label: "Contact & Appointments",
    content:
      "For appointments and enquiries, please call +91 95407 40947 or +91 98680 53854. You can also reach us on WhatsApp at +91 94150 57201 or email us at santharidashospital@gmail.com. We are located at Main, Nangloi – Najafgarh Road, Ram Nagar, Najafgarh, Delhi – 110043.",
  },
];

function AccordionChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeelFreeSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="w-full bg-white py-10 sm:py-12 px-3 sm:px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4 sm:mb-5">Feel Free to Ask Us</h2>

          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm lg:max-w-none">
            <div className="relative w-full" style={{ height: 200 }}>
              <Image src="/faq-woman.png" alt="Woman in a thinking pose" fill className="object-cover object-top" />
            </div>

            <div className="px-4 py-3 bg-white">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus-within:border-[#1a9fa8] transition-colors">
                <input
                  type="text"
                  placeholder="Ask your question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1 min-w-0 text-[13px] sm:text-[14px] text-gray-600 placeholder-gray-400 outline-none bg-transparent"
                />
                <button
                  aria-label="Submit question"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-gray-300 hover:border-[#1a9fa8] flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col gap-3 lg:pt-[68px]">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 bg-white hover:bg-gray-50 transition-colors text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[14px] sm:text-[15px] font-semibold text-[#1a1a1a] pr-3">{item.label}</span>
                  <AccordionChevron open={isOpen} />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-white">
                    <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {item.content}
                    </p>
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

// ── Patient Stories ─────────────────────────────────────────────────────────

const patientStories = [
  {
    name: "Mr. Rajesh Kumar",
    image: "/patient-ronak.png",
    hospital: "Sant Haridas Hospital, Najafgarh",
    text: "Mr. Rajesh Kumar was treated at Sant Haridas Hospital for a complex medical condition. With advanced diagnostic facilities and personalized care from our skilled doctors, he made a full recovery and is now leading a healthy, active life.",
  },
  {
    name: "Mrs. Anita Desai",
    image: "/patient-prabhat.png",
    hospital: "Sant Haridas Hospital, Najafgarh",
    text: "Mrs. Anita Desai received comprehensive gynecology care at Sant Haridas Hospital. Thanks to early diagnosis and expert treatment by our specialists, she recovered quickly and continues to enjoy good health and wellbeing.",
  },
  {
    name: "Master Aarav Singh",
    image: "/patient-sunita.png",
    hospital: "Sant Haridas Hospital, Najafgarh",
    text: "Master Aarav Singh, aged 7, visited Sant Haridas Hospital for a general health concern. Our pediatric team provided compassionate care and complete treatment, ensuring excellent recovery and peace of mind for his family.",
  },
];

function PatientStoriesSection() {
  const [current, setCurrent] = useState(0);
  const total = patientStories.length;

  function prev() { setCurrent((c) => (c - 1 + total) % total); }
  function next() { setCurrent((c) => (c + 1) % total); }

  const story = patientStories[current];
  const nextStory = patientStories[(current + 1) % total];

  return (
    <section className="w-full bg-white py-10 sm:py-14 px-3 sm:px-4 overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
        <div className="w-full lg:w-[220px] flex-shrink-0 flex flex-col gap-4 sm:gap-6 lg:pt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] leading-snug">
            Our Patient&apos;s Stories
          </h2>
          <Link
            href="/patient-stories"
            className="inline-flex items-center justify-center w-[120px] sm:w-[140px] border-2 border-[#e07060] text-[#e07060] font-semibold text-[13px] sm:text-[14px] rounded px-4 sm:px-5 py-2 sm:py-2.5 hover:bg-[#fdf4f3] transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="flex-1 w-full flex flex-col gap-4 min-w-0">
          <div className="flex items-center gap-3 justify-center">
            <button onClick={prev} aria-label="Previous story" className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-[#e07060] text-[#e07060] hover:bg-[#fdf4f3] transition-colors">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={next} aria-label="Next story" className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-[#e07060] text-[#e07060] hover:bg-[#fdf4f3] transition-colors">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex gap-4 sm:gap-5 items-stretch">
            <div className="flex-1 min-w-0 relative bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col justify-between" style={{ minHeight: 280 }}>
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 text-[48px] sm:text-[64px] leading-none text-[#f0b8b0] font-serif select-none" aria-hidden="true">
                &ldquo;
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start pt-4">
                <div className="flex-shrink-0 flex flex-col items-center gap-1 mx-auto sm:mx-0" style={{ width: 110 }}>
                  <div className="relative" style={{ width: 100, height: 100 }}>
                    <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60 5 C82 5, 110 22, 115 50 C120 78, 100 112, 70 116 C40 120, 8 102, 5 72 C2 42, 20 5, 60 5Z" fill="#f8d8d2" />
                    </svg>
                    <div className="absolute inset-[8px] rounded-full overflow-hidden">
                      <Image src={story.image} alt={`Patient ${story.name}`} fill className="object-cover object-center" />
                    </div>
                  </div>
                  <div className="bg-[#2eaa5e] text-white text-[9px] sm:text-[10px] font-semibold text-center px-2 sm:px-3 py-1 rounded-sm leading-tight -mt-3 relative z-10 w-full max-w-[100px] sm:max-w-[110px]">
                    <span className="block text-[8px] sm:text-[9px] font-normal opacity-80">Patient</span>
                    {story.name}
                  </div>
                </div>

                <p className="flex-1 text-[13px] sm:text-[14px] text-gray-700 leading-relaxed sm:pt-2">
                  {story.text}
                </p>
              </div>

              <div className="flex items-end justify-between mt-4 sm:mt-5">
                <p className="text-[12px] sm:text-[13px] text-gray-400 font-medium">{story.hospital}</p>
                <div className="text-[48px] sm:text-[64px] leading-none text-[#f0b8b0] font-serif select-none" aria-hidden="true">
                  &rdquo;
                </div>
              </div>
            </div>

            <div
              className="hidden lg:flex flex-col justify-between bg-white border border-gray-200 rounded-2xl shadow-sm p-6 overflow-hidden cursor-pointer"
              style={{ width: 120, minHeight: 300, opacity: 0.6 }}
              onClick={next}
              aria-label="Next patient story"
            >
              <div className="text-[48px] leading-none text-[#f0b8b0] font-serif select-none" aria-hidden="true">
                &ldquo;
              </div>
              <div className="relative mx-auto" style={{ width: 80, height: 80 }}>
                <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 3 C55 3, 74 15, 77 33 C80 52, 66 75, 46 77 C26 80, 5 68, 3 48 C1 28, 14 3, 40 3Z" fill="#f8d8d2" />
                </svg>
                <div className="absolute inset-[5px] rounded-full overflow-hidden">
                  <Image src={nextStory.image} alt={`Patient ${nextStory.name}`} fill className="object-cover object-center" />
                </div>
              </div>
              <div className="bg-[#2eaa5e] text-white text-[9px] font-semibold text-center px-2 py-1 rounded-sm leading-tight">
                <span className="block opacity-80">Patient</span>
                {nextStory.name.split(" ").slice(0, 2).join(" ")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center">
            <button onClick={prev} aria-label="Previous story" className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-[#e07060] text-[#e07060] hover:bg-[#fdf4f3] transition-colors">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button onClick={next} aria-label="Next story" className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-[#e07060] text-[#e07060] hover:bg-[#fdf4f3] transition-colors">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact Section ─────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section id="contact" className="w-full bg-[#f8fbfc] py-10 sm:py-14 px-3 sm:px-4 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3a5c] mb-3">Contact Sant Haridas Hospital</h2>
          <p className="text-gray-600 text-[14px] sm:text-[15px] max-w-2xl mx-auto">
            Reach out to us for appointments, enquiries, or emergency assistance. Our team is available to serve you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

          {/* Phone */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1a9fa8]/10 flex items-center justify-center">
              <PhoneIcon color="#1a9fa8" />
            </div>
            <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1a3a5c]">Call Us</h3>
            <div className="flex flex-col gap-2 text-[13px] sm:text-[14px] text-gray-700">
              <a href="tel:+919540740947" className="hover:text-[#1a9fa8] transition-colors">
                <span className="text-gray-500 text-[11px] sm:text-[12px] block">Primary Phone</span>
                +91 95407 40947
              </a>
              <a href="tel:+919868053854" className="hover:text-[#1a9fa8] transition-colors">
                <span className="text-gray-500 text-[11px] sm:text-[12px] block">Mobile</span>
                +91 98680 53854
              </a>
              <a href="https://wa.me/919415057201" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a9fa8] transition-colors flex items-center gap-1.5">
                <WhatsAppIcon />
                <span>+91 94150 57201 (WhatsApp)</span>
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1a9fa8]/10 flex items-center justify-center">
              <EmailIcon color="#1a9fa8" />
            </div>
            <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1a3a5c]">Email Us</h3>
            <div className="text-[13px] sm:text-[14px] text-gray-700">
              <a href="mailto:santharidashospital@gmail.com" className="hover:text-[#1a9fa8] transition-colors break-all">
                santharidashospital@gmail.com
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1a9fa8]/10 flex items-center justify-center">
              <LocationIcon color="#1a9fa8" />
            </div>
            <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1a3a5c]">Visit Us</h3>
            <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed">
              Main, Nangloi – Najafgarh Road,<br />
              Ram Nagar, Najafgarh,<br />
              Delhi – 110043, India
            </p>
          </div>

        </div>

        {/* Conflict note */}
        <p className="mt-6 sm:mt-8 text-center text-[11px] sm:text-[12px] text-gray-400 italic max-w-3xl mx-auto">
          Note: The page contains conflicting contact details in a few places. The WhatsApp/Call button points to +91 94150 57201, while the main contact section lists +91 98680 53854.
        </p>
      </div>
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────────────────────

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/santharidashospital?stkn=MWN5bDAycm9qc2Zqag==",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.5" stroke="url(#ig)" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="url(#ig)" />
        <defs>
          <linearGradient id="ig" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f09433" />
            <stop offset="0.25" stopColor="#e6683c" />
            <stop offset="0.5" stopColor="#dc2743" />
            <stop offset="0.75" stopColor="#cc2366" />
            <stop offset="1" stopColor="#bc1888" />
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
    label: "X (Twitter)",
    href: "https://twitter.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="#000" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4l16 16M4 20L20 4" stroke="#000" strokeWidth="2" strokeLinecap="round" />
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
];

function Footer() {
  return (
    <footer className="w-full bg-[#f0faf5] border-t border-gray-200">
      {/* Map strip */}
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

      {/* Bottom bar */}
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
            {socialLinks.map((s) => (
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
            href="/contact"
            className="mt-1 inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-[11px] sm:text-[12px] font-semibold px-4 py-2 rounded hover:bg-[#122b47] transition-colors"
          >
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
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function SantHaridasHospitalPage() {
  return (
    <>
      <main className="bg-white overflow-hidden">
        <TopBar />
        <MainNav />
        <HeroSection />
        <ServicesSection />
        <HealthBlogsSection />
        <PatientStoriesSection />
        <FeelFreeSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}