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

  // Refresh the auth token and handle errors gracefully
  const { data: { user }, error } = await supabase.auth.getUser();

  // Define protected routes that require authentication
  // Note: /onboarding is NOT protected - it's the entry point for new users to sign up
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/api/saved-tenders') ||
    request.nextUrl.pathname.startsWith('/api/alert-preferences') ||
    request.nextUrl.pathname.startsWith('/api/admin');

  // If there's an auth error OR no user on protected routes, redirect to home
  if (isProtectedRoute && (error || !user)) {
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

  return supabaseResponse;
}

