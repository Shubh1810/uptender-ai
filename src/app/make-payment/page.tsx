'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, Check } from 'lucide-react';
import { loadRazorpayCheckout } from '@/features/billing/checkout-script';
import type { RazorpayOptions, RazorpayResponse } from '@/features/billing/types';
import { createClient } from '@/lib/supabase/client';
import {
  PAID_PLANS,
  PAID_PLAN_IDS,
  GST_RATE,
  formatINR,
  getPlanPricing,
  planFromCheckoutKey,
  type PaidPlanId,
} from '@/config/plans';

interface PaymentFormData {
  name: string;
  email: string;
  phone: string;
}

interface PaymentStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

const PLAN_HIGHLIGHTS: Record<PaidPlanId, string[]> = {
  basic: [
    'All India tenders: GeM, eProcure, state & PSU portals',
    'Unlimited AI-powered search with negative filters',
    'Daily email + WhatsApp alerts with Excel export',
    'Unlimited eligibility verdicts',
    '3 bid packs / month',
  ],
  pro: [
    'Everything in Starter, with higher monthly limits',
    '15 bid packs / month',
    '750 tender downloads / month',
    'Certificate expiry watchdog',
    'Priority email support',
  ],
  enterprise: [
    'Everything in Professional, with 4x the monthly limits',
    '50 bid packs / month',
    'Custom annexure templates',
    'API access & MCP server',
    'Dedicated onboarding & WhatsApp support line',
  ],
};

const GST_PERCENT = Math.round(GST_RATE * 100);

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPlan = planFromCheckoutKey(searchParams.get('plan'))?.id ?? 'pro';
  const [activePlan, setActivePlan] = useState<PaidPlanId>(initialPlan);

  const plan = PAID_PLANS[activePlan];
  const pricing = getPlanPricing(activePlan);

  const [formData, setFormData] = useState<PaymentFormData>({ name: '', email: '', phone: '' });
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ type: 'idle' });
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const loaded = await loadRazorpayCheckout();
      if (cancelled) return;
      setIsScriptLoaded(loaded);
      if (!loaded) {
        setPaymentStatus({ type: 'error', message: 'Failed to load payment gateway. Please refresh.' });
      }
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && !cancelled) {
          setFormData((prev) => ({
            ...prev,
            email: user.email ?? prev.email,
            name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? prev.name,
          }));
        }
      } catch {
        /* prefill is a convenience only */
      }
    };
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!isScriptLoaded || !window.Razorpay) {
      setPaymentStatus({ type: 'error', message: 'Payment gateway not loaded. Please refresh.' });
      return;
    }
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setPaymentStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    setPaymentStatus({ type: 'loading' });

    try {
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) throw new Error(orderData.error || 'Failed to create order');

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TenderPost',
        description: `${plan.name} Plan – Annual (12 months)`,
        order_id: orderData.orderId,
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: '#f97316' },
        handler: async (response: RazorpayResponse) => {
          setPaymentStatus({ type: 'loading' });
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const result = await verifyRes.json();
            if (verifyRes.ok && result.success) {
              setPaymentStatus({ type: 'success', message: 'Payment successful! Redirecting to dashboard…' });
              setTimeout(() => router.push('/dashboard'), 2000);
            } else {
              setPaymentStatus({
                type: 'error',
                message: result.error || 'Verification failed. If you were charged, your plan will activate shortly.',
              });
            }
          } catch {
            setPaymentStatus({
              type: 'error',
              message: 'Could not confirm payment. If you were charged, your plan will activate shortly.',
            });
          }
        },
        modal: {
          ondismiss: () => setPaymentStatus({ type: 'idle' }),
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      setPaymentStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.',
      });
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

        {/* Plan tabs */}
        <div className="mt-6 inline-flex items-center gap-1 bg-[#1c1c1e] rounded-xl p-1">
          {PAID_PLAN_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setActivePlan(id)}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                activePlan === id ? 'bg-[#2c2c2e] text-white shadow-sm' : 'text-[#8a8a8e] hover:text-white'
              }`}
            >
              {activePlan === id && <Check className="w-3.5 h-3.5 text-orange-400" />}
              {PAID_PLANS[id].name}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left — features + contact */}
        <div className="space-y-5">
          <div className="bg-[#1c1c1e] rounded-2xl p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-[#636366] mb-4">What&apos;s included</p>
            <ul className="space-y-3">
              {PLAN_HIGHLIGHTS[activePlan].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-[#ebebf5]">
                  <div className="w-5 h-5 rounded-full bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1c1c1e] rounded-2xl p-6 space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[#636366]">Your details</p>

            {paymentStatus.type === 'error' && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{paymentStatus.message}</p>
              </div>
            )}

            <div className="space-y-3">
              {[
                { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'jane@company.com' },
                { id: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
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
          <p className="text-xs font-medium uppercase tracking-wider text-[#636366] mb-5">Summary</p>

          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8a8a8e]">Plan</span>
              <span className="text-sm text-white font-medium">{plan.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#8a8a8e]">Period</span>
              <span className="text-sm text-white text-right">Annual (12 months)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8a8a8e]">Rate</span>
              <span className="text-sm text-white">
                {formatINR(pricing.monthlyEquivalent)}/mo{' '}
                <span className="text-xs text-[#8a8a8e]">billed yearly</span>
              </span>
            </div>
          </div>

          <div className="h-px bg-[#3a3a3c] mb-5" />

          <div className="space-y-2 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8a8a8e]">Subtotal</span>
              <span className="text-sm text-white">{formatINR(pricing.base)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#8a8a8e]">GST ({GST_PERCENT}%)</span>
              <span className="text-sm text-white">{formatINR(pricing.gst)}</span>
            </div>
          </div>

          <div className="h-px bg-[#3a3a3c] mb-5" />

          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-white">Total</span>
            <span className="text-lg font-semibold text-white">{formatINR(pricing.total)}</span>
          </div>
          <p className="text-xs text-[#636366] mb-6">
            Includes GST at {GST_PERCENT}%, i.e. {formatINR(pricing.gst)}
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
              `Upgrade to ${plan.name}`
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
