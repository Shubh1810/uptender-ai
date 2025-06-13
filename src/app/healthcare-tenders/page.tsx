import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Heart, 
  Stethoscope, 
  Activity,
  Bell,
  CheckCircle,
  ArrowRight,
  Building2,
  Pill,
  Microscope,
  Ambulance,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentPageHeader } from '@/components/Header';
import { ContentPageFooter } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Healthcare Tenders India 2024 | Medical Equipment & Pharmaceutical Tenders | TenderPost AI',
  description: 'Find latest healthcare tenders across India. Medical equipment tenders, pharmaceutical tenders, hospital supplies, diagnostic equipment, and healthcare infrastructure projects. Get instant AI-powered notifications.',
  keywords: 'healthcare tenders India, medical equipment tenders, pharmaceutical tenders, hospital tenders, diagnostic equipment tenders, medical supplies procurement, healthcare infrastructure, AIIMS tenders, government hospital tenders',
  openGraph: {
    title: 'Healthcare Tenders India 2024 | Medical Equipment & Pharmaceutical Tenders',
    description: 'Access latest healthcare and medical tenders across India with AI-powered notifications. Medical equipment, pharmaceutical, and hospital supply tenders.',
    url: 'https://tenderpost.org/healthcare-tenders',
    type: 'article',
  },
  alternates: {
    canonical: 'https://tenderpost.org/healthcare-tenders',
  },
};

export default function HealthcareTenders() {
  const healthcareCategories = [
    {
      icon: Stethoscope,
      title: 'Medical Equipment Tenders',
      description: 'Advanced medical devices, diagnostic equipment, surgical instruments, and hospital machinery',
      examples: ['MRI Machines', 'CT Scanners', 'Ventilators', 'X-Ray Equipment', 'Ultrasound Systems']
    },
    {
      icon: Pill,
      title: 'Pharmaceutical Tenders',
      description: 'Medicine procurement, drug supplies, vaccines, and pharmaceutical manufacturing contracts',
      examples: ['Generic Medicines', 'Vaccines', 'Surgical Drugs', 'Emergency Medicines', 'Ayurvedic Products']
    },
    {
      icon: Building2,
      title: 'Hospital Infrastructure',
      description: 'Hospital construction, medical facility upgrades, and healthcare infrastructure development',
      examples: ['Hospital Construction', 'ICU Setup', 'OT Equipment', 'Medical Gas Pipeline', 'HVAC Systems']
    }
  ];

  const recentStats = [
    { label: 'Active Healthcare Tenders', value: '8,500+', period: 'Monthly' },
    { label: 'Average Tender Value', value: '₹1.8 Cr', period: 'Healthcare Sector' },
    { label: 'Success Rate Improvement', value: '72%', period: 'With AI Analysis' },
    { label: 'Medical Equipment Tenders', value: '3,200+', period: 'Per Month' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <ContentPageHeader />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li><ArrowRight className="h-4 w-4" /></li>
          <li className="text-gray-900 font-medium">Healthcare Tenders</li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Healthcare Tenders India 2024
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Access the latest healthcare and medical tenders across India. From medical equipment procurement 
            to pharmaceutical supplies and hospital infrastructure - never miss a healthcare opportunity.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {recentStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="text-2xl font-bold text-red-600 mb-1">{stat.value}</div>
                <div className="text-gray-900 font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.period}</div>
              </div>
            ))}
          </div>

          <Link href="/make-payment">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4">
              <Heart className="mr-2 h-5 w-5" />
              Get Healthcare Tender Alerts
            </Button>
          </Link>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Types of Healthcare Tenders
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {healthcareCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-center mb-4">
                  <div className="bg-red-100 rounded-lg p-3 w-fit mx-auto mb-3">
                    <category.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 text-sm">Common Items:</h4>
                  <div className="flex flex-wrap gap-1">
                    {category.examples.map((example, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Win More Healthcare Tenders?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join leading healthcare companies using TenderPost AI to track and win medical tenders
          </p>
          <div className="space-x-4">
            <Link href="/make-payment">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/tender-guide">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                Learn More
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <ContentPageFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Healthcare Tenders India 2024",
            "description": "Find latest healthcare and medical tenders across India including medical equipment, pharmaceutical, and hospital supply tenders with AI-powered notifications.",
            "url": "https://tenderpost.org/healthcare-tenders",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://tenderpost.org"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Healthcare Tenders",
                  "item": "https://tenderpost.org/healthcare-tenders"
                }
              ]
            }
          }),
        }}
      />
    </div>
  );
} 