"use client";

import { useState } from "react";
import Link from "next/link";

// ── Top Bar ───────────────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-[11px] sm:text-[13px]">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 h-9 sm:h-10 flex items-center justify-center sm:justify-between">
        <div className="hidden sm:flex items-center gap-6"></div>
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="https://wa.me/919540740947"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M11.998 2C6.477 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5.01L2 22l5.118-1.318C8.578 21.527 10.248 22 11.998 22 17.523 22 22 17.523 22 12S17.523 2 11.998 2z" />
            </svg>
            <span className="hidden xs:inline">WhatsApp Us</span>
            <span className="xs:hidden">WhatsApp</span>
          </a>
          <a
            href="tel:+919540740947"
            className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.22 2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">+91 95407 40947</span>
            <span className="sm:hidden">Call</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Nav ──────────────────────────────────────────────────────────────────

const navItems = [
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

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

function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
        <Link href="/" className="flex items-center flex-shrink-0">
          <img
            src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
            alt="Sant Haridas Hospital"
            className="h-9 sm:h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[14px] font-medium transition-colors ${
                item.label === "Contact Us"
                  ? "text-[#1a9fa8]"
                  : "text-[#1a3a5c] hover:text-[#1a9fa8]"
              }`}
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

          <a
            href="tel:+919540740947"
            className="hidden sm:inline-block bg-[#e07030] hover:bg-[#c85f22] text-white text-[12px] sm:text-[13px] font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded transition-colors whitespace-nowrap"
          >
            Book Appointment
          </a>
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
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`py-3 px-2 text-[15px] font-semibold hover:text-[#1a9fa8] border-b border-gray-50 last:border-0 transition-colors ${
                  item.label === "Contact Us" ? "text-[#1a9fa8]" : "text-[#1a3a5c]"
                }`}
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
            <a
              href="tel:+919540740947"
              onClick={() => setMobileOpen(false)}
              className="mt-1 mb-2 bg-[#e07030] hover:bg-[#c85f22] text-white font-semibold text-sm px-5 py-2.5 rounded transition-colors text-center"
            >
              Book an Appointment
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

// ── Hero Banner ───────────────────────────────────────────────────────────────

function HeroBanner() {
  return (
    <section className="w-full bg-[#eaf6f7] border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-gray-500 mb-3 flex-wrap">
          <Link href="/" className="hover:text-[#1a9fa8] transition-colors">Home</Link>
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[#1a3a5c] font-medium">Contact Us</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a3a5c] mb-2">Contact Sant Haridas Hospital | Eye &amp; Gynae Hospital in Najafgarh</h1>
        <p className="text-[14px] sm:text-[15px] text-gray-600 max-w-2xl leading-relaxed">
          We&apos;re here to help. Reach out to us for appointments, enquiries, or emergency
          assistance. Our team is available to serve you with compassion and care.
        </p>
      </div>
    </section>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.22 2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#1a9fa8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#1a9fa8" strokeWidth="1.8" />
      <path d="M2 7l10 7 10-7" stroke="#1a9fa8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-7.5 8-13a8 8 0 10-16 0c0 5.5 8 13 8 13z" stroke="#1a9fa8" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="3" stroke="#1a9fa8" strokeWidth="1.8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#1a9fa8" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="#1a9fa8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppGreenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M11.998 2C6.477 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5.01L2 22l5.118-1.318C8.578 21.527 10.248 22 11.998 22 17.523 22 22 17.523 22 12S17.523 2 11.998 2z" />
    </svg>
  );
}

// ── Contact Info Section ──────────────────────────────────────────────────────

function ContactInfoSection() {
  const cards = [
    {
      icon: <PhoneIcon />,
      title: "Call Us",
      lines: [
        { label: "Phone", value: "+91 95407 40947", href: "tel:+919540740947" },
      ],
    },
    {
      icon: <WhatsAppGreenIcon />,
      title: "WhatsApp",
      lines: [
        { label: "Chat with us", value: "+91 95407 40947", href: "https://wa.me/919540740947" },
        { label: "Availability", value: "Always Available" },
      ],
    },
    {
      icon: <MailIcon />,
      title: "Email Us",
      lines: [
        { label: "General Enquiries", value: "santharidashospital@gmail.com", href: "mailto:santharidashospital@gmail.com" },
      ],
    },
    {
      icon: <MapPinIcon />,
      title: "Visit Us",
      lines: [
        {
          label: "Address",
          value: "Main, Nangloi – Najafgarh Road, Ram Nagar, Najafgarh, Delhi – 110043, India",
        },
      ],
    },
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-12 px-3 sm:px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2">Contact Information</h2>
          <p className="text-[13px] sm:text-[14px] text-gray-500 max-w-2xl mx-auto">
            Reach out through any of the channels below — our team is always here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 flex flex-col gap-4"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#1a9fa8]/10 flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1a3a5c]">{card.title}</h3>
              <div className="flex flex-col gap-2.5">
                {card.lines.map((line, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wide font-medium">
                      {line.label}
                    </span>
                    {line.href ? (
                      <a
                        href={line.href}
                        target={line.href.startsWith("http") ? "_blank" : undefined}
                        rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-[12px] sm:text-[13px] text-[#1a3a5c] hover:text-[#1a9fa8] transition-colors break-words font-medium"
                      >
                        {line.value}
                      </a>
                    ) : (
                      <span className="text-[12px] sm:text-[13px] text-[#1a3a5c] leading-snug font-medium">
                        {line.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Working Hours strip */}
        <div className="mt-5 sm:mt-6 bg-[#f8fafb] border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#1a9fa8]/10 flex items-center justify-center flex-shrink-0">
              <ClockIcon />
            </div>
            <div>
              <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1a3a5c]">Working Hours</h3>
              <p className="text-[12px] sm:text-[13px] text-gray-500">
                OPD services and emergency availability
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 text-center sm:text-left">
            <div>
              <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                OPD Hours
              </p>
              <p className="text-[13px] sm:text-[14px] text-[#1a3a5c] font-semibold">
                Mon – Sat: 9:00 AM – 8:00 PM
              </p>
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">
                Emergency
              </p>
              <p className="text-[13px] sm:text-[14px] text-[#cc0000] font-semibold">
                Always Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Emergency Strip ───────────────────────────────────────────────────────────

function EmergencyStrip() {
  return (
    <section className="w-full bg-[#cc0000] py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M12 8 L12 16 M8 12 L16 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-white text-lg sm:text-xl font-bold">Emergency Helpline</h3>
            <p className="text-white/80 text-[13px] sm:text-[14px]">
              Available round the clock for urgent medical assistance
            </p>
          </div>
        </div>
        <a
          href="tel:+919540740947"
          className="inline-flex items-center gap-2 bg-white text-[#cc0000] hover:bg-gray-100 font-bold text-[14px] sm:text-[15px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.22 2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          +91 95407 40947
        </a>
      </div>
    </section>
  );
}

// ── Map Section ───────────────────────────────────────────────────────────────

function MapSection() {
  return (
    <section className="w-full bg-white py-10 sm:py-12 px-3 sm:px-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2">Find Us on the Map</h2>
          <p className="text-[13px] sm:text-[14px] text-gray-500">
            Main, Nangloi – Najafgarh Road, Ram Nagar, Najafgarh, Delhi – 110043
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            title="Sant Haridas Hospital Location Map"
            src="https://www.google.com/maps?q=Sant+Haridas+Hospital,+Ram+Nagar,+Najafgarh,+Delhi+110043&output=embed"
            width="100%"
            height="360"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Sant+Haridas+Hospital,+Ram+Nagar,+Najafgarh,+Delhi+110043"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#1a3a5c] hover:bg-[#122b47] text-white font-semibold text-[13px] sm:text-[14px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2 L22 12 L12 22 L2 12 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M12 8 L12 16 M8 12 L16 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Get Directions
          </a>
          <a
            href="tel:+919540740947"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#1a9fa8] text-[#1a9fa8] hover:bg-[#1a9fa8] hover:text-white font-semibold text-[13px] sm:text-[14px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.22 2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────

const faqItems = [
  {
    id: "appointment",
    label: "How do I book an appointment?",
    content:
      "You can book an appointment by calling +91 95407 40947, messaging us on WhatsApp at +91 95407 40947, or emailing santharidashospital@gmail.com. You can also visit us directly during OPD hours.",
  },
  {
    id: "hours",
    label: "What are the OPD timings?",
    content:
      "Our OPD services run Monday to Saturday from 9:00 AM to 8:00 PM. Emergency services are available 24 hours a day, 7 days a week.",
  },
  {
    id: "emergency",
    label: "Is emergency care available at all times?",
    content:
      "Yes. Sant Haridas Hospital provides round-the-clock emergency care. For emergencies, please call +91 95407 40947 immediately or visit the hospital directly at Main, Nangloi – Najafgarh Road, Ram Nagar, Najafgarh, Delhi – 110043.",
  },
  {
    id: "directions",
    label: "How do I reach Sant Haridas Hospital?",
    content:
      "Sant Haridas Hospital is located on Main, Nangloi – Najafgarh Road, Ram Nagar, Najafgarh, Delhi – 110043. It is easily accessible by road from Najafgarh, Nangloi, Dwarka, and surrounding areas. Use the 'Get Directions' button above for turn-by-turn navigation.",
  },
];

function AccordionChevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="w-full bg-[#f8fafb] py-10 sm:py-12 px-3 sm:px-4 border-t border-gray-100">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2">Frequently Asked Questions</h2>
          <p className="text-[13px] sm:text-[14px] text-gray-500">
            Quick answers to some of the most common questions about visiting us.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
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

// ── Footer ────────────────────────────────────────────────────────────────────

const aboutSocialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/santharidashospital?stkn=MWN5bDAycm9qc2Zqag==",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-contact)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.5" stroke="url(#ig-contact)" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-contact)" />
        <defs>
          <linearGradient id="ig-contact" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
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
            {aboutSocialLinks.map((s) => (
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
          <a
            href="tel:+919540740947"
            className="mt-1 inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-[11px] sm:text-[12px] font-semibold px-4 py-2 rounded hover:bg-[#122b47] transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.22 2 2 0 012 .04h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Book an Appointment
          </a>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContactPageClient() {
  return (
    <>
      <TopBar />
      <MainNav />
      <main className="min-h-screen bg-white">
        <HeroBanner />
        <ContactInfoSection />
        <EmergencyStrip />
        <MapSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}