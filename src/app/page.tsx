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

import { SearchBar } from '@/components/ui/search-bar';
import { EmailSignup } from '@/components/ui/email-signup';
import { WaitlistOverlay } from '@/components/ui/waitlist-overlay';

export default function Home() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [ctaEmail, setCtaEmail] = React.useState('');
  const [ctaLoading, setCtaLoading] = React.useState(false);
  const [ctaSuccess, setCtaSuccess] = React.useState(false);

  const handleCtaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctaEmail || ctaLoading) return;

    setCtaLoading(true);
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: ctaEmail,
          source: 'cta-section'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCtaSuccess(true);
        setCtaEmail('');
        
        // Auto-reset success state after 5 seconds
        setTimeout(() => {
          setCtaSuccess(false);
        }, 5000);
      } else {
        console.error('Signup failed:', data.error);
        alert(data.error || 'Failed to join waitlist. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setCtaLoading(false);
    }
  };

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
      ]
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
      ],
      popular: true
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

      {/* Header */}
      <Header variant="main" />



      {/* Professional Hero Section */}
      <section 
        className="hero-section relative py-16 lg:py-24 z-10 pt-32"
        style={{
          backgroundColor: '#fefcf3',
          backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="relative flex items-center bg-cover bg-center rounded-3xl p-6 lg:p-24 bg-white min-h-[400px] lg:min-h-[550px]" 
            style={{ 
              backgroundImage: "url('/mainbackk.PNG')",
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundColor: '#f8fafc' // Fallback color if image fails to load
            }}
          >
            <div className="w-full z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side content */}
            <div className="text-center lg:text-left mt-8 lg:mt-12 px-2 lg:pl-24">
              <h1 className="font-ubuntu text-2xl md:text-4xl text-gray-900 mb-2 leading-tight">
                Your <span className="text-2xl md:text-4xl font-semibold font-mono">AI-powered Tender Automation</span> <span className="font-semibold">Platform</span>{' '}
                <span className="inline-flex items-center ml-2 text-sm text-gray-600 font-medium">
                  powered by{' '}
                  <Image
                    src="/acuron.PNG"
                    alt="Acuron"
                    width={50}
                    height={20}
                    className="ml-1 rounded opacity-70"
                  />
                </span>
              </h1>
              <p className="font-ubuntu text-xs text-gray-600 mb-6 leading-relaxed px-1 lg:px-0">
                Get instant notifications for <strong>government tenders</strong> across all Industries in India. 
                AI-powered tender analysis, bid automation, and intelligent next-gen tender tracking system.
              </p>
              
              <div className="mb-8 flex justify-center lg:justify-start">
                <SearchBar 
                  placeholder="Search tenders by keyword..."
                  onSearch={(query) => console.log('Searching for:', query)}
                  className="max-w-lg w-full"
                />
              </div>

              {/* Apple-like Metrics Container */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  {/* Main Metrics Card */}
                  <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Live Tenders - Not Connected */}
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gray-400 rounded-full shadow-lg"></div>
                        <div>
                          <div className="font-ubuntu text-xl font-bold text-gray-600">0</div>
                          <div className="font-ubuntu text-xs text-gray-500 font-medium">Live Tenders · Not Connected</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

                {/* Right side - Empty now */}
                <div className="hidden lg:block">
                </div>
              </div>
            </div>
          </div>
          
          {/* Trusted By Section - Floating below container */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-medium mb-6">Trusted by leading organizations</p>
              <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 opacity-60">
                {/* Real company logos */}
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/iso.webp"
                    alt="ISO Certified"
                    width={80}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/Make_In_India.png"
                    alt="Make In India"
                    width={120}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/msme.png"
                    alt="MSME Registered"
                    width={100}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/NSIC.PNG"
                    alt="NSIC"
                    width={90}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/ce-mark.png"
                    alt="CE Mark"
                    width={80}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/who.png"
                    alt="WHO"
                    width={80}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/atma.png"
                    alt="ATMA"
                    width={80}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/cdsco-logo.webp"
                    alt="CDSCO"
                    width={90}
                    height={48}
                    className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Workflow Section */}
      <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10" style={{ backgroundColor: '#fefcf3' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-gray-900">
              Smart Tender Notifications
            </h2>
            <p className="text-lg text-gray-600">
              AI detection → Multi-channel alerts → Win more tenders
            </p>
          </div>

          {/* Simplified Workflow */}
          <div className="flex items-center justify-center space-x-8 mb-12">
            {/* AI Detection */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">AI</span>
              </div>
              <p className="text-sm font-medium text-gray-900">AI Detection</p>
            </div>

            {/* Arrow */}
            <div className="text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Notifications */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Instant Alerts</p>
            </div>

            {/* Arrow */}
            <div className="text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Success */}
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Win Tenders</p>
            </div>
          </div>

          {/* Notification Channels */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 mb-4">Get notified instantly via:</p>
            <div className="flex justify-center items-center space-x-4">
              {/* WhatsApp */}
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                </svg>
              </div>

              {/* Gmail */}
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.273L12 10.91l10.091-7.09h.273c.904 0 1.636.732 1.636 1.636z"/>
                </svg>
              </div>

              {/* iMessage */}
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.74 0-3.35-.56-4.656-1.515L3 20l1.515-4.344A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link href="/make-payment?plan=professional&amount=12353">
              <Button className="relative bg-white hover:bg-blue-900 text-gray-900 hover:text-white border-2 border-transparent bg-clip-padding shadow-md hover:shadow-lg transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-blue-900 before:via-blue-600 before:to-sky-400 hover:before:bg-blue-900 px-8 py-3">
                <Bell className="mr-2 h-5 w-5" />
                Start Getting Alerts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10" style={{ backgroundColor: '#fefcf3' }}>
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

                <ul className={`space-y-3 ${plan.name === 'Basic' ? 'mb-16' : 'mb-8'}`}>
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

      {/* Modern Minimal CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-900 relative z-10 overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Email icon floating */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl mb-8 border border-white/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join the Waitlist
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Be the first to access AI-powered tender notifications. Get early access and exclusive launch pricing.
          </p>

          {/* Floating email form */}
          <div className="relative max-w-md mx-auto">
            <form onSubmit={handleCtaSubmit} className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                value={ctaEmail}
                onChange={(e) => setCtaEmail(e.target.value)}
                className="w-full h-14 pl-6 pr-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all duration-300"
                disabled={ctaLoading}
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 h-10 px-6 bg-white text-gray-900 rounded-xl font-medium hover:bg-white/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40"
                disabled={ctaLoading}
              >
                {ctaLoading ? 'Joining...' : 'Join'}
              </button>
            </form>
            {ctaSuccess && (
              <p className="mt-4 text-green-500 text-sm text-center">
                Thank you for joining! We'll be in touch soon.
              </p>
            )}
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-white/60 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>No spam</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Early access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>5,000+ joined</span>
            </div>
          </div>
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
