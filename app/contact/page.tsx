import type { Metadata } from "next";
import ContactPageClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Sant Haridas Hospital | Eye & Gynae Hospital in Najafgarh",
  description:
    "Contact Sant Haridas Hospital in Najafgarh, Delhi. Get address, phone number, OPD timings, and directions. Book your consultation today.",
  keywords: [
    "contact Sant Haridas Hospital",
    "eye hospital Najafgarh address",
    "hospital phone number Najafgarh",
    "hospital near Ram Nagar Najafgarh",
    "OPD timings Sant Haridas Hospital",
    "emergency eye care Najafgarh",
    "gynaecologist contact Najafgarh",
  ],
  alternates: {
    canonical: "https://www.santharidashospital.com/contact",
  },
  openGraph: {
    title: "Contact Sant Haridas Hospital | Eye & Gynae Hospital in Najafgarh",
    description:
      "Contact Sant Haridas Hospital in Najafgarh, Delhi. Get address, phone number, OPD timings, and directions. Book your consultation today.",
    url: "https://www.santharidashospital.com/contact",
    siteName: "Sant Haridas Hospital",
    images: [
      {
        url: "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Sant Haridas Hospital Najafgarh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Sant Haridas Hospital | Eye & Gynae Hospital in Najafgarh",
    description:
      "Contact Sant Haridas Hospital in Najafgarh, Delhi. Get address, phone number, OPD timings, and directions. Book your consultation today.",
    images: [
      "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
    ],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}