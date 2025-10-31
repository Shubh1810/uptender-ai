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
  const [primaryIndustry, setPrimaryIndustry] = React.useState('General');
  const [secondaryIndustries, setSecondaryIndustries] = React.useState<string[]>([]);

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
              if (profile.onboarding_completed === true || profile.onboarding_completed === 'true') {
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
            {/* Stepper */}
            <div className="mb-6 sm:mb-8">
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 border-t-2 border-dashed border-gray-200" />
                <ol className="relative z-10 flex items-center justify-between">
                  {steps.map((s) => {
                    const isCompleted = step > s.id;
                    const isActive = step === s.id;
                    return (
                      <li key={s.id} className="flex-1 flex flex-col items-center text-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm border ${isCompleted ? 'bg-blue-600 text-white border-blue-600' : isActive ? 'bg-white text-blue-600 border-blue-600' : 'bg-white text-gray-500 border-gray-300'}`}>{s.id}</div>
                        <span className={`mt-2 text-xs sm:text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>{s.label}</span>
                      </li>
                    );
                  })}
                </ol>
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
                  <select className="border rounded-md px-3 py-2" value={businessType} onChange={e => setBusinessType(e.target.value)}>
                    {['Proprietorship','Pvt Ltd','LLP','MSME','Startup','Consultant','Individual'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                  <input className="border rounded-md px-3 py-2" placeholder="GST number (optional)" value={gstNumber} onChange={e => setGstNumber(e.target.value)} />
                  <select className="border rounded-md px-3 py-2" value={years} onChange={e => setYears(parseInt(e.target.value))}>
                    {Array.from({ length: 22 }, (_, i) => i).map(v => (
                      <option key={v} value={v}>{v === 21 ? '20+' : v}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600">Primary industry</label>
                      <select className="border rounded-md px-3 py-2 w-full" value={primaryIndustry} onChange={e => setPrimaryIndustry(e.target.value)}>
                        {['General','Healthcare','Construction','IT','Government','Education'].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Secondary industries</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {['Healthcare','Construction','IT','Government','Education','Manufacturing'].map(o => (
                          <button type="button" key={o} className={`px-3 py-1 rounded-full text-sm border ${secondaryIndustries.includes(o) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`} onClick={() => toggleSecondary(o)}>
                            {o}
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
                    <button type="button" className={`px-3 py-1 rounded-full text-sm border ${notifyInapp ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`} onClick={() => setNotifyInapp(v => !v)}>In-app</button>
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


