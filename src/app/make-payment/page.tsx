'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, Check } from 'lucide-react';
import { loadRazorpayScript } from '@/lib/razorpay';
import { RazorpayOptions, RazorpayResponse } from '@/lib/types/razorpay';
import { createClient } from '@/lib/supabase/client';

interface PaymentFormData {
  name: string;
  email: string;
  phone: string;
}

interface PaymentStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

type PlanKey = 'basic' | 'professional' | 'enterprise';
type BillingCycle = 'monthly' | 'yearly';

// Prices match the landing page
// yearly prices = what lands page already shows as "billed yearly"
// monthly prices = ~15% more expensive per-month equivalent
const PLANS: Record<PlanKey, {
  planId: 'basic' | 'pro' | 'enterprise';
  label: string;
  monthly: { charge: number; displayPrice: number; period: string };
  yearly:  { charge: number; displayPrice: number; period: string; savingsLabel: string };
  features: string[];
}> = {
  basic: {
    planId: 'basic',
    label: 'Basic',
    monthly: { charge: 1499,  displayPrice: 1499,  period: 'Monthly' },
    yearly:  { charge: 14988, displayPrice: 1249,  period: 'Annual (12 months)', savingsLabel: 'Save ₹2,988/yr' },
    features: ['Search & filter tenders', 'Alert settings', 'Email preferences', 'Tender analytics', 'Bid analytics'],
  },
  professional: {
    planId: 'pro',
    label: 'Professional',
    monthly: { charge: 2999,  displayPrice: 2999,  period: 'Monthly' },
    yearly:  { charge: 29988, displayPrice: 2499,  period: 'Annual (12 months)', savingsLabel: 'Save ₹5,988/yr' },
    features: ['Everything in Basic', 'AI Bid Draft', 'AI Review', 'Document Generator', 'Compliance Checker', 'Bid Optimizer'],
  },
  enterprise: {
    planId: 'enterprise',
    label: 'Enterprise',
    monthly: { charge: 7999,  displayPrice: 7999,  period: 'Monthly' },
    yearly:  { charge: 81590, displayPrice: 6799,  period: 'Annual (12 months)', savingsLabel: 'Save ₹14,398/yr' },
    features: ['Everything in Pro', 'Opportunity Finder', 'Competitor Intelligence', 'Risk & Compliance Agent', 'Priority support'],
  },
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planFromUrl = (searchParams.get('plan') ?? 'professional') as PlanKey;
  const initialPlan: PlanKey = PLANS[planFromUrl] ? planFromUrl : 'professional';

  const [activePlan, setActivePlan] = useState<PlanKey>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');

  // Toggle is only available for Enterprise; force yearly for Basic & Pro
  const showBillingToggle = activePlan === 'enterprise';
  const effectiveCycle: BillingCycle = showBillingToggle ? billingCycle : 'yearly';

  const handleSetActivePlan = (key: PlanKey) => {
    setActivePlan(key);
    if (key !== 'enterprise') setBillingCycle('yearly');
  };

  const plan = PLANS[activePlan];
  const billing = effectiveCycle === 'yearly' ? plan.yearly : plan.monthly;
  const gst = Math.round(billing.charge * 0.18);
  const total = billing.charge + gst;

  const [formData, setFormData] = useState<PaymentFormData>({ name: '', email: '', phone: '' });
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ type: 'idle' });
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      const loaded = await loadRazorpayScript();
      setIsScriptLoaded(loaded);
      if (!loaded) {
        setPaymentStatus({ type: 'error', message: 'Failed to load payment gateway. Please refresh.' });
      }
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setFormData(prev => ({
            ...prev,
            email: user.email ?? prev.email,
            name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? prev.name,
          }));
        }
      } catch { /* non-critical */ }
    };
    init();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      setPaymentStatus({ type: 'error', message: 'Payment gateway not loaded. Please refresh.' });
      return;
    }
    if (!formData.name || !formData.email || !formData.phone) {
      setPaymentStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setPaymentStatus({ type: 'loading' });

    try {
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.planId, billingCycle: effectiveCycle, currency: 'INR' }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create order');

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TenderPost',
        description: `${plan.label} Plan – ${billing.period}`,
        order_id: orderData.orderId,
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: '#f97316' },
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const result = await verifyRes.json();
            if (result.success) {
              setPaymentStatus({ type: 'success', message: 'Payment successful! Redirecting to dashboard…' });
              setTimeout(() => router.push('/dashboard'), 2000);
            } else {
              setPaymentStatus({ type: 'error', message: result.error || 'Verification failed. Contact support.' });
            }
          } catch {
            setPaymentStatus({ type: 'error', message: 'Verification failed. Contact support.' });
          }
        },
        modal: {
          ondismiss: () => setPaymentStatus({ type: 'idle' }),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setPaymentStatus({ type: 'error', message: 'Failed to initiate payment. Please try again.' });
    }
  };

  if (paymentStatus.type === 'success') {
    return (
      <div className="min-h-screen bg-[#111113] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">Payment Successful</h2>
          <p className="text-sm text-[#8a8a8e]">{paymentStatus.message}</p>
          <Loader2 className="w-4 h-4 animate-spin text-[#8a8a8e] mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111113] text-white">
      {/* Top bar */}
      <div className="px-6 py-5 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-[#8a8a8e] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Page header */}
      <div className="text-center pt-4 pb-10 px-4">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Upgrade Plan</h1>
        <p className="mt-2 text-sm text-[#8a8a8e]">Unlock powerful tools for your procurement workflow</p>

        {/* Billing cycle toggle — Enterprise only */}
        {showBillingToggle && (
        <div className="mt-6 inline-flex items-center gap-1 bg-[#1c1c1e] rounded-xl p-1 relative">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              effectiveCycle === 'monthly'
                ? 'bg-[#2c2c2e] text-white shadow-sm'
                : 'text-[#8a8a8e] hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              effectiveCycle === 'yearly'
                ? 'bg-[#2c2c2e] text-white shadow-sm'
                : 'text-[#8a8a8e] hover:text-white'
            }`}
          >
            Yearly
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-400 leading-none">
              Save 15%
            </span>
          </button>
        </div>
        )}

        {/* Plan tabs */}
        <div className="mt-4 inline-flex items-center gap-1 bg-[#1c1c1e] rounded-xl p-1">
          {(Object.keys(PLANS) as PlanKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handleSetActivePlan(key)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                activePlan === key
                  ? 'bg-[#2c2c2e] text-white shadow-sm'
                  : 'text-[#8a8a8e] hover:text-white'
              }`}
            >
              {activePlan === key && <Check className="w-3.5 h-3.5 text-orange-400" />}
              {PLANS[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* Left — features + contact */}
        <div className="space-y-5">
          {/* Feature list */}
          <div className="bg-[#1c1c1e] rounded-2xl p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-[#636366] mb-4">
              What&apos;s included
            </p>
            <ul className="space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#ebebf5]">
                  <div className="w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact details */}
          <div className="bg-[#1c1c1e] rounded-2xl p-6 space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[#636366]">
              Your details
            </p>

            {paymentStatus.type === 'error' && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{paymentStatus.message}</p>
              </div>
            )}

            <div className="space-y-3">
              {[
                { id: 'name',  label: 'Full Name', type: 'text',  placeholder: 'Jane Doe' },
                { id: 'email', label: 'Email',      type: 'email', placeholder: 'jane@company.com' },
                { id: 'phone', label: 'Phone',      type: 'tel',   placeholder: '+91 98765 43210' },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-xs font-medium text-[#8a8a8e] mb-1.5">
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    value={formData[id as keyof PaymentFormData]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full bg-[#2c2c2e] border border-[#3a3a3c] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#636366] focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — summary */}
        <div className="bg-[#1c1c1e] rounded-2xl p-6 flex flex-col h-fit lg:sticky lg:top-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[#636366] mb-5">
            Summary
          </p>

          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8a8a8e]">Plan</span>
              <span className="text-sm text-white font-medium">{plan.label}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#8a8a8e]">Period</span>
              <span className="text-sm text-white text-right">{billing.period}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8a8a8e]">Rate</span>
              <span className="text-sm text-white">
                ₹{billing.displayPrice.toLocaleString('en-IN')}/mo
              </span>
            </div>
            {/* Savings callout for yearly */}
            {effectiveCycle === 'yearly' && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm text-[#8a8a8e]">Savings</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-orange-500/15 text-orange-400">
                  {plan.yearly.savingsLabel}
                </span>
              </div>
            )}
          </div>

          <div className="h-px bg-[#3a3a3c] mb-5" />

          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8a8a8e]">Subtotal</span>
              <span className="text-sm text-white">₹{billing.charge.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8a8a8e]">GST (18%)</span>
              <span className="text-sm text-white">₹{gst.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="h-px bg-[#3a3a3c] mb-5" />

          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-white">Total</span>
            <span className="text-lg font-semibold text-white">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-xs text-[#636366] mb-6">
            Includes GST at 18%, i.e. ₹{gst.toLocaleString('en-IN')}
          </p>

          <button
            onClick={handlePayment}
            disabled={paymentStatus.type === 'loading' || !isScriptLoaded}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
          >
            {paymentStatus.type === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing…
              </>
            ) : (
              `Upgrade to ${plan.label}`
            )}
          </button>

          <p className="text-xs text-[#636366] text-center mt-4 leading-relaxed">
            By clicking above you agree to TenderPost&apos;s{' '}
            <Link href="/terms-and-conditions" className="underline hover:text-[#8a8a8e] transition-colors">
              Terms of use
            </Link>
          </p>

          <div className="mt-6 pt-5 border-t border-[#3a3a3c] flex items-center justify-center gap-3 text-xs text-[#636366]">
            <span>UPI</span>
            <span>•</span>
            <span>Cards</span>
            <span>•</span>
            <span>Net Banking</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentLoading() {
  return (
    <div className="min-h-screen bg-[#111113] flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-[#636366]" />
    </div>
  );
}

export default function MakePaymentPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentContent />
    </Suspense>
  );
}
