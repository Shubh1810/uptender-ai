'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PAID_PLANS, formatINR, getPlanPricing, type PaidPlanId } from '@/features/plans/catalog';

interface FeatureRowData {
  title: string;
  description?: string;
  value?: string;
}

interface TailoredRowData {
  label: string;
  value: string;
}

interface PricingPlan {
  name: string;
  /** Paid plan backing this card; prices and checkout key come from `@/features/plans/catalog`. */
  planId?: PaidPlanId;
  tagline: string;
  priceLabel?: string;
  gstNote?: string;
  pill?: string;
  popular?: boolean;
  features?: FeatureRowData[];
  tailored?: TailoredRowData[];
  cta:
    | { type: 'buy' }
    | { type: 'custom' };
}

const pricingPlans: PricingPlan[] = [
  {
    name: PAID_PLANS.basic.name,
    planId: 'basic',
    tagline: 'For individual bidders who want eligibility answers, not just alerts.',
    pill: '1 user login',
    features: [
      { title: 'All India Tenders Covered', description: 'GeM, eProcure, state & PSU portals' },
      { title: 'Unlimited Search', description: 'AI-powered, with negative filters' },
      { title: 'Daily Email + WhatsApp Alerts', description: '9 AM digest with Excel export' },
      { title: 'Credential Vault', description: 'Udyam, GST, ITRs — stored once' },
      { title: 'Eligibility Verdicts', description: 'Pass, fail or conditional verdicts', value: 'Unlimited' },
      { title: 'Bid Pack Generation', description: 'Annexures & undertakings, ready to sign', value: '3 /Month' },
      { title: 'Tender Downloads', description: 'Documents & BOQ', value: '150 /Month' },
      { title: 'Company Contacts', description: 'Phone, email & GST', value: '10 /Month' },
      { title: 'Competitor Intelligence', description: 'Past L1 rates & bidder profiles', value: '10 /Month' },
      { title: 'Organisation Analysis', description: 'Buyer patterns & demand trends', value: '10 /Month' },
      { title: 'Corrigendum Tracking', description: 'Automatic amendment alerts' },
    ],
    cta: { type: 'buy' },
  },
  {
    name: PAID_PLANS.pro.name,
    planId: 'pro',
    tagline: 'For teams bidding regularly who need volume and compliance cover.',
    pill: '4 user logins',
    popular: true,
    features: [
      { title: 'Everything in Starter', description: 'With higher monthly limits' },
      { title: 'Eligibility Verdicts', description: 'Pass, fail or conditional verdicts', value: 'Unlimited' },
      { title: 'Bid Pack Generation', description: 'Annexures & undertakings, ready to sign', value: '15 /Month' },
      { title: 'Tender Downloads', description: 'Documents & BOQ', value: '750 /Month' },
      { title: 'Company Contacts', description: 'Phone, email & GST', value: '40 /Month' },
      { title: 'Competitor Intelligence', description: 'Past L1 rates & bidder profiles', value: '40 /Month' },
      { title: 'Organisation Analysis', description: 'Buyer patterns & demand trends', value: '40 /Month' },
      { title: 'Certificate Expiry Watchdog', description: 'Flags stale documents before you upload' },
      { title: 'Priority Email Support', description: 'Faster response times from our team' },
    ],
    cta: { type: 'buy' },
  },
  {
    name: PAID_PLANS.enterprise.name,
    planId: 'enterprise',
    tagline: 'For bid teams running at volume, with API access and your own templates.',
    pill: '10 user logins',
    features: [
      { title: 'Everything in Professional', description: 'With 4x the monthly limits' },
      { title: 'Eligibility Verdicts', description: 'Pass, fail or conditional verdicts', value: 'Unlimited' },
      { title: 'Bid Pack Generation', description: 'Annexures & undertakings, ready to sign', value: '50 /Month' },
      { title: 'Tender Downloads', description: 'Documents & BOQ', value: '3,000 /Month' },
      { title: 'Company Contacts', description: 'Phone, email & GST', value: '150 /Month' },
      { title: 'Competitor Intelligence', description: 'Past L1 rates & bidder profiles', value: '150 /Month' },
      { title: 'Organisation Analysis', description: 'Buyer patterns & demand trends', value: '150 /Month' },
      { title: 'Custom Annexure Templates', description: 'Your letterhead and formats, pre-loaded' },
      { title: 'API Access & MCP Server', description: 'Pipe tenders into your own systems' },
      { title: 'Dedicated Onboarding & WhatsApp Support Line', description: 'A named contact for setup and support' },
    ],
    cta: { type: 'buy' },
  },
  {
    name: 'Custom',
    tagline: 'For larger teams needing higher limits, more logins, and market intelligence.',
    priceLabel: 'Custom quote',
    gstNote: 'Includes setup, onboarding & ongoing support',
    tailored: [
      { label: 'Usage Limits', value: 'Requirement-based' },
      { label: 'User Logins', value: 'Custom' },
      { label: 'Bid Pack Volume', value: 'Unlimited' },
      { label: 'Custom Integrations', value: 'Requirement-based' },
      { label: 'API & MCP Server', value: 'Available' },
      { label: 'SSO & Audit Logs', value: 'Available' },
      { label: 'Onboarding & Support', value: 'Dedicated CSM' },
    ],
    cta: { type: 'custom' },
  },
];

