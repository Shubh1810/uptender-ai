'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { createClient } from '@/lib/supabase/client';

type Step = 1 | 2 | 3;

export default function OnboardingClient() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState<Step>(1);
  const [loading, setLoading] = React.useState(false);

  // Force light mode on onboarding page
  React.useEffect(() => {
    // Remove dark class from HTML element
    document.documentElement.classList.remove('dark');
    
    // Cleanup: restore previous theme when leaving the page
    return () => {
      const storedTheme = localStorage.getItem('dashboard-theme');
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    };
  }, []);

  // Auth state for step 1
  const [isSignUp, setIsSignUp] = React.useState(true); // Toggle between sign up and sign in
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);

  const [fullName, setFullName] = React.useState('');
  const [isFullNameLocked, setIsFullNameLocked] = React.useState(false);
  const [company, setCompany] = React.useState('');
  const [businessType, setBusinessType] = React.useState('Proprietorship');

  // Business type mapping: display name -> API value
  const businessTypeMapping: Record<string, string> = {
    'Proprietorship': 'Proprietorship',
    'Private Limited': 'Pvt Ltd',
    'Limited Liability Partnership': 'LLP',
    'Micro, Small & Medium Enterprises (MSME)': 'MSME',
    'Startup': 'Startup',
    'Consultant': 'Consultant',
    'Individual': 'Individual'
  };
  const [gstNumber, setGstNumber] = React.useState('');
  const [years, setYears] = React.useState<number>(0);
  const [primaryIndustry, setPrimaryIndustry] = React.useState('');
  const [secondaryIndustries, setSecondaryIndustries] = React.useState<string[]>([]);

  // Autocomplete state
  const [primarySearch, setPrimarySearch] = React.useState('');
  const [secondarySearch, setSecondarySearch] = React.useState('');
  const [showPrimaryDropdown, setShowPrimaryDropdown] = React.useState(false);
  const [showSecondaryDropdown, setShowSecondaryDropdown] = React.useState(false);
  const primaryInputRef = React.useRef<HTMLInputElement>(null);
  const secondaryInputRef = React.useRef<HTMLInputElement>(null);

  // Comprehensive Industry List with Categories
  const industryCategories = [
    {
      category: '🏗️ Infrastructure & Construction',
      industries: [
        'Civil Construction',
        'Roads & Highways',
        'Bridges & Flyovers',
        'Railways & Metro',
        'Smart Cities & Urban Infrastructure',
        'Water Supply & Sanitation',
        'Electrical & Power Installation',
        'EPC / Turnkey Projects',
      ],
    },
    {
      category: '⚡ Energy & Power',
      industries: [
        'Renewable Energy (Solar, Wind, Hydro)',
        'Power Generation & Transmission',
        'Oil & Gas',
        'Energy Efficiency & Audits',
      ],
    },
    {
      category: '🧠 IT & Software',
      industries: [
        'Software Development',
        'AI / Data Analytics',
        'Web & Mobile Applications',
        'Cybersecurity',
        'Cloud & Hosting Services',
        'IT Hardware & Networking',
        'ERP / CRM Solutions',
      ],
    },
    {
      category: '🧱 Manufacturing & Industrial',
      industries: [
        'Machinery & Equipment',
        'Electrical Components',
        'Mechanical / Fabrication',
        'Industrial Supplies',
        'Automotive Components',
        'Heavy Engineering',
        'Plastics & Packaging',
      ],
    },
    {
      category: '🏢 Consulting & Services',
      industries: [
        'Management Consulting',
        'Financial & Audit Services',
        'Legal & Compliance',
        'Human Resource & Staffing',
        'Marketing & Branding',
        'Training & Skill Development',
        'Environmental & ESG Consulting',
      ],
    },
    {
      category: '🧬 Healthcare & Pharmaceuticals',
      industries: [
        'Medical Equipment & Devices',
        'Hospital Infrastructure',
        'Pharmaceuticals & Drugs',
        'Diagnostics & Lab Equipment',
        'Health IT / Telemedicine',
      ],
    },
    {
      category: '🏫 Education & Research',
      industries: [
        'Educational Supplies',
        'EdTech Solutions',
        'Skill Development / Vocational',
        'Research & Testing Services',
      ],
    },
    {
      category: '🌾 Agriculture & Rural',
      industries: [
        'Agri Equipment & Inputs',
        'Irrigation & Water Systems',
        'Food Processing & Packaging',
        'Animal Husbandry & Dairy',
      ],
    },
    {
      category: '🏠 Real Estate & Interiors',
      industries: [
        'Architecture & Design',
        'Furniture & Interiors',
        'Facility Management',
        'Landscaping',
      ],
    },
    {
      category: '🛒 FMCG & Consumer',
      industries: [
        'Food & Beverages',
        'Personal Care Products',
        'Cleaning & Hygiene',
        'Household Supplies',
      ],
    },
    {
      category: '🚚 Logistics & Transportation',
      industries: [
        'Courier / Cargo',
        'Fleet & Vehicle Leasing',
        'Warehouse Management',
        'Transport Infrastructure',
      ],
    },
    {
      category: '🧰 Public Works & Utilities',
      industries: [
        'Government Procurement / PSUs',
        'Defence Supplies',
        'Fire Safety & Security',
        'Waste Management',
        'Water Treatment & Sewage',
      ],
    },
    {
      category: '🌐 Telecom & Electronics',
      industries: [
        'Communication Equipment',
        'Networking & IoT Devices',
        'Semiconductor / Electronics Manufacturing',
        'Surveillance & CCTV',
      ],
    },
    {
      category: '🏦 Finance & FinTech',
      industries: [
        'Banking & Insurance',
        'Payment Solutions',
        'Investment & Advisory',
        'Accounting Software',
      ],
    },
    {
      category: '🧾 Printing, Media & Design',
      industries: [
        'Printing & Stationery',
        'Media Production',
        'Graphic & Web Design',
        'Advertising',
      ],
    },
    {
      category: '🎯 Startup & Innovation',
      industries: [
        'SaaS / Product Startups',
        'AI / Robotics',
        'Blockchain / Web3',
        'AR / VR Solutions',
        'Drones & Aerospace',
      ],
    },
    {
      category: '🌍 Environment & Sustainability',
      industries: [
        'Renewable Materials',
        'ClimateTech',
        'Green Building',
      ],
    },
    {
      category: '🏛️ Government & NGO',
      industries: [
        'Central / State Government Projects',
        'Public Sector Enterprises',
        'NGOs & Non-profits',
        'International Development Projects',
      ],
    },
  ];

  // Flatten all industries for secondary selection
  const allIndustries = industryCategories.flatMap(cat => cat.industries);

  // Filter industries based on search
  const filterIndustries = (searchTerm: string) => {
    if (!searchTerm.trim()) return allIndustries;
    const lowerSearch = searchTerm.toLowerCase();
    return allIndustries.filter(industry => 
      industry.toLowerCase().includes(lowerSearch)
    );
  };

  const handlePrimarySelect = (industry: string) => {
    setPrimaryIndustry(industry);
    setPrimarySearch('');
    setShowPrimaryDropdown(false);
  };

  const handleSecondarySelect = (industry: string) => {
    if (secondaryIndustries.includes(industry)) {
      setSecondaryIndustries(prev => prev.filter(x => x !== industry));
    } else if (secondaryIndustries.length < 3) {
      setSecondaryIndustries(prev => [...prev, industry]);
    }
    setSecondarySearch('');
    secondaryInputRef.current?.focus();
  };

  const removeSecondaryIndustry = (industry: string) => {
    setSecondaryIndustries(prev => prev.filter(x => x !== industry));
  };

  // Step 3: AI Preferences (New simplified version)
  const [selectedRoles, setSelectedRoles] = React.useState<string[]>([]);
  const [userGoal, setUserGoal] = React.useState<string>('');
  const [tenderDocumentationComfort, setTenderDocumentationComfort] = React.useState<string>('');

  // Feature carousel state (only for step 1)
  const [activeFeatureIndex, setActiveFeatureIndex] = React.useState(0);
  
  const features = [
    {
      heading: "What takes teams days, we do in minutes.",
      subheading: "Tender discovery, qualification, and risk checks—automated."
    },
    {
      heading: "Know when not to bid.",
      subheading: "TenderPost flags low-fit, risky tenders before you waste time or money."
    },
    {
      heading: "Stop reading irrelevant tenders.",
      subheading: "TenderPost filters thousands of government tenders down to the few you should actually bid on."
    }
  ];

  // Step 3 carousel state
  const [activeStep3Index, setActiveStep3Index] = React.useState(0);

  const step3Priorities = React.useMemo(() => [
    {
      text: "Tenders suitable for new bidders"
    },
    {
      text: `Categories aligned with ${primaryIndustry || 'your industry'}`
    },
    {
      text: "Opportunities with lower eligibility friction"
    }
  ], [primaryIndustry]);

  // Dynamic advisor state for step 2
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  // Field insights for dynamic advisor
  const getFieldInsight = (fieldName: string) => {
    const insights: Record<string, { insight: string; whyItMatters: string; hint?: string }> = {
      fullName: {
        insight: "Used for official tender alerts and compliance records.",
        whyItMatters: "Many tenders require named authorized contacts. Incorrect details can invalidate submissions."
      },
      company: {
        insight: "We match tenders against company eligibility rules.",
        whyItMatters: "PSU and government buyers often restrict bids by entity type and registration history.",
        hint: "Tip: Use the exact name as on GST or incorporation documents."
      },
      businessType: {
        insight: businessType === 'Proprietorship' 
          ? "Certain tenders are legally restricted by business structure. We'll automatically hide tenders where proprietorships are ineligible."
          : "Certain tenders are legally restricted by business structure.",
        whyItMatters: businessType === 'Proprietorship'
          ? "Many PSU tenders exclude proprietorships above certain contract values."
          : "For example, many PSU tenders exclude proprietorships above certain contract values."
      },
      gstNumber: {
        insight: "GST unlocks higher-value and compliance-heavy tenders.",
        whyItMatters: "Without GST, we'll only surface exemption-friendly opportunities.",
        hint: "Add GST to access 3–5× more tenders in your category."
      },
      years: {
        insight: years <= 1
          ? "Experience thresholds are one of the top rejection reasons. We'll prioritize startup-friendly and MSME-focused tenders."
          : "Experience thresholds are one of the top rejection reasons.",
        whyItMatters: "Many tenders require 2–5 years of operational history."
      },
      primaryIndustry: {
        insight: "Industry selection powers our AI relevance scoring.",
        whyItMatters: "We exclude tenders where technical criteria don't match your manufacturing or service profile."
      },
      secondaryIndustries: {
        insight: secondaryIndustries.length === 3
          ? "That's optimal. We'll keep matches tight."
          : "Secondary industries expand reach without diluting relevance.",
        whyItMatters: secondaryIndustries.length === 3
          ? ""
          : "We cap this to avoid flooding you with low-fit tenders."
      }
    };
    return insights[fieldName] || { insight: "", whyItMatters: "" };
  };

  // Reset carousel when step changes
  React.useEffect(() => {
    if (step === 1) {
      setActiveFeatureIndex(0);
    }
    if (step === 3) {
      setActiveStep3Index(0);
    }
  }, [step]);

  // Auto-rotate carousel for step 1
  React.useEffect(() => {
    if (step !== 1) return;
    
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % features.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [step, features.length]);

  // Auto-rotate carousel for step 3
  React.useEffect(() => {
    if (step !== 3) return;
    
    const interval = setInterval(() => {
      setActiveStep3Index((prev) => (prev + 1) % step3Priorities.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [step, step3Priorities.length]);

  // Reset focused field when step changes
  React.useEffect(() => {
    if (step !== 2) {
      setFocusedField(null);
    }
  }, [step]);


  const roleOptions = ['Manufacturer', 'Authorized Dealer / Distributor', 'Contractor / EPC', 'Service Provider', 'Consultant', 'New Bidder (≤ 2 years)'];
  const goalOptions = [
    { value: 'relevant_tenders', label: 'I want more relevant tenders' },
    { value: 'ai_bid_drafting', label: 'I want AI to help me draft bids' },
    { value: 'both', label: 'Both' }
  ];

  const tenderDocumentationOptions = [
    { value: 'experienced', label: "I've done this many times" },
    { value: 'guided', label: 'I can manage with guidance' },
    { value: 'new', label: "I'm new to this" }
  ];

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };


  const steps = [
    { id: 1 as Step, label: 'Sign up / Login' },
    { id: 2 as Step, label: 'Company Snapshot' },
    { id: 3 as Step, label: 'Bid Intelligence Setup' },
  ] as const;

  // Refs for measuring dot positions
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = React.useRef<HTMLDivElement | null>(null);
  const [progressWidth, setProgressWidth] = React.useState<string>('0%');

  // Calculate progress width based on current step's dot position
  React.useEffect(() => {
    const calculateProgress = () => {
      if (!lineRef.current) return;

      const lineRect = lineRef.current.getBoundingClientRect();
      const lineWidth = lineRect.width;

      // Wait for DOM to be ready
      requestAnimationFrame(() => {
        const currentStepIndex = step - 1;
        const currentStepRef = stepRefs.current[currentStepIndex];

        if (currentStepRef && lineRef.current) {
          const dotRect = currentStepRef.getBoundingClientRect();
          const dotCenterX = dotRect.left + dotRect.width / 2;
          const lineLeft = lineRef.current.getBoundingClientRect().left;
          const dotPositionFromLeft = dotCenterX - lineLeft;

          // Calculate percentage, accounting for dot being at the center of the line
          const percentage = (dotPositionFromLeft / lineWidth) * 100;
          setProgressWidth(`${Math.max(0, Math.min(100, percentage))}%`);
        }
      });
    };

    // Small delay to ensure DOM is rendered
    const timeoutId = setTimeout(calculateProgress, 0);

    // Recalculate on window resize
    window.addEventListener('resize', calculateProgress);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [step]);

  React.useEffect(() => {
    const stepParam = searchParams?.get('step');
    if (stepParam === '1' || stepParam === '2' || stepParam === '3') {
      setStep(parseInt(stepParam, 10) as Step);
      return; // Don't check onboarding if step is explicitly set
    }

    supabase.auth.getUser().then(({ data }: { data: { user: import('@supabase/supabase-js').User | null } }) => {
      if (data.user) {
        const oauthFullName = 
          data.user.user_metadata?.full_name || 
          data.user.user_metadata?.name || 
          data.user.user_metadata?.display_name;
        
        supabase
          .from('profiles')
          .select('onboarding_completed, full_name')
          .eq('id', data.user.id)
          .maybeSingle()
          .then(({ data: profile, error }: { data: { onboarding_completed?: boolean | string; full_name?: string } | null; error: unknown }) => {
            if (error) {
              console.error('Error fetching profile:', error);
              // On error, default to step 2 and use OAuth name if available
              if (!stepParam) setStep(2);
              if (oauthFullName && !fullName) {
                setFullName(oauthFullName);
                setIsFullNameLocked(true);
              }
            } else if (profile) {
              // If onboarding is completed, redirect to dashboard
              if (profile.onboarding_completed === true || profile.onboarding_completed === 'true') {
                window.location.href = '/dashboard';
                return;
              }
              // If not completed, go to step 2
              if (!stepParam) setStep(2);
              
              // Priority: profile.full_name > OAuth name
              // Use profile name if it exists, otherwise use OAuth name
              const nameToUse = profile.full_name || oauthFullName;
              if (nameToUse) {
                setFullName(nameToUse);
                setIsFullNameLocked(true);
              }
            } else {
              // No profile exists, go to step 2 and use OAuth name
              if (!stepParam) setStep(2);
        if (oauthFullName) {
          setFullName(oauthFullName);
          setIsFullNameLocked(true);
        }
            }
          });
      }
    });
  }, [supabase, searchParams]);


  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if onboarding is completed
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile?.onboarding_completed) {
          window.location.href = '/dashboard';
        } else {
          setStep(2);
        }
      }
    } catch (err) {
      setAuthError('An unexpected error occurred');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitOnboarding = async () => {
    setLoading(true);
    try {
      const payload = {
        profile: {
          full_name: fullName || 'User',
          company,
          business_type: businessTypeMapping[businessType] || businessType,
          gst_number: gstNumber || undefined,
          years_in_operation: years,
          primary_industry: primaryIndustry,
          secondary_industries: secondaryIndustries,
        },
        preferences: {
          notify_email: true,
          notify_inapp: true,
          frequency: 'daily' as const,
          alert_threshold: 70,
          keywords: [],
          regions: [],
          roles: selectedRoles,
          user_goal: userGoal,
          tender_documentation_comfort: tenderDocumentationComfort,
        },
      };

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Onboarding API error:', errorData);
        throw new Error(
          errorData.details 
            ? `Validation error: ${JSON.stringify(errorData.details)}` 
            : errorData.error || 'Failed to save onboarding'
        );
      }
      
      const result = await res.json();
      console.log('Onboarding saved successfully:', result);
      
      // Redirect to dashboard after successful onboarding
      window.location.href = '/dashboard';
    } catch (e) {
      const errorMessage = (e as Error).message || 'An error occurred';
      console.error('Onboarding submit error:', e);
      alert(`Failed to save onboarding: ${errorMessage}\n\nPlease check the browser console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-4" style={{ backgroundColor: '#fefcf3' }}>
        {/* Background Image Container */}
        <div className="relative flex-1 rounded-2xl overflow-hidden">
          {/* Static Background Image */}
          <Image
            src="/onboard5.jpeg"
            alt="TenderPost Onboarding"
            fill
            className="object-cover"
            quality={100}
            priority
            sizes="50vw"
          />

          {/* Back Arrow - Only visible on step 1 */}
          {step === 1 && (
            <div className="absolute top-6 left-6 z-20">
              <Link 
                href="/"
                className="inline-block hover:opacity-80 transition-opacity duration-200"
                aria-label="Back to home"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
              </Link>
            </div>
          )}

          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 z-[5]"></div>

          {/* Content Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col p-12 pt-16">
            {/* Hero Content - Higher Up */}
            <div className="space-y-2 mb-auto text-center px-4 mt-8">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                {step === 1 && (
                  <>Welcome to <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span></>
                )}
                {step === 2 && (
                  <>We <span className="underline">tailor</span> <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span> for your business.</>
                )}
                {step === 3 && (
                  <>Let <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span>  work the way you do.</>
                )}
              </h1>
              {step === 1 && (
                <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                  Your Gateway to Smarter Tender Discovery
                </p>
              )}
            </div>

            {/* Feature Carousel - Bottom Aligned (only for step 1) */}
            {step === 1 && (
              <div className="max-w-lg mx-auto pb-8 w-full">
                <div className="relative">
                  {/* Carousel Content */}
                  <div className="overflow-hidden w-full">
                    <div 
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ 
                        width: `${features.length * 100}%`,
                        transform: `translateX(-${(activeFeatureIndex * 100) / features.length}%)` 
                      }}
                    >
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex-shrink-0"
                          style={{ width: `${100 / features.length}%` }}
                        >
                          <div className="text-center px-2">
                            <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-3 leading-tight">
                              {feature.heading}
                            </h3>
                            <p className="text-sm lg:text-base text-white/80 leading-relaxed">
                              {feature.subheading}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Minimal Indicator Bar */}
                  <div className="flex items-center justify-center gap-2 mt-6">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveFeatureIndex(index)}
                        className="focus:outline-none"
                        aria-label={`Go to feature ${index + 1}`}
                      >
                        <div
                          className={`h-1 rounded-full transition-all duration-500 ${
                            index === activeFeatureIndex
                              ? 'w-8 bg-white'
                              : 'w-1 bg-white/40'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="max-w-lg mx-auto pb-8 w-full">
                {focusedField ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl lg:text-2xl font-semibold text-white leading-tight">
                        {focusedField === 'fullName' && 'Full Name'}
                        {focusedField === 'company' && 'Company Name'}
                        {focusedField === 'businessType' && 'Business Type'}
                        {focusedField === 'gstNumber' && 'GST Number'}
                        {focusedField === 'years' && 'Years in Operation'}
                        {focusedField === 'primaryIndustry' && 'Primary Industry'}
                        {focusedField === 'secondaryIndustries' && 'Secondary Industries'}
                      </h3>
                      <p className="text-base lg:text-lg text-white/90 leading-relaxed">
                        {getFieldInsight(focusedField).insight}
                      </p>
                    </div>
                    {getFieldInsight(focusedField).whyItMatters && (
                      <div className="pt-2 border-t border-white/20">
                        <p className="text-sm text-white/70 italic">
                          Why it matters: {getFieldInsight(focusedField).whyItMatters}
                        </p>
                      </div>
                    )}
                    {getFieldInsight(focusedField).hint && (
                      <div className="pt-2">
                        <p className="text-sm text-white/80 font-medium">
                          {getFieldInsight(focusedField).hint}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <h3 className="text-xl lg:text-2xl font-semibold text-white leading-tight">
                      Company Profile
                    </h3>
                    <p className="text-sm lg:text-base text-white/80 leading-relaxed">
                    Most vendors lose time chasing tenders they were never eligible for. These details help TenderPost filter those out automatically.
                    </p>
                  </div>
                )}
              </div>
            )}
            {step === 3 && (
              <div className="max-w-lg mx-auto pb-8 w-full">
                <div className="text-center space-y-4 mb-6">
                  <h3 className="text-xl lg:text-2xl font-semibold text-white leading-tight">
                    Based on your profile, we'll prioritize:
                  </h3>
                </div>
                <div className="relative h-20 overflow-hidden">
                  {/* Vertical Slot Machine Carousel */}
                  {step3Priorities.map((priority, index) => (
                    <div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out"
                      style={{
                        transform: `translateY(${(index - activeStep3Index) * 100}%)`,
                        opacity: index === activeStep3Index ? 1 : 0
                      }}
                    >
                      <div className="text-center px-2">
                        <p className="text-base lg:text-lg text-white/90 leading-relaxed">
                          {priority.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#fefcf3' }}>
        {/* Mobile Logo - Only on small screens */}
        <div className="lg:hidden flex-shrink-0 p-6 border-b border-gray-200" style={{ backgroundColor: '#fefcf3' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-0">
              <Image
                src="/tplogo.png" 
                alt="TenderPost" 
                className="h-8 w-8 rounded-lg"
                priority
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span>
              </span>
            </div>
            {step === 1 && (
              <Link 
                href="/"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                aria-label="Back to home"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-gray-700" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Form Container - Scrollable */}
        <div className={`flex-1 flex ${step === 2 || step === 3 ? 'flex-col' : 'items-center justify-center'} p-6 sm:p-8 overflow-y-auto`}>
          <div className={`w-full ${step === 2 || step === 3 ? 'max-w-xl mt-12 sm:mt-16' : 'max-w-md'} mx-auto`}>

            {/* Form Card - Containerless for step 2 and 3 */}
            <div className={`${step === 2 || step === 3 ? 'px-4 sm:px-8 pt-8' : step === 1 ? '' : 'rounded-2xl shadow-sm border border-gray-200 p-8'}`} style={step === 2 || step === 3 || step === 1 ? {} : { backgroundColor: '#fefcf3' }}>
              {/* Step Title */}
              {step === 1 ? (
                <div className="mb-6">
                  <div className="flex items-center justify-start space-x-0 mb-2">
                    <Image
                      src="/tplogo.png" 
                      alt="TenderPost" 
                      className="h-10 w-10 rounded-lg"
                      priority
                      width={40}
                      height={40}
                    />
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">
                      <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Create your account to get started
                  </p>
                </div>
              ) : (
                <div className={`${step === 2 || step === 3 ? 'mb-5 flex-shrink-0' : 'mb-6'}`}>
                  <h2 className={`${step === 2 || step === 3 ? 'text-xl font-semibold' : 'text-2xl font-bold'} text-gray-900 ${step === 2 || step === 3 ? 'mb-0.5' : 'mb-2'}`}>
                    {step === 2 && 'Company Details'}
                    {step === 3 && 'Bid Intelligence Setup'}
                  </h2>
                  <p className={`${step === 2 || step === 3 ? 'text-xs text-gray-500' : 'text-sm text-gray-600'}`}>
                    {step === 2 && 'Help us qualify and protect you from bad tenders'}
                    {step === 3 && 'How you Win Tenders.'}
                  </p>
                </div>
              )}

              {/* Form Content */}
              <div className={step === 2 || step === 3 ? 'flex-shrink-0' : ''}>
              {step === 1 && (
                <div className="space-y-6">
                  {/* Tab Switcher */}
                  <div className="flex gap-2 p-1 rounded-lg" style={{ backgroundColor: '#efe8dc' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setAuthError('');
                      }}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
                        isSignUp 
                          ? 'bg-[#3d2817] hover:bg-[#4d3520] text-white shadow-sm scale-[1.02]' 
                          : 'text-gray-600 hover:text-gray-700 hover:bg-[#e0d4c0]'
                      }`}
                    >
                      Sign Up
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setAuthError('');
                      }}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ease-in-out ${
                        !isSignUp 
                          ? 'bg-[#3d2817] hover:bg-[#4d3520] text-white shadow-sm scale-[1.02]' 
                          : 'text-gray-600 hover:text-gray-700 hover:bg-[#e0d4c0]'
                      }`}
                    >
                      Sign In
                    </button>
                  </div>

                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {authError}
                    </div>
                  )}

                  {/* Email/Password Form */}
                  <form onSubmit={isSignUp ? async (e) => {
                    e.preventDefault();
                    setAuthError('');
                    setLoading(true);

                    try {
                      const { data, error } = await supabase.auth.signUp({
                        email,
                        password,
                      });

                      if (error) {
                        setAuthError(error.message);
                        setLoading(false);
                        return;
                      }

                      if (data.user) {
                        setStep(2);
                      }
                    } catch (err) {
                      setAuthError('An unexpected error occurred');
                      console.error('Sign up error:', err);
                    } finally {
                      setLoading(false);
                    }
                  } : handleEmailSignIn} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Id <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3d2817] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <Link
                          href="/auth/reset-password"
                          className="text-xs text-[#3d2817] hover:text-[#2d1f12] transition-colors"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3d2817] focus:border-transparent transition-all"
                      />
                      <div className="flex justify-end mt-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 text-[#3d2817] border-gray-300 rounded focus:ring-[#3d2817] focus:ring-2"
                          />
                          <span className="ml-2 text-sm text-gray-700">Remember me</span>
                        </label>
                      </div>
                      {isSignUp && (
                        <>
                          <p className="text-xs text-gray-500 mt-2">Password Strength : Weak</p>
                          <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
                            <li>• Cannot contain your name or email address</li>
                            <li>• At least 8 characters</li>
                            <li>• Contains a number or symbol</li>
                          </ul>
                        </>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3.5 rounded-lg font-medium transition-all shadow-sm hover:shadow"
                    >
                      {loading 
                        ? (isSignUp ? 'Creating Account...' : 'Signing in...') 
                        : (isSignUp ? 'Create Account' : 'Sign In')
                      }
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 text-gray-500" style={{ backgroundColor: '#fefcf3' }}>Or</span>
                    </div>
                  </div>

                  {/* Social Sign-in Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
                          const { error } = await supabase.auth.signInWithOAuth({
                            provider: 'google',
                            options: {
                              redirectTo: `${siteUrl}/auth/callback`,
                              queryParams: {
                                access_type: 'offline',
                                prompt: 'select_account',
                              },
                            },
                          });
                          if (error) {
                            setAuthError(error.message);
                            setLoading(false);
                          }
                        } catch (err) {
                          setAuthError('Failed to sign in with Google');
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#fefcf3' }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Google</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const appleSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
                          const { error } = await supabase.auth.signInWithOAuth({
                            provider: 'apple',
                            options: {
                              redirectTo: `${appleSiteUrl}/auth/callback`,
                            },
                          });
                          if (error) {
                            setAuthError(error.message);
                            setLoading(false);
                          }
                        } catch (err) {
                          setAuthError('Failed to sign in with Apple');
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#fefcf3' }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Apple</span>
                    </button>
                  </div>

                  {/* Terms */}
                  <p className="text-xs text-center text-gray-500">
                    By signing up to create an account I accept Company's{' '}
                    <Link href="/terms" className="text-[#3d2817] hover:underline">
                      Terms of use
                    </Link>
                    {' & '}
                    <Link href="/privacy" className="text-[#3d2817] hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      className={`w-full border-0 border-b border-gray-300 px-0 py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200 bg-transparent ${isFullNameLocked ? 'bg-gray-50 cursor-not-allowed' : ''}`} 
                      placeholder="Enter your full name" 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                      onFocus={() => setFocusedField('fullName')}
                      disabled={isFullNameLocked}
                      readOnly={isFullNameLocked}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wider">Company Name <span className="text-red-500">*</span></label>
                    <input 
                      className="w-full border-0 border-b border-gray-300 px-0 py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200 bg-transparent" 
                      placeholder="Enter company name" 
                      value={company} 
                      onChange={e => setCompany(e.target.value)} 
                      onFocus={() => setFocusedField('company')}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wider">Business Type <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border-0 border-b border-gray-300 px-0 py-1 text-sm text-gray-900 bg-transparent cursor-pointer focus:outline-none focus:border-gray-900 transition-colors duration-200 appearance-none bg-no-repeat bg-right pr-5" 
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0 top 50%' }}
                      value={businessType} 
                      onChange={e => setBusinessType(e.target.value)}
                      onFocus={() => setFocusedField('businessType')}
                    >
                      {['Proprietorship','Private Limited','Limited Liability Partnership','Micro, Small & Medium Enterprises (MSME)','Startup','Consultant','Individual'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wider">GST Number <span className="normal-case font-normal text-gray-400">(Optional)</span></label>
                    <input 
                      className="w-full border-0 border-b border-gray-300 px-0 py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200 bg-transparent" 
                      placeholder="Enter GST number" 
                      value={gstNumber} 
                      onChange={e => setGstNumber(e.target.value)} 
                      onFocus={() => setFocusedField('gstNumber')}
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">Add GST to access 3–5× more tenders in your category</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wider">Years in Operation <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border-0 border-b border-gray-300 px-0 py-1 text-sm text-gray-900 bg-transparent cursor-pointer focus:outline-none focus:border-gray-900 transition-colors duration-200 appearance-none bg-no-repeat bg-right pr-5" 
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0 top 50%' }}
                      value={years} 
                      onChange={e => setYears(parseInt(e.target.value))}
                      onFocus={() => setFocusedField('years')}
                    >
                      {Array.from({ length: 21 }, (_, i) => i).map(v => (
                        <option key={v} value={v}>{v === 20 ? '20+' : v}</option>
                      ))}
                    </select>
                  </div>
                  {/* Primary Industry Autocomplete */}
                  <div className="relative">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wider">Primary Industry <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        ref={primaryInputRef}
                        type="text"
                        placeholder={primaryIndustry || "Search and select industry..."}
                        value={primarySearch}
                        onChange={(e) => {
                          setPrimarySearch(e.target.value);
                          setShowPrimaryDropdown(true);
                        }}
                        onFocus={() => {
                          setFocusedField('primaryIndustry');
                          setShowPrimaryDropdown(true);
                        }}
                        onBlur={() => setTimeout(() => setShowPrimaryDropdown(false), 200)}
                        className="w-full border-0 border-b border-gray-300 px-0 py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200 bg-transparent"
                      />
                      {primaryIndustry && (
                        <button
                          type="button"
                          onClick={() => {
                            setPrimaryIndustry('');
                            setPrimarySearch('');
                          }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-base leading-none"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {primaryIndustry && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">
                          {primaryIndustry}
                          <button 
                            type="button" 
                            onClick={() => setPrimaryIndustry('')}
                            className="hover:text-blue-900 text-xs leading-none"
                          >
                            ×
                          </button>
                        </span>
                      </div>
                    )}
                    {showPrimaryDropdown && (
                      <div className="absolute z-10 w-full mt-0.5 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                        {filterIndustries(primarySearch).map((industry) => (
                          <button
                            key={industry} 
                            type="button"
                            onClick={() => handlePrimarySelect(industry)}
                            className="w-full text-left px-2.5 py-1.5 hover:bg-blue-50 text-xs border-b border-gray-50 last:border-b-0 transition-colors"
                          >
                                {industry}
                          </button>
                        ))}
                        {filterIndustries(primarySearch).length === 0 && (
                          <div className="px-2.5 py-1.5 text-xs text-gray-500">No industries found</div>
                        )}
                    </div>
                    )}
                  </div>

                  {/* Secondary Industries Autocomplete */}
                  <div className="relative">
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wider">
                      Secondary Industries <span className="normal-case font-normal text-gray-400">(up to 3)</span>
                    </label>
                    <div className="relative">
                      <input
                        ref={secondaryInputRef}
                        type="text"
                        placeholder="Search and select up to 3 industries..."
                        value={secondarySearch}
                        onChange={(e) => {
                          setSecondarySearch(e.target.value);
                          setShowSecondaryDropdown(true);
                        }}
                        onFocus={() => {
                          setFocusedField('secondaryIndustries');
                          setShowSecondaryDropdown(true);
                        }}
                        onBlur={() => setTimeout(() => setShowSecondaryDropdown(false), 200)}
                        disabled={secondaryIndustries.length >= 3}
                        className="w-full border-0 border-b border-gray-300 px-0 py-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-200 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    {secondaryIndustries.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {secondaryIndustries.map((industry) => (
                          <span
                            key={industry}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs border border-green-100"
                          >
                            {industry}
                          <button 
                            type="button" 
                              onClick={() => removeSecondaryIndustry(industry)}
                              className="hover:text-green-900 text-xs leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {showSecondaryDropdown && secondaryIndustries.length < 3 && (
                      <div className="absolute z-10 w-full mt-0.5 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                        {filterIndustries(secondarySearch)
                          .filter(industry => !secondaryIndustries.includes(industry))
                          .map((industry) => (
                            <button
                            key={industry} 
                              type="button"
                              onClick={() => handleSecondarySelect(industry)}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-green-50 text-xs border-b border-gray-50 last:border-b-0 transition-colors"
                          >
                            {industry}
                          </button>
                        ))}
                        {filterIndustries(secondarySearch).filter(industry => !secondaryIndustries.includes(industry)).length === 0 && (
                          <div className="px-2.5 py-1.5 text-xs text-gray-500">
                            {secondarySearch ? 'No industries found' : 'All matching industries selected'}
                      </div>
                        )}
                    </div>
                    )}
                  </div>

                  <div className="flex gap-2.5 pt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 text-sm font-medium"
                    >
                      Back
                    </Button>
                    <Button 
                      disabled={!fullName || !company || !primaryIndustry}
                      onClick={() => setStep(3)}
                      className="flex-1 bg-[#3d2817] hover:bg-[#2d1f12] text-white py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  {/* Role Selection */}
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wider">
                      Your Role <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[10px] text-gray-400 mb-2 leading-relaxed">
                      Select roles that best describe your business
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {roleOptions.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => toggleRole(role)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                            selectedRoles.includes(role)
                              ? 'bg-[#3d2817] text-white'
                              : 'bg-[#efe8dc] text-[#3d2817] hover:bg-[#e0d4c0] border border-[#8b7355]'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tender Documentation Comfort */}
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                      How comfortable are you with tender documentation? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {tenderDocumentationOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setTenderDocumentationComfort(option.value)}
                          className={`w-full text-left px-3 py-2 rounded border transition-all duration-200 text-sm ${
                            tenderDocumentationComfort === option.value
                              ? 'border-[#3d2817] bg-[#f5f0e8] text-[#3d2817] font-medium'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* User Goal */}
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                      What Describes You Best? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {goalOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setUserGoal(option.value)}
                          className={`w-full text-left px-3 py-2 rounded border transition-all duration-200 text-sm ${
                            userGoal === option.value
                              ? 'border-[#3d2817] bg-[#f5f0e8] text-[#3d2817] font-medium'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(2)}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 text-sm font-medium"
                    >
                      Back
                    </Button>
                    <Button 
                      disabled={loading || selectedRoles.length === 0 || !userGoal || !tenderDocumentationComfort} 
                      onClick={submitOnboarding}
                      className="flex-1 bg-[#3d2817] hover:bg-[#2d1f12] text-white py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Finish Setup'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


