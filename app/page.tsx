"use client";

import { useState } from "react";
import Image from "next/image";

// ── SVG Icons (inline, no external deps) ─────────────────────────────────────

function SiteLogo() {
  return (
    <img
      src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
      alt="Sant Haridas Hospital"
      className="h-12 w-auto object-contain"
    />
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

function PhoneIcon({ color = "#fff" }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        fill={color}
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.7.9-.9 1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.4.1-.1.2-.3.3-.4.1-.2.1-.3 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.4.1-.7.3C7.4 8 7 8.9 7 9.9c0 1 .7 2 .8 2.2.1.1 1.5 2.3 3.6 3.2.5.2.9.4 1.2.5.5.2 1 .1 1.3.1.4-.1 1.3-.5 1.5-1s.2-.9.1-1z"
        fill="white"
      />
    </svg>
  );
}

// ── Speciality Icons ──────────────────────────────────────────────────────────

function RoboticSurgeryIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <rect x="6" y="28" width="14" height="12" rx="2" stroke="#1a3a5c" strokeWidth="1.8" />
      <rect x="12" y="20" width="8" height="10" rx="1" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M16 20v-6" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 14h6" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 28v-4h4" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 28v-4h-4" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="13" cy="32" r="2" fill="#1a9fa8" />
      <circle cx="19" cy="32" r="2" fill="#1a9fa8" />
      <path d="M28 18 L38 12 L42 18 L38 24 L28 24 Z" stroke="#1a3a5c" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M28 21l-4 4" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="38" cy="18" r="3" stroke="#1a9fa8" strokeWidth="1.5" />
    </svg>
  );
}

function CardiacIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <path
        d="M24 38s-14-10-14-20a8 8 0 0116 0 8 8 0 0116 0c0 10-14 20-18 20z"
        stroke="#1a3a5c"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 22h6l3-4 3 8 3-4h6" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NeuroscienceIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <circle cx="24" cy="20" r="12" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M24 20 C20 16, 16 18, 16 22 C16 26, 20 28, 24 26" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 20 C28 16, 32 18, 32 22 C32 26, 28 28, 24 26" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 32v8" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 36h8" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function InternalMedicineIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <circle cx="22" cy="16" r="8" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M10 40c0-7 5-12 12-12s12 5 12 12" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="34" cy="34" r="8" fill="white" stroke="#1a9fa8" strokeWidth="1.8" />
      <path d="M34 30v8M30 34h8" stroke="#1a9fa8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CancerCareIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <path d="M24 6 C24 6, 18 12, 18 20 C18 28, 22 34, 24 42 C26 34, 30 28, 30 20 C30 12, 24 6, 24 6Z" stroke="#1a3a5c" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M24 10 C18 14, 12 18, 10 26" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 10 C30 14, 36 18, 38 26" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3" fill="#1a9fa8" />
    </svg>
  );
}

function OrthopaedicsIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <path d="M22 8 C20 8, 18 10, 18 14 L18 20 L14 22 L14 32 L18 34 L18 42" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="22" cy="8" rx="4" ry="5" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M18 22 L26 20 L28 26 L20 28 Z" fill="#e8f4f8" stroke="#1a9fa8" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function NephrologyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <path d="M18 10 C12 10, 8 16, 8 22 C8 30, 14 36, 20 36 C22 36, 24 34, 24 32" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M30 10 C36 10, 40 16, 40 22 C40 30, 34 36, 28 36 C26 36, 24 34, 24 32" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 16 C14 18, 12 22, 14 28" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 16 C34 18, 36 22, 34 28" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ObstetricsIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
      <ellipse cx="24" cy="26" rx="12" ry="14" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M18 20 C18 20, 20 16, 24 16 C28 16, 30 20, 30 20" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 24 C20 24, 22 28, 24 28 C26 28, 28 24, 28 24" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 12 C24 8, 26 6, 28 8" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ── Nav data ──────────────────────────────────────────────────────────────────

const topNavLinks = [];

const mainNavItems = [
  "Doctors",
  "Services",
  "Blogs",
  "About Us",
  "Contact Us",
];

// ── Components ────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-sm">
      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-end gap-6 h-10">
        {topNavLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="hover:underline whitespace-nowrap transition-opacity hover:opacity-80 font-medium"
          >
            {link}
          </a>
        ))}
        <a
          href="#"
          className="flex items-center gap-1.5 hover:underline whitespace-nowrap font-medium"
        >
          <WhatsAppIcon />
          WhatsApp Us (24/7)
        </a>
        <a
          href="tel:+919268880303"
          className="flex items-center gap-1.5 hover:underline whitespace-nowrap font-medium"
        >
          <PhoneIcon />
          +91 926 888 0303 (24/7)
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
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
            <SiteLogo />
        </a>

        {/* Nav items */}
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

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <a
            href="/doctors"
            className="bg-[#e85d26] hover:bg-[#d14e1c] text-white font-semibold text-sm px-5 py-2.5 rounded transition-colors whitespace-nowrap"
          >
            Book an Appointment
          </a>
        </div>
      </div>
    </header>
  );
}

function EmergencyTab() {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex">
      <div
        className="bg-[#cc0000] text-white font-bold text-[11px] tracking-[0.25em] py-4 px-2.5 flex flex-col items-center gap-0 cursor-pointer hover:bg-[#b00000] transition-colors"
        style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
      >
        EMERGENCY
      </div>
    </div>
  );
}

function FloatingPhoneBadge() {
  return (
    <a
      href="tel:+919268880303"
      className="absolute bottom-5 right-5 z-20 flex items-center gap-2.5 bg-[#1a3a5c] hover:bg-[#122b47] text-white rounded-full px-4 py-2.5 shadow-lg transition-colors"
    >
      {/* 24/7 circle */}
      <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
        <span className="text-[11px] font-bold leading-none">24/7</span>
      </div>
      <div className="flex items-center gap-1.5">
        <PhoneIcon />
        <span className="font-semibold text-sm tracking-wide">+91 926 888 0303</span>
      </div>
    </a>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Hospital image */}
      <div className="relative w-full" style={{ height: "calc(100vh - 106px)", minHeight: 480, maxHeight: 680 }}>
        <Image
          src="/hospital-hero.png"
          alt="Sant Haridas Hospital building"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-transparent" />

        {/* Emergency side tab */}
        <EmergencyTab />

        {/* Floating phone badge */}
        <FloatingPhoneBadge />
      </div>
    </section>
  );
}

// ── Doctor Illustration SVG ───────────────────────────────────────────────────

function DoctorIllustration() {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Desk */}
      <rect x="40" y="195" width="240" height="10" rx="3" fill="#c8d8e8" />
      <rect x="55" y="205" width="8" height="40" rx="2" fill="#b0c4d8" />
      <rect x="257" y="205" width="8" height="40" rx="2" fill="#b0c4d8" />

      {/* Monitor */}
      <rect x="130" y="140" width="80" height="56" rx="4" fill="#1a3a5c" />
      <rect x="134" y="144" width="72" height="46" rx="2" fill="#2a5298" />
      {/* screen glow lines */}
      <rect x="140" y="150" width="60" height="4" rx="1" fill="#4a8fd8" opacity="0.7" />
      <rect x="140" y="158" width="48" height="3" rx="1" fill="#4a8fd8" opacity="0.5" />
      <rect x="140" y="165" width="54" height="3" rx="1" fill="#4a8fd8" opacity="0.5" />
      <rect x="140" y="172" width="36" height="3" rx="1" fill="#4a8fd8" opacity="0.3" />
      {/* Monitor stand */}
      <rect x="165" y="196" width="10" height="8" rx="1" fill="#1a3a5c" />
      <rect x="155" y="203" width="30" height="4" rx="2" fill="#1a3a5c" />

      {/* Keyboard */}
      <rect x="135" y="198" width="50" height="8" rx="2" fill="#c8d8e8" />

      {/* Bookshelf background */}
      <rect x="215" y="110" width="70" height="85" rx="3" fill="#d4e4f0" />
      <rect x="220" y="115" width="60" height="12" rx="1" fill="#2a5298" opacity="0.6" />
      <rect x="220" y="130" width="60" height="12" rx="1" fill="#1a9fa8" opacity="0.5" />
      <rect x="220" y="145" width="60" height="12" rx="1" fill="#2a5298" opacity="0.4" />
      <rect x="220" y="160" width="60" height="12" rx="1" fill="#1a9fa8" opacity="0.4" />
      <rect x="220" y="175" width="60" height="12" rx="1" fill="#2a5298" opacity="0.3" />

      {/* Doctor (left figure) - sitting */}
      {/* Body */}
      <rect x="68" y="148" width="38" height="48" rx="6" fill="white" />
      {/* White coat lapels */}
      <path d="M82 148 L87 168 L87 196" stroke="#e0e8f0" strokeWidth="1.5" />
      <path d="M92 148 L87 168" stroke="#e0e8f0" strokeWidth="1.5" />
      {/* Stethoscope */}
      <path d="M80 160 C76 165, 74 172, 78 175 C82 178, 86 174, 87 170" stroke="#1a9fa8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="78" cy="176" r="3" fill="#1a9fa8" />
      {/* Head */}
      <circle cx="87" cy="136" r="14" fill="#f5cba7" />
      {/* Hair */}
      <path d="M73 132 C73 122, 101 122, 101 132" fill="#5d4037" />
      {/* Face */}
      <circle cx="83" cy="135" r="1.5" fill="#333" />
      <circle cx="91" cy="135" r="1.5" fill="#333" />
      <path d="M84 141 Q87 144 90 141" stroke="#c0845a" strokeWidth="1.2" strokeLinecap="round" />
      {/* Arm pointing */}
      <path d="M106 162 L128 155" stroke="#f5cba7" strokeWidth="8" strokeLinecap="round" />
      <path d="M128 155 L140 150" stroke="#f5cba7" strokeWidth="6" strokeLinecap="round" />

      {/* Patient (right figure) - sitting */}
      {/* Body */}
      <rect x="178" y="152" width="36" height="44" rx="6" fill="#d4e4f0" />
      {/* Head */}
      <circle cx="196" cy="138" r="13" fill="#f5cba7" />
      {/* Hair */}
      <path d="M183 132 C183 122, 209 122, 209 132" fill="#333" />
      {/* Face - looking toward doctor */}
      <circle cx="192" cy="137" r="1.5" fill="#333" />
      <circle cx="199" cy="137" r="1.5" fill="#333" />
      <path d="M193 143 Q196 146 199 143" stroke="#c0845a" strokeWidth="1.2" strokeLinecap="round" />
      {/* Arms on desk */}
      <path d="M178 172 L148 185" stroke="#d4e4f0" strokeWidth="8" strokeLinecap="round" />
      <path d="M214 172 L230 185" stroke="#d4e4f0" strokeWidth="8" strokeLinecap="round" />

      {/* Chair backs */}
      <rect x="62" y="148" width="6" height="52" rx="3" fill="#9ab0c4" />
      <rect x="174" y="148" width="6" height="52" rx="3" fill="#9ab0c4" />

      {/* Plant */}
      <rect x="38" y="185" width="6" height="12" rx="1" fill="#6d8b74" />
      <rect x="34" y="193" width="14" height="6" rx="2" fill="#8b6c5c" />
      <ellipse cx="41" cy="182" rx="8" ry="6" fill="#5d8a6b" />
      <ellipse cx="35" cy="178" rx="6" ry="5" fill="#4a7a5a" />
      <ellipse cx="47" cy="179" rx="6" ry="5" fill="#4a7a5a" />

      {/* Clock on wall (top right of card) */}
      <circle cx="270" cy="50" r="22" fill="white" opacity="0.9" />
      <circle cx="270" cy="50" r="20" stroke="#c8d8e8" strokeWidth="2" />
      {/* Clock hands */}
      <path d="M270 50 L270 34" stroke="#1a3a5c" strokeWidth="2" strokeLinecap="round" />
      <path d="M270 50 L282 56" stroke="#1a3a5c" strokeWidth="2" strokeLinecap="round" />
      <circle cx="270" cy="50" r="2.5" fill="#1a3a5c" />
      {/* Clock ticks */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180;
        const x1 = 270 + 16 * Math.cos(rad);
        const y1 = 50 + 16 * Math.sin(rad);
        const x2 = 270 + (i % 3 === 0 ? 12 : 14) * Math.cos(rad);
        const y2 = 50 + (i % 3 === 0 ? 12 : 14) * Math.sin(rad);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9ab0c4" strokeWidth={i % 3 === 0 ? 1.8 : 1} />;
      })}
    </svg>
  );
}

// ── Specialities & Procedures Section ────────────────────────────────────────

const specialities = [
  { name: "Robotic Surgery", icon: <RoboticSurgeryIcon /> },
  { name: "Cancer Care / Oncology", icon: <CancerCareIcon /> },
  { name: "Cardiac Sciences", icon: <CardiacIcon /> },
  { name: "Orthopaedics & Joint Replacement", icon: <OrthopaedicsIcon /> },
  { name: "Neurosciences", icon: <NeuroscienceIcon /> },
  { name: "Nephrology", icon: <NephrologyIcon /> },
  { name: "Internal Medicine", icon: <InternalMedicineIcon /> },
  { name: "Obstetrics And Gynaecology", icon: <ObstetricsIcon /> },
];

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpecialitiesSection() {
  const [activeTab, setActiveTab] = useState<"specialities" | "procedures">("specialities");

  return (
    <section className="w-full bg-white py-12 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-10 items-start">

        {/* ── Left: Specialities list ── */}
        <div className="flex-1 min-w-0">
          {/* Heading */}
          <h2 className="text-2xl font-bold text-[#1a3a5c] border-b-2 border-gray-200 pb-3 mb-5">
            Specialities &amp; Procedures
          </h2>

          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("specialities")}
              className={`pb-3 text-[15px] font-semibold transition-colors relative ${
                activeTab === "specialities"
                  ? "text-[#1a9fa8]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Specialities
              {activeTab === "specialities" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a9fa8] rounded-t-sm" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("procedures")}
              className={`pb-3 text-[15px] font-semibold transition-colors relative ${
                activeTab === "procedures"
                  ? "text-[#1a9fa8]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Procedures
              {activeTab === "procedures" && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1a9fa8] rounded-t-sm" />
              )}
            </button>
          </div>

          {/* Grid of specialities */}
          {activeTab === "specialities" && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {specialities.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="text-[15px] text-[#1a3a5c] font-medium group-hover:text-[#1a9fa8] transition-colors leading-snug">
                    {s.name}
                  </span>
                </a>
              ))}
            </div>
          )}

          {activeTab === "procedures" && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {["Angioplasty", "Bypass Surgery", "Hip Replacement", "Knee Replacement",
                "Cataract Surgery", "Laparoscopy", "MRI Scan", "Dialysis"].map((p) => (
                <a key={p} href="#" className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-[#1a9fa8] flex-shrink-0 ml-5" />
                  <span className="text-[15px] text-[#1a3a5c] font-medium group-hover:text-[#1a9fa8] transition-colors">
                    {p}
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* View all */}
          <a
            href="#"
            className="inline-flex items-center gap-1 mt-8 text-[#1a3a5c] font-semibold text-[15px] hover:text-[#1a9fa8] transition-colors"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* ── Right: Looking for an Expert card ── */}
        <div className="w-full lg:w-[420px] flex-shrink-0">
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ backgroundColor: "#1a9fa8", minHeight: 360 }}
          >
            {/* Text content */}
            <div className="px-8 pt-8 pb-4 relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2 leading-snug">
                Looking for an Expert
              </h3>
              <p className="text-white/85 text-[14px] leading-relaxed mb-6">
                Sant Haridas Hospital is home to some of the<br />eminent doctors in the world.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-[#1a3a5c] hover:bg-[#122b47] text-white font-semibold text-[15px] px-6 py-3 rounded transition-colors"
              >
                Find a Doctor
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Illustration */}
            <div className="relative z-10 px-2 pb-2" style={{ height: 240 }}>
              <DoctorIllustration />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ── Health Blogs Section ─────────────────────────────────────────────────────

const blogPosts = [
  {
    title: "WORLD LUNG\nCANCER DAY",
    subtitle: "United for Awareness,\nPrevention and Early\nDetection",
    fullTitle: "World Lung Cancer Day 2026: United for Awareness, Prevention and Early Detection",
    excerpt:
      "Lung cancer is one of the most widespread and deadliest types of cancer, responsibl...",
    image: "/blog-lung-cancer.png",
    imageAlt: "White ribbon symbolising lung cancer awareness",
  },
  {
    title: "WORLD\nBREASTFEEDING\nWEEK",
    subtitle: "Supporting Healthy\nBeginnings for All",
    fullTitle: "World Breastfeeding Week 2026: Supporting Healthy Beginnings for All",
    excerpt:
      "Despite being one of the most natural and beneficial acts for both mother and child, b...",
    image: "/blog-breastfeeding.png",
    imageAlt: "Mother breastfeeding her newborn baby",
  },
  {
    title: "WATER BORNE\nDISEASES",
    subtitle: "List, Risks, and\nPrevention",
    fullTitle: "Water Borne Diseases- List, Risks, and Prevention",
    excerpt:
      "Do you know why the intake of purified water is emphasized so much? It is because c...",
    image: "/blog-waterborne.png",
    imageAlt: "Microscopic view of waterborne disease pathogens",
  },
];

function HealthBlogsSection() {
  return (
    <section className="w-full bg-white py-12 px-4">
      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-3">
          <h2 className="text-2xl font-bold text-[#1a3a5c] underline decoration-[#1a3a5c] underline-offset-4">
            Health Blogs
          </h2>
          <a
            href="#"
            className="flex items-center gap-1 text-[#1a3a5c] font-semibold text-sm hover:text-[#1a9fa8] transition-colors"
          >
            View all
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Blog cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <a key={post.fullTitle} href="#" className="group flex flex-col">

              {/* Card banner */}
              <div className="relative rounded-lg overflow-hidden bg-[#d6eef2]" style={{ height: 200 }}>

                {/* Left text block */}
                <div className="absolute inset-0 z-10 flex flex-col justify-center pl-5 pr-[46%]">
                  <p className="text-[#1a3a5c] font-bold text-[15px] leading-tight whitespace-pre-line mb-3">
                    {post.title}
                  </p>
                  {/* Teal divider */}
                  <div className="w-10 h-[3px] bg-[#1a9fa8] mb-3" />
                  <p className="text-[#1a3a5c] text-[12px] leading-snug whitespace-pre-line">
                    {post.subtitle}
                  </p>
                </div>

                {/* Teal curved wave overlay */}
                <div className="absolute inset-y-0 right-0 z-10 flex items-center" style={{ width: "52%" }}>
                  <svg
                    viewBox="0 0 120 200"
                    preserveAspectRatio="none"
                    className="absolute left-0 top-0 h-full w-8"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M120 0 C60 50, 60 150, 120 200 L0 200 L0 0 Z" fill="#d6eef2" />
                  </svg>
                </div>

                {/* Photo */}
                <div className="absolute right-0 top-0 bottom-0 z-0" style={{ width: "52%" }}>
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    className="object-cover object-center"
                  />
                  {/* Slight teal tint overlay on the photo */}
                  <div className="absolute inset-0 bg-[#1a9fa8]/10" />
                </div>

                {/* Teal arc border on top-right corner */}
                <svg
                  className="absolute top-0 right-0 z-20"
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M60 0 Q60 60 0 60" stroke="#1a9fa8" strokeWidth="3" fill="none" />
                </svg>
              </div>

              {/* Below card: title link + excerpt */}
              <div className="mt-3 flex flex-col gap-1.5">
                <p className="text-[#1a3a5c] font-semibold text-[13px] leading-snug group-hover:text-[#1a9fa8] transition-colors line-clamp-2">
                  {post.fullTitle}
                </p>
                <p className="text-gray-500 text-[12px] leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

// ── Feel Free To Ask Us Section ──────────────────────��───────────────────────

const faqItems = [
  {
    id: "about",
    label: "About Us",
    content:
      "Sant Haridas Hospital is one of India's foremost providers of comprehensive medical care. We operate a network of hospitals and medical centres committed to delivering world-class treatment with compassion.",
  },
  {
    id: "patient-care",
    label: "Patient Care and Services",
    content:
      "We offer a wide range of patient care services including 24/7 emergency care, outpatient consultations, advanced diagnostics, surgical procedures, rehabilitation, and personalised care programmes tailored to each patient's needs.",
  },
  {
    id: "statutory",
    label: "Statutory Compliances",
    content:
      "Sant Haridas Hospital adheres to all statutory and regulatory requirements prescribed by the relevant health authorities. We maintain full compliance with NABH accreditation standards, clinical governance frameworks, and patient safety norms.",
  },
  {
    id: "clinical",
    label: "Clinical Outcomes",
    content:
      "Our clinical outcomes consistently rank among the best nationally. We track and publish key performance indicators across specialities to ensure transparency, drive continuous improvement, and benchmark against global standards.",
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
    <section className="w-full bg-white py-12 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-10 items-start">

        {/* ── Left: image + input ── */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-5">Feel Free to ask us</h2>

          {/* Photo card */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative w-full" style={{ height: 240 }}>
              <Image
                src="/faq-woman.png"
                alt="Woman in a thinking pose"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Input row */}
            <div className="px-4 py-3 bg-white">
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 focus-within:border-[#1a9fa8] transition-colors">
                <input
                  type="text"
                  placeholder="Ask your question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1 text-[14px] text-gray-600 placeholder-gray-400 outline-none bg-transparent"
                />
                <button
                  aria-label="Submit question"
                  className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-[#1a9fa8] flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: accordion ── */}
        <div className="flex-1 flex flex-col gap-3 pt-[68px]">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-semibold text-[#1a1a1a]">{item.label}</span>
                  <AccordionChevron open={isOpen} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 bg-white">
                    <p className="text-[14px] text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
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

// ── Patient Stories Section ──────────────────────────────────────────────────

const patientStories = [
  {
    name: "Mr. Ronak Singh",
    image: "/patient-ronak.png",
    hospital: "Sant Haridas Hospital, Saket",
    text: "Mr. Ronak Singh successfully underwent Bilateral Total Knee Replacement (BL TKR) under Dr. Bharat Goswami at Sant Haridas Hospital, Saket. With advanced orthopaedic care and structured recovery, he is now moving towards improved mobility, comfort, and everyday activities.",
  },
  {
    name: "Mr. Prabhat Ranjan",
    image: "/patient-prabhat.png",
    hospital: "Sant Haridas Hospital, Patparganj",
    text: "Mr. Prabhat Ranjan was treated for a complex cardiac condition at Sant Haridas Hospital, Patparganj. Thanks to the expert cardiology team and minimally invasive procedures, he recovered swiftly and is now leading a healthy, active life with renewed confidence.",
  },
  {
    name: "Mrs. Sunita Sharma",
    image: "/patient-sunita.png",
    hospital: "Sant Haridas Hospital, Panchsheel Park",
    text: "Mrs. Sunita Sharma came to Sant Haridas Hospital with a challenging oncology case. The multidisciplinary team provided personalised cancer care combining the latest therapies, and she has completed her treatment with excellent clinical outcomes and a positive quality of life.",
  },
];

function PatientStoriesSection() {
  const [current, setCurrent] = useState(0);
  const total = patientStories.length;

  function prev() { setCurrent((c) => (c - 1 + total) % total); }
  function next() { setCurrent((c) => (c + 1) % total); }

  // visible: current and partially next
  const story = patientStories[current];
  const nextStory = patientStories[(current + 1) % total];

  return (
    <section className="w-full bg-white py-14 px-4 overflow-hidden">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-10 items-start">

        {/* ── Left: heading + button ── */}
        <div className="w-full lg:w-[220px] flex-shrink-0 flex flex-col gap-6 pt-10">
          <h2 className="text-2xl font-bold text-[#1a1a1a] leading-snug">
            Our Patient&apos;s Stories
          </h2>
          <a
            href="#"
            className="inline-flex items-center justify-center w-[140px] border-2 border-[#e07060] text-[#e07060] font-semibold text-[14px] rounded px-5 py-2.5 hover:bg-[#fdf4f3] transition-colors"
          >
            View all
          </a>
        </div>

        {/* ── Right: carousel ── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Top nav arrows */}
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={prev}
              aria-label="Previous story"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e07060] text-[#e07060] hover:bg-[#fdf4f3] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next story"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e07060] text-[#e07060] hover:bg-[#fdf4f3] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Cards row */}
          <div className="flex gap-5 items-stretch">
            {/* Main card */}
            <div className="flex-1 min-w-0 relative bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between" style={{ minHeight: 300 }}>
              {/* Opening quote */}
              <div className="absolute top-5 left-5 text-[64px] leading-none text-[#f0b8b0] font-serif select-none" aria-hidden="true">
                &ldquo;
              </div>

              {/* Content row */}
              <div className="flex gap-6 items-start pt-4">
                {/* Patient photo with blob border */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1" style={{ width: 130 }}>
                  <div className="relative" style={{ width: 120, height: 120 }}>
                    {/* Pink organic blob background */}
                    <svg
                      viewBox="0 0 120 120"
                      className="absolute inset-0 w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M60 5 C82 5, 110 22, 115 50 C120 78, 100 112, 70 116 C40 120, 8 102, 5 72 C2 42, 20 5, 60 5Z"
                        fill="#f8d8d2"
                      />
                    </svg>
                    {/* Circular clipped photo */}
                    <div className="absolute inset-[8px] rounded-full overflow-hidden">
                      <Image
                        src={story.image}
                        alt={`Patient ${story.name}`}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                  {/* Green name label */}
                  <div className="bg-[#2eaa5e] text-white text-[10px] font-semibold text-center px-3 py-1 rounded-sm leading-tight -mt-3 relative z-10 w-full max-w-[110px]">
                    <span className="block text-[9px] font-normal opacity-80">Patient</span>
                    {story.name}
                  </div>
                </div>

                {/* Testimonial text */}
                <p className="flex-1 text-[14px] text-gray-700 leading-relaxed pt-2">
                  {story.text}
                </p>
              </div>

              {/* Hospital + closing quote row */}
              <div className="flex items-end justify-between mt-5">
                <p className="text-[13px] text-gray-400 font-medium">{story.hospital}</p>
                <div className="text-[64px] leading-none text-[#f0b8b0] font-serif select-none" aria-hidden="true">
                  &rdquo;
                </div>
              </div>
            </div>

            {/* Partially visible next card */}
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
                  <Image
                    src={nextStory.image}
                    alt={`Patient ${nextStory.name}`}
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>
              <div className="bg-[#2eaa5e] text-white text-[9px] font-semibold text-center px-2 py-1 rounded-sm leading-tight">
                <span className="block opacity-80">Patient</span>
                {nextStory.name.split(" ").slice(0, 2).join(" ")}
              </div>
            </div>
          </div>

          {/* Bottom nav arrows */}
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={prev}
              aria-label="Previous story"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e07060] text-[#e07060] hover:bg-[#fdf4f3] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next story"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e07060] text-[#e07060] hover:bg-[#fdf4f3] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
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
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17 2h-3a5 5 0 00-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
          stroke="#1877f2"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="#000" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4l16 16M4 20L20 4" stroke="#000" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
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

        {/* Stay in touch */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[11px] font-bold tracking-widest text-[#1a3a5c] uppercase">Stay in Touch</p>
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <p className="text-[12px] text-gray-500">
            &copy; {new Date().getFullYear()} Sant Haridas Hospital. All Rights Reserved.
          </p>
        </div>

        {/* Right: contact info */}
        <div className="flex flex-col items-end gap-1.5 text-right">
          <p className="text-[12px] font-semibold text-[#1a3a5c]">24/7 Emergency</p>
          <a href="tel:+919268880303" className="text-[15px] font-bold text-[#1a9fa8] hover:text-[#1a3a5c] transition-colors">
            +91 926 888 0303
          </a>
          <a
            href="#"
            className="mt-1 inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-[12px] font-semibold px-4 py-2 rounded hover:bg-[#122b47] transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M1 6h14" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="5" cy="9.5" r="1" fill="currentColor" />
              <circle cx="8" cy="9.5" r="1" fill="currentColor" />
            </svg>
            Book an Appointment
          </a>
        </div>

      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MaxHealthcarePage() {
  return (
    <>
      <main className="bg-white overflow-hidden">
        <TopBar />
        <MainNav />
        <HeroSection />
        <SpecialitiesSection />
        <HealthBlogsSection />
        <PatientStoriesSection />
        <FeelFreeSection />
      </main>
      <Footer />
    </>
  );
}
