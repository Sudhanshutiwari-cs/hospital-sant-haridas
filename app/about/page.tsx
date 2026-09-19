import type { Metadata } from "next";
import AboutPageClient from "./about-client";

export const metadata: Metadata = {
  title: "About Sant Haridas Hospital | Eye & Gynae Hospital in Najafgarh",
  description:
    "Learn about Sant Haridas Hospital in Najafgarh, Delhi. Committed to affordable, advanced eye care, gynaecology, and compassionate patient healthcare.",
  keywords: [
    "about Sant Haridas Hospital",
    "hospital in Najafgarh",
    "eye hospital in Najafgarh",
    "healthcare in Najafgarh Delhi",
    "best hospital in Najafgarh",
    "gynae hospital in Najafgarh",
    "ophthalmologist Najafgarh",
  ],
  alternates: {
    canonical: "https://www.santharidashospital.com/about",
  },
  openGraph: {
    title: "About Sant Haridas Hospital | Eye & Gynae Hospital in Najafgarh",
    description:
      "Learn about Sant Haridas Hospital in Najafgarh, Delhi. Committed to affordable, advanced eye care, gynaecology, and compassionate patient healthcare.",
    url: "https://www.santharidashospital.com/about",
    siteName: "Sant Haridas Hospital",
    images: [
      {
        url: "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
        width: 1200,
        height: 630,
        alt: "About Sant Haridas Hospital Najafgarh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sant Haridas Hospital | Eye & Gynae Hospital in Najafgarh",
    description:
      "Learn about Sant Haridas Hospital in Najafgarh, Delhi. Committed to affordable, advanced eye care, gynaecology, and compassionate patient healthcare.",
    images: [
      "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
    ],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}