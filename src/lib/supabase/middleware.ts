import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Define protected routes that require authentication
  // Note: /onboarding is NOT protected - it's the entry point for new users to sign up
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/api/saved-tenders') ||
    request.nextUrl.pathname.startsWith('/api/alert-preferences') ||
    request.nextUrl.pathname.startsWith('/api/admin');

  // IMPORTANT: Only call getUser() on protected routes.
  // Calling getUser() on public routes (like "/" after sign-out) would trigger
  // a token refresh via the refresh_token cookie, re-creating the session and
  // setting new auth cookies — effectively re-logging-in the user we just
  // signed out.
  if (isProtectedRoute) {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      if (error) {
        console.warn('Auth middleware error:', error.message, 'on', request.nextUrl.pathname);
      } else {
        console.warn('No authenticated user accessing protected route:', request.nextUrl.pathname);
      }

      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      redirectUrl.searchParams.set('redirected', 'auth_required');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

