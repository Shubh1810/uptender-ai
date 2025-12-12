'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/ui/google-signin-button';
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
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);

  const [fullName, setFullName] = React.useState('');
  const [isFullNameLocked, setIsFullNameLocked] = React.useState(false);
  const [company, setCompany] = React.useState('');
  const [businessType, setBusinessType] = React.useState('Proprietorship');
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
  const [categorySearch, setCategorySearch] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false);
  const categoryInputRef = React.useRef<HTMLInputElement>(null);

  const roleOptions = ['Contractor', 'Consultant', 'Vendor', 'Supplier', 'New bidder'];
  const goalOptions = [
    { value: 'relevant_tenders', label: 'I want more relevant tenders' },
    { value: 'ai_bid_drafting', label: 'I want AI to help me draft bids' },
    { value: 'both', label: 'Both' }
  ];

  const tenderCategories = [
    'Healthcare & Medical', 'Construction & Infrastructure', 'IT & Technology',
    'Manufacturing & Industrial', 'Consulting & Services', 'Education & Research',
    'Agriculture & Rural', 'Energy & Power', 'Transportation & Logistics',
    'Defense & Security', 'Finance & Banking', 'Telecommunications',
    'Pharmaceuticals', 'Environmental Services', 'Real Estate'
  ];

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filterCategories = (searchTerm: string) => {
    if (!searchTerm.trim()) return tenderCategories;
    const lowerSearch = searchTerm.toLowerCase();
    return tenderCategories.filter(cat =>
      cat.toLowerCase().includes(lowerSearch)
    );
  };

  const steps = [
    { id: 1 as Step, label: 'Sign up / Login' },
    { id: 2 as Step, label: 'Company Snapshot' },
    { id: 3 as Step, label: 'AI Preferences' },
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

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        // First, extract OAuth name from user_metadata
        const oauthFullName = 
          data.user.user_metadata?.full_name || 
          data.user.user_metadata?.name || 
          data.user.user_metadata?.display_name;
        
        // Check if user has completed onboarding before redirecting to step 2
        supabase
          .from('profiles')
          .select('onboarding_completed, full_name')
          .eq('id', data.user.id)
          .maybeSingle()
          .then(({ data: profile, error }) => {
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
          business_type: businessType as any,
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
          categories: selectedCategories,
          regions: [],
          roles: selectedRoles,
          user_goal: userGoal,
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
    <div className="min-h-screen flex flex-col">
      <main
        className="flex-1 relative"
        style={{
          backgroundColor: '#fefcf3',
          backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px',
        }}
      >
        {/* Back Arrow - Only visible on step 1 */}
        {step === 1 && (
          <div className="absolute top-6 left-6 z-10">
            <Link 
              href="/"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200"
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
          </div>
        )}

        {/* Logo, Branding & Header - Centered Above Container */}
        <div className="pt-12 pb-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            {/* Logo and Brand Name - Smaller */}
            <div className="flex items-center space-x-2">
              <Image
                src="/tplogo.png" 
                alt="TenderPost - AI Tender Notifier Platform" 
                className="h-8 w-8 rounded-lg object-contain"
                priority
                width={32}
                height={32}
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span>
              </span>
            </div>

            {/* Welcome Header - Bigger */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Welcome to TenderPost</h1>
              <p className="text-gray-600 text-lg">Smarter tender discovery powered by AI.</p>
            </div>
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col">
            {/* Minimal Stepper with Line Through Dots */}
            <div className="mb-6">
              <div className="relative">
                {/* Step Indicators */}
                <div className="relative flex items-center justify-between pb-3">
                  {/* Horizontal Line Running Through Center of Dots */}
                  <div 
                    ref={lineRef}
                    className="absolute top-0 left-0 right-0 h-0.5 transform translate-y-2"
                  >
                    {/* Background Line */}
                    <div className="absolute inset-0 bg-gray-200" />
                    {/* Progress Line (Bottle Green to Lime Green Gradient) */}
                    <div 
                      className="absolute left-0 top-0 h-full transition-all duration-500 ease-out"
                      style={{ 
                        width: progressWidth,
                        background: 'linear-gradient(to right, #1B4332 0%, #1B4332 66%, #84cc16 100%)'
                      }}
                    >
                      {/* Glow effect on second half only */}
                      <div 
                        className="absolute right-0 top-0 h-full w-1/2"
                        style={{
                          background: 'linear-gradient(to right, transparent 0%, rgba(132, 204, 22, 0.3) 50%, rgba(132, 204, 22, 0.6) 100%)',
                          boxShadow: '0 0 8px rgba(132, 204, 22, 0.6), 0 0 12px rgba(132, 204, 22, 0.4)'
                        }}
                      />
                      {/* Glowing tip effect */}
                      <div 
                        className="absolute right-0 top-0 h-full w-[30%] bg-gradient-to-r from-transparent via-[#84cc16]/50 to-[#84cc16] blur-sm"
                      />
                    </div>
                  </div>
                  
                  {steps.map((s) => {
                    const isCompleted = step > s.id;
                    const isActive = step === s.id;
                    
                    return (
                      <div 
                        key={s.id} 
                        ref={(el) => { stepRefs.current[s.id - 1] = el; }}
                        className="relative flex flex-col items-center z-10"
                        style={{ flex: 1 }}
                      >
                        {/* Step Dot (on the line) */}
                        <div 
                          className={`
                            relative w-4 h-4 rounded-full border-2 transition-all duration-300
                            ${isCompleted 
                              ? 'bg-[#1B4332] border-[#1B4332]'
                              : isActive
                              ? 'bg-[#84cc16] border-[#84cc16]'
                              : 'bg-white border-gray-300'
                            }
                            ${isActive ? 'scale-110 ring-2 ring-[#84cc16]/30 shadow-[0_0_8px_rgba(132,204,22,0.5)]' : ''}
                          `}
                        >
                          {/* Checkmark for Completed */}
                          {isCompleted && (
                            <svg 
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 text-white pointer-events-none" 
                              fill="none" 
                              viewBox="0 0 12 12"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M2 6l2 2 4-4"
                              />
                            </svg>
                          )}
                          
                          {/* Active Dot Indicator */}
                          {isActive && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        
                        {/* Step Label */}
                        <span 
                          className={`
                            mt-3 text-xs font-medium transition-colors duration-300 text-center whitespace-nowrap
                            ${isActive 
                              ? 'text-gray-900 font-semibold' 
                              : isCompleted 
                              ? 'text-gray-600' 
                              : 'text-gray-400'
                            }
                          `}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1">
            {step === 1 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-4">
                {/* Email/Password Form */}
                <form onSubmit={handleEmailSignIn} className="w-full max-w-sm space-y-4">
                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                      {authError}
                    </div>
                  )}

                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link
                      href="/auth/reset-password"
                      className="text-sm text-blue-600 hover:text-blue-900 hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-900 text-white py-2.5 rounded-lg font-medium transition-colors"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center w-full max-w-sm my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Social Sign-in Buttons - Side by Side */}
                <div className="w-full max-w-sm space-y-4">
                  <div className="flex gap-3">
                    <GoogleSignInButton 
                      className="flex-1 relative bg-white hover:bg-blue-900 text-gray-900 hover:text-white border-2 border-transparent bg-clip-padding shadow-md hover:shadow-lg transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-blue-900 before:via-blue-600 before:to-sky-400 hover:before:bg-blue-900 px-3 py-2.5 text-sm"
                    />
                    
                    {/* Apple Sign-in Button */}
                    <button
                      type="button"
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const { error } = await supabase.auth.signInWithOAuth({
                            provider: 'apple',
                            options: {
                              redirectTo: `${window.location.origin}/auth/callback`,
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
                      className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white border border-gray-800 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <span className="hidden sm:inline">Sign in with Apple</span>
                      <span className="sm:hidden">Apple</span>
                    </button>
                  </div>

                  {/* Sign Up Prompt */}
                  <div className="text-center text-sm text-gray-600 pb-4">
                    Don't have an account?{' '}
                    <Link
                      href="/auth/signup"
                      className="text-blue-600 hover:text-blue-900 hover:underline font-medium transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Details</h2>
                <div className="grid grid-cols-1 gap-4">
                  <input 
                    className={`border rounded-md px-3 py-2 ${isFullNameLocked ? 'bg-gray-100 cursor-not-allowed' : ''}`} 
                    placeholder="Full name" 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    disabled={isFullNameLocked}
                    readOnly={isFullNameLocked}
                  />
                  <input className="border rounded-md px-3 py-2" placeholder="Company name" value={company} onChange={e => setCompany(e.target.value)} />
                  <select className="border rounded-md px-3 py-2 pr-10 appearance-none bg-white cursor-pointer" value={businessType} onChange={e => setBusinessType(e.target.value)}>
                    {['Proprietorship','Private Limited','Limited Liability Partnership','Micro, Small & Medium Enterprises (MSME)','Startup','Consultant','Individual'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <input className="border rounded-md px-3 py-2" placeholder="GST number (optional)" value={gstNumber} onChange={e => setGstNumber(e.target.value)} />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Years in operation</label>
                    <select className="border rounded-md px-3 py-2 pr-10 appearance-none bg-white cursor-pointer w-full" value={years} onChange={e => setYears(parseInt(e.target.value))}>
                      {Array.from({ length: 21 }, (_, i) => i).map(v => (
                        <option key={v} value={v}>{v === 20 ? '20+' : v}</option>
                      ))}
                    </select>
                  </div>
                  {/* Primary Industry Autocomplete */}
                  <div className="relative">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Primary industry</label>
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
                        onFocus={() => setShowPrimaryDropdown(true)}
                        onBlur={() => setTimeout(() => setShowPrimaryDropdown(false), 200)}
                        className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {primaryIndustry && (
                        <button
                          type="button"
                          onClick={() => {
                            setPrimaryIndustry('');
                            setPrimarySearch('');
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {primaryIndustry && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {primaryIndustry}
                          <button 
                            type="button" 
                            onClick={() => setPrimaryIndustry('')}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      </div>
                    )}
                    {showPrimaryDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filterIndustries(primarySearch).map((industry) => (
                          <button
                            key={industry} 
                            type="button"
                            onClick={() => handlePrimarySelect(industry)}
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
                          >
                                {industry}
                          </button>
                        ))}
                        {filterIndustries(primarySearch).length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">No industries found</div>
                        )}
                    </div>
                    )}
                  </div>

                  {/* Secondary Industries Autocomplete */}
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Secondary industries (up to 3)
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
                        onFocus={() => setShowSecondaryDropdown(true)}
                        onBlur={() => setTimeout(() => setShowSecondaryDropdown(false), 200)}
                        disabled={secondaryIndustries.length >= 3}
                        className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    {secondaryIndustries.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {secondaryIndustries.map((industry) => (
                          <span
                            key={industry}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {industry}
                          <button 
                            type="button" 
                              onClick={() => removeSecondaryIndustry(industry)}
                              className="hover:text-green-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {showSecondaryDropdown && secondaryIndustries.length < 3 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filterIndustries(secondarySearch)
                          .filter(industry => !secondaryIndustries.includes(industry))
                          .map((industry) => (
                            <button
                            key={industry} 
                              type="button"
                              onClick={() => handleSecondarySelect(industry)}
                              className="w-full text-left px-3 py-2 hover:bg-green-50 text-sm border-b border-gray-100 last:border-b-0"
                          >
                            {industry}
                          </button>
                        ))}
                        {filterIndustries(secondarySearch).filter(industry => !secondaryIndustries.includes(industry)).length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            {secondarySearch ? 'No industries found' : 'All matching industries selected'}
                      </div>
                        )}
                    </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)}>Next</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Shape Your AI Assistant</h2>
                  <p className="text-sm text-gray-600">
                    This is where you shape AI behavior without making it complicated.
                  </p>
                  </div>

                <div className="space-y-6">
                  {/* Categories of Interest */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Categories of interest
                      </label>
                    <div className="relative">
                      <input
                        ref={categoryInputRef}
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setShowCategoryDropdown(true);
                        }}
                        onFocus={() => setShowCategoryDropdown(true)}
                        onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                        className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {selectedCategories.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedCategories.map((category) => (
                          <span
                            key={category}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => toggleCategory(category)}
                              className="hover:text-purple-900"
                            >
                              ×
                            </button>
                          </span>
                    ))}
                  </div>
                    )}
                    {showCategoryDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filterCategories(categorySearch).map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              toggleCategory(category);
                              setCategorySearch('');
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-purple-50 text-sm border-b border-gray-100 last:border-b-0 ${
                              selectedCategories.includes(category) ? 'bg-purple-50 font-medium' : ''
                            }`}
                          >
                            {category}
                            {selectedCategories.includes(category) && (
                              <span className="float-right text-purple-600">✓</span>
                            )}
                          </button>
                        ))}
                  </div>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Pre-set roles
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      They don't need exact accuracy; your model only needs direction.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {roleOptions.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => toggleRole(role)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedRoles.includes(role)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* User Goal */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      What describes you best?
                    </label>
                    <div className="space-y-2">
                      {goalOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setUserGoal(option.value)}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                            userGoal === option.value
                              ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button disabled={loading} onClick={submitOnboarding}>
                    {loading ? 'Saving...' : 'Finish Setup'}
                  </Button>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


