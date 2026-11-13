/**
 * Single source of truth for paid plans and pricing.
 *
 * Used by the landing page, the checkout page, structured data, and — most
 * importantly — the server when it creates Razorpay orders and activates
 * subscriptions. Never hard-code a price anywhere else.
 *
 * All plans are billed yearly. Prices are shown per month ("billed yearly")
 * but the customer is charged `yearlyPrice + GST` once a year.
 */

/** Plan IDs as stored in `subscription_plans.id` / `user_subscriptions.plan_id`. */
export const PAID_PLAN_IDS = ['basic', 'pro', 'enterprise'] as const;
export type PaidPlanId = (typeof PAID_PLAN_IDS)[number];
export type PlanId = 'free' | PaidPlanId;

export const GST_RATE = 0.18;
export const BILLING_PERIOD_MONTHS = 12;
export const CURRENCY = 'INR';

export interface PaidPlan {
  id: PaidPlanId;
  /** Public-facing name (the DB id stays stable even if marketing renames a plan). */
  name: string;
  /** Key used in `/make-payment?plan=` links. */
  checkoutKey: string;
  /** Pre-tax price for one year, in whole rupees. */
  yearlyPrice: number;
  userLogins: number;
}

export const PAID_PLANS: Record<PaidPlanId, PaidPlan> = {
  basic: { id: 'basic', name: 'Starter', checkoutKey: 'basic', yearlyPrice: 4999, userLogins: 1 },
  pro: { id: 'pro', name: 'Professional', checkoutKey: 'professional', yearlyPrice: 14999, userLogins: 4 },
  enterprise: { id: 'enterprise', name: 'Enterprise', checkoutKey: 'enterprise', yearlyPrice: 39999, userLogins: 10 },
};

export function isPaidPlanId(value: unknown): value is PaidPlanId {
  return typeof value === 'string' && (PAID_PLAN_IDS as readonly string[]).includes(value);
}

/** Resolve a `?plan=` value (checkout key or plan id) to a plan, or null. */
export function planFromCheckoutKey(key: string | null | undefined): PaidPlan | null {
  if (!key) return null;
  const normalized = key.toLowerCase();
  return Object.values(PAID_PLANS).find((p) => p.checkoutKey === normalized || p.id === normalized) ?? null;
}

export interface PlanPricing {
  /** Pre-tax yearly price, rupees. */
  base: number;
  /** GST in whole rupees. */
  gst: number;
  /** Amount actually charged, rupees. */
  total: number;
  /** Amount actually charged, paise (what Razorpay expects). */
  totalPaise: number;
  /** Per-month equivalent of the pre-tax price, rounded for display. */
  monthlyEquivalent: number;
}

export function getPlanPricing(planId: PaidPlanId): PlanPricing {
  const base = PAID_PLANS[planId].yearlyPrice;
  const gst = Math.round(base * GST_RATE);
  const total = base + gst;
  return {
    base,
    gst,
    total,
    totalPaise: total * 100,
    monthlyEquivalent: Math.round(base / BILLING_PERIOD_MONTHS),
  };
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Expiry for a subscription that starts at `start`. */
export function subscriptionExpiry(start: Date): Date {
  const expires = new Date(start);
  expires.setMonth(expires.getMonth() + BILLING_PERIOD_MONTHS);
  return expires;
}
