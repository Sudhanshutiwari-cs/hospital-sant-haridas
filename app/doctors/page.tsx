import type { Metadata } from "next";
import DoctorsPageClient from "./doctors-client";

export const metadata: Metadata = {
  title: "Doctors in Najafgarh, Delhi | Eye & Gynae Specialists | Sant Haridas Hospital",
  description:
    "Meet expert doctors at Sant Haridas Hospital, Najafgarh. Highly qualified ophthalmologists, eye surgeons, and gynaecologists serving Delhi patients.",
  keywords: [
    "doctors in Najafgarh",
    "eye doctor in Najafgarh",
    "ophthalmologist in Najafgarh",
    "gynaecologist in Najafgarh",
    "Sant Haridas Hospital doctors",
    "lady doctor in Najafgarh",
    "eye specialist in Najafgarh",
    "cataract surgeon Najafgarh",
  ],
  alternates: {
    canonical: "https://www.santharidashospital.com/doctors",
  },
  openGraph: {
    title: "Doctors in Najafgarh, Delhi | Eye & Gynae Specialists | Sant Haridas Hospital",
    description:
      "Meet expert doctors at Sant Haridas Hospital, Najafgarh. Highly qualified ophthalmologists, eye surgeons, and gynaecologists serving Delhi patients.",
    url: "https://www.santharidashospital.com/doctors",
    siteName: "Sant Haridas Hospital",
    images: [
      {
        url: "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
        width: 1200,
        height: 630,
        alt: "Doctors at Sant Haridas Hospital Najafgarh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Doctors in Najafgarh, Delhi | Eye & Gynae Specialists | Sant Haridas Hospital",
    description:
      "Meet expert doctors at Sant Haridas Hospital, Najafgarh. Highly qualified ophthalmologists, eye surgeons, and gynaecologists serving Delhi patients.",
    images: [
      "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
    ],
  },
};

export default function DoctorsPage() {
  return <DoctorsPageClient />;
}