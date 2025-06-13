'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Users, 
  CheckCircle, 
  Brain,
  FileText,
  BarChart3,
  Bell,
  Target,
  TrendingUp,
  Search,
  Heart,
  Building,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ColourfulText } from '@/components/ui/colourful-text';
import { SearchBar } from '@/components/ui/search-bar';
import { EmailSignup } from '@/components/ui/email-signup';
import { AnnouncementBanner } from '@/components/ui/announcement-banner';
import { WaitlistOverlay } from '@/components/ui/waitlist-overlay';

export default function Home() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Tender Analysis',
      description: 'Advanced AI algorithms analyze government tenders, healthcare tenders, and construction tenders to provide intelligent insights for better bidding decisions and higher win rates.'
    },
    {
      icon: Bell,
      title: 'Real-Time Tender Notifications',
      description: 'Get instant alerts for relevant government tenders, healthcare tenders, pharmaceutical tenders, and construction opportunities matching your business profile across India.'
    },
    {
      icon: Target,
      title: 'Smart Tender Filtering',
      description: 'Intelligent filtering system for government procurement, GeM tenders, state tenders, and central government tenders based on your business category and location preferences.'
    },
    {
      icon: BarChart3,
      title: 'Tender Analytics Dashboard',
      description: 'Comprehensive analytics for tender tracking, bid success rates, competitor analysis, and market trends in Indian government procurement and private sector tenders.'
    },
    {
      icon: FileText,
      title: 'Automated Bid Documentation',
      description: 'AI-assisted preparation of tender documents, technical specifications, and compliance documentation for government tenders and healthcare procurement processes.'
    },
    {
      icon: TrendingUp,
      title: 'Tender Market Intelligence',
      description: 'Deep insights into tender market trends, pricing analysis, competitor strategies, and success patterns across various sectors including healthcare, construction, and IT.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: 9134,
      description: 'Essential tender tracking for small businesses',
      features: [
        'Government tender notifications',
        'Basic AI analysis',
        'Email alerts',
        'Standard templates',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      price: 12353,
      description: 'Advanced features for growing companies',
      features: [
        'All Basic features',
        'Advanced AI recommendations',
        'Multi-sector coverage',
        'Priority support',
        'Analytics dashboard',
        'Custom filters'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 14983,
      description: 'Complete solution for large organizations',
      features: [
        'All Professional features',
        'Unlimited notifications',
        'API access',
        'Dedicated support',
        'Custom integrations',
        'White-label options'
      ]
    }
  ];

  const tenderCategories = [
    {
      icon: Heart,
      title: 'Healthcare & Medical Tenders',
      description: 'Medical equipment, pharmaceutical supplies, hospital tenders, diagnostic equipment, and healthcare infrastructure projects across India.',
      keywords: 'Healthcare tenders, medical equipment tenders, pharmaceutical tenders, hospital supplies'
    },
    {
      icon: Building,
      title: 'Construction & Infrastructure',
      description: 'Road construction, building projects, smart city tenders, water supply, electricity infrastructure, and public works department tenders.',
      keywords: 'Construction tenders, infrastructure tenders, PWD tenders, road construction'
    },
    {
      icon: Shield,
      title: 'Government & Defense',
      description: 'Central government tenders, defense procurement, public sector undertaking tenders, and government department requirements.',
      keywords: 'Government tenders, defense tenders, PSU tenders, central government procurement'
    },
    {
      icon: Zap,
      title: 'IT & Technology',
      description: 'Software development, IT infrastructure, digital services, cybersecurity, and technology implementation tenders from government and private sectors.',
      keywords: 'IT tenders, software tenders, technology procurement, digital services'
    }
  ];

  const faqData = [
    {
      question: 'What types of tenders does Tender Post AI cover?',
      answer: 'Tender Post AI covers all major tender categories including government tenders, healthcare tenders, construction tenders, pharmaceutical tenders, medical equipment tenders, IT tenders, defense tenders, and infrastructure projects across India. We monitor GeM, eProcurement portals, state government websites, and central government tender portals.'
    },
    {
      question: 'How does the AI-powered tender notification system work?',
      answer: 'Our AI system continuously monitors 1000+ government and private tender portals across India. It uses advanced algorithms to match tenders with your business profile, location, and tender categories. You receive real-time notifications via email, SMS, and mobile app for relevant government tenders, healthcare tenders, and construction opportunities.'
    },
    {
      question: 'Can I track healthcare and pharmaceutical tenders specifically?',
      answer: 'Yes! Tender Post AI specializes in healthcare tender tracking. We monitor medical equipment tenders, pharmaceutical tenders, hospital supply tenders, diagnostic equipment procurement, and healthcare infrastructure projects from government hospitals, medical colleges, and healthcare institutions across India.'
    },
    {
      question: 'What is the success rate improvement with Tender Post AI?',
      answer: 'Our users report an average 40-60% improvement in tender win rates. The AI-powered bid analysis, competitor intelligence, and market insights help businesses make better bidding decisions. Our tender automation reduces preparation time by 70% and ensures timely submission.'
    },
    {
      question: 'Do you provide support for government tender documentation?',
      answer: 'Yes, our Professional and Enterprise plans include AI-assisted documentation support. We help with technical specifications, compliance documentation, EMD calculations, and bid preparation for government tenders, healthcare procurement, and construction projects.'
    },
    {
      question: 'How quickly will I receive tender notifications?',
      answer: 'Tender notifications are sent within 15 minutes of publication on government portals. Our real-time monitoring ensures you never miss important government tenders, healthcare opportunities, or construction projects. Premium users get priority alerts for high-value tenders.'
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Blue Glow Blur Balls - Background Design Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Large blur balls */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-sky-300/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-blue-500/12 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        
        {/* Medium blur balls */}
        <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-cyan-400/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-blue-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-2/3 left-20 w-44 h-44 bg-sky-400/9 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '5s' }} />
        <div className="absolute top-10 right-1/3 w-52 h-52 bg-blue-600/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }} />
        
        {/* Small blur balls */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-cyan-300/12 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-blue-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '3.5s' }} />
        <div className="absolute top-1/2 right-16 w-36 h-36 bg-sky-500/8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-blue-300/9 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4.5s' }} />
        <div className="absolute top-3/4 left-1/2 w-24 h-24 bg-cyan-400/11 rounded-full blur-xl animate-pulse" style={{ animationDelay: '5.5s' }} />
        
        {/* Extra small accent balls */}
        <div className="absolute top-16 left-1/3 w-20 h-20 bg-blue-500/12 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-16 left-16 w-16 h-16 bg-sky-400/14 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2.8s' }} />
        <div className="absolute top-1/3 right-20 w-18 h-18 bg-cyan-300/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '4.2s' }} />
      </div>

      {/* Announcement Banner */}
      <AnnouncementBanner />
      
      {/* Header with enhanced navigation */}
      <Header variant="main" />

      {/* Professional Hero Section */}
      <section className="relative flex items-start bg-cover bg-center py-12 lg:min-h-screen lg:py-16 z-10" style={{ backgroundImage: "url('/mainback.png')" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start lg:pt-16">
            {/* Left side content */}
            <div className="text-left mt-8 lg:mt-0">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Your{' '}
                <span className="text-4xl md:text-6xl font-bold">
                  <ColourfulText text="AI powered" />
                </span>{' '}
                Tender Automation Platform
                <div className="inline-flex items-center ml-3 space-x-2">
                  <span className="text-sm text-gray-600 font-medium">powered by</span>
        <Image
                    src="/acuron.PNG"
                    alt="TenderPost Logo"
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
            </div>
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Get instant notifications for <strong>government tenders</strong> across all Industries in India. 
                AI-powered tender analysis, bid automation, and intelligent next-gen tender tracking system.
              </p>
              
              <div className="mb-8">
                <SearchBar 
                  placeholder="Search tenders by keyword..."
                  onSearch={(query) => console.log('Searching for:', query)}
                  className="max-w-lg"
                />
        </div>

              {/* Simplified Live Status */}
              <div className="mt-12 max-w-md mx-auto">
                <div className="bg-white rounded-2xl px-8 py-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">167,725</div>
                        <div className="text-xs text-gray-600 font-medium">Live Tenders</div>
                      </div>
            </div>

                    <div className="w-px h-8 bg-gray-200"></div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                        <div className="text-lg font-bold text-gray-900">33,977</div>
                        <div className="text-xs text-gray-600 font-medium">Fresh Tenders</div>
              </div>
              </div>
              </div>
            </div>
          </div>
            </div>


          </div>
        </div>
      </section>

      {/* Professional Workflow Section */}
      <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Smart Notification & Analytics Workflow
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant notifications across multiple channels and leverage AI-powered analytics 
              to make informed bidding decisions with real-time tender insights.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Step 1: Detection */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-gray-200">
                  <svg className="h-10 w-10 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.849-2.693L5.757 17.657z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Detection</h3>
              <p className="text-gray-600">Our AI continuously monitors 1000+ tender portals and instantly detects relevant opportunities matching your profile.</p>
            </div>

            {/* Step 2: Multi-Channel Notifications */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-gray-200">
                  <svg className="h-10 w-10 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Channel Alerts</h3>
              <p className="text-gray-600 mb-4">Receive instant notifications via WhatsApp, Gmail, Slack, and Google Sheets integration.</p>
              
              {/* Notification Channels */}
              <div className="flex justify-center space-x-3">
                {/* WhatsApp */}
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                </div>
                {/* Gmail */}
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.273L12 10.91l10.091-7.09h.273c.904 0 1.636.732 1.636 1.636z"/>
                  </svg>
                </div>
                {/* Slack */}
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 5.042 10.12h2.52v2.522a2.528 2.528 0 0 1-2.52 2.523zm0-6.73a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 5.042 3.39a2.528 2.528 0 0 1 2.52 2.522v2.523H5.042zm6.73 0a2.528 2.528 0 0 1-2.523-2.523A2.528 2.528 0 0 1 11.772 3.39a2.528 2.528 0 0 1 2.523 2.522v2.523h-2.523zm0 6.73a2.528 2.528 0 0 1-2.523-2.523v-2.522H11.772a2.528 2.528 0 0 1 2.523 2.522 2.528 2.528 0 0 1-2.523 2.523z"/>
                  </svg>
                </div>
                {/* Google Sheets */}
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.44 3H4.56C3.15 3 2 4.15 2 5.56v12.88C2 19.85 3.15 21 4.56 21h14.88C20.85 21 22 19.85 22 18.44V5.56C22 4.15 20.85 3 19.44 3zM14 17H8v-2h6v2zm0-4H8v-2h6v2zm0-4H8V7h6v2z"/>
                  </svg>
                </div>
                {/* Zapier */}
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 1.5a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm-1.5 3.5v2.5H8v3h2.5v2.5h3V13H16v-3h-2.5V7.5h-3z"/>
                  </svg>
                </div>
                {/* HubSpot */}
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.164 7.931V6.993c1.2-.91 1.98-2.364 1.98-3.993 0-2.761-2.238-5-5-5s-5 2.239-5 5c0 1.629.78 3.084 1.98 3.993v.938c-4.324.473-7.124 4.244-7.124 8.569 0 2.761 2.238 5 5 5s5-2.239 5-5c0-1.629-.78-3.084-1.98-3.993v-.938c4.324-.473 7.124-4.244 7.124-8.569 0-2.761-2.238-5-5-5s-5 2.239-5 5c0 1.629.78 3.084 1.98 3.993v.938c-4.324.473-7.124 4.244-7.124 8.569 0 2.761 2.238 5 5 5s5-2.239 5-5c0-1.629-.78-3.084-1.98-3.993z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Step 3: Analytics */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-gray-200">
                  <svg className="h-10 w-10 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analytics</h3>
              <p className="text-gray-600">Get detailed bid analysis, competitor insights, success probability scores, and market trends to optimize your bidding strategy.</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link href="/make-payment?plan=professional&amount=12353">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Bell className="mr-3 h-6 w-6" />
                Start Getting Smart Tender Alerts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Advanced AI-Powered Tender Management Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to dominate the government tender landscape with intelligent automation, real-time notifications, and next-generation AI-driven insights.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 ml-4">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple One-Time Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business needs. One-time payment, lifetime access.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-xl p-8 border-2 transition-all duration-200 hover:shadow-lg ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600 text-lg ml-2">one-time</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/make-payment?plan=${plan.name.toLowerCase()}&amount=${plan.price}`} className="block">
                  <Button 
                    className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                      plan.popular
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about government tenders and 
              AI-powered tender notifications in India
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFaq === index ? (
                      <MinusCircle className="h-5 w-5 text-gray-600" />
                    ) : (
                      <PlusCircle className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Email Signup Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 relative z-10">
        <div className="max-w-2xl mx-auto">
          <EmailSignup />
        </div>
      </section>

      {/* Enhanced Footer with tender-focused links */}
      <Footer />

      {/* Waitlist Overlay for First-Time Visitors */}
      <WaitlistOverlay />

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          }),
        }}
      />
    </div>
  );
}
