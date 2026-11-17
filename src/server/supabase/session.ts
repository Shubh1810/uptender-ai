import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Page routes that require a signed-in user. API routes enforce auth themselves. */
const PROTECTED_PAGE_PREFIXES = ['/dashboard', '/make-payment'];

function isProtectedPage(pathname: string) {
  return PROTECTED_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only touch auth on protected pages. Calling getUser() on public routes
  // (like "/" right after sign-out) would refresh the token from a lingering
  // refresh cookie and silently sign the user back in.
  if (!isProtectedPage(pathname)) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // getClaims() refreshes an expired session (writing new cookies via setAll)
  // and verifies the JWT locally when the project uses asymmetric signing
  // keys; otherwise it falls back to a getUser() round-trip. This is only a
  // redirect gate: pages re-verify with getUser() via server/auth.ts.
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    redirectUrl.search = '';
    redirectUrl.searchParams.set('redirected', 'auth_required');
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
