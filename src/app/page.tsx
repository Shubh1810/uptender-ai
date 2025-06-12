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
      name: 'Starter',
      price: 499,
      description: 'Perfect for small businesses and startups entering government tender market',
      features: [
        'Up to 50 tender notifications per month',
        'Basic AI tender analysis',
        'Government tender alerts (Central & State)',
        'Email & SMS notifications',
        'Standard tender templates',
        'Basic bid tracking',
        'Email support'
      ]
    },
    {
      name: 'Professional',
      price: 1999,
      description: 'Ideal for growing companies targeting healthcare and construction tenders',
      features: [
        'Up to 200 tender notifications per month',
        'Advanced AI bid analysis & recommendations',
        'Healthcare & pharmaceutical tender alerts',
        'Construction & infrastructure tender tracking',
        'GeM and CPPP tender integration',
        'Custom tender filters & categories',
        'Priority support with tender experts',
        'Competitor analysis reports',
        'Tender success rate analytics'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 4999,
      description: 'For large organizations and tender consultants',
      features: [
        'Unlimited tender notifications',
        'Premium AI features with predictive analytics',
        'Multi-sector tender coverage (All categories)',
        'Dedicated tender research team',
        'White-label tender platform',
        'API access for tender data',
        'Custom integrations with ERP systems',
        'Advanced compliance monitoring',
        'Dedicated account manager',
        'Custom reporting & insights'
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

      {/* Enhanced Hero Section with Web3 style layout */}
      <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/heroback.png')" }}>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your 
                <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                  {' '}AI powered{' '}
                </span>
                Tender Automation Platform
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Get instant notifications for <strong>government tenders</strong> across all Industries in India. 
                AI-powered tender analysis, bid automation, and intelligent next-gen tender tracking system.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/make-payment">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 hover:from-blue-600 hover:via-green-600 hover:to-yellow-600 text-white text-lg px-8 py-4 h-auto shadow-lg"
                  >
                    <Bell className="mr-2 h-5 w-5" />
                    Start Getting Tender Alerts
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4 h-auto border-2 border-gray-300 hover:border-blue-500 transition-colors"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Tenders Now
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-left">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">1000+</div>
                  <div className="text-sm text-gray-600">Government Portals Monitored</div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">50,000+</div>
                  <div className="text-sm text-gray-600">Tender Notifications Sent Daily</div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-yellow-500 bg-clip-text text-transparent">95%</div>
                  <div className="text-sm text-gray-600">Customer Satisfaction Rate</div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">40-60%</div>
                  <div className="text-sm text-gray-600">Average Win Rate Improvement</div>
                </div>
              </div>
            </motion.div>
            
            {/* Right side - space for background motif */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              {/* This space is intentionally left for the background motif to show through */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tender Categories Section - Web3 Style */}
      <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50/50 to-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                Comprehensive Tender Coverage
              </span>
              <br />
              <span className="text-gray-900">Across India</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Track and get notifications for all types of government tenders across industries and 
              private sector opportunities in all Indian states and territories.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tenderCategories.map((category, index) => (
              <motion.article
                key={category.title}
                initial={{ opacity: 0, y: 30, rotateY: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-white/20 hover:border-blue-200/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.8) 100%)`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              >
                <div className="h-14 w-14 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <category.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{category.description}</p>
                <p className="text-xs bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent font-semibold">
                  {category.keywords}
                </p>
              </motion.article>
            ))}
          </div>
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

      {/* Enhanced Pricing Section - Web3 Style */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-green-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-500/10 via-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              <span className="text-gray-900">Choose Your </span>
              <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                Tender Management
              </span>
              <br />
              <span className="text-gray-900">Plan</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Flexible pricing for businesses of all sizes to access government tenders 
              and opportunities across India with AI-powered automation.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ 
                  y: -8, 
                  scale: plan.popular ? 1.08 : 1.05,
                  transition: { duration: 0.3 }
                }}
                className={`group relative backdrop-blur-md rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-white/95 to-blue-50/90 border border-blue-200/50 shadow-2xl' 
                    : 'bg-white/90 border border-white/30 hover:border-blue-200/50 shadow-lg hover:shadow-xl'
                }`}
                style={{
                  boxShadow: plan.popular 
                    ? '0 20px 60px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1) inset'
                    : '0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}
                
                {/* Gradient border effect for popular plan */}
                {plan.popular && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-green-500/20 to-yellow-500/20 -z-10 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                
                <div className="text-center mb-8 relative">
                  <h3 className={`text-2xl font-bold mb-3 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent' 
                      : 'text-gray-900 group-hover:text-blue-600'
                  } transition-colors`}>
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{plan.description}</p>
                  <div className="mt-6">
                    <span className={`text-5xl font-bold ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 bg-clip-text text-transparent' 
                        : 'text-gray-900'
                    }`}>
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-600 text-lg">/month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                      className="flex items-start group/item"
                    >
                      <CheckCircle className={`h-5 w-5 mr-4 flex-shrink-0 mt-0.5 transition-colors ${
                        plan.popular 
                          ? 'text-green-500' 
                          : 'text-green-500 group-hover/item:text-blue-500'
                      }`} />
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Link href="/make-payment" className="block">
                  <Button 
                    className={`w-full py-4 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 hover:from-blue-600 hover:via-green-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                        : 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    Get Started with {plan.name} →
                  </Button>
                </Link>
              </motion.div>
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
