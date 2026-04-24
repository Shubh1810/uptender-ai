'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useDashboardAccess, type SubscriptionPlan } from '@/components/dashboard/DashboardAccessProvider';

export function useSubscription() {
  const { initialPlan } = useDashboardAccess();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(initialPlan);
  const [loading, setLoading] = useState(!initialPlan);
  
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select(`
            plan_id,
            status,
            expires_at,
            subscription_plans (
              display_name,
              features,
              limits
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .or(`expires_at.is.null,expires_at.gt.${now}`)
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error || !data) {
          // Default to free plan
          setPlan({
            plan_id: 'free',
            display_name: 'Free',
            features: {},
            limits: {},
            status: 'active'
          });
        } else {
          const planData = data.subscription_plans as any;
          setPlan({
            plan_id: data.plan_id,
            display_name: planData?.display_name || 'Free',
            features: planData?.features || {},
            limits: planData?.limits || {},
            status: data.status
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        // Default to free plan on error
        setPlan({
          plan_id: 'free',
          display_name: 'Free',
          features: {},
          limits: {},
          status: 'active'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlan();
  }, []);
  
  const hasFeature = (feature: string): boolean => {
    if (!plan) return false;
    return plan.features?.[feature] === true;
  };
  
  const getLimit = (limitKey: string): number => {
    if (!plan) return 0;
    return plan.limits?.[limitKey] ?? 0;
  };
  
  const isFreePlan = plan?.plan_id === 'free';
  const isPro = plan?.plan_id === 'pro' || plan?.plan_id === 'enterprise';
  const isBasic = plan?.plan_id === 'basic';
  
  return {
    plan,
    loading,
    hasFeature,
    getLimit,
    isFreePlan,
    isBasic,
    isPro,
    planId: plan?.plan_id
  };
}
