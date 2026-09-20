"use client";

import { useState } from "react";
import Image from "next/image";
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
                item.label === "About Us"
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

          <Link
            href="/book-appointment"
            className="hidden sm:inline-block bg-[#e07030] hover:bg-[#c85f22] text-white text-[12px] sm:text-[13px] font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded transition-colors whitespace-nowrap"
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
          <div className="max-w-[1200px] mx-auto px-3 sm:px-4 py-2 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`py-3 px-2 text-[15px] font-semibold hover:text-[#1a9fa8] border-b border-gray-50 last:border-0 transition-colors ${
                  item.label === "About Us" ? "text-[#1a9fa8]" : "text-[#1a3a5c]"
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
            <Link
              href="/book-appointment"
              onClick={() => setMobileOpen(false)}
              className="mt-1 mb-2 bg-[#e07030] hover:bg-[#c85f22] text-white font-semibold text-sm px-5 py-2.5 rounded transition-colors text-center"
            >
              Book an Appointment
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

// ── About Hero Banner ─────────────────────────────────────────────────────────

function AboutHeroBanner() {
  const diamonds = [
    {
      src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
      alt: "Doctor with tablet",
      x: 42, y: 3, size: 52,
    },
    {
      src: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=400&q=80",
      alt: "Doctor on laptop",
      x: 52, y: 23, size: 56,
    },
    {
      src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80",
      alt: "Doctor with stethoscope",
      x: 72, y: 5, size: 48,
    },
    {
      src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=400&q=80",
      alt: "Medical team",
      x: 80, y: 30, size: 44,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#e8f4f8]" style={{ height: 320 }}>
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent z-10" />

      <div className="absolute inset-0 z-0">
        {diamonds.map((d, i) => (
          <div
            key={i}
            className="absolute overflow-hidden hidden sm:block"
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
              <Image src={d.src} alt={d.alt} fill className="object-cover" unoptimized />
            </div>
          </div>
        ))}

        {[
          { x: 47, y: 18 }, { x: 62, y: 8 }, { x: 68, y: 28 },
          { x: 78, y: 15 }, { x: 85, y: 42 }, { x: 55, y: 48 },
        ].map((pos, i) => (
          <svg
            key={i}
            className="absolute text-white/80 hidden sm:block"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: 18, height: 18 }}
            viewBox="0 0 18 18"
            fill="none"
          >
            <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ))}
      </div>

      <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-10 max-w-[520px]">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-5 sm:px-6 py-4 sm:py-5 shadow-sm">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2">About Sant Haridas Hospital | Eye &amp; Gynae Hospital in Najafgarh</h1>
          <p className="text-[13px] sm:text-[14px] text-gray-600">
            Compassionate Multi-Speciality Healthcare in Najafgarh, Delhi
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Founder Section ───────────────────────────────────────────────────────────

interface FounderData {
  id: string;
  name: string;
  affiliation: string;
  specialization: string;
  roleBadge: string;
  image: string;
  aboutShort: string;
  aboutFull: string;
  qualifications: string;
  slug?: string;
}

const foundersData: FounderData[] = [
  {
    id: "dr-prateek-sehrawat",
    name: "Dr. Prateek Sehrawat",
    affiliation: "MBBS, MS (Ophthalmology) | Sant Haridas Hospital",
    specialization: "Ophthalmologist",
    roleBadge: "Founder & Consultant",
    image: "https://res.cloudinary.com/df01whs60/image/upload/v1787725729/copy_of_whatsapp_image_2026-08-26_at_115606_am_p3brxu.jpg",
    aboutShort: "Consultant ophthalmologist specializing in cataracts, glaucoma, macular degeneration, diabetic retinopathy, and refractive errors. Graduate of University College Of Medical Sciences and Lady Hardinge Medical College, Del...",
    aboutFull: "Consultant ophthalmologist specializing in cataracts, glaucoma, macular degeneration, diabetic retinopathy, and refractive errors. Graduate of University College Of Medical Sciences and Lady Hardinge Medical College, Delhi. Dr. Prateek brings extensive surgical expertise in modern cataract micro-surgery, glaucoma management, diabetic eye care, and visual rehabilitation, committed to providing compassionate, accessible, and high-precision clinical eye care to every patient.",
    qualifications: "MBBS, MS (Ophthalmology)",
    slug: "dr-prateek-sehrawat",
  },
  {
    id: "dr-mayura-baliyan",
    name: "Dr. Mayura Baliyan",
    affiliation: "MBBS, MS (Lady Hardinge Medical College, Delhi) | Sant Haridas Hospital",
    specialization: "Gynecologist",
    roleBadge: "Founder & Consultant",
    image: "https://res.cloudinary.com/df01whs60/image/upload/v1787725884/WhatsApp_Image_2026-08-26_at_11.56.31_AM_wh2ge0.jpg",
    aboutShort: "Highly experienced consultant obstetrics and gynaecology. Specializes in Adolescent Health and vaccination, Pregnancy Care (Antenatal, Delivery - normal and Cesarean, postnatal care), Reproductive Health (Infertility, Fa...",
    aboutFull: "Highly experienced consultant obstetrics and gynaecology. Specializes in Adolescent Health and vaccination, Pregnancy Care (Antenatal, Delivery - normal and Cesarean, postnatal care), Reproductive Health (Infertility, Family Planning), Gynaecology Problems (PCOS, Menstruation Abnormality, Vaginal Infection, Uterus and Ovaries related problems), Menopause and Beyond, Cancer Screening (Pap Smear), and Laparoscopic Gynae Surgery. Gained MBBS and MS degrees from prestigious Lady Hardinge Medical College, Delhi. Worked as senior resident at Government Medical College, Kota and ESIC Hospital Rohini, Delhi.",
    qualifications: "MBBS, MS (Lady Hardinge Medical College, Delhi)",
    slug: "dr-mayura-baliyan",
  },
];

function FounderCard({ founder }: { founder: FounderData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row">
      {/* ── Image Holder ── */}
      <div className="md:w-64 lg:w-72 bg-gradient-to-b from-[#eaf6f7] to-[#d8eff2] p-5 sm:p-6 flex flex-col items-center justify-center flex-shrink-0 relative border-b md:border-b-0 md:border-r border-gray-100">
        <div className="relative w-44 h-52 sm:w-48 sm:h-56 rounded-2xl overflow-hidden shadow-md border-4 border-white bg-gray-100 flex items-center justify-center">
          {!imgError && founder.image ? (
            <Image
              src={founder.image}
              alt={founder.name}
              fill
              className="object-cover object-top"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4 text-gray-400">
              <svg className="w-16 h-16 mb-2 text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-semibold text-gray-500">Image Holder</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Photo Slot</span>
            </div>
          )}
          <span className="absolute bottom-2 left-2 right-2 text-center bg-[#1a3a5c]/85 backdrop-blur-xs text-white text-[10px] font-semibold py-0.5 px-2 rounded-md shadow-xs">
            Sant Haridas Hospital
          </span>
        </div>
        <div className="mt-3 text-center">
          <span className="inline-block bg-white text-[#1a9fa8] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs border border-[#1a9fa8]/20">
            {founder.roleBadge}
          </span>
        </div>
      </div>

      {/* ── Details Column ── */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
              {founder.name}
            </h3>
            <span className="inline-flex items-center gap-1.5 bg-[#eaf6f7] text-[#1a9fa8] font-bold text-xs px-3 py-1 rounded-full border border-[#1a9fa8]/30">
              {founder.specialization}
            </span>
          </div>

          <p className="text-[12px] sm:text-[13px] text-gray-500 font-medium mb-4">
            {founder.affiliation}
          </p>

          <hr className="border-gray-100 mb-4" />

          {/* About Section */}
          <div className="mb-4">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#1a3a5c] mb-1.5 flex items-center gap-1.5">
              <span>About</span>
            </h4>
            <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed">
              {isExpanded ? founder.aboutFull : founder.aboutShort}
            </p>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1.5 text-xs font-bold text-[#1a9fa8] hover:text-[#137d84] transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{isExpanded ? "Read Less" : "Read More"}</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Qualifications */}
          <div className="mb-4 bg-gray-50/80 rounded-xl p-3 border border-gray-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1a3a5c] mb-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#1a9fa8]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L2 7l8 4 8-4-8-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M6 9v5c0 1.657 1.791 3 4 3s4-1.343 4-3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M18 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Qualifications</span>
            </h4>
            <p className="text-[13px] font-semibold text-gray-800">
              {founder.qualifications}
            </p>
            <div className="mt-1.5">
              <span className="inline-block bg-white text-gray-700 text-[11px] font-medium px-2.5 py-0.5 rounded border border-gray-200">
                {founder.specialization}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2.5">
          <Link
            href="/book-appointment"
            className="inline-flex items-center gap-1.5 bg-[#e07030] hover:bg-[#c85f22] text-white text-xs sm:text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M2 7h14" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 2v3M12 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Book Appointment</span>
          </Link>
          <a
            href="https://wa.me/919540740947"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:text-[#1a9fa8] hover:border-[#1a9fa8] text-xs sm:text-[13px] font-semibold px-3.5 py-2 rounded-lg transition-colors"
          >
            <span>Consult via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function FounderSection() {
  return (
    <section className="w-full py-12 sm:py-16 px-3 sm:px-4 bg-[#f8fafc] border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="inline-block bg-[#1a9fa8]/10 text-[#1a9fa8] font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-2">
            Leadership & Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">
            Our Founders
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            Meet the visionary doctors and medical leaders who established Sant Haridas Hospital to bring compassionate, world-class healthcare to our community.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {foundersData.map((founder) => (
            <FounderCard key={founder.id} founder={founder} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── About Us Text Section ─────────────────────────────────────────────────────

function AboutUsText() {
  return (
    <section className="w-full bg-white py-8 px-3 sm:px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4">About Us</h2>
        <div className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed max-w-[900px] space-y-4">
          <p>
            <strong>Sant Haridas Hospital</strong> is a multi-speciality healthcare facility
            located at Main, Nangloi – Najafgarh Road, Ram Nagar, Najafgarh, Delhi – 110043.
            The hospital is committed to delivering comprehensive, compassionate, and
            patient-centric medical care to the community.
          </p>
          <p>
            We provide a wide range of medical services including <strong>Eye OPD, Gynecology,
            Child OPD (Pediatrician), Medicine OPD, Pathology Laboratory, Physiotherapy</strong>, and OPDs across multiple
            disciplines, supported by state-of-the-art diagnostic equipment.
          </p>
          <p>
            At Sant Haridas Hospital, we combine skilled doctors and medical staff with
            modern infrastructure to ensure the highest standards of clinical care. Every
            patient receives a personalized treatment plan delivered with compassion,
            dignity, and respect.
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Vision & Mission Section ──────────────────────────────────────────────────

function VisionIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 sm:w-14 sm:h-14" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" stroke="#8b6fb5" strokeWidth="1.8" />
      <circle cx="32" cy="32" r="14" stroke="#8b6fb5" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="6" stroke="#8b6fb5" strokeWidth="1.5" />
      <path d="M44 20 L36 28" stroke="#c084d0" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 20 L44 20 L44 26" stroke="#c084d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MissionIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 sm:w-14 sm:h-14" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 38 C12 34, 14 30, 18 29 L26 28 C28 27.5, 30 28, 30 30 L30 34" stroke="#b07ac8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 34 L44 34 C46 34, 48 36, 46 38 L36 42 C32 44, 26 44, 22 42 L12 38" stroke="#b07ac8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 34 L34 30 C34 28, 36 27, 38 28 L38 34" stroke="#b07ac8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 34 L38 30 C38 28, 40 27, 42 28 L42 34" stroke="#b07ac8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="34" cy="20" r="10" stroke="#8b6fb5" strokeWidth="1.8" />
      <path d="M24 20 Q29 16, 34 20 Q39 24, 44 20" stroke="#8b6fb5" strokeWidth="1.2" fill="none" />
      <path d="M24 20 Q29 24, 34 20 Q39 16, 44 20" stroke="#8b6fb5" strokeWidth="1.2" fill="none" />
      <path d="M34 10 Q37 15, 37 20 Q37 25, 34 30" stroke="#8b6fb5" strokeWidth="1.2" fill="none" />
      <path d="M34 10 Q31 15, 31 20 Q31 25, 34 30" stroke="#8b6fb5" strokeWidth="1.2" fill="none" />
      <path d="M24 20 h20" stroke="#8b6fb5" strokeWidth="1.2" />
    </svg>
  );
}

function VisionMissionSection() {
  const cards = [
    {
      icon: <VisionIcon />,
      title: "Vision",
      text: "To be the most trusted multi-speciality hospital in Najafgarh and West Delhi, delivering world-class healthcare that combines clinical excellence with compassionate patient care — accessible to every family we serve.",
    },
    {
      icon: <MissionIcon />,
      title: "Mission",
      text: "To provide comprehensive, affordable, and high-quality medical services across multiple disciplines, supported by state-of-the-art facilities and skilled doctors — always putting the patient first.",
    },
  ];

  return (
    <section className="w-full bg-[#fafafa] py-10 sm:py-12 px-3 sm:px-4">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-gray-200 rounded-2xl flex flex-col items-center text-center px-6 sm:px-10 py-8 sm:py-10 shadow-sm"
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-[16px] sm:text-[17px] font-bold text-[#7c55b0] mb-5">{card.title}</h3>
            <div className="w-10 h-[2px] bg-gray-200 mb-5" />
            <p className="text-[13px] sm:text-[14px] text-gray-600 leading-relaxed max-w-[360px]">
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
    <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="16" r="5" stroke="#8b6fb5" strokeWidth="1.8" />
      <circle cx="14" cy="20" r="4" stroke="#b07ac8" strokeWidth="1.6" />
      <circle cx="42" cy="20" r="4" stroke="#b07ac8" strokeWidth="1.6" />
      <path d="M20 36c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 38c0-3.314 2.686-6 6-6" stroke="#b07ac8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48 38c0-3.314-2.686-6-6-6" stroke="#b07ac8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 28 A20 20 0 0 1 46 28" stroke="#8b6fb5" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 2" />
      <path d="M46 30 A20 20 0 0 1 10 30" stroke="#8b6fb5" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 2" />
      <path d="M10 28 l-2-3 3 0" stroke="#8b6fb5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M46 30 l2 3-3 0" stroke="#8b6fb5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IntegrityIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="8" width="24" height="28" rx="3" stroke="#8b6fb5" strokeWidth="1.8" />
      <path d="M22 16h12M22 21h12M22 26h8" stroke="#b07ac8" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="34" cy="30" r="6" fill="white" stroke="#8b6fb5" strokeWidth="1.5" />
      <path d="M31 30l2 2 4-4" stroke="#8b6fb5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 44 C14 40, 18 38, 22 40 L28 42 L34 40 C38 38, 42 40, 44 44" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 40 L28 42 L34 40" stroke="#b07ac8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TeamworkIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="18" r="5" stroke="#8b6fb5" strokeWidth="1.8" />
      <circle cx="40" cy="18" r="5" stroke="#8b6fb5" strokeWidth="1.8" />
      <circle cx="28" cy="14" r="6" stroke="#8b6fb5" strokeWidth="1.8" />
      <path d="M8 38c0-4.418 3.582-8 8-8" stroke="#8b6fb5" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M40 30c4.418 0 8 3.582 8 8" stroke="#8b6fb5" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 40c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="42" cy="36" r="8" fill="white" stroke="#8b6fb5" strokeWidth="1.6" />
      <path d="M42 32v8M38 36h8" stroke="#8b6fb5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OwnershipIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="14" r="6" stroke="#8b6fb5" strokeWidth="1.8" />
      <path d="M28 20 L28 38" stroke="#8b6fb5" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 28 L28 24 L38 28" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 38 L22 48" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M28 38 L34 48" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M38 10 L38 28" stroke="#b07ac8" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M38 10 L50 15 L38 20 Z" fill="#e0c8f0" stroke="#b07ac8" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function InnovationIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 10 C20 10, 16 16, 16 22 C16 27, 19 30, 22 33 L22 38 L34 38 L34 33 C37 30, 40 27, 40 22 C40 16, 36 10, 28 10 Z" stroke="#8b6fb5" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M22 38h12M23 42h10M25 46h6" stroke="#8b6fb5" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="28" cy="24" r="5" stroke="#b07ac8" strokeWidth="1.4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 28 + 5.5 * Math.cos(rad);
        const y1 = 24 + 5.5 * Math.sin(rad);
        const x2 = 28 + 7.5 * Math.cos(rad);
        const y2 = 24 + 7.5 * Math.sin(rad);
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b07ac8" strokeWidth="2" strokeLinecap="round" />
        );
      })}
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
    <svg viewBox="0 0 56 56" fill="none" className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10 L36 10 L36 28 C36 34, 32 38, 28 38 C24 38, 20 34, 20 28 Z" stroke="#8b6fb5" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M20 14 C14 14, 12 18, 12 22 C12 26, 15 28, 20 28" stroke="#b07ac8" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M36 14 C42 14, 44 18, 44 22 C44 26, 41 28, 36 28" stroke="#b07ac8" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M28 38 L28 44" stroke="#8b6fb5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 44 L34 44" stroke="#8b6fb5" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 16 L29.8 21.4 L35.5 21.4 L31 24.6 L32.8 30 L28 26.8 L23.2 30 L25 24.6 L20.5 21.4 L26.2 21.4 Z" stroke="#b07ac8" strokeWidth="1.2" fill="#e0c8f0" strokeLinejoin="round" />
    </svg>
  );
}

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
      { highlight: "Treat patients and their caregivers", rest: " with compassion and care" },
      { highlight: "Our patients' needs come first", rest: "" },
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
      { highlight: "Respect and value people at all levels", rest: " with different opinions and backgrounds" },
      { highlight: "Collaborate across departments", rest: " for the patient's benefit" },
    ],
  },
  {
    icon: <OwnershipIcon />,
    title: "Ownership",
    points: [
      { highlight: "Be responsible and take pride in our", rest: " actions" },
      { highlight: "Take initiative and go beyond the call", rest: " of duty" },
      { highlight: "Deliver on commitments", rest: " made." },
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
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 sm:px-6 py-6 sm:py-7 flex flex-col gap-5">
      <div className="flex items-center gap-3 sm:gap-4">
        {value.icon}
        <h3 className="text-[15px] sm:text-[17px] font-bold text-[#1a1a1a]">{value.title}</h3>
      </div>
      <ul className="flex flex-col gap-2.5">
        {value.points.map((pt, i) => (
          <li key={i} className="flex items-start gap-2">
            <ValueBullet />
            <span className="text-[12px] sm:text-[13px] leading-snug">
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
    <section className="w-full bg-white py-10 sm:py-12 px-3 sm:px-4">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-6 sm:mb-8">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
    label: "About Sant Haridas Hospital",
    content:
      "Sant Haridas Hospital is a multi-speciality healthcare facility located at Main, Nangloi – Najafgarh Road, Ram Nagar, Najafgarh, Delhi – 110043. We provide comprehensive medical services across multiple disciplines with a focus on compassionate, patient-centric care.",
  },
  {
    id: "services",
    label: "Our Medical Services",
    content:
      "We offer a wide range of medical services including Eye OPD, Gynecology, Child OPD (Pediatrician), Medicine OPD, Pathology Laboratory, Physiotherapy, and OPDs across multiple disciplines.",
  },
  {
    id: "facilities",
    label: "Facilities & Infrastructure",
    content:
      "Our hospital is equipped with state-of-the-art medical equipment and hospital facilities and modern diagnostic infrastructure. We provide personalized treatment plans delivered by skilled doctors and medical staff, ensuring the highest standard of patient care.",
  },
  {
    id: "contact",
    label: "Contact & Appointments",
    content:
      "For appointments and enquiries, please call +91 95407 40947. You can also reach us on WhatsApp at +91 95407 40947 or email us at santharidashospital@gmail.com. We are located at Main, Nangloi – Najafgarh Road, Ram Nagar, Najafgarh, Delhi – 110043.",
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-4 sm:mb-5">Feel Free to ask us</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm lg:max-w-none">
            <div className="relative w-full" style={{ height: 200 }}>
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                alt="Woman in a thinking pose"
                fill
                className="object-cover object-top"
                unoptimized
              />
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

// ── Footer ────────────────────────────────────────────────────────────────────

const aboutSocialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/santharidashospital?stkn=MWN5bDAycm9qc2Zqag==",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
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
    href: "https://www.facebook.com/100090027224112/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg">
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

function AboutFooter() {
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
          <Link
            href="/book-appointment"
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPageClient() {
  return (
    <>
      <main className="min-h-screen bg-white">
        <TopBar />
        <MainNav />
        <AboutHeroBanner />
        <FounderSection />
        <AboutUsText />
        <VisionMissionSection />
        <OurValuesSection />
        <FeelFreeSection />
      </main>
      <AboutFooter />
    </>
  );
}