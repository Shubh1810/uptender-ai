import { redirect } from 'next/navigation';
import DashboardShell from '@/components/layout/dashboard/DashboardShell';
import { DashboardAccessProvider } from '@/components/layout/dashboard/DashboardAccessProvider';
import { getAuth, getUserRole } from '@/server/auth';
import { getActivePlan } from '@/features/plans/server/active-plan';
import { isOnboardingComplete } from '@/features/onboarding/status';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const auth = await getAuth();
  if (!auth) redirect('/?redirected=auth_required');

  const { supabase, user } = auth;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile || !isOnboardingComplete(profile.onboarding_completed)) {
    redirect('/onboarding?step=2');
  }

  const [initialPlan, role] = await Promise.all([getActivePlan(supabase, user.id), getUserRole(auth)]);
  const isDirector = role === 'director';

  return (
    <DashboardAccessProvider initialUser={user} initialPlan={initialPlan} isDirector={isDirector}>
      <DashboardShell initialUser={user} isDirector={isDirector}>
        {children}
      </DashboardShell>
    </DashboardAccessProvider>
  );
}
