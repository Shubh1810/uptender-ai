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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with enhanced navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
        <Image
                src="/uptenderlogo.png" 
                alt="TenderPost AI - Smart Tender Notifier Platform for India" 
                className="h-10 w-10 rounded-xl object-contain"
          priority
                width={40}
                height={40}
              />
              <span className="text-2xl font-bold text-gray-900">TenderPost AI</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Tender Features</a>
              <a href="#categories" className="text-gray-600 hover:text-gray-900 transition-colors">Tender Categories</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQs</a>
              <Link href="/make-payment">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Tracking Tenders
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section with tender-focused content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Tender Notifier{' '}
              </span>
              & Automation Platform for India
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Get instant notifications for <strong>government tenders</strong>, <strong>healthcare tenders</strong>, 
              <strong> construction tenders</strong>, and <strong>pharmaceutical tenders</strong> across India. 
              AI-powered tender analysis, bid automation, and intelligent tender tracking system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/make-payment">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto"
                >
                  <Bell className="mr-2 h-5 w-5" />
                  Start Getting Tender Alerts
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 h-auto"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Tenders Now
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-600">Government Portals Monitored</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">50,000+</div>
                <div className="text-sm text-gray-600">Tender Notifications Sent Daily</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">40-60%</div>
                <div className="text-sm text-gray-600">Average Win Rate Improvement</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tender Categories Section */}
      <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Tender Coverage Across India
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track and get notifications for all types of government tenders, healthcare tenders, 
              construction projects, and private sector opportunities across all Indian states and territories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tenderCategories.map((category, index) => (
              <motion.article
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <p className="text-sm text-blue-600 font-medium">{category.keywords}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced AI-Powered Tender Management Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to dominate the government tender landscape with intelligent automation, 
              real-time notifications, and AI-driven insights for healthcare and construction tenders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Tender Management Plan
            </h2>
            <p className="text-xl text-gray-600">
              Flexible pricing for businesses of all sizes to access government tenders, 
              healthcare opportunities, and construction projects across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl border-2 p-8 ${
                  plan.popular 
                    ? 'border-blue-500 shadow-xl scale-105' 
                    : 'border-gray-200 hover:border-blue-200'
                } transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular for Tender Businesses
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/make-payment" className="block">
                  <Button 
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    size="lg"
                  >
                    Start {plan.name} Plan
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions About Tender Management
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about government tenders, healthcare tender tracking, 
              and AI-powered tender notifications in India
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  {openFaq === index ? (
                    <MinusCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <PlusCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Tender Success Rate?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses across India that trust Tender Post AI to track government tenders, 
              healthcare opportunities, construction projects, and pharmaceutical tenders. 
              Start winning more tenders with AI-powered insights today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/make-payment">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Start Tender Tracking Now
                </Button>
              </Link>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 h-auto"
              >
                <Users className="mr-2 h-5 w-5" />
                Contact Our Tender Experts
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer with tender-focused links */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
          <Image
                  src="/uptenderlogo.png" 
                  alt="Tender Post AI - Tender Management Platform" 
                  className="h-8 w-8 rounded-lg object-contain"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold">Tender Post AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                India&apos;s leading AI-powered tender notification and management platform for 
                government tenders, healthcare tenders, and construction opportunities.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tender Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Government Tenders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Healthcare Tenders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Construction Tenders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">IT & Software Tenders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Defense Tenders</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tender Notifications</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Bid Analysis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tender Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Market Intelligence</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/cancellation-and-refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Tender Post AI. All rights reserved. Leading tender management platform for India&apos;s business community.</p>
            <p className="mt-2 text-sm">Specialized in government tenders, healthcare tender notifications, construction tender tracking, and AI-powered bid analysis.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
