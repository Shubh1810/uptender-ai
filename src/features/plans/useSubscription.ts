'use client';

import { useDashboardAccess } from '@/components/layout/dashboard/DashboardAccessProvider';
import type { SubscriptionPlan } from '@/features/plans/types';

const FREE_PLAN: SubscriptionPlan = {
  plan_id: 'free',
  display_name: 'Free',
  features: {},
  limits: {},
  status: 'active',
};

/**
 * The current user's plan, resolved on the server by the dashboard layout
 * (see `getActivePlan`). Use it for UI decisions only; APIs enforce access.
 */
export function useSubscription() {
  const { initialPlan } = useDashboardAccess();
  const plan = initialPlan ?? FREE_PLAN;

  const hasFeature = (feature: string): boolean => plan.features?.[feature] === true;
  const getLimit = (limitKey: string): number => plan.limits?.[limitKey] ?? 0;

  return {
    plan,
    loading: false,
    hasFeature,
    getLimit,
    isFreePlan: plan.plan_id === 'free',
    isBasic: plan.plan_id === 'basic',
    isPro: plan.plan_id === 'pro' || plan.plan_id === 'enterprise',
    planId: plan.plan_id,
  };
}
