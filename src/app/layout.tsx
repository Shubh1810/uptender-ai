import type { Metadata } from "next";
import { Geist, Geist_Mono, Kings, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kings = Kings({
  variable: "--font-kings",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TenderPost - AI Tender Notifier & Automation Platform for India | Government Tenders, Healthcare Tenders",
  description: "Revolutionary AI-powered tender management platform for India. Get instant notifications for government tenders, healthcare tenders, construction tenders. Advanced tender automation, bid analysis, and tender tracking system. Win more tenders with AI-driven insights.",
  keywords: [
    "tender notifier India",
    "government tenders India", 
    "healthcare tenders",
    "tender automation India",
    "AI tender management",
    "tender tracking system",
    "construction tenders India",
    "pharmaceutical tenders",
    "medical equipment tenders",
    "tender bidding platform",
    "government procurement India",
    "tender alerts India",
    "bid management software",
    "tender search engine",
    "etender platform",
    "GeM tenders",
    "CPPP tenders",
    "state government tenders",
    "central government tenders",
    "tender database India"
  ].join(", "),
  authors: [{ name: "TenderPost Team" }],
  creator: "TenderPost",
  publisher: "TenderPost",
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
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://tenderpost.org',
    siteName: 'TenderPost',
    title: 'TenderPost - AI Tender Notifier & Automation Platform for India',
    description: 'Revolutionary AI-powered tender management platform for India. Get instant notifications for government tenders, healthcare tenders, construction tenders with advanced AI automation.',
    images: [
      {
        url: '/uptenderlogo.png',
        width: 1200,
        height: 630,
        alt: 'TenderPost - AI Tender Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TenderPost - AI Tender Notifier & Automation Platform for India',
    description: 'Revolutionary AI-powered tender management for government tenders across industries in India. Advanced tender automation & bid analysis.',
    images: ['/uptenderlogo.png'],
    creator: '@tenderpost',
  },
  alternates: {
    canonical: 'https://tenderpost.org',
    languages: {
      'en-IN': 'https://tenderpost.org',
      'hi-IN': 'https://tenderpost.org/hi',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  category: 'Business Software',
  classification: 'Tender Management, Government Procurement, Business Intelligence',
  icons: {
    icon: [
      {
        url: '/uptenderlogo.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/uptenderlogo.png',
        type: 'image/png',
        sizes: '16x16',
      },
    ],
    shortcut: '/uptenderlogo.png',
    apple: {
      url: '/uptenderlogo.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
  other: {
    'theme-color': '#ffffff',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        {/* Enhanced SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TenderPost",
              "url": "https://tenderpost.org",
              "logo": "https://tenderpost.org/uptenderlogo.png",
              "description": "AI-powered tender management platform for India providing notifications and automation for government tenders across all industries.",
              "foundingDate": "2024",
              "founders": [
                {
                  "@type": "Person",
                  "name": "TenderPost Team"
                }
              ],
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "serviceType": [
                "Tender Management",
                "Government Procurement Services", 
                "Bid Management Software",
                "Tender Notification Services"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://twitter.com/tenderpost",
                "https://linkedin.com/company/tenderpost"
              ]
            }),
          }}
        />

        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TenderPost",
              "url": "https://tenderpost.org",
              "description": "Smart tender notifier and automation platform for India covering government tenders across all industries with AI-powered analysis.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://tenderpost.org/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "author": {
                "@type": "Organization",
                "name": "TenderPost"
              }
            }),
          }}
        />

        {/* Structured Data - SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TenderPost Platform",
              "operatingSystem": "Web Browser",
              "applicationCategory": "BusinessApplication",
              "description": "AI-powered tender management and notification platform for Indian government tenders across all industries with advanced automation and bid analysis.",
              "offers": {
                "@type": "Offer",
                "price": "499",
                "priceCurrency": "INR",
                "priceValidUntil": "2025-12-31",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "Tender Notifications",
                "AI Bid Analysis", 
                "Tender Automation",
                "Government Tender Tracking",
                "Healthcare Tender Alerts",
                "Construction Tender Management"
              ],
              "screenshot": "https://tenderpost.org/uptenderlogo.png"
            }),
          }}
        />

        {/* Structured Data - Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Tender Management Services",
              "description": "Comprehensive tender management services including government tender notifications, healthcare tender tracking, construction tender automation, and AI-powered bid analysis for Indian businesses.",
              "provider": {
                "@type": "Organization",
                "name": "Tender Post AI"
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Tender Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Government Tender Notifications"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Healthcare Tender Tracking"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Construction Tender Management"
                    }
                  }
                ]
              }
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kings.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
