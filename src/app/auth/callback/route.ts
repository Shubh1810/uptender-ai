import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      const forwardedHost = request.headers.get('x-forwarded-host');

      const isLocalEnv = process.env.NODE_ENV === 'development';
      const isLocalHostHeader = request.headers.get('host')?.includes('localhost');
      
      // Build base redirect URL; we'll decide onboarding vs dashboard shortly
      const baseRedirect = (path: string) => {
        if (isLocalEnv) return `${origin}${path}`;
        if (forwardedHost) return `https://${forwardedHost}${path}`;
        return `${origin}${path}`;
      };
      
      // Kick off a background fetch to warm the tender cache so results are ready on dashboard
      // We intentionally do not await this fully to avoid delaying the redirect.
      (async () => {
        try {
          const API_PAGE_LIMIT = 200; // keep in sync with dashboard
          const isDevelopment = isLocalEnv || isLocalHostHeader;
          const apiBaseUrl = isDevelopment 
            ? 'http://localhost:8080'
            : 'https://tenderpost-api.onrender.com';

          const params = new URLSearchParams({ page: '1', limit: `${API_PAGE_LIMIT}` });
          const res = await fetch(`${apiBaseUrl}/api/tenders?${params.toString()}`);
          if (!res.ok) return;
          const data = await res.json();
          const tenders = Array.isArray(data?.items) ? data.items : [];
          const totalCount = typeof data?.count === 'number' ? data.count : tenders.length;
          const liveTendersCount = typeof data?.live_tenders === 'number' ? data.live_tenders : 0;

          // Save to global cache endpoint so dashboard can pick it up immediately
          await fetch(`${origin}/api/tenders-cache`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tenders,
              totalCount,
              liveTendersCount,
              source: 'auth-prefetch',
            }),
            // no-cache to ensure edge functions don't cache unintendedly
            cache: 'no-store',
          });

          // Also update the global live tenders stat so signed-out users see the count in header/hero
          if (liveTendersCount > 0) {
            await fetch(`${origin}/api/tender-stats`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                liveTendersCount,
                updatedBy: 'auth-prefetch',
              }),
              cache: 'no-store',
            });
          }
        } catch (e) {
          // best-effort prefetch; ignore errors
          console.error('Auth prefetch failed:', e);
        }
      })();

      // Always check onboarding status first - ignore next query param
      // This ensures users always go through proper flow
      const { data: { user } } = await (await createClient()).auth.getUser();
      let redirectPath = '/dashboard'; // Default fallback
      
      if (user) {
        try {
          const supa = await createClient();
          const { data: prof, error: profError } = await supa
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profError) {
            console.error('Error checking onboarding status:', profError);
            // If we can't check, assume onboarding needed
            redirectPath = '/onboarding?step=2';
          } else if (!prof) {
            // No profile exists, need onboarding
            redirectPath = '/onboarding?step=2';
          } else if (prof.onboarding_completed !== true && prof.onboarding_completed !== 'true') {
            // Onboarding not completed (handle both boolean and string)
            redirectPath = '/onboarding?step=2';
          } else {
            // Onboarding completed, go to dashboard
            redirectPath = '/dashboard';
          }
        } catch (e) {
          console.error('Exception checking onboarding status:', e);
          // On error, assume onboarding needed
          redirectPath = '/onboarding?step=2';
        }
      } else {
        // No user session, redirect to onboarding
        redirectPath = '/onboarding?step=2';
      }

      // Create response with redirect (to onboarding or dashboard)
      const response = NextResponse.redirect(baseRedirect(redirectPath));
      
      // Ensure cookies are set properly
      return response;
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