function FeatureRow({ title, description, value }: FeatureRowData) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-green-500" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[12.5px] font-semibold text-gray-900">{title}</span>
          {value && (
            <span className="flex-shrink-0 whitespace-nowrap text-[12.5px]">
              {value.includes('/Month') ? (
                <>
                  <span className="font-bold text-gray-900">{value.replace('/Month', '').trim()}</span>{' '}
                  <span className="font-normal text-gray-400">/Month</span>
                </>
              ) : (
                <span className="font-bold text-gray-900">{value}</span>
              )}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[10.5px] leading-tight text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </li>
  );
}

function PlanPrice({ plan }: { plan: PricingPlan }) {
  if (!plan.planId) {
    return (
      <>
        <span className="text-2xl font-bold text-gray-900">{plan.priceLabel}</span>
        {plan.gstNote && <p className="text-gray-500 text-[11px] mt-0.5">{plan.gstNote}</p>}
      </>
    );
  }

  const pricing = getPlanPricing(plan.planId);
  return (
    <>
      <span className="text-2xl font-bold text-gray-900">
        {formatINR(pricing.monthlyEquivalent)}
        <span className="text-sm font-medium text-gray-500"> /month</span>
      </span>
      <p className="text-gray-500 text-[11px] mt-0.5">
        Billed yearly · {formatINR(pricing.base)} + 18% GST ({formatINR(pricing.total)} total)
      </p>
    </>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-10 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Pricing that fits all
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No Credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-xl p-4 border border-gray-900 transition-all duration-200 hover:shadow-lg flex flex-col h-full"
              style={{
                backgroundColor: plan.popular ? '#fefcf3' : 'white'
              }}
            >
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

              <div className="text-left mb-2">
                <h3 className={`text-xl font-bold mb-1 ${
                  plan.popular ? 'text-[#b84d00] italic font-playfair' : 'text-gray-900'
                }`}>
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-[11px] leading-snug">{plan.tagline}</p>
              </div>

              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <PlanPrice plan={plan} />
                </div>
                {plan.pill && (
                  <span className="flex-shrink-0 whitespace-nowrap rounded-full border border-gray-300 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                    {plan.pill}
                  </span>
                )}
              </div>

              <div className="mb-3 border-t border-gray-200" />

              <ul className="space-y-1.5 mb-3 flex-grow">
                {plan.features?.map((feature, i) => (
                  <FeatureRow key={i} {...feature} />
                ))}

                {plan.tailored && (
                  <li>
                    <p className="text-[10px] font-semibold tracking-wide text-gray-400 mb-2">
                      TAILORED FOR YOU
                    </p>
                    <div className="space-y-1">
                      {plan.tailored.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between border-b border-gray-100 py-1 last:border-0"
                        >
                          <span className="text-[12.5px] text-gray-600">{row.label}</span>
                          <span className="text-[12.5px] font-semibold text-gray-900">{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-start gap-2 border-t border-gray-100 pt-3">
                      <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-green-500" />
                      <p className="text-[11px] leading-snug text-gray-600">
                        <span className="font-semibold text-gray-800">Have another use case?</span> Lead
                        generation, JV partner discovery, surety bonds, market research, or
                        anything else — schedule a demo and we will map it with you.
                      </p>
                    </div>
                  </li>
                )}
              </ul>

              <div className="mt-auto pt-1 flex justify-start">
                {plan.cta.type === 'buy' ? (
                  <Link href={`/make-payment?plan=${plan.planId ? PAID_PLANS[plan.planId].checkoutKey : ''}`}>
                    <Button
                      className={`w-auto py-2 px-6 font-semibold rounded-full transition-colors text-sm opacity-100 ${
                        plan.popular
                          ? 'bg-blue-500 hover:bg-blue-600 text-white border-0'
                          : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-900'
                      }`}
                      style={{ backgroundColor: plan.popular ? '#3b82f6' : '#ffffff', opacity: 1 }}
                    >
                      Get this plan
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col items-start gap-2">
                    <Link href="/contact">
                      <Button className="w-auto py-2 px-6 font-semibold rounded-full transition-colors text-sm bg-white hover:bg-blue-50 text-blue-600 border border-blue-500 flex items-center justify-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Schedule Demo
                      </Button>
                    </Link>
                    <a href="https://wa.me/919821944444" target="_blank" rel="noopener noreferrer">
                      <Button className="w-auto py-2 px-6 font-semibold rounded-full transition-colors text-sm bg-white hover:bg-green-50 text-green-600 border border-green-500 flex items-center justify-center gap-2">
                        <MessageCircle className="h-3.5 w-3.5" />
                        Chat with us
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-[11px] text-gray-500">
          Extra bid packs beyond your plan: ₹149 (Starter), ₹99 (Professional), ₹79 (Enterprise).
          All prices in INR. GST at 18% shown separately. No hidden charges.
        </p>
      </div>
    </section>
  );
}
