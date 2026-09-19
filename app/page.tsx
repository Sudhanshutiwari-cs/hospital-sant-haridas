import type { Metadata } from "next";
import HomePageClient from "./page-client";

export const metadata: Metadata = {
  title: "Eye & Gynae Hospital in Najafgarh, Delhi | Sant Haridas Hospital",
  description:
    "Sant Haridas Hospital is a trusted eye & gynae hospital in Najafgarh, Delhi. Expert eye specialists, gynaecologists, pharmacy & diagnostic lab tests.",
  keywords: [
    "eye hospital in Najafgarh",
    "eye doctor in Najafgarh",
    "eye specialist in Najafgarh",
    "gynae hospital in Najafgarh",
    "gynaecologist in Najafgarh",
    "Sant Haridas Hospital",
    "hospital in Najafgarh Delhi",
    "eye care hospital in Najafgarh",
    "ophthalmologist in Najafgarh",
    "women healthcare in Najafgarh",
  ],
  alternates: {
    canonical: "https://www.santharidashospital.com/",
  },
  openGraph: {
    title: "Eye & Gynae Hospital in Najafgarh, Delhi | Sant Haridas Hospital",
    description:
      "Sant Haridas Hospital is a trusted eye & gynae hospital in Najafgarh, Delhi. Expert eye specialists, gynaecologists, pharmacy & diagnostic lab tests.",
    url: "https://www.santharidashospital.com/",
    siteName: "Sant Haridas Hospital",
    images: [
      {
        url: "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
        width: 1200,
        height: 630,
        alt: "Sant Haridas Hospital Najafgarh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eye & Gynae Hospital in Najafgarh, Delhi | Sant Haridas Hospital",
    description:
      "Sant Haridas Hospital is a trusted eye & gynae hospital in Najafgarh, Delhi. Expert eye specialists, gynaecologists, pharmacy & diagnostic lab tests.",
    images: [
      "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
    ],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}