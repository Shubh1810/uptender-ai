import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Building2, HardHat, Road, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentPageHeader } from '@/components/Header';
import { ContentPageFooter } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Construction Tenders India 2024 | Building, Infrastructure & Civil Tenders | TenderPost AI',
  description: 'Find latest construction tenders across India. Building tenders, infrastructure projects, civil works, roads & bridges, and construction equipment. Get instant AI-powered notifications.',
  keywords: 'construction tenders India, building tenders, infrastructure tenders, civil tenders, PWD tenders, road construction tenders, bridge tenders, construction contracts India, government construction tenders',
  openGraph: {
    title: 'Construction Tenders India 2024 | Building & Infrastructure Tenders',
    description: 'Access latest construction and infrastructure tenders across India with AI-powered notifications. Building, civil, and road construction tenders.',
    url: 'https://tenderpost.org/construction-tenders',
    type: 'article',
  },
  alternates: {
    canonical: 'https://tenderpost.org/construction-tenders',
  },
};

export default function ConstructionTenders() {
  const constructionCategories = [
    {
      icon: Building2,
      title: 'Building & Civil Works',
      description: 'Residential and commercial construction, civil works, and building contracts',
      examples: ['Building Construction', 'RCC Works', 'Structural Steel', 'Finishing Works', 'Renovation'],
    },
    {
      icon: Road,
      title: 'Infrastructure & Roads',
      description: 'Roads, bridges, highways, and urban infrastructure projects',
      examples: ['Road Construction', 'Bridge Works', 'Highway Projects', 'Pavement', 'Drainage'],
    },
    {
      icon: Wrench,
      title: 'MEP & Equipment',
      description: 'Electrical, plumbing, HVAC, and construction equipment procurement',
      examples: ['Electrical Works', 'Plumbing', 'HVAC', 'Lifts & Escalators', 'Construction Equipment'],
    },
  ];

  const recentStats = [
    { label: 'Active Construction Tenders', value: '12,000+', period: 'Monthly' },
    { label: 'Average Tender Value', value: '₹3.2 Cr', period: 'Construction Sector' },
    { label: 'Success Rate Improvement', value: '68%', period: 'With AI Analysis' },
    { label: 'Notification Speed', value: '< 15 min', period: 'Real-time Alerts' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <ContentPageHeader />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
          <li><ArrowRight className="h-4 w-4" /></li>
          <li className="text-gray-900 font-medium">Construction Tenders</li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Construction Tenders India 2024
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Access the latest construction and infrastructure tenders across India. From building and civil works
            to roads, bridges, and MEP — never miss a construction opportunity.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {recentStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="text-2xl font-bold text-amber-600 mb-1">{stat.value}</div>
                <div className="text-gray-900 font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.period}</div>
              </div>
            ))}
          </div>

          <Link href="/make-payment">
            <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4">
              <HardHat className="mr-2 h-5 w-5" />
              Get Construction Tender Alerts
            </Button>
          </Link>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Types of Construction Tenders
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {constructionCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-center mb-4">
                  <div className="bg-amber-100 rounded-lg p-3 w-fit mx-auto mb-3">
                    <category.icon className="h-6 w-6 text-amber-600" />
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

        <section className="text-center bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Win More Construction Tenders?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join construction companies using TenderPost AI to track and win infrastructure tenders
          </p>
          <div className="space-x-4">
            <Link href="/make-payment">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/tender-guide">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
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
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Construction Tenders India 2024',
            description: 'Find latest construction and infrastructure tenders across India including building, civil, roads and MEP tenders with AI-powered notifications.',
            url: 'https://tenderpost.org/construction-tenders',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://tenderpost.org' },
                { '@type': 'ListItem', position: 2, name: 'Construction Tenders', item: 'https://tenderpost.org/construction-tenders' },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
