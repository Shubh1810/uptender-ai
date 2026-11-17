import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/server/supabase/server';
import { isOnboardingComplete } from '@/features/onboarding/status';
import { safeRedirectPath } from '@/lib/safe-redirect';

/**
 * OAuth / magic-link landing route. Exchanges the auth code for a session and
 * sends the user on, either to onboarding or to `next`. `next` must be a
 * same-origin path, so this route can't be used as an open redirect.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const next = safeRedirectPath(searchParams.get('next'), '/dashboard');
  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.nextUrl.origin));

  if (!code) return redirectTo('/auth/auth-code-error');

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return redirectTo('/auth/auth-code-error');

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!isOnboardingComplete(profile?.onboarding_completed)) {
    return redirectTo('/onboarding?step=2');
  }
  return redirectTo(next);
}
