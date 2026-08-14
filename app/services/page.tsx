"use client";

import { useState } from "react";

// ── Shared: Top Bar ───────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-[13px]">
      <div className="max-w-[1200px] mx-auto px-4 h-10 flex items-center justify-between">
        <div className="flex items-center gap-6"></div>
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M11.998 2C6.477 2 2 6.477 2 12c0 1.82.487 3.53 1.338 5.01L2 22l5.118-1.318C8.578 21.527 10.248 22 11.998 22 17.523 22 22 17.523 22 12S17.523 2 11.998 2z" />
            </svg>
            WhatsApp Us (24/7)
          </a>
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

// ── Shared: Main Nav ──────────────────────────────────────────────────────────

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
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src="https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg"
            alt="Sant Haridas Hospital"
            className="h-12 w-auto object-contain"
          />
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {["Doctors", "Services", "Blogs", "About Us", "Contact Us"].map((item) => (
            <a
              key={item}
              href={getNavLink(item)}
              className="text-[14px] font-medium text-[#1a3a5c] hover:text-[#1a9fa8] transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/doctors"
            className="bg-[#e85d26] text-white text-[13px] font-semibold px-4 py-2 rounded hover:bg-[#c94e1e] transition-colors whitespace-nowrap"
          >
            Book an Appointment
          </a>
        </div>
      </div>
    </header>
  );
}

// ── Hero Banner ───────────────────────────────────────────────────────────────

function HeroBanner() {
  return (
    <div className="w-full bg-[#eaf6f7] border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 py-10 flex items-center justify-between gap-8">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3">
            <a href="/" className="hover:text-[#1a9fa8] transition-colors">Home</a>
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[#1a3a5c] font-medium">Services</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1a3a5c] mb-2">Our Services</h1>
          <p className="text-[15px] text-gray-600 max-w-xl leading-relaxed">
            World-class medical care delivered with compassion. Explore our comprehensive range of clinical and support services designed around your health needs.
          </p>
        </div>
        {/* Decorative stats row */}
        <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
          {[
            { number: "36+", label: "Facilities" },
            { number: "6,000+", label: "Beds" },
            { number: "17,900+", label: "Professionals" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[#1a9fa8]">{s.number}</p>
              <p className="text-[12px] text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Service SVG Icons ─────────────────────────────────────────────────────────

function EmergencyIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="24" stroke="#1a9fa8" strokeWidth="1.8" />
      <path d="M28 16v8M28 32v8" stroke="#1a3a5c" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 28h16" stroke="#1a3a5c" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28 12v-4M28 48v-4M12 28H8M48 28h-4" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DiagnosticsIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="30" height="36" rx="3" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M14 20h18M14 26h18M14 32h12" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="40" cy="40" r="10" fill="white" stroke="#1a9fa8" strokeWidth="1.8" />
      <path d="M40 36v8M36 40h8" stroke="#1a9fa8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PharmacyIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="22" width="36" height="26" rx="3" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M18 22v-6a10 10 0 0120 0v6" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 34h12M28 28v12" stroke="#1a9fa8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="34" r="2" fill="#1a9fa8" />
      <circle cx="36" cy="34" r="2" fill="#1a9fa8" />
    </svg>
  );
}

function BloodBankIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 10 C28 10, 14 22, 14 32 C14 40, 20.3 46, 28 46 C35.7 46, 42 40, 42 32 C42 22, 28 10, 28 10Z" stroke="#1a3a5c" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M20 34 C20 38, 23.6 42, 28 42" stroke="#1a9fa8" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M24 30h8M28 26v8" stroke="#1a9fa8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RehabIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="12" r="6" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M28 18v14" stroke="#1a3a5c" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 26l12-4 12 4" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 32l-6 14" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M34 32l6 14" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 42 C20 38, 22 40, 28 38 C34 36, 36 38, 40 42" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ICUIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="18" width="40" height="24" rx="4" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M12 30 L18 30 L20 24 L22 36 L24 28 L26 32 L30 32 L32 30 L44 30" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 42v6M40 42v6" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 48h32" stroke="#1a3a5c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AmbulanceIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="20" width="32" height="22" rx="3" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M36 28h8l8 8v6h-16" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="44" r="5" stroke="#1a9fa8" strokeWidth="1.8" />
      <circle cx="38" cy="44" r="5" stroke="#1a9fa8" strokeWidth="1.8" />
      <path d="M16 28h-4M14 24v8" stroke="#1a9fa8" strokeWidth="2" strokeLinecap="round" />
      <path d="M46 30l4 6" stroke="#1a3a5c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TelemedIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="40" height="28" rx="4" stroke="#1a3a5c" strokeWidth="1.8" />
      <circle cx="28" cy="24" r="7" stroke="#1a9fa8" strokeWidth="1.6" />
      <path d="M24 24h8M28 20v8" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 38v8M36 38v8M16 46h24" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DietIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="30" r="18" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M28 12v-6M22 10 C22 6, 28 4, 28 4 C28 4, 34 6, 34 10" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 28 C18 22, 22 18, 28 18 C34 18, 38 22, 38 28" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 34 C23 38, 26 40, 28 40 C30 40, 33 38, 34 34" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PsychologyIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 8 C18 8, 12 15, 12 22 C12 28, 16 32, 18 34 L18 44 L38 44 L38 34 C40 32, 44 28, 44 22 C44 15, 38 8, 28 8Z" stroke="#1a3a5c" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M22 22 C22 18, 26 16, 28 18 C30 20, 28 24, 26 26 C24 28, 28 30, 28 30" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="28" cy="34" r="1.5" fill="#1a9fa8" />
      <path d="M22 44v4M34 44v4" stroke="#1a3a5c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function NursingIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="14" r="8" stroke="#1a3a5c" strokeWidth="1.8" />
      <path d="M16 48 C16 38, 20 34, 28 34 C36 34, 40 38, 40 48" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="22" y="20" width="12" height="6" rx="1" fill="white" stroke="#1a9fa8" strokeWidth="1.5" />
      <path d="M26 10h4M28 8v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LabIcon() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 8v20L10 44a2 2 0 001.8 3h32.4A2 2 0 0046 44L34 28V8" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 8h20" stroke="#1a3a5c" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 36 C20 32, 26 34, 28 38 C30 42, 36 42, 40 38" stroke="#1a9fa8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Services Data ─────────────────────────────────────────────────────────────

type Service = {
  id: string;
  category: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  icon: React.ReactNode;
  availability: string;
  highlight?: string;
};

const services: Service[] = [
  {
    id: "emergency",
    category: "Critical Care",
    title: "24/7 Emergency Care",
    description: "Round-the-clock emergency medical services staffed by experienced trauma and emergency physicians equipped to handle all critical conditions.",
    features: ["Level 1 Trauma Centre", "Dedicated resuscitation bays", "Direct ICU admission pathway", "Specialist on-call 24/7"],
    image: "/service-emergency.png",
    icon: <EmergencyIcon />,
    availability: "24 / 7",
    highlight: "Always Open",
  },
  {
    id: "diagnostics",
    category: "Imaging & Lab",
    title: "Advanced Diagnostics",
    description: "State-of-the-art imaging and pathology labs including MRI, CT, PET-CT, digital X-ray, ultrasound, and a fully automated NABL-accredited clinical laboratory.",
    features: ["3T MRI & 256-slice CT", "PET-CT oncology imaging", "Digital pathology", "Same-day reports"],
    image: "/service-diagnostics.png",
    icon: <DiagnosticsIcon />,
    availability: "7 AM – 10 PM",
  },
  {
    id: "icu",
    category: "Critical Care",
    title: "Intensive Care Unit",
    description: "Multi-disciplinary ICUs with the latest monitoring technology managed by intensivists around the clock, ensuring the highest standards of critical patient care.",
    features: ["Medical & Surgical ICUs", "Cardiac & Neuro ICUs", "Neonatal ICU (NICU)", "Continuous monitoring"],
    image: "/service-icu.png",
    icon: <ICUIcon />,
    availability: "24 / 7",
    highlight: "Always Open",
  },
  {
    id: "pharmacy",
    category: "Support Services",
    title: "In-House Pharmacy",
    description: "Fully stocked 24-hour pharmacy dispensing a comprehensive range of branded and generic medicines with trained pharmacist counselling.",
    features: ["24-hour dispensing", "Pharmacist consultation", "Home delivery available", "Cold-chain medicines"],
    image: "/service-pharmacy.png",
    icon: <PharmacyIcon />,
    availability: "24 / 7",
    highlight: "Home Delivery",
  },
  {
    id: "bloodbank",
    category: "Support Services",
    title: "Blood Bank & Transfusion",
    description: "Licensed blood bank providing safe and reliable transfusion services including component therapy, apheresis, and autologous blood banking.",
    features: ["Component therapy", "Apheresis facility", "Voluntary donation drives", "NABH-licensed"],
    image: "/service-bloodbank.png",
    icon: <BloodBankIcon />,
    availability: "24 / 7",
  },
  {
    id: "rehab",
    category: "Rehabilitation",
    title: "Rehabilitation & Physiotherapy",
    description: "Comprehensive rehabilitation programmes covering neuro, orthopaedic, cardiac, and pulmonary rehab delivered by certified physiotherapists and therapists.",
    features: ["Post-surgical rehab", "Neuro physiotherapy", "Hydrotherapy pool", "Home visit programmes"],
    image: "/service-rehab.png",
    icon: <RehabIcon />,
    availability: "8 AM – 7 PM",
  },
  {
    id: "ambulance",
    category: "Emergency",
    title: "Ambulance Services",
    description: "Advanced Life Support (ALS) and Basic Life Support (BLS) ambulances equipped with resuscitation equipment and paramedics for safe patient transport.",
    features: ["ALS & BLS fleet", "Trained paramedics", "GPS-tracked vehicles", "Air ambulance tie-up"],
    image: "/service-emergency.png",
    icon: <AmbulanceIcon />,
    availability: "24 / 7",
    highlight: "Call: 926 888 0303",
  },
  {
    id: "telemedicine",
    category: "Digital Health",
    title: "Telemedicine & Video Consult",
    description: "Consult Sant Haridas Hospital specialists from the comfort of your home via secure video calls. Get prescriptions, follow-ups, and second opinions digitally.",
    features: ["Secure video platform", "E-prescription", "Digital health records", "Multi-specialty coverage"],
    image: "/service-diagnostics.png",
    icon: <TelemedIcon />,
    availability: "7 AM – 11 PM",
    highlight: "Online",
  },
  {
    id: "diet",
    category: "Wellness",
    title: "Diet & Nutrition",
    description: "Personalised diet counselling by registered dietitians for disease management, pre/post-operative care, weight management, and sports nutrition.",
    features: ["Clinical dietitians", "Customised meal plans", "Diabetes nutrition", "Bariatric diet support"],
    image: "/service-rehab.png",
    icon: <DietIcon />,
    availability: "9 AM – 6 PM",
  },
  {
    id: "psychology",
    category: "Mental Health",
    title: "Psychology & Mental Wellness",
    description: "Confidential mental health services including individual therapy, cognitive behavioural therapy (CBT), counselling, and psychiatric consultations.",
    features: ["CBT & psychotherapy", "Stress management", "Child & adolescent care", "De-addiction support"],
    image: "/service-diagnostics.png",
    icon: <PsychologyIcon />,
    availability: "9 AM – 7 PM",
  },
  {
    id: "nursing",
    category: "Support Services",
    title: "Home Nursing Care",
    description: "Trained nurses and caregivers providing post-discharge care, wound management, IV therapy, and long-term patient care in the comfort of home.",
    features: ["Post-discharge care", "IV & wound care", "Elderly care", "Trained RNs"],
    image: "/service-rehab.png",
    icon: <NursingIcon />,
    availability: "On-demand",
  },
  {
    id: "lab",
    category: "Imaging & Lab",
    title: "Clinical Laboratory",
    description: "NABL-accredited pathology lab offering 2,000+ tests with rapid turnaround, home sample collection, and digital report delivery.",
    features: ["2,000+ tests", "Home sample collection", "Digital reports", "NABL accredited"],
    image: "/service-diagnostics.png",
    icon: <LabIcon />,
    availability: "6 AM – 10 PM",
    highlight: "Home Collection",
  },
];

const categories = ["All", "Critical Care", "Imaging & Lab", "Support Services", "Rehabilitation", "Emergency", "Digital Health", "Wellness", "Mental Health"];

// ── Service Card ──────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: Service }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Image with overlay */}
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a5c]/80 via-[#1a3a5c]/20 to-transparent" />
        {/* Category pill */}
        <span className="absolute top-3 left-3 bg-white/90 text-[#1a3a5c] text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {service.category}
        </span>
        {/* Highlight badge */}
        {service.highlight && (
          <span className="absolute top-3 right-3 bg-[#1a9fa8] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {service.highlight}
          </span>
        )}
        {/* Icon + title at bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center shadow flex-shrink-0">
            <div className="scale-75">{service.icon}</div>
          </div>
          <h3 className="text-white font-bold text-[15px] leading-tight drop-shadow">{service.title}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Availability */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#1a9fa8] flex-shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[12px] text-gray-500 font-medium">
            Available: <span className="text-[#1a3a5c] font-semibold">{service.availability}</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-gray-600 leading-relaxed">
          {expanded ? service.description : service.description.slice(0, 90) + (service.description.length > 90 ? "…" : "")}
          {service.description.length > 90 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-[#1a9fa8] font-medium hover:underline text-[13px]"
            >
              {expanded ? "Less" : "More"}
            </button>
          )}
        </p>

        {/* Features */}
        <ul className="flex flex-col gap-1.5">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13px] text-gray-600">
              <svg className="w-3.5 h-3.5 text-[#1a9fa8] flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {/* Footer buttons */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
          <button className="flex-1 py-2.5 text-[13px] font-semibold text-[#1a3a5c] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Learn More
          </button>
          <button className="flex-1 py-2.5 text-[13px] font-semibold text-white bg-[#1a9fa8] rounded-lg hover:bg-[#17878f] transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────

const serviceFaqItems = [
  {
    id: "coverage",
    label: "What services does Sant Haridas Hospital offer?",
    content: "Sant Haridas Hospital offers a comprehensive range of clinical and support services including 24/7 emergency care, advanced diagnostics, ICU, pharmacy, blood bank, rehabilitation, telemedicine, home nursing, diet counselling, mental wellness, and more across its network of hospitals.",
  },
  {
    id: "insurance",
    label: "Are services covered under health insurance?",
    content: "Most clinical services at Sant Haridas Hospital are covered under major health insurance plans and cashless empanelments with leading TPA providers. Our billing team will assist you with pre-authorisation and claims at the time of admission.",
  },
  {
    id: "appointment",
    label: "How do I book a service or appointment?",
    content: "You can book services online via our website or app, call our 24/7 helpline at +91 926 888 0303, WhatsApp us, or visit any Sant Haridas Hospital facility. Our team will guide you to the right department and specialist.",
  },
  {
    id: "home",
    label: "Are home-based services available?",
    content: "Yes. Sant Haridas Hospital offers several home-based services including home nursing care, home sample collection for lab tests, pharmacy home delivery, and telemedicine video consultations — so you can receive quality care without leaving your home.",
  },
];

function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  return (
    <section className="w-full bg-white py-12 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-10 items-start">
        {/* Left */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-5">Feel Free to ask us</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="w-full h-[240px] overflow-hidden">
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
          {serviceFaqItems.map((item) => {
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

// ── Footer ────────────────────────────────────────────────────────────────────

const footerSocialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#ig-svc)" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.5" stroke="url(#ig-svc)" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-svc)" />
        <defs>
          <linearGradient id="ig-svc" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f09433" /><stop offset="0.25" stopColor="#e6683c" />
            <stop offset="0.5" stopColor="#dc2743" /><stop offset="0.75" stopColor="#cc2366" />
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
        <path d="M17 2h-3a5 5 0 00-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="#1877f2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
      <div className="w-full" style={{ height: 200 }}>
        <iframe
          title="Sant Haridas Hospital Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.2536096392!2d77.2088!3d28.5494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce1c9af8e7ad3%3A0x5e1c3a2a2a2a2a2a!2sMAX%20Super%20Speciality%20Hospital%2C%20Saket!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%" height="200" style={{ border: 0, display: "block" }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <svg viewBox="0 0 36 36" fill="none" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="32" height="32" rx="6" fill="#1a3a5c" />
            <path d="M10 26V10l8 10 8-10v16" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 20l-4-5" stroke="#1a9fa8" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 20l4-5" stroke="#1a9fa8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold text-[#1a3a5c] tracking-tight">MAX</span>
            <span className="text-[10px] text-[#1a9fa8] font-semibold tracking-widest uppercase">Healthcare</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-[11px] font-bold tracking-widest text-[#1a3a5c] uppercase">Stay in Touch</p>
          <div className="flex items-center gap-3">
            {footerSocialLinks.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow">
                {s.icon}
              </a>
            ))}
          </div>
          <p className="text-[12px] text-gray-500">
            &copy; {new Date().getFullYear()} Sant Haridas Hospital. All Rights Reserved.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-right">
          <p className="text-[12px] font-semibold text-[#1a3a5c]">24/7 Emergency</p>
          <a href="tel:+919268880303" className="text-[15px] font-bold text-[#1a9fa8] hover:text-[#1a3a5c] transition-colors">
            +91 926 888 0303
          </a>
          <a href="#"
            className="mt-1 inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-[12px] font-semibold px-4 py-2 rounded hover:bg-[#122b47] transition-colors">
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

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <TopBar />
      <MainNav />
      <main className="min-h-screen bg-[#f8fafb]">
        <HeroBanner />

        {/* Search + Filter bar */}
        <div className="w-full bg-white border-b border-gray-200 py-5 px-4 sticky top-16 z-40">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search */}
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 focus-within:border-[#1a9fa8] transition-colors bg-white w-full md:w-72 flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search services…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-[14px] text-gray-600 placeholder-gray-400 outline-none bg-transparent"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[13px] font-medium px-3.5 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-[#1a9fa8] text-white border-[#1a9fa8]"
                      : "bg-white text-[#1a3a5c] border-gray-300 hover:border-[#1a9fa8] hover:text-[#1a9fa8]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-[1200px] mx-auto px-4 py-10">
          {/* Result count */}
          <p className="text-[13px] text-gray-500 mb-6">
            Showing <span className="font-semibold text-[#1a3a5c]">{filtered.length}</span> service{filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" && <span> in <span className="font-semibold text-[#1a9fa8]">{activeCategory}</span></span>}
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <svg className="w-16 h-16 text-gray-300" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="20" stroke="currentColor" strokeWidth="2" />
                <path d="M44 44l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M22 28h12M28 22v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-[15px] text-gray-500 font-medium">No services found. Try a different search or category.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="text-[14px] text-[#1a9fa8] font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Why Choose MAX strip */}
        <div className="w-full bg-[#1a3a5c] py-12 px-4">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Why Choose Sant Haridas Hospital?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: "🏆", label: "JCI & NABH Accredited", sub: "4 JCI & 33 NABH hospitals" },
                { icon: "👨‍⚕️", label: "Expert Specialists", sub: "17,900+ healthcare professionals" },
                { icon: "🏥", label: "Wide Network", sub: "36+ facilities across India" },
                { icon: "💊", label: "Advanced Technology", sub: "Latest medical equipment & tech" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <p className="text-white font-semibold text-[14px]">{item.label}</p>
                  <p className="text-white/60 text-[12px]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
