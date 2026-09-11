"use client";

import { useState } from "react";
import {
  Eye,
  Heart,
  Stethoscope,
  FlaskConical,
  Activity,
  ClipboardList,
  BedDouble,
  DoorOpen,
  Microscope,
  Search,
  X,
  Phone,
  MessageCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Check,
  Calendar,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

// ── Shared: Top Bar ───────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="w-full bg-[#1a9fa8] text-white text-[13px]">
      <div className="max-w-[1200px] mx-auto px-4 h-10 flex items-center justify-between">
        <div className="flex items-center gap-6"></div>
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/919415057201"
            className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us (24/7)
          </a>
          <a
            href="tel:+919540740947"
            className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
          >
            <Phone className="w-4 h-4" />
            +91 95407 40947
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
            href="#contact"
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
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div>
          <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-3">
            <a href="/" className="hover:text-[#1a9fa8] transition-colors">Home</a>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1a3a5c] font-medium">Services</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1a3a5c] mb-2">Our Medical Services</h1>
          <p className="text-[15px] text-gray-600 max-w-xl leading-relaxed">
            Comprehensive healthcare services delivered with compassion. Explore our range of medical services across multiple disciplines designed to keep you and your family healthy.
          </p>
        </div>
      </div>
    </div>
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
  detailedInfo?: string;
};

const iconClass = "w-6 h-6 text-[#1a3a5c]";

const services: Service[] = [
  {
    id: "eye-opd",
    category: "OPD",
    title: "Eye OPD",
    description:
      "Comprehensive eye examination and treatment services for all age groups, delivered by experienced ophthalmologists using modern diagnostic equipment.",
    features: ["Vision testing", "Refraction & prescription", "Slit-lamp exam", "Dilated fundus evaluation"],
    image: "/service-eye-opd.png",
    icon: <Eye className={iconClass} />,
    availability: "Mon – Sat",
    highlight: "Walk-in",
    detailedInfo:
      "Our Eye OPD offers complete eye check-ups including visual acuity testing, refraction, slit-lamp biomicroscopy, intraocular pressure measurement, and dilated fundus evaluation. We diagnose and manage a wide range of eye conditions and provide spectacles prescription, medical therapy, and referral for surgical care when needed.",
  },
  {
    id: "gynecology",
    category: "Speciality",
    title: "Gynecology",
    description:
      "Comprehensive women's health services including routine check-ups, prenatal care, and treatment of gynecological conditions by experienced specialists.",
    features: ["Prenatal & antenatal care", "Routine gynec check-ups", "Menstrual health", "Family planning"],
    image: "/service-gynecology.png",
    icon: <Heart className={iconClass} />,
    availability: "Mon – Sat",
    highlight: "Women's Health",
    detailedInfo:
      "Our Gynecology department provides comprehensive care for women at every stage of life. Services include antenatal and postnatal care, treatment of menstrual disorders, menopause management, family planning counseling, and management of gynecological conditions. Our experienced gynecologists provide compassionate, personalized care in a comfortable environment.",
  },
  {
    id: "medicine-opd",
    category: "OPD",
    title: "Medicine OPD",
    description:
      "General medicine consultations for a wide range of acute and chronic conditions including diabetes, hypertension, infections, and preventive health checks.",
    features: ["General consultation", "Chronic disease care", "Preventive health checks", "Health counseling"],
    image: "/service-medicine.png",
    icon: <Stethoscope className={iconClass} />,
    availability: "Mon – Sat",
    highlight: "Walk-in",
    detailedInfo:
      "Our Medicine OPD offers comprehensive general medicine consultation services. Our physicians diagnose and manage a broad spectrum of conditions including diabetes, hypertension, thyroid disorders, respiratory and gastrointestinal conditions, infections, and lifestyle diseases. We also provide preventive health check-ups and health counseling.",
  },
  {
    id: "pathology",
    category: "Diagnostics",
    title: "Pathology Laboratory",
    description:
      "Well-equipped pathology laboratory offering a comprehensive range of diagnostic tests with accurate reporting and timely turnaround.",
    features: ["Blood tests", "Urine analysis", "Routine & specialized tests", "Accurate reporting"],
    image: "/service-pathology.png",
    icon: <FlaskConical className={iconClass} />,
    availability: "Mon – Sat",
    detailedInfo:
      "Our pathology laboratory offers a comprehensive range of diagnostic tests including hematology, biochemistry, serology, microbiology, and clinical pathology. All tests are conducted with strict quality control, and reports are delivered promptly. Our lab supports both routine health check-ups and specialized diagnostic requirements.",
  },
  {
    id: "physiotherapy",
    category: "Rehabilitation",
    title: "Physiotherapy",
    description:
      "Personalized physiotherapy programs for pain relief, injury recovery, and rehabilitation, delivered by qualified physiotherapists.",
    features: ["Pain management", "Post-injury rehab", "Post-surgical rehab", "Mobility therapy"],
    image: "/service-physiotherapy.png",
    icon: <Activity className={iconClass} />,
    availability: "Mon – Sat",
    highlight: "Rehab Care",
    detailedInfo:
      "Our Physiotherapy department offers personalized treatment programs for musculoskeletal pain, post-surgical rehabilitation, sports injuries, neurological conditions, and mobility improvement. Our qualified physiotherapists design tailored treatment plans using modern equipment and evidence-based techniques to help patients regain function and improve quality of life.",
  },
  {
    id: "multi-opd",
    category: "OPD",
    title: "OPDs Across Multiple Disciplines",
    description:
      "OPD services across multiple medical disciplines under one roof, ensuring convenient access to a wide range of specialist consultations.",
    features: ["Multiple specialities", "One-roof access", "Specialist consultations", "Coordinated care"],
    image: "/service-multi-opd.png",
    icon: <ClipboardList className={iconClass} />,
    availability: "Mon – Sat",
    highlight: "Multi-Speciality",
    detailedInfo:
      "Sant Haridas Hospital runs OPD services across multiple medical disciplines, ensuring convenient access to a wide range of specialist consultations under one roof. Our coordinated approach means patients can easily be referred between departments for comprehensive, connected care.",
  },
  {
    id: "wards",
    category: "Inpatient",
    title: "Wards",
    description:
      "Well-maintained inpatient wards with round-the-clock nursing care, monitoring, and support for admitted patients.",
    features: ["24/7 nursing care", "Doctor rounds", "Clean environment", "Monitored stay"],
    image: "/service-wards.png",
    icon: <BedDouble className={iconClass} />,
    availability: "24/7",
    detailedInfo:
      "Our inpatient wards provide a clean, comfortable, and well-monitored environment for patients requiring admission. Round-the-clock nursing care, regular doctor rounds, and coordinated support services ensure that every admitted patient receives attentive and compassionate care throughout their stay.",
  },
  {
    id: "semi-private",
    category: "Rooms",
    title: "Semi-Private Rooms",
    description:
      "Comfortable semi-private inpatient rooms offering privacy, comfort, and attentive care at an affordable price point.",
    features: ["Comfortable stay", "Shared facility", "Attentive nursing", "Affordable"],
    image: "/service-semi-private.png",
    icon: <DoorOpen className={iconClass} />,
    availability: "24/7",
    detailedInfo:
      "Our semi-private rooms offer a comfortable and affordable inpatient option with shared facilities. Each room is designed for patient comfort and is supported by attentive nursing care, regular doctor visits, and clean, well-maintained amenities.",
  },
  {
    id: "private-rooms",
    category: "Rooms",
    title: "Private Rooms",
    description:
      "Private inpatient rooms offering complete privacy, comfort, and personalized care for patients who prefer a more exclusive environment.",
    features: ["Complete privacy", "Personalized care", "Attendant space", "Premium comfort"],
    image: "/service-private-rooms.png",
    icon: <DoorOpen className={iconClass} />,
    availability: "24/7",
    highlight: "Premium",
    detailedInfo:
      "Our private rooms offer complete privacy and premium comfort for patients who prefer an exclusive environment during their stay. Each private room includes space for an attendant, personalized nursing care, and enhanced amenities to ensure a comfortable recovery experience.",
  },
  {
    id: "automated-lab",
    category: "Diagnostics",
    title: "Fully Automated Laboratory",
    description:
      "State-of-the-art fully automated laboratory providing fast, accurate, and reliable diagnostic results with minimal turnaround time.",
    features: ["Fully automated", "Fast reporting", "High accuracy", "Modern analyzers"],
    image: "/service-auto-lab.png",
    icon: <Microscope className={iconClass} />,
    availability: "Mon – Sat",
    highlight: "Advanced",
    detailedInfo:
      "Our fully automated laboratory is equipped with modern analyzers that ensure fast, accurate, and reliable diagnostic results. Automation minimizes human error, standardizes quality, and reduces turnaround time, helping doctors make quicker, better-informed clinical decisions for our patients.",
  },
];

const categories = ["All", "OPD", "Speciality", "Diagnostics", "Rehabilitation", "Inpatient", "Rooms"];

// ── Modal Component ───────────────────────────────────────────────────────────

function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-64 overflow-hidden rounded-t-2xl">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a5c] via-[#1a3a5c]/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/95 flex items-center justify-center shadow-lg flex-shrink-0">
                <div className="scale-90">{service.icon}</div>
              </div>
              <div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#1a9fa8] text-white inline-block mb-1">
                  {service.category}
                </span>
                <h2 className="text-2xl font-bold text-white drop-shadow">{service.title}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-[#1a9fa8]" />
            <span className="text-sm text-gray-600">
              Available: <span className="font-semibold text-[#1a3a5c]">{service.availability}</span>
            </span>
            {service.highlight && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#1a9fa8]/10 text-[#1a9fa8]">
                {service.highlight}
              </span>
            )}
          </div>

          <p className="text-[15px] text-gray-700 leading-relaxed mb-6">{service.description}</p>

          {service.detailedInfo && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-bold text-[#1a3a5c] mb-2">About this Service</h3>
              <p className="text-[14px] text-gray-600 leading-relaxed">{service.detailedInfo}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#1a3a5c] mb-3">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-[14px] text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-[#1a9fa8] flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <a
              href="#contact"
              className="flex-1 py-3 text-[14px] font-semibold text-white bg-[#1a9fa8] rounded-lg hover:bg-[#17878f] transition-colors text-center"
            >
              Book Appointment
            </a>
            <a
              href="tel:+919540740947"
              className="flex-1 py-3 text-[14px] font-semibold text-[#1a3a5c] border-2 border-[#1a3a5c] rounded-lg hover:bg-[#1a3a5c] hover:text-white transition-colors text-center"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Service Card ──────────────────────────────────────────────────────────────

function ServiceCard({ service, onLearnMore }: { service: Service; onLearnMore: (service: Service) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="relative w-full h-44 overflow-hidden">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a5c]/80 via-[#1a3a5c]/20 to-transparent" />
        <span className="absolute top-3 left-3 bg-white/90 text-[#1a3a5c] text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {service.category}
        </span>
        {service.highlight && (
          <span className="absolute top-3 right-3 bg-[#1a9fa8] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            {service.highlight}
          </span>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center shadow flex-shrink-0">
            <div className="scale-90">{service.icon}</div>
          </div>
          <h3 className="text-white font-bold text-[15px] leading-tight drop-shadow">{service.title}</h3>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#1a9fa8] flex-shrink-0" />
          <span className="text-[12px] text-gray-500 font-medium">
            Available: <span className="text-[#1a3a5c] font-semibold">{service.availability}</span>
          </span>
        </div>

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

        <ul className="flex flex-col gap-1.5">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13px] text-gray-600">
              <Check className="w-3.5 h-3.5 text-[#1a9fa8] flex-shrink-0 mt-0.5" strokeWidth={3} />
              {f}
            </li>
          ))}
        </ul>

        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
          <button
            onClick={() => onLearnMore(service)}
            className="flex-1 py-2.5 text-[13px] font-semibold text-[#1a3a5c] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Learn More
          </button>
          <a
            href="#contact"
            className="flex-1 py-2.5 text-[13px] font-semibold text-white bg-[#1a9fa8] rounded-lg hover:bg-[#17878f] transition-colors text-center"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}

// ── FAQ Section ───────────────────────────────────────────────────────────────

const serviceFaqItems = [
  {
    id: "services-list",
    label: "What medical services does Sant Haridas Hospital offer?",
    content:
      "Sant Haridas Hospital offers a comprehensive range of medical services including Eye OPD, Gynecology, Medicine OPD, Pathology Laboratory, Physiotherapy, and OPDs across multiple disciplines. Inpatient services include wards, semi-private rooms, and private rooms, supported by a fully automated laboratory.",
  },
  {
    id: "facilities",
    label: "What facilities are available at the hospital?",
    content:
      "Our hospital is equipped with state-of-the-art medical equipment and hospital facilities, fully automated laboratories, and modern diagnostic infrastructure. We offer personalized treatment plans, skilled doctors and medical staff, compassionate patient care, multiple OPD disciplines, inpatient ward facilities, and both semi-private and private rooms.",
  },
  {
    id: "appointment",
    label: "How do I book an appointment or consultation?",
    content:
      "You can book an appointment by calling our primary phone at +91 95407 40947, our mobile at +91 98680 53854, messaging us on WhatsApp at +91 94150 57201, or emailing santharidashospital@gmail.com. You can also visit the hospital directly at Main, Nangloi – Najafgarh Road, Ram Nagar, Najafgarh, Delhi – 110043.",
  },
  {
    id: "contact",
    label: "Where is Sant Haridas Hospital located?",
    content:
      "Sant Haridas Hospital is located at Main, Nangloi – Najafgarh Road, Ram Nagar, Najafgarh, Delhi – 110043, India. For appointments and enquiries, you can reach us at +91 95407 40947 / +91 98680 53854 or email santharidashospital@gmail.com.",
  },
];

function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  return (
    <section className="w-full bg-white py-12 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-5">Feel Free to ask us</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="w-full h-[240px] overflow-hidden">
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
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

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
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
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
  { label: "Instagram", href: "#", Icon: FaInstagram, color: "#e1306c" },
  { label: "Facebook", href: "#", Icon: FaFacebookF, color: "#1877f2" },
  { label: "X (Twitter)", href: "#", Icon: FaXTwitter, color: "#000000" },
  { label: "YouTube", href: "#", Icon: FaYoutube, color: "#ff0000" },
];

function Footer() {
  return (
    <footer className="w-full bg-[#f0faf5] border-t border-gray-200">
      <div className="w-full" style={{ height: 200 }}>
        <iframe
          title="Sant Haridas Hospital Location Map"
          src="https://www.google.com/maps?q=Ram+Nagar,+Najafgarh,+Delhi+110043&output=embed"
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
            {footerSocialLinks.map(({ label, href, Icon, color }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:shadow-md transition-shadow"
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </a>
            ))}
          </div>
          <p className="text-[12px] text-gray-500">
            &copy; {new Date().getFullYear()} Sant Haridas Hospital. All Rights Reserved.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-right">
          <p className="text-[12px] font-semibold text-[#1a3a5c]">24/7 Helpline</p>
          <a href="tel:+919540740947" className="text-[15px] font-bold text-[#1a9fa8] hover:text-[#1a3a5c] transition-colors">
            +91 95407 40947
          </a>
          <a
            href="#contact"
            className="mt-1 inline-flex items-center gap-1.5 bg-[#1a3a5c] text-white text-[12px] font-semibold px-4 py-2 rounded hover:bg-[#122b47] transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
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
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
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
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 focus-within:border-[#1a9fa8] transition-colors bg-white w-full md:w-72 flex-shrink-0">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search services…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-[14px] text-gray-600 placeholder-gray-400 outline-none bg-transparent"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
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
          <p className="text-[13px] text-gray-500 mb-6">
            Showing <span className="font-semibold text-[#1a3a5c]">{filtered.length}</span> service
            {filtered.length !== 1 ? "s" : ""}
            {activeCategory !== "All" && (
              <span>
                {" "}
                in <span className="font-semibold text-[#1a9fa8]">{activeCategory}</span>
              </span>
            )}
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => (
                <ServiceCard key={s.id} service={s} onLearnMore={setSelectedService} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Search className="w-16 h-16 text-gray-300" />
              <p className="text-[15px] text-gray-500 font-medium">
                No services found. Try a different search or category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="text-[14px] text-[#1a9fa8] font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Why Choose strip */}
        <div className="w-full bg-[#1a3a5c] py-12 px-4">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Why Choose Sant Haridas Hospital?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { Icon: Stethoscope, label: "State-of-the-Art Facilities", sub: "Modern medical equipment" },
                { Icon: Heart, label: "Skilled Doctors & Staff", sub: "Experienced medical team" },
                { Icon: Microscope, label: "Fully Automated Labs", sub: "Accurate & fast diagnostics" },
                { Icon: Activity, label: "Compassionate Care", sub: "Personalized treatment plans" },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-white font-semibold text-[14px]">{label}</p>
                  <p className="text-white/60 text-[12px]">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <FaqSection />
      </main>
      <Footer />

      {selectedService && (
        <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </>
  );
}