import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.santharidashospital.com'),
  title: {
    default: 'Eye & Gynae Hospital in Najafgarh, Delhi | Sant Haridas Hospital',
    template: '%s | Sant Haridas Hospital',
  },
  description:
    'Sant Haridas Hospital is a healthcare hospital in Najafgarh, Delhi offering specialized Eye Care and Gynae services along with Pharmacy and Lab Tests. Book your consultation today.',
  keywords: [
    'eye hospital in Najafgarh',
    'eye doctor in Najafgarh',
    'eye specialist in Najafgarh',
    'eye care hospital in Najafgarh',
    'eye clinic in Najafgarh',
    'eye hospital in Delhi',
    'eye specialist in Delhi',
    'ophthalmologist in Najafgarh',
    'eye checkup in Najafgarh',
    'eye treatment in Najafgarh',
    'gynae hospital in Najafgarh',
    'gynaecologist in Najafgarh',
    'women healthcare in Najafgarh',
    'Sant Haridas Hospital',
    'Najafgarh',
    'Ram Nagar',
    'Nangloi',
    'Nangloi-Najafgarh Road',
    'Delhi 110043',
    'West Delhi',
    'South West Delhi',
  ],
  authors: [{ name: 'Sant Haridas Hospital', url: 'https://www.santharidashospital.com' }],
  creator: 'Sant Haridas Hospital',
  publisher: 'Sant Haridas Hospital',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://www.santharidashospital.com',
  },
  verification: {
    google: 'lg7ZJC_mm1ldqS5Afdtg-JwW1LtBbbWF11Go3lk7d_k',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon-light-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.santharidashospital.com',
    siteName: 'Sant Haridas Hospital',
    title: 'Eye & Gynae Hospital in Najafgarh, Delhi | Sant Haridas Hospital',
    description:
      'Sant Haridas Hospital is a healthcare hospital in Najafgarh, Delhi offering specialized Eye Care and Gynae services along with Pharmacy and Lab Tests. Book your consultation today.',
    images: [
      {
        url: 'https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg',
        width: 1200,
        height: 630,
        alt: 'Sant Haridas Hospital - Eye & Gynae Care in Najafgarh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eye & Gynae Hospital in Najafgarh, Delhi | Sant Haridas Hospital',
    description:
      'Sant Haridas Hospital is a healthcare hospital in Najafgarh, Delhi offering specialized Eye Care and Gynae services along with Pharmacy and Lab Tests.',
    images: ['https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light',
  themeColor: '#1a9fa8',
}

const hospitalSchema = {
  '@context': 'https://schema.org',
  '@type': 'Hospital',
  name: 'Sant Haridas Hospital',
  alternateName: 'Sant Haridas Eye & Gynae Hospital',
  url: 'https://www.santharidashospital.com',
  logo: 'https://www.santharidashospital.com/favicon.png',
  image: 'https://res.cloudinary.com/df01whs60/image/upload/v1785656956/Sant_haridas_hospital_logo_page-0001_vu9ssi.jpg',
  description:
    'Sant Haridas Hospital is a healthcare hospital in Najafgarh, Delhi offering specialized Eye Care and Gynae services along with Pharmacy and Lab Tests.',
  telephone: '+91 95407 40947',
  email: 'santharidashospital@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Main Nangloi – Najafgarh Road, Ram Nagar',
    addressLocality: 'Najafgarh',
    addressRegion: 'Delhi',
    postalCode: '110043',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '28.6129',
    longitude: '76.9856',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  medicalSpecialty: [
    'Ophthalmology',
    'Obstetrics',
    'Gynecology',
    'Pediatrics',
    'GeneralMedicine',
    'Pathology',
    'Physiotherapy',
  ],
  areaServed: [
    'Najafgarh',
    'Ram Nagar',
    'Nangloi',
    'Nangloi-Najafgarh Road',
    'Delhi 110043',
    'West Delhi',
    'South West Delhi',
  ],
  priceRange: '₹₹',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Hospital Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalProcedure',
          name: 'Eye Care & Cataract Surgery',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalProcedure',
          name: 'Obstetrics & Gynecology Consultations',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalProcedure',
          name: 'Child OPD & Pediatric Care',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalProcedure',
          name: 'Pathology & Diagnostic Laboratory',
        },
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light bg-white">
      <head>
        <meta name="google-site-verification" content="lg7ZJC_mm1ldqS5Afdtg-JwW1LtBbbWF11Go3lk7d_k" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalSchema) }}
        />
      </head>
      <body className="antialiased bg-white">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}