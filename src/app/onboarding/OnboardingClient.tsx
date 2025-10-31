'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/ui/google-signin-button';
import { createClient } from '@/lib/supabase/client';

type Step = 1 | 2 | 3;

export default function OnboardingClient() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState<Step>(1);
  const [loading, setLoading] = React.useState(false);

  const [fullName, setFullName] = React.useState('');
  const [isFullNameLocked, setIsFullNameLocked] = React.useState(false);
  const [company, setCompany] = React.useState('');
  const [businessType, setBusinessType] = React.useState('Proprietorship');
  const [gstNumber, setGstNumber] = React.useState('');
  const [years, setYears] = React.useState<number>(0);
  const [primaryIndustry, setPrimaryIndustry] = React.useState('');
  const [secondaryIndustries, setSecondaryIndustries] = React.useState<string[]>([]);

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

  const [notifyWhatsApp, setNotifyWhatsApp] = React.useState(false);
  const [notifySMS, setNotifySMS] = React.useState(false);
  const [notifyEmail, setNotifyEmail] = React.useState(true);
  const [notifyInapp, setNotifyInapp] = React.useState(true);
  const [frequency, setFrequency] = React.useState<'real_time' | 'daily' | 'weekly'>('daily');
  const [alertThreshold, setAlertThreshold] = React.useState(70);
  const [keywords, setKeywords] = React.useState<string[]>([]);

  const steps = [
    { id: 1 as Step, label: 'Sign up / Login' },
    { id: 2 as Step, label: 'Company Snapshot' },
    { id: 3 as Step, label: 'Tender Preferences & Alerts' },
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
        // Check if user has completed onboarding before redirecting to step 2
        supabase
          .from('profiles')
          .select('onboarding_completed, full_name')
          .eq('id', data.user.id)
          .maybeSingle()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
              // On error, default to step 2
              if (!stepParam) setStep(2);
            } else if (profile) {
              // If onboarding is completed, redirect to dashboard
              // Check for true (boolean), 'true' (string), or 1 (number) to handle all cases
              const isCompleted = profile.onboarding_completed === true || 
                                  profile.onboarding_completed === 'true' || 
                                  profile.onboarding_completed === 1;
              
              if (isCompleted) {
                window.location.href = '/dashboard';
                return;
              }
              // If not completed, go to step 2
              if (!stepParam) setStep(2);
              
              // Set full name if available
              if (profile.full_name) {
                setFullName(profile.full_name);
                setIsFullNameLocked(true);
              }
            } else {
              // No profile exists, go to step 2
              if (!stepParam) setStep(2);
            }
          });
        
        // Also check user_metadata from auth for full name
        const oauthFullName = 
          data.user.user_metadata?.full_name || 
          data.user.user_metadata?.name || 
          data.user.user_metadata?.display_name;
        
        if (oauthFullName) {
          setFullName(oauthFullName);
          setIsFullNameLocked(true);
        }
      }
    });
  }, [supabase, searchParams]);

  const toggleSecondary = (v: string) => {
    setSecondaryIndustries(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };

  const addKeyword = (k: string) => {
    if (!k) return;
    setKeywords(prev => Array.from(new Set([...prev, k])));
  };

  const removeKeyword = (k: string) => setKeywords(prev => prev.filter(x => x !== k));

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
          notify_whatsapp: notifyWhatsApp,
          notify_sms: notifySMS,
          notify_email: notifyEmail,
          notify_inapp: notifyInapp,
          frequency,
          alert_threshold: alertThreshold,
          keywords,
          categories: [],
          regions: [],
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
      <Header />
      <main
        className="flex-1 relative pt-20 md:pt-24"
        style={{
          backgroundColor: '#fefcf3',
          backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px',
        }}
      >

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 min-h-[600px] flex flex-col">
            {/* Minimal Stepper with Line Through Dots */}
            <div className="mb-10">
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
              <div className="h-full flex flex-col items-center justify-center text-center mt-8 md:mt-22">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h1>
                <p className="text-gray-600 mb-6">Sign in to personalize your tender alerts</p>
                <GoogleSignInButton className="relative bg-white hover:bg-blue-900 text-gray-900 hover:text-white border-2 border-transparent bg-clip-padding shadow-md hover:shadow-lg transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-blue-900 before:via-blue-600 before:to-sky-400 hover:before:bg-blue-900 px-4 py-2" />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Primary industry</label>
                      <select className="border rounded-md px-3 py-2 pr-10 appearance-none bg-white cursor-pointer w-full" value={primaryIndustry} onChange={e => setPrimaryIndustry(e.target.value)}>
                        <option value="">Select an industry</option>
                        {industryCategories.map((category) => (
                          <optgroup key={category.category} label={category.category}>
                            {category.industries.map((industry) => (
                              <option key={industry} value={industry}>
                                {industry}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Secondary industries</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {allIndustries.map(industry => (
                          <button 
                            type="button" 
                            key={industry} 
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                              secondaryIndustries.includes(industry) 
                                ? 'bg-[#1B4332] text-white border-[#1B4332]' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1B4332]/50'
                            }`} 
                            onClick={() => toggleSecondary(industry)}
                          >
                            {industry}
                          </button>
                        ))}
                      </div>
                    </div>
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tender Preferences & Alerts</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={`px-3 py-1 rounded-full text-sm border ${notifyWhatsApp ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`} onClick={() => setNotifyWhatsApp(v => !v)}>WhatsApp</button>
                    <button type="button" className={`px-3 py-1 rounded-full text-sm border ${notifySMS ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`} onClick={() => setNotifySMS(v => !v)}>SMS</button>
                    <button type="button" className={`px-3 py-1 rounded-full text-sm border ${notifyEmail ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`} onClick={() => setNotifyEmail(v => !v)}>Email</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Frequency</span>
                    {(['real_time','daily','weekly'] as const).map(f => (
                      <label key={f} className="text-sm text-gray-700 flex items-center gap-1">
                        <input type="radio" name="freq" checked={frequency === f} onChange={() => setFrequency(f)} />
                        {f.replace('_',' ')}
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Auto-alert if match score ≥ {alertThreshold}%</label>
                    <input type="range" min={0} max={100} value={alertThreshold} onChange={e => setAlertThreshold(parseInt(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Keyword watchlist</label>
                    <div className="flex gap-2 mt-2">
                      <input id="kw" className="border rounded-md px-3 py-2 flex-1" placeholder="Add a keyword" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const v = (e.target as HTMLInputElement).value.trim(); addKeyword(v); (e.target as HTMLInputElement).value=''; } }} />
                      <Button onClick={() => { const el = document.getElementById('kw') as HTMLInputElement | null; if (el) { const v = el.value.trim(); addKeyword(v); el.value=''; } }}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.map(k => (
                        <span key={k} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                          {k}
                          <button className="ml-2 text-gray-500" onClick={() => removeKeyword(k)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button disabled={loading} onClick={submitOnboarding}>{loading ? 'Saving...' : 'Finish'}</Button>
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


