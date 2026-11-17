import 'server-only';
import { cache } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { SubscriptionPlan } from '@/features/plans/types';

interface PlanRow {
  display_name?: string | null;
  features?: Record<string, unknown> | null;
  limits?: Record<string, number> | null;
}

interface SubscriptionRow {
  plan_id: string;
  status: string;
  expires_at: string | null;
  subscription_plans: PlanRow | PlanRow[] | null;
}

function toPlan(planId: string, status: string, row: PlanRow | null, expiresAt: string | null = null): SubscriptionPlan {
  return {
    plan_id: planId,
    display_name: row?.display_name || (planId === 'free' ? 'Free' : planId),
    features: row?.features ?? {},
    limits: row?.limits ?? {},
    status,
    expires_at: expiresAt,
  };
}

/**
 * The user's current plan: their newest active, unexpired subscription, or
 * the `free` plan (with its real limits from `subscription_plans`) if none.
 *
 * Always resolve limits through this function. Previously, users without a
 * subscription row skipped limit checks entirely.
 *
 * Cached per server render (React `cache()`), keyed by the client + user id.
 */
export const getActivePlan = cache(loadActivePlan);

async function loadActivePlan(supabase: SupabaseClient, userId: string): Promise<SubscriptionPlan> {
  const now = new Date().toISOString();

  const { data } = await supabase
    .from('user_subscriptions')
    .select('plan_id, status, expires_at, subscription_plans (display_name, features, limits)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionRow>();

  if (data) {
    const plan = Array.isArray(data.subscription_plans) ? data.subscription_plans[0] : data.subscription_plans;
    return toPlan(data.plan_id, data.status, plan ?? null, data.expires_at);
  }

  const { data: free } = await supabase
    .from('subscription_plans')
    .select('display_name, features, limits')
    .eq('id', 'free')
    .maybeSingle<PlanRow>();

  return toPlan('free', 'active', free ?? null);
}

/** Numeric limit for `key`, or `fallback` if the plan doesn't define it. */
export function planLimit(plan: SubscriptionPlan, key: string, fallback: number): number {
  const value = plan.limits?.[key];
  return typeof value === 'number' ? value : fallback;
}
