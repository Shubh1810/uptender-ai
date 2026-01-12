import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .maybeSingle();
        
        const isOnboardingCompleted = profile?.onboarding_completed === true || 
                                      profile?.onboarding_completed === 'true' || 
                                      profile?.onboarding_completed === 1;
        
        // Redirect unonboarded users to onboarding step 2
        if (!isOnboardingCompleted) {
          const forwardedHost = request.headers.get('x-forwarded-host');
          const isLocalEnv = process.env.NODE_ENV === 'development';
          const onboardingUrl = '/onboarding?step=2';
          
          if (isLocalEnv) {
            return NextResponse.redirect(`http://localhost:3000${onboardingUrl}`);
          } else if (forwardedHost) {
            return NextResponse.redirect(`https://${forwardedHost}${onboardingUrl}`);
          } else {
            return NextResponse.redirect(`${new URL(request.url).origin}${onboardingUrl}`);
          }
        }
      }
      
      // User has completed onboarding, redirect to dashboard or next URL
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        return NextResponse.redirect(`http://localhost:3000${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${new URL(request.url).origin}${next}`);
      }
    }
  }

  // Return the user to an error page with instructions if auth failed
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
}

