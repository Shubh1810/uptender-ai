import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      const user = data.session.user; // User is already in the session!
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

      // Simple flow: Check if user exists and if they're onboarded
      let redirectPath = '/onboarding?step=2'; // Default to onboarding
      
      if (!user) {
        console.log('[AUTH CALLBACK] No user in session, redirecting to onboarding');
        redirectPath = '/onboarding?step=2';
      } else {
        try {
          // Query profile to check onboarding status
          const { data: prof, error: profError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', user.id)
            .maybeSingle();
          
          // Log everything for debugging
          console.log('[AUTH CALLBACK]', {
            userId: user.id,
            hasProfile: !!prof,
            error: profError ? {
              message: profError.message,
              code: profError.code,
              details: profError.details,
              hint: profError.hint
            } : null,
            onboardingCompleted: prof?.onboarding_completed,
            onboardingType: typeof prof?.onboarding_completed,
            onboardingRaw: JSON.stringify(prof?.onboarding_completed)
          });
          
          if (profError) {
            console.error('[AUTH CALLBACK] Database error:', profError);
            redirectPath = '/onboarding?step=2';
          } else if (!prof) {
            console.log('[AUTH CALLBACK] Profile not found');
            redirectPath = '/onboarding?step=2';
          } else {
            // Check onboarding status - be very explicit
            const onboardingValue = prof.onboarding_completed;
            const isCompleted = onboardingValue === true || 
                               onboardingValue === 'true' || 
                               onboardingValue === 1 ||
                               onboardingValue === '1';
            
            console.log('[AUTH CALLBACK] Decision:', {
              value: onboardingValue,
              type: typeof onboardingValue,
              isCompleted,
              redirectTo: isCompleted ? '/dashboard' : '/onboarding?step=2'
            });
            
            redirectPath = isCompleted ? '/dashboard' : '/onboarding?step=2';
          }
        } catch (e) {
          console.error('[AUTH CALLBACK] Exception:', e);
          redirectPath = '/onboarding?step=2';
        }
      }

      console.log('[AUTH CALLBACK] Final redirect:', redirectPath);

      // Create response with redirect (to onboarding or dashboard)
      const response = NextResponse.redirect(baseRedirect(redirectPath));
      
      // Ensure cookies are set properly
      return response;
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

