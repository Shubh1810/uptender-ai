import { redirect } from 'next/navigation';
import DashboardShell from '@/components/dashboard/DashboardShell';
import {
  DashboardAccessProvider,
  type SubscriptionPlan,
} from '@/components/dashboard/DashboardAccessProvider';
import { createClient } from '@/lib/supabase/server';

function isOnboardingComplete(value: unknown) {
  return value === true || value === 'true' || value === 1;
}

async function getInitialPlan(userId: string): Promise<SubscriptionPlan> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data } = await supabase
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
    .eq('user_id', userId)
    .eq('status', 'active')
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return {
      plan_id: 'free',
      display_name: 'Free',
      features: {},
      limits: {},
      status: 'active',
    };
  }

  const plan = data.subscription_plans as {
    display_name?: string;
    features?: Record<string, unknown>;
    limits?: Record<string, number>;
  } | null;

  return {
    plan_id: data.plan_id,
    display_name: plan?.display_name || 'Free',
    features: plan?.features || {},
    limits: plan?.limits || {},
    status: data.status,
  };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?redirected=auth_required');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('onboarding_completed, role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || !isOnboardingComplete(profile.onboarding_completed)) {
    redirect('/onboarding?step=2');
  }

  const initialPlan = await getInitialPlan(user.id);
  const isDirector = profile.role === 'director';

  return (
    <DashboardAccessProvider initialUser={user} initialPlan={initialPlan} isDirector={isDirector}>
      <DashboardShell initialUser={user} isDirector={isDirector}>
        {children}
      </DashboardShell>
    </DashboardAccessProvider>
  );
}
