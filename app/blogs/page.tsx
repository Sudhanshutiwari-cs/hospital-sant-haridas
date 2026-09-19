import type { Metadata } from "next";
import BlogsPageClient from "./blogs-client";

export const metadata: Metadata = {
  title: "Health & Eye Care Blog | Sant Haridas Hospital Najafgarh",
  description:
    "Read informative articles on eye health, cataract, pregnancy care, women's wellness, and healthcare tips from experts at Sant Haridas Hospital.",
  keywords: [
    "eye care tips",
    "health blog Najafgarh",
    "cataract awareness",
    "women health tips",
    "Sant Haridas Hospital blog",
    "eye doctor articles Najafgarh",
    "gynaecology tips Delhi",
  ],
  alternates: {
    canonical: "https://www.santharidashospital.com/blogs",
  },
  openGraph: {
    title: "Health & Eye Care Blog | Sant Haridas Hospital Najafgarh",
    description:
      "Read informative articles on eye health, cataract, pregnancy care, women's wellness, and healthcare tips from experts at Sant Haridas Hospital.",
    url: "https://www.santharidashospital.com/blogs",
    siteName: "Sant Haridas Hospital",
    images: [
      {
        url: "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
        width: 1200,
        height: 630,
        alt: "Sant Haridas Hospital Health & Eye Care Blog",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Health & Eye Care Blog | Sant Haridas Hospital Najafgarh",
    description:
      "Read informative articles on eye health, cataract, pregnancy care, women's wellness, and healthcare tips from experts at Sant Haridas Hospital.",
    images: [
      "https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg",
    ],
  },
};

export default function BlogsPage() {
  return <BlogsPageClient />;
}