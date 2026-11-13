import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { safeRedirectPath } from '@/lib/safe-redirect';

/**
 * Signs the user out and redirects with a 302. It's a redirect, not JSON,
 * because Safari ignores Set-Cookie on fetch() responses but always applies it
 * on navigations. The client triggers it via form.submit() (see lib/auth/sign-out).
 */
export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;

  // CSRF: only accept sign-out submitted from our own pages.
  const requestOrigin = request.headers.get('origin');
  if (requestOrigin && requestOrigin !== origin) {
    return NextResponse.json({ error: 'Cross-origin request rejected' }, { status: 403 });
  }

  const redirectTo = safeRedirectPath(request.nextUrl.searchParams.get('redirect'), '/');
  const response = NextResponse.redirect(new URL(redirectTo, origin), { status: 302 });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch (err) {
    console.error('[auth] signOut error', err);
  }

  // Safety net: expire every Supabase auth cookie even if signOut failed.
  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.startsWith('sb-')) {
      response.cookies.set(cookie.name, '', { path: '/', maxAge: 0, expires: new Date(0) });
    }
  });

  return response;
}
