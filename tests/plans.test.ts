import { describe, expect, it } from 'vitest';
import {
  PAID_PLANS,
  PAID_PLAN_IDS,
  getPlanPricing,
  isPaidPlanId,
  planFromCheckoutKey,
  subscriptionExpiry,
} from '@/config/plans';

describe('plan pricing', () => {
  it('charges base + 18% GST, matching the totals advertised on the landing page', () => {
    expect(getPlanPricing('basic')).toMatchObject({ base: 4999, gst: 900, total: 5899, totalPaise: 589900 });
    expect(getPlanPricing('pro')).toMatchObject({ base: 14999, gst: 2700, total: 17699 });
    expect(getPlanPricing('enterprise')).toMatchObject({ base: 39999, gst: 7200, total: 47199 });
  });

  it('shows a whole-rupee monthly equivalent of the yearly price', () => {
    expect(getPlanPricing('basic').monthlyEquivalent).toBe(417);
    expect(getPlanPricing('pro').monthlyEquivalent).toBe(1250);
    expect(getPlanPricing('enterprise').monthlyEquivalent).toBe(3333);
  });

  it('always charges an integer number of paise', () => {
    for (const id of PAID_PLAN_IDS) {
      expect(Number.isInteger(getPlanPricing(id).totalPaise)).toBe(true);
    }
  });
});

describe('plan lookup', () => {
  it('resolves checkout keys and plan ids', () => {
    expect(planFromCheckoutKey('professional')?.id).toBe('pro');
    expect(planFromCheckoutKey('pro')?.id).toBe('pro');
    expect(planFromCheckoutKey('BASIC')?.id).toBe('basic');
    expect(planFromCheckoutKey('free')).toBeNull();
    expect(planFromCheckoutKey(null)).toBeNull();
  });

  it('only accepts real paid plan ids', () => {
    expect(isPaidPlanId('enterprise')).toBe(true);
    expect(isPaidPlanId('free')).toBe(false);
    expect(isPaidPlanId('__proto__')).toBe(false);
    expect(Object.keys(PAID_PLANS).sort()).toEqual([...PAID_PLAN_IDS].sort());
  });
});

describe('subscriptionExpiry', () => {
  it('lasts 12 months', () => {
    expect(subscriptionExpiry(new Date('2026-01-15T00:00:00Z')).toISOString()).toBe('2027-01-15T00:00:00.000Z');
  });
});
