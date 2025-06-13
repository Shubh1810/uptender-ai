import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { 
  Shield, 
  FileText, 
  TrendingUp,
  Bell,
  CheckCircle,
  ArrowRight,
  Building,
  Users,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentPageHeader } from '@/components/Header';
import { ContentPageFooter } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Government Tenders India 2024 | Central & State Government Procurement | TenderPost AI',
  description: 'Find latest government tenders across India. Central government tenders, state government procurement, PSU tenders, defense tenders, and ministry tenders. Get instant notifications with AI-powered tender management.',
  keywords: 'government tenders India, central government tenders, state government tenders, PSU tenders, defense tenders, ministry tenders, government procurement India, CPPP tenders, GeM tenders, government contracts',
  openGraph: {
    title: 'Government Tenders India 2024 | Central & State Government Procurement',
    description: 'Access latest government tenders across India with AI-powered notifications. Central government, state government, PSU, and defense tenders.',
    url: 'https://tenderpost.org/government-tenders',
    type: 'article',
  },
  alternates: {
    canonical: 'https://tenderpost.org/government-tenders',
  },
};

export default function GovernmentTenders() {
  const governmentCategories = [
    {
      icon: Shield,
      title: 'Central Government Tenders',
      description: 'Ministry tenders, central PSU procurement, and national-level government contracts',
      examples: ['Ministry of Defence', 'Ministry of Health', 'Ministry of Railways', 'DRDO', 'ISRO']
    },
    {
      icon: Building,
      title: 'State Government Tenders',
      description: 'State-level procurement, municipal corporation tenders, and regional government contracts',
      examples: ['PWD Tenders', 'State Health Departments', 'Municipal Corporations', 'State Transport']
    },
    {
      icon: Users,
      title: 'PSU & Public Sector',
      description: 'Public sector undertaking tenders and government enterprise procurement',
      examples: ['ONGC', 'NTPC', 'Coal India', 'BHEL', 'HAL']
    },
    {
      icon: Target,
      title: 'Defense & Security',
      description: 'Defense procurement, military equipment, and security-related government tenders',
      examples: ['Indian Army', 'Indian Navy', 'Indian Air Force', 'CRPF', 'BSF']
    }
  ];

  const majorPlatforms = [
    {
      name: 'GeM (Government e-Marketplace)',
      description: 'Primary platform for government procurement in India',
      url: 'https://gem.gov.in',
      coverage: 'All Central Government Departments'
    },
    {
      name: 'CPPP (Central Public Procurement Portal)',
      description: 'Central procurement portal for major government tenders',
      url: 'https://eprocure.gov.in',
      coverage: 'Central Ministries & PSUs'
    },
    {
      name: 'State eProcurement Portals',
      description: 'Individual state government procurement platforms',
      url: 'Various state portals',
      coverage: 'State Government Departments'
    }
  ];

  const recentStats = [
    { label: 'Active Government Tenders', value: '15,000+', period: 'Monthly' },
    { label: 'Average Tender Value', value: '₹2.5 Cr', period: 'Government Sector' },
    { label: 'Success Rate Improvement', value: '65%', period: 'With AI Analysis' },
    { label: 'Notification Speed', value: '< 15 min', period: 'Real-time Alerts' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <ContentPageHeader />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li><ArrowRight className="h-4 w-4" /></li>
          <li className="text-gray-900 font-medium">Government Tenders</li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Government Tenders India 2024
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Access the latest government tenders across India with AI-powered notifications. 
            From central government ministries to state procurement and PSU tenders - never miss an opportunity.
          </p>
          
          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {recentStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-gray-900 font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.period}</div>
              </div>
            ))}
          </div>

          <Link href="/make-payment">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4">
              <Bell className="mr-2 h-5 w-5" />
              Get Government Tender Alerts
            </Button>
          </Link>
        </div>

        {/* Government Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Types of Government Tenders
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {governmentCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <category.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Key Organizations:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Major Platforms */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Major Government Tender Platforms
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {majorPlatforms.map((platform, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{platform.name}</h3>
                <p className="text-gray-600 mb-4">{platform.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <strong>Coverage:</strong> {platform.coverage}
                </div>
                <div className="text-sm text-blue-600 font-medium">{platform.url}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How TenderPost Helps */}
        <section className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How TenderPost AI Transforms Government Tender Management
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Monitoring</h3>
              <p className="text-gray-600">
                AI monitors 1000+ government portals 24/7 and sends instant notifications for relevant tenders
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Advanced algorithms analyze tender requirements and provide bid optimization insights
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Documentation Support</h3>
              <p className="text-gray-600">
                AI-assisted preparation of government tender documents and compliance requirements
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Win More Government Tenders?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses using TenderPost AI to track and win government contracts
          </p>
          <div className="space-x-4">
            <Link href="/make-payment">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/tender-guide">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <ContentPageFooter />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Government Tenders India 2024",
            "description": "Find latest government tenders across India including central government, state government, PSU, and defense tenders with AI-powered notifications.",
            "url": "https://tenderpost.org/government-tenders",
            "mainEntity": {
              "@type": "Service",
              "name": "Government Tender Notifications",
              "description": "AI-powered government tender tracking and notification service for Indian businesses",
              "provider": {
                "@type": "Organization",
                "name": "TenderPost"
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "serviceType": "Government Procurement Notifications"
            },
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
                  "name": "Government Tenders",
                  "item": "https://tenderpost.org/government-tenders"
                }
              ]
            }
          }),
        }}
      />
    </div>
  );
} 