"use client";

import { useState } from "react";
import Image from "next/image";

// ── Top Bar ───────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-[13px]">
      <div className="max-w-[1200px] mx-auto px-4 h-10 flex items-center justify-between">
        <div className="flex items-center gap-6"></div>
        <div className="flex items-center gap-4">
          <a href="tel:+919268880303" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.22 2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            +91 926 888 0303 (24/7)
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Nav ──────────────────────────────────────────────────────────────────

const navItems = ["Doctors", "Services", "Blogs", "About Us", "Contact Us"];

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
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <a href="/" className="flex items-center flex-shrink-0">
          <img
            src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
            alt="Sant Haridas Hospital"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item}
              href={getNavLink(item)}
              className="text-[14px] font-medium text-[#1a3a5c] hover:text-[#1a9fa8] transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <a
            href="/doctors"
            className="bg-[#e07030] hover:bg-[#c85f22] text-white text-[13px] font-semibold px-5 py-2.5 rounded transition-colors whitespace-nowrap"
          >
            Book an Appointment
          </a>
        </div>
      </div>
    </header>
  );
}

// ── About Hero Banner ─────────────────────────────────────────────────────────

function AboutHeroBanner() {
  // Diamond grid images – each diamond is a rotated square clipped to show a photo
  const diamonds = [
    { src: "/about-hero-1.png", alt: "Doctor with tablet", x: 42, y: 3, size: 52 },
    { src: "/about-hero-2.png", alt: "Doctor on laptop", x: 52, y: 23, size: 56 },
    { src: "/about-hero-3.png", alt: "Doctor with stethoscope", x: 72, y: 5, size: 48 },
    { src: "/about-hero-4.png", alt: "Medical team", x: 80, y: 30, size: 44 },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#e8f4f8]" style={{ height: 320 }}>
      {/* Subtle background wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-10" />

      {/* Diamond photo collage – rendered as rotated + clipped divs */}
      <div className="absolute inset-0 z-0">
        {diamonds.map((d, i) => (
          <div
            key={i}
            className="absolute overflow-hidden"
            style={{
              width: `${d.size * 0.9}%`,
              aspectRatio: "1",
              left: `${d.x}%`,
              top: `${d.y}%`,
              transform: "rotate(45deg)",
              border: "3px solid white",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotate(-45deg) scale(1.5)",
                transformOrigin: "center",
              }}
            >
              <Image
                src={d.src}
                alt={d.alt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}

        {/* Plus / cross decorative marks */}
        {[
          { x: 47, y: 18 }, { x: 62, y: 8 }, { x: 68, y: 28 },
          { x: 78, y: 15 }, { x: 85, y: 42 }, { x: 55, y: 48 },
        ].map((pos, i) => (
          <svg
            key={i}
            className="absolute text-white/80"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: 18, height: 18 }}
            viewBox="0 0 18 18"
            fill="none"
          >
            <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ))}
      </div>

      {/* Text content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-10 max-w-[480px]">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-5 shadow-sm">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Sant Haridas Hospital</h1>
          <p className="text-[14px] text-gray-600">
            Leading Integrated Healthcare Services Provider in India
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────

function HospitalIcon() {
  return (
    <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="14" width="30" height="22" rx="2" stroke="#b8860b" strokeWidth="1.8" />
      <path d="M5 22h30" stroke="#b8860b" strokeWidth="1.5" />
      <rect x="15" y="28" width="10" height="8" rx="1" stroke="#b8860b" strokeWidth="1.5" />
      <path d="M1 36h38" stroke="#b8860b" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 4v10M15 9h10" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BedIcon() {
  return (
    <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 26V14" stroke="#1a6fa8" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 22h32v8H4z" stroke="#1a6fa8" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 26h32" stroke="#1a6fa8" strokeWidth="1.5" />
      <rect x="16" y="16" width="20" height="6" rx="2" stroke="#1a6fa8" strokeWidth="1.5" />
      <circle cx="10" cy="19" r="3" stroke="#1a6fa8" strokeWidth="1.5" />
      <path d="M2 32h36" stroke="#1a6fa8" strokeWidth="2" strokeLinecap="round" />
      {/* Plus on pillow */}
      <path d="M24 18v2M23 19h2" stroke="#1a6fa8" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function DoctorBadgeIcon() {
  return (
    <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="14" r="7" stroke="#8b4566" strokeWidth="1.8" />
      <path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#8b4566" strokeWidth="1.8" strokeLinecap="round" />
      {/* stethoscope badge */}
      <circle cx="30" cy="30" r="8" fill="white" stroke="#8b4566" strokeWidth="1.5" />
      <path d="M27 28c0-1.5 1.2-2.5 3-2.5s3 1 3 2.5c0 2-1.5 3.5-3 4.5" stroke="#8b4566" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="30" cy="33" r="1" fill="#8b4566" />
    </svg>
  );
}

const stats = [
  {
    bg: "bg-[#f0ecf8]",
    content: (
      <div className="flex flex-col justify-center h-full px-6">
        <p className="text-[18px] font-bold text-[#3a2a5c] leading-tight">
          4 JCI &amp; 33 NABH
        </p>
        <p className="text-[18px] font-bold text-[#3a2a5c] leading-tight">
          ACCREDITED HOSPITALS
        </p>
      </div>
    ),
  },
  {
    bg: "bg-[#fdf8ec]",
    content: (
      <div className="flex items-center gap-4 px-6 h-full">
        <HospitalIcon />
        <div>
          <p className="text-[28px] font-bold text-[#1a1a1a] leading-none">36</p>
          <p className="text-[13px] text-gray-600 mt-0.5">Healthcare Facilities</p>
        </div>
      </div>
    ),
  },
  {
    bg: "bg-[#eaf4fb]",
    content: (
      <div className="flex items-center gap-4 px-6 h-full">
        <BedIcon />
        <div>
          <p className="text-[28px] font-bold text-[#1a1a1a] leading-none">6,000+</p>
          <p className="text-[13px] text-gray-600 mt-0.5">Operational Beds</p>
        </div>
      </div>
    ),
  },
  {
    bg: "bg-[#fdf0f4]",
    content: (
      <div className="flex items-center gap-4 px-6 h-full">
        <DoctorBadgeIcon />
        <div>
          <p className="text-[28px] font-bold text-[#1a1a1a] leading-none">17,900+</p>
          <p className="text-[13px] text-gray-600 mt-0.5">Healthcare professionals</p>
        </div>
      </div>
    ),
  },
];

function StatsBar() {
  return (
    <section className="w-full py-8 px-4 bg-white">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} rounded-xl border border-white/60 shadow-sm`}
            style={{ height: 100 }}
          >
            {stat.content}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── About Us Text Section ─────────────────────────────────────────────────────

function AboutUsText() {
  return (
    <section className="w-full bg-white py-8 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">About Us</h2>
        <p className="text-[14px] text-gray-700 leading-relaxed max-w-[900px]">
          <strong>Sant Haridas Hospital</strong> is a leading integrated healthcare delivery
          service provider in India. The healthcare verticals of the company primarily comprise
          hospitals, diagnostics, and day care specialty facilities. Currently, the company
          operates 36 healthcare facilities (including JVs and O&amp;M facilities) across 12
          states. The Hospital&apos;s network comprises over 6,000 operational beds (including
          O&amp;M beds) and 400 diagnostics labs.
        </p>
      </div>
    </section>
  );
}

// ── Vision & Mission Section ──────────────────────────────────────────────────

function VisionIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle */}
      <circle cx="32" cy="32" r="22" stroke="#8b6fb5" strokeWidth="1.8" />
      {/* Middle circle */}
      <circle cx="32" cy="32" r="14" stroke="#8b6fb5" strokeWidth="1.5" />
      {/* Inner circle */}
      <circle cx="32" cy="32" r="6" stroke="#8b6fb5" strokeWidth="1.5" />
      {/* Arrow/checkmark hitting the target */}
      <path
        d="M44 20 L36 28"
        stroke="#c084d0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M38 20 L44 20 L44 26"
        stroke="#c084d0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MissionIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
      {/* Hand (palm up) */}
      <path
        d="M12 38 C12 34, 14 30, 18 29 L26 28 C28 27.5, 30 28, 30 30 L30 34"
        stroke="#b07ac8"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 34 L44 34 C46 34, 48 36, 46 38 L36 42 C32 44, 26 44, 22 42 L12 38"
        stroke="#b07ac8"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Fingers suggestion */}
      <path d="M34 34 L34 30 C34 28, 36 27, 38 28 L38 34" stroke="#b07ac8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 34 L38 30 C38 28, 40 27, 42 28 L42 34" stroke="#b07ac8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Globe */}
      <circle cx="34" cy="20" r="10" stroke="#8b6fb5" strokeWidth="1.8" />
      {/* Globe latitude lines */}
      <path d="M24 20 Q29 16, 34 20 Q39 24, 44 20" stroke="#8b6fb5" strokeWidth="1.2" fill="none" />
      <path d="M24 20 Q29 24, 34 20 Q39 16, 44 20" stroke="#8b6fb5" strokeWidth="1.2" fill="none" />
      {/* Globe vertical line */}
      <path d="M34 10 Q37 15, 37 20 Q37 25, 34 30" stroke="#8b6fb5" strokeWidth="1.2" fill="none" />
      <path d="M34 10 Q31 15, 31 20 Q31 25, 34 30" stroke="#8b6fb5" strokeWidth="1.2" fill="none" />
      {/* Globe horizontal divider */}
      <path d="M24 20 h20" stroke="#8b6fb5" strokeWidth="1.2" />
    </svg>
  );
}

function VisionMissionSection() {
  const cards = [
    {
      icon: <VisionIcon />,
      title: "Vision",
      text: "To create a world-class integrated healthcare delivery system in India, entailing the finest medical skills combined with compassionate patient care.",
    },
    {
      icon: <MissionIcon />,
      title: "Mission",
      text: "To be a globally respected healthcare organisation known for Clinical Excellence and Distinctive Patient Care.",
    },
  ];

  return (
    <section className="w-full bg-[#fafafa] py-12 px-4">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-gray-200 rounded-2xl flex flex-col items-center text-center px-10 py-10 shadow-sm"
          >
            {/* Icon */}
            <div className="mb-4">{card.icon}</div>

            {/* Title */}
            <h3 className="text-[17px] font-bold text-[#7c55b0] mb-5">
              {card.title}
            </h3>

            {/* Divider */}
            <div className="w-10 h-[2px] bg-gray-200 mb-5" />

            {/* Body text */}
            <p className="text-[14px] text-gray-600 leading-relaxed max-w-[360px]">
              {card.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Our Values Section ────────────────────────────────────────────────────────

function PatientCentricityIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      {/* Three people */}
      <circle cx="28" cy="16" r="5" stroke="#8b6fb5" strokeWidth="1.8" />
      <circle cx="14" cy="20" r="4" stroke="#b07ac8" strokeWidth="1.6" />
      <circle cx="42" cy="20" r="4" stroke="#b07ac8" strokeWidth="1.6" />
      {/* Center body */}
      <path d="M20 36c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" />
      {/* Left body */}
      <path d="M8 38c0-3.314 2.686-6 6-6" stroke="#b07ac8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Right body */}
      <path d="M48 38c0-3.314-2.686-6-6-6" stroke="#b07ac8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Circular arrows around the group */}
      <path d="M10 28 A20 20 0 0 1 46 28" stroke="#8b6fb5" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 2" />
      <path d="M46 30 A20 20 0 0 1 10 30" stroke="#8b6fb5" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 2" />
      {/* Arrow heads */}
      <path d="M10 28 l-2-3 3 0" stroke="#8b6fb5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M46 30 l2 3-3 0" stroke="#8b6fb5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IntegrityIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      {/* Document / certificate */}
      <rect x="16" y="8" width="24" height="28" rx="3" stroke="#8b6fb5" strokeWidth="1.8" />
      <path d="M22 16h12M22 21h12M22 26h8" stroke="#b07ac8" strokeWidth="1.4" strokeLinecap="round" />
      {/* Seal / badge on certificate */}
      <circle cx="34" cy="30" r="6" fill="white" stroke="#8b6fb5" strokeWidth="1.5" />
      <path d="M31 30l2 2 4-4" stroke="#8b6fb5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Handshake below */}
      <path d="M12 44 C14 40, 18 38, 22 40 L28 42 L34 40 C38 38, 42 40, 44 44" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 40 L28 42 L34 40" stroke="#b07ac8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TeamworkIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      {/* Three people silhouettes */}
      <circle cx="16" cy="18" r="5" stroke="#8b6fb5" strokeWidth="1.8" />
      <circle cx="40" cy="18" r="5" stroke="#8b6fb5" strokeWidth="1.8" />
      <circle cx="28" cy="14" r="6" stroke="#8b6fb5" strokeWidth="1.8" />
      {/* Bodies */}
      <path d="M8 38c0-4.418 3.582-8 8-8" stroke="#8b6fb5" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M40 30c4.418 0 8 3.582 8 8" stroke="#8b6fb5" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 40c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" />
      {/* Plus badge */}
      <circle cx="42" cy="36" r="8" fill="white" stroke="#8b6fb5" strokeWidth="1.6" />
      <path d="M42 32v8M38 36h8" stroke="#8b6fb5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OwnershipIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      {/* Person standing */}
      <circle cx="28" cy="14" r="6" stroke="#8b6fb5" strokeWidth="1.8" />
      <path d="M28 20 L28 38" stroke="#8b6fb5" strokeWidth="2" strokeLinecap="round" />
      {/* Arms raised */}
      <path d="M18 28 L28 24 L38 28" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Legs */}
      <path d="M28 38 L22 48" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 38 L34 48" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" />
      {/* Flag pole */}
      <path d="M38 10 L38 28" stroke="#b07ac8" strokeWidth="1.8" strokeLinecap="round" />
      {/* Flag */}
      <path d="M38 10 L50 15 L38 20 Z" fill="#e0c8f0" stroke="#b07ac8" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function InnovationIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      {/* Lightbulb */}
      <path d="M28 10 C20 10, 16 16, 16 22 C16 27, 19 30, 22 33 L22 38 L34 38 L34 33 C37 30, 40 27, 40 22 C40 16, 36 10, 28 10 Z" stroke="#8b6fb5" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Bulb base lines */}
      <path d="M22 38h12M23 42h10M25 46h6" stroke="#8b6fb5" strokeWidth="1.5" strokeLinecap="round" />
      {/* Gear overlaid on bulb */}
      <circle cx="28" cy="24" r="5" stroke="#b07ac8" strokeWidth="1.4" />
      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 28 + 5.5 * Math.cos(rad);
        const y1 = 24 + 5.5 * Math.sin(rad);
        const x2 = 28 + 7.5 * Math.cos(rad);
        const y2 = 24 + 7.5 * Math.sin(rad);
        return (
          <line
            key={deg}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#b07ac8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      {/* Shine rays */}
      <path d="M28 4 L28 6" stroke="#b07ac8" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M40 8 L39 10" stroke="#b07ac8" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 8 L17 10" stroke="#b07ac8" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M44 20 L42 20" stroke="#b07ac8" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 20 L14 20" stroke="#b07ac8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ExcellenceIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-14 h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      {/* Trophy cup */}
      <path
        d="M20 10 L36 10 L36 28 C36 34, 32 38, 28 38 C24 38, 20 34, 20 28 Z"
        stroke="#8b6fb5"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Trophy handles */}
      <path d="M20 14 C14 14, 12 18, 12 22 C12 26, 15 28, 20 28" stroke="#b07ac8" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M36 14 C42 14, 44 18, 44 22 C44 26, 41 28, 36 28" stroke="#b07ac8" strokeWidth="1.6" strokeLinecap="round" />
      {/* Stem */}
      <path d="M28 38 L28 44" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" />
      {/* Base */}
      <path d="M22 44 L34 44" stroke="#8b6fb5" strokeWidth="2" strokeLinecap="round" />
      {/* Star inside trophy */}
      <path
        d="M28 16 L29.8 21.4 L35.5 21.4 L31 24.6 L32.8 30 L28 26.8 L23.2 30 L25 24.6 L20.5 21.4 L26.2 21.4 Z"
        stroke="#b07ac8"
        strokeWidth="1.2"
        fill="#e0c8f0"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Chevron bullet used in value lists
function ValueBullet() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2l5 4-5 4" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type ValueItem = {
  icon: React.ReactNode;
  title: string;
  points: { highlight: string; rest: string }[];
};

const values: ValueItem[] = [
  {
    icon: <PatientCentricityIcon />,
    title: "Patient Centricity",
    points: [
      { highlight: "Commit to 'best outcomes and experience'", rest: " for our patients" },
      { highlight: "Treat patients and their caregivers", rest: " with compassion, care" },
      { highlight: "Our patients' needs will come first", rest: "" },
    ],
  },
  {
    icon: <IntegrityIcon />,
    title: "Integrity",
    points: [
      { highlight: "Be principled, open and honest", rest: "" },
      { highlight: "Model and live our 'Values'", rest: "" },
      { highlight: "Demonstrate moral courage to", rest: " speak up and do the right things" },
    ],
  },
  {
    icon: <TeamworkIcon />,
    title: "Teamwork",
    points: [
      { highlight: "Proactively support each other and", rest: " operate as one team" },
      { highlight: "Respect and value people at all levels", rest: " with different opinions, experiences and backgrounds" },
      { highlight: "Demonstrate moral courage to", rest: " speak up and do the right things" },
    ],
  },
  {
    icon: <OwnershipIcon />,
    title: "Ownership",
    points: [
      { highlight: "Be responsible and take pride in our", rest: " actions" },
      { highlight: "Take initiative and go beyond the call", rest: " of duty" },
      { highlight: "Deliver commitment and agreement", rest: " made." },
    ],
  },
  {
    icon: <InnovationIcon />,
    title: "Innovation",
    points: [
      { highlight: "Continuously improve and innovate", rest: " to exceed expectations" },
      { highlight: "Adopt a 'can-do' attitude", rest: "" },
      { highlight: "Challenge ourselves to do things", rest: " differently." },
    ],
  },
  {
    icon: <ExcellenceIcon />,
    title: "Excellence",
    points: [
      { highlight: "Strive for the highest standards", rest: " in everything we do" },
      { highlight: "Pursue continuous learning", rest: " and professional growth" },
      { highlight: "Measure outcomes and celebrate", rest: " achievements that inspire." },
    ],
  },
];

function ValueCard({ value }: { value: ValueItem }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-7 flex flex-col gap-5">
      {/* Icon + Title row */}
      <div className="flex items-center gap-4">
        {value.icon}
        <h3 className="text-[17px] font-bold text-[#1a1a1a]">{value.title}</h3>
      </div>
      {/* Bullet points */}
      <ul className="flex flex-col gap-2.5">
        {value.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2">
            <ValueBullet />
            <span className="text-[13px] leading-snug">
              <span className="text-[#1a6fa8] font-medium">{pt.highlight}</span>
              <span className="text-gray-600">{pt.rest}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OurValuesSection() {
  return (
    <section className="w-full bg-white py-12 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8">Our Values</h2>

        {/* 3 × 2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {values.map((v) => (
            <ValueCard key={v.title} value={v} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Feel Free To Ask Us Section ──────────────────────────────────────────────

const faqItems = [
  {
    id: "about",
    label: "About Us",
    content:
      "Sant Haridas Hospital is one of India's foremost providers of comprehensive medical care. We operate a network of hospitals and medical centres across North India, committed to delivering world-class treatment with compassion.",
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

        {/* Left: image + input */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-5">Feel Free to ask us</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative w-full" style={{ height: 240 }}>
              <Image
                src="/faq-woman.png"
                alt="Woman in a thinking pose"
                fill
                className="object-cover object-top"
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

        {/* Right: accordion */}
        <div className="flex-1 flex flex-col gap-3 pt-[68px]">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
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

// ── Footer ────────────────────────────────────────────────────────────────────

const aboutSocialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-about)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.5" stroke="url(#ig-about)" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-about)" />
        <defs>
          <linearGradient id="ig-about" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
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

function AboutFooter() {
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
            {aboutSocialLinks.map((s) => (
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

export default function AboutPage() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <TopBar />
        <MainNav />
        <AboutHeroBanner />
        <StatsBar />
        <AboutUsText />
        <VisionMissionSection />
        <OurValuesSection />
        <FeelFreeSection />
      </main>
      <AboutFooter />
    </>
  );
}
