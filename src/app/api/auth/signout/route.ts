import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const redirectTo = request.nextUrl.searchParams.get('redirect') || '/';

  // Return a 302 REDIRECT, not JSON. Safari silently ignores Set-Cookie
  // headers on fetch() responses but always processes them on navigation
  // (302) responses. The client triggers this via form.submit().
  const response = NextResponse.redirect(new URL(redirectTo, origin), {
    status: 302,
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
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch (err) {
    console.error('Supabase signOut error:', err);
  }

  // Safety net: forcibly expire every Supabase auth cookie.
  request.cookies.getAll().forEach((cookie) => {
    if (cookie.name.startsWith('sb-')) {
      response.cookies.set(cookie.name, '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });
    }
  });

  return response;
}
