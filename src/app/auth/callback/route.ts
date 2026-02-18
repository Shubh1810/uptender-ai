import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function buildRedirectUrl(request: Request, path: string): string {
  const forwardedHost = request.headers.get('x-forwarded-host');
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000${path}`;
  }
  if (forwardedHost) {
    return `https://${forwardedHost}${path}`;
  }
  return `${new URL(request.url).origin}${path}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .maybeSingle();

        const isOnboardingCompleted =
          profile?.onboarding_completed === true ||
          profile?.onboarding_completed === 'true' ||
          profile?.onboarding_completed === 1;

        if (!isOnboardingCompleted) {
          return NextResponse.redirect(buildRedirectUrl(request, '/onboarding?step=2'));
        }
      }

      return NextResponse.redirect(buildRedirectUrl(request, next));
    }
  }

  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
}
