import type { Metadata } from "next";
import ServicesPageClient from "./services-client";

export const metadata: Metadata = {
  title: "Eye Care & Gynae Services in Najafgarh | Sant Haridas Hospital",
  description:
    "Comprehensive healthcare services at Sant Haridas Hospital Najafgarh: Cataract surgery, Lasik, Glaucoma, Maternity, Gynaecology, Pharmacy & Lab Tests.",
  keywords: [
    "eye care services Najafgarh",
    "cataract surgery Najafgarh",
    "gynae services Najafgarh",
    "maternity hospital Najafgarh",
    "lab test in Najafgarh",
    "pharmacy in Najafgarh",
    "eye hospital in Najafgarh",
    "gynaecologist in Najafgarh",
    "Sant Haridas Hospital services",
  ],
  alternates: {
    canonical: "https://www.santharidashospital.com/services",
  },
  openGraph: {
    title: "Eye Care & Gynae Services in Najafgarh | Sant Haridas Hospital",
    description:
      "Comprehensive healthcare services at Sant Haridas Hospital Najafgarh: Cataract surgery, Lasik, Glaucoma, Maternity, Gynaecology, Pharmacy & Lab Tests.",
    url: "https://www.santharidashospital.com/services",
    siteName: "Sant Haridas Hospital",
    images: [
      {
        url: "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
        width: 1200,
        height: 630,
        alt: "Services at Sant Haridas Hospital Najafgarh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eye Care & Gynae Services in Najafgarh | Sant Haridas Hospital",
    description:
      "Comprehensive healthcare services at Sant Haridas Hospital Najafgarh: Cataract surgery, Lasik, Glaucoma, Maternity, Gynaecology, Pharmacy & Lab Tests.",
    images: [
      "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
    ],
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}