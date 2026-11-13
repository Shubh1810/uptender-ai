import { type NextRequest } from 'next/server';
import { updateSession } from '@/server/supabase/session';

/**
 * Next.js 16 request proxy (formerly `middleware`).
 * Refreshes the Supabase session and redirects signed-out users away from
 * protected pages. API routes authenticate themselves and return JSON 401s.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Everything except static assets and image optimisation.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
