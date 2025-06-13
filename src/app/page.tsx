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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header with enhanced navigation */}
      <Header variant="main" />

      {/* Professional Hero Section */}
      <section className="relative flex items-start bg-cover bg-center py-12 lg:min-h-screen lg:py-16" style={{ backgroundImage: "url('/mainback.png')" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start lg:pt-16">
            {/* Left side content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left mt-8 lg:mt-0"
            >
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

              {/* Apple-style Live Status Pill */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-12 max-w-md mx-auto"
              >
                <div className="bg-white/90 backdrop-blur-xl rounded-full px-8 py-6 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">167,725</div>
                        <div className="text-xs text-gray-600 font-medium">Live Tenders</div>
                      </div>
                    </div>
                    
                    <div className="w-px h-8 bg-gray-200"></div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping animation-delay-500"></div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">33,977</div>
                        <div className="text-xs text-gray-600 font-medium">Fresh Tenders</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>


          </div>
        </div>
      </section>

      {/* Notification & Analytics Workflow Section */}
      <section id="workflow" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                Smart Notification
              </span>
              <br />
              <span className="text-gray-900">& Analytics Workflow</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Get instant notifications across multiple channels and leverage AI-powered analytics 
              to make informed bidding decisions with real-time tender insights.
            </motion.p>
          </div>

          {/* Workflow Steps */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Step 1: Detection */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Detection</h3>
              <p className="text-gray-600">Our AI continuously monitors 1000+ tender portals and instantly detects relevant opportunities matching your profile.</p>
            </motion.div>

            {/* Step 2: Multi-Channel Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Bell className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Channel Alerts</h3>
              <p className="text-gray-600 mb-4">Receive instant notifications via WhatsApp, Gmail, SMS, and mobile app push notifications.</p>
              
              {/* Notification Channels */}
              <div className="flex justify-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.273L12 10.91l10.091-7.09h.273c.904 0 1.636.732 1.636 1.636z"/>
                  </svg>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analytics</h3>
              <p className="text-gray-600">Get detailed bid analysis, competitor insights, success probability scores, and market trends to optimize your bidding strategy.</p>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link href="/make-payment">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-12 py-4 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Bell className="mr-3 h-6 w-6" />
                Start Getting Smart Tender Alerts
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section - Web3 Style */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-green-500/5 to-yellow-500/5"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="text-gray-900">Advanced </span>
              <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-gray-900">Tender Management Features</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              Everything you need to dominate the government tender landscape with intelligent automation, 
              real-time notifications, and next-generation AI-driven insights.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                className="group relative bg-white/90 backdrop-blur-md p-8 rounded-3xl border border-white/30 hover:border-blue-200/60 transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)`,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset'
                }}
              >
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-green-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                
                <div className="relative">
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  
                  {/* Decorative element */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
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

                <Link href="/make-payment" className="block">
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

      {/* FAQ Section - Web3 Style */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50/30 to-white/60 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gradient-to-l from-yellow-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
              <br />
              <span className="text-gray-900">About Tender Management</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Everything you need to know about government tenders and 
              AI-powered tender notifications in India
            </motion.p>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className="group bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 hover:border-blue-200/50 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-gray-900 pr-4 group-hover:text-blue-600 transition-colors">
                    {faq.question}
                  </h3>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openFaq === index 
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 rotate-180' 
                      : 'bg-gradient-to-r from-blue-500/20 to-green-500/20 group-hover:from-blue-500/40 group-hover:to-green-500/40'
                  }`}>
                    {openFaq === index ? (
                      <MinusCircle className="h-5 w-5 text-white" />
                    ) : (
                      <PlusCircle className={`h-5 w-5 ${openFaq === index ? 'text-white' : 'text-blue-600'}`} />
                    )}
                  </div>
                </button>
                {openFaq === index && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-8 pb-6"
                  >
                    <div className="h-px bg-gradient-to-r from-blue-200 to-green-200 mb-4"></div>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section - Web3 Style */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-green-600/20 to-yellow-600/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-sm bg-white/10 rounded-3xl p-12 border border-white/20"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2) inset'
            }}
          >
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                Tender Success Rate?
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed"
            >
              Join thousands of businesses across India that trust TenderPost to track government tenders 
              and opportunities. Start winning more tenders with next-generation AI-powered insights today.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href="/make-payment">
                <Button 
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-4 h-auto rounded-2xl font-semibold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  <Zap className="mr-3 h-6 w-6" />
                  Start Tender Tracking Now
                </Button>
              </Link>
              <Button 
                variant="outline"
                className="border-2 border-white/50 text-white hover:bg-white hover:text-blue-600 text-lg px-10 py-4 h-auto rounded-2xl font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <Users className="mr-3 h-6 w-6" />
                Contact Our Tender Experts
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer with tender-focused links */}
      <Footer />
    </div>
  );
}
