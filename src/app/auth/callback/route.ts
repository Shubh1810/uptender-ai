import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.session) {
      // Use NEXT_PUBLIC_SITE_URL if set, otherwise fallback to origin logic
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      
      let redirectUrl: string;
      if (siteUrl) {
        // Use environment variable (respects http vs https)
        redirectUrl = `${siteUrl}${next}`;
        console.log('🔗 Callback redirecting to (from SITE_URL):', redirectUrl);
      } else {
        // Fallback to origin-based logic
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';
        
        if (isLocalEnv) {
          redirectUrl = `${origin}${next}`;
        } else if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}${next}`;
        } else {
          redirectUrl = `${origin}${next}`;
        }
        console.log('🔗 Callback redirecting to (from origin):', redirectUrl);
      }
      
      // Create response with redirect
      const response = NextResponse.redirect(redirectUrl);
      
      // Ensure cookies are set properly
      return response;
    }
  }

  // return the user to an error page with instructions
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;
  return NextResponse.redirect(`${siteUrl}/auth/auth-code-error`);
}

