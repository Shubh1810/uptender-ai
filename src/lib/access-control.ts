// Access Control System for Subscription Tiers
import { createClient } from '@/lib/supabase/server';

export type Feature = 
  | 'email_alerts'
  | 'whatsapp_alerts'
  | 'sms_alerts'
  | 'ai_basic'
  | 'ai_advanced'
  | 'bid_drafting'
  | 'competitor_intel'
  | 'export_data'
  | 'priority_support'
  | 'api_access'
  | 'search_filters';

export type UsageKey = 
  | 'tenders_viewed_today'
  | 'saved_tenders'
  | 'ai_queries_today'
  | 'exports_this_month';

export interface AccessCheckResult {
  allowed: boolean;
  reason?: string;
  currentUsage?: number;
  limit?: number;
  planId?: string;
  upgradeRequired?: boolean;
}

/**
 * Check if user has access to a feature
 */
export async function checkFeatureAccess(
  userId: string,
  feature: Feature
): Promise<AccessCheckResult> {
  const supabase = await createClient();
  
  try {
    // Call the helper function we created in SQL
    const { data, error } = await supabase.rpc('user_has_feature', {
      p_user_id: userId,
      p_feature_key: feature
    });
    
    if (error) {
      console.error('Error checking feature:', error);
      return { allowed: false, reason: 'Failed to check feature access' };
    }
    
    if (!data) {
      return { 
        allowed: false, 
        reason: `Feature '${feature}' not available in your plan`,
        upgradeRequired: true
      };
    }
    
    return { allowed: true };
  } catch (error) {
    console.error('Exception checking feature:', error);
    return { allowed: false, reason: 'Failed to check feature access' };
  }
}

/**
 * Check usage limit and increment atomically if allowed
 */
export async function checkUsageLimit(
  userId: string,
  usageKey: UsageKey,
  incrementBy: number = 1
): Promise<AccessCheckResult> {
  const supabase = await createClient();
  
  try {
    // First get the limit from user's plan
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('plan_id, subscription_plans(limits)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (!subscription) {
      return { allowed: false, reason: 'No active subscription' };
    }
    
    const plan = subscription.subscription_plans as any;
    const limit = plan?.limits?.[usageKey] ?? 0;
    
    // -1 means unlimited
    if (limit === -1) {
      return { 
        allowed: true, 
        limit: -1, 
        currentUsage: 0,
        planId: subscription.plan_id 
      };
    }
    
    // Call atomic increment function
    const { data: result, error } = await supabase.rpc('check_and_increment_usage', {
      p_user_id: userId,
      p_usage_key: usageKey,
      p_increment: incrementBy,
      p_limit: limit
    });
    
    if (error) {
      console.error('Error checking usage:', error);
      return { allowed: false, reason: 'Failed to check usage limit' };
    }
    
    if (result.exceeded) {
      return {
        allowed: false,
        reason: `Limit reached (${result.current_count}/${result.limit})`,
        currentUsage: result.current_count,
        limit: result.limit,
        planId: subscription.plan_id,
        upgradeRequired: true
      };
    }
    
    return {
      allowed: true,
      currentUsage: result.current_count,
      limit: result.limit,
      planId: subscription.plan_id
    };
  } catch (error) {
    console.error('Exception checking usage:', error);
    return { allowed: false, reason: 'Failed to check usage limit' };
  }
}

/**
 * Combined check: both feature access and usage limit
 */
export async function checkAccess(
  userId: string,
  feature: Feature,
  usageKey?: UsageKey
): Promise<AccessCheckResult> {
  // 1. Check if plan has this feature
  const featureCheck = await checkFeatureAccess(userId, feature);
  if (!featureCheck.allowed) {
    return featureCheck;
  }
  
  // 2. If usage key provided, check and increment usage
  if (usageKey) {
    return await checkUsageLimit(userId, usageKey);
  }
  
  return { allowed: true };
}

/**
 * Get user's current plan details
 */
export async function getUserPlan(userId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        id,
        plan_id,
        status,
        started_at,
        expires_at,
        subscription_plans (
          display_name,
          features,
          limits
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (error || !data) {
      // Return free plan as fallback
      return {
        plan_id: 'free',
        display_name: 'Free',
        status: 'active',
        features: {},
        limits: {}
      };
    }
    
    return {
      ...data,
      ...(data.subscription_plans as any)
    };
  } catch (error) {
    console.error('Exception getting user plan:', error);
    return {
      plan_id: 'free',
      display_name: 'Free',
      status: 'active',
      features: {},
      limits: {}
    };
  }
}

/**
 * Get current usage stats (non-blocking, for display only)
 */
export async function getUserUsage(userId: string, usageKey: UsageKey) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc('get_user_usage', {
      p_user_id: userId,
      p_usage_key: usageKey
    });
    
    if (error || !data) {
      return { current: 0, limit: 0, unlimited: false, percentage: 0 };
    }
    
    return data;
  } catch (error) {
    console.error('Exception getting user usage:', error);
    return { current: 0, limit: 0, unlimited: false, percentage: 0 };
  }
}
