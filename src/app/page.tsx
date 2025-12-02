'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  Save,
  Trophy,
  TrendingUp,
  Search,
  Heart,
  Building,
  PlusCircle,
  MinusCircle,
  Clock,
  Sparkles,
  Link2,
  CircleDollarSign,
  Layout,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

import { SearchBar } from '@/components/ui/search-bar';
import { EmailSignup } from '@/components/ui/email-signup';
import { WaitlistOverlay } from '@/components/ui/waitlist-overlay';
import { getLiveTendersCount, type TenderStats } from '@/lib/tender-stats';
import { WorkflowSection } from '@/components/WorkflowSection';

export default function Home() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [ctaEmail, setCtaEmail] = React.useState('');
  const [ctaLoading, setCtaLoading] = React.useState(false);
  const [ctaSuccess, setCtaSuccess] = React.useState(false);
  const [tenderStats, setTenderStats] = React.useState<TenderStats>({
    liveTendersCount: 0,
    lastUpdated: '',
    isConnected: false,
  });
  
  // Load live tenders count on mount - simple and reliable!
  React.useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getLiveTendersCount();
        setTenderStats(stats);
        console.log('🏠 Hero Section: Live tenders loaded:', stats.liveTendersCount, stats.isConnected ? '✅ Connected' : '⚠️ Not Connected');
      } catch (error) {
        console.error('❌ Hero Section: Failed to load tender stats:', error);
      }
    };
    
    // Initial load - data comes from Supabase, always accurate!
    loadStats();
    
    // Optional: Refresh every 60 seconds to show updated counts from CRON
    const refreshInterval = setInterval(() => {
      console.log('🔄 Hero Section: Refreshing tender stats from Supabase...');
      loadStats();
    }, 60000); // Every 60 seconds (can increase to 5 minutes if preferred)
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

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
      icon: Bell,
      title: 'Instant Opportunity Alerts',
      description: 'Get only the tenders you can win — instant, relevant alerts delivered to email & WhatsApp. Speed and relevance that customers want.'
    },
    {
      icon: Sparkles,
      title: 'Auto-Bid Generator',
      description: 'A fully formed draft bid (technical + commercial) created instantly from your past documents, profile, and tender requirements. This flips "I don\'t have the team to bid" into "I can bid 5x more tenders".'
    },
    {
      icon: Target,
      title: 'AI Tender Matchmaking Engine',
      description: 'Not generic alerts. A model that understands what you can fulfill, what you have won/lost before, your pricing, and your business capabilities. Matches you to tenders you actually can win. That\'s the money feature.'
    },
    {
      icon: CircleDollarSign,
      title: 'Competitor & Pricing Intel',
      description: 'AI extracts who usually bids, at what price range, who wins, seasonality patterns, and predicts the competitiveness of a tender. This answers the hardest procurement question: "Should I even compete here?"'
    },
    {
      icon: Layout,
      title: 'Zero-Friction Tender Workspace',
      description: 'A UX layer with one-click save tender, auto extract important fields, generate checklists, track docs, and assign tasks. This reduces chaos for SMBs that have no procurement team.'
    },
    {
      icon: LineChart,
      title: 'Bid Intelligence Graph™',
      description: 'A continuously-learning graph of all tenders, bidders, and outcomes.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: 999,
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
      price: 1249,
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
      price: 1499,
      description: 'Complete solution for large organizations',
      features: [
        'All Professional features',
        'Unlimited notifications',
        'API access',
        'Dedicated support',
        'Custom integrations',
        'White-label options'
      ],
      popular: true,
      showBadge: false
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
    <div className="min-h-screen" style={{ backgroundColor: '#fefcf3' }}>
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
          {/* Full-bleed hero background on desktop only: keep mobile/tablet unchanged */}
          <div className="lg:mx-[calc(50%-50vw+12px)]">
          <div 
            className="relative flex items-center bg-cover bg-center rounded-3xl px-4 sm:px-6 lg:px-8 py-6 lg:py-24 pb-12 bg-white min-h-[400px] lg:min-h-[650px]" 
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
                Your <span className="text-2xl md:text-4xl font-semibold font-inter">AI-powered Tender Automation</span> <span className="font-semibold">Platform</span>{' '}
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
                      {/* Live Tenders - Dynamic */}
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full shadow-lg ${tenderStats.isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <div>
                          <div className={`font-ubuntu text-xl font-bold ${tenderStats.isConnected ? 'text-green-600' : 'text-gray-600'}`}>
                            {tenderStats.liveTendersCount.toLocaleString()}
                          </div>
                          <div className="font-ubuntu text-xs text-gray-500 font-medium">
                            Live Tenders {tenderStats.isConnected ? '· Connected' : '· Not Connected'}
                          </div>
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
            <div className="flex flex-col items-center lg:flex-row lg:items-center gap-4 lg:gap-16">
              <p className="text-sm text-gray-500 font-medium whitespace-nowrap">Trusted by leading organizations</p>
              <div className="flex flex-wrap items-center gap-4 lg:gap-9 opacity-60 justify-center lg:justify-start">
                {/* Real company logos */}
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/isop.png"
                    alt="ISO Certified"
                    width={80}
                    height={48}
                    className="h-8 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/Make_In_India.png"
                    alt="Make In India"
                    width={120}
                    height={48}
                    className="h-8 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/msme2.svg"
                    alt="MSME Registered"
                    width={100}
                    height={48}
                    className="h-8 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/NSIC.PNG"
                    alt="NSIC"
                    width={90}
                    height={48}
                    className="h-8 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/ce-mark.png"
                    alt="CE Mark"
                    width={80}
                    height={48}
                    className="h-8 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/who.png"
                    alt="WHO"
                    width={80}
                    height={48}
                    className="h-8 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/atma.png"
                    alt="ATMA"
                    width={80}
                    height={48}
                    className="h-8 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="h-12 w-auto flex items-center justify-center">
                  <Image
                    src="/cdsco-logo.webp"
                    alt="CDSCO"
                    width={110}
                    height={58}
                    className="h-10 lg:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Workflow Section - GSAP ScrollTrigger powered */}
      <WorkflowSection />

      {/* Professional Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10" style={{ backgroundImage: 'linear-gradient(to bottom, #fefcf3 0%, #fefcf3 60%, #ffffff 100%)' }}>
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
                  <feature.icon className="h-8 w-8 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900 ml-4">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Pricing that fits all
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No Credit card required. Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.name}
                className="relative rounded-xl p-8 border border-gray-900 transition-all duration-200 hover:shadow-lg flex flex-col h-full"
                style={{
                  backgroundColor: plan.popular ? '#fefcf3' : 'white'
                }}
              >
                {plan.popular && (plan as any).showBadge !== false && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {plan.popular && (
                  <div className="absolute -bottom-10 -right-9 opacity-9 pointer-events-none">
                    <Image
                      src="/ashok.webp"
                      alt="Ashok Chakra"
                      width={240}
                      height={240}
                      className="w-64 h-64"
                    />
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-3 ${
                    plan.popular ? 'text-[#b84d00] italic font-playfair' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <div className="mb-6">
                    <p className="text-gray-600 mb-2">Starting from</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ₹{plan.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">per month, billed yearly.</p>
                  </div>

                  <div>
                    <Link href={`/make-payment?plan=${plan.name.toLowerCase()}&amount=${plan.price}`} className="inline-block">
                      <Button 
                        className={`w-auto py-6 px-4 font-semibold rounded-full transition-colors text-base ${
                          plan.popular
                            ? 'bg-blue-500 hover:bg-blue-600 text-white border-0' 
                            : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-900'
                        }`}
                      >
                        Get this plan
                      </Button>
                    </Link>
                  </div>
                </div>
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
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden" style={{ backgroundColor: '#ff8c42' }}>
        {/* Wavy motif lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top wavy lines */}
          <svg className="absolute top-0 left-0 w-full opacity-30" viewBox="0 0 1200 100" preserveAspectRatio="none" style={{ height: '80px' }}>
            <path d="M0,50 Q300,20 600,50 T1200,50" stroke="white" strokeWidth="2" fill="none" />
            <path d="M0,40 Q200,60 400,40 T800,40 T1200,40" stroke="white" strokeWidth="2" fill="none" />
            <path d="M0,60 Q250,30 500,60 T1000,60 T1200,60" stroke="white" strokeWidth="2" fill="none" />
          </svg>
          {/* Bottom wavy lines */}
          <svg className="absolute bottom-0 left-0 w-full opacity-30" viewBox="0 0 1200 100" preserveAspectRatio="none" style={{ height: '80px' }}>
            <path d="M0,50 Q300,80 600,50 T1200,50" stroke="white" strokeWidth="2" fill="none" />
            <path d="M0,60 Q200,40 400,60 T800,60 T1200,60" stroke="white" strokeWidth="2" fill="none" />
            <path d="M0,40 Q250,70 500,40 T1000,40 T1200,40" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Heading */}
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            Join the Waitlist
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-white/90">
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
                className="w-full h-14 pl-6 pr-32 bg-white rounded-2xl text-gray-900 placeholder-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                disabled={ctaLoading}
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-2 h-10 px-6 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={ctaLoading}
              >
                {ctaLoading ? 'Joining...' : 'Join'}
              </button>
            </form>
            {ctaSuccess && (
              <p className="mt-4 text-white text-sm text-center font-medium">
                Thank you for joining! We'll be in touch soon.
              </p>
            )}
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-white/80">
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
