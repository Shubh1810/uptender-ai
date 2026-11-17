import 'server-only';
import { cache } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/server/supabase/server';
import { forbidden, unauthorized } from '@/server/http';

export type UserRole = 'user' | 'admin' | 'director';

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export interface AuthContext {
  supabase: SupabaseServerClient;
  user: User;
}

/**
 * The signed-in user, verified with Supabase Auth (`getUser()`), or null.
 *
 * Wrapped in React `cache()`: during one server render the dashboard layout,
 * pages and helpers can all call it and only one Auth request is made.
 * (Outside a render, e.g. in route handlers, each call runs normally.)
 */
export const getAuth = cache(async (): Promise<AuthContext | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { supabase, user };
});

/** For API routes: the signed-in user, or throws a 401 `ApiError`. */
export async function requireUser(): Promise<AuthContext> {
  const auth = await getAuth();
  if (!auth) throw unauthorized();
  return auth;
}

/** The user's role. Cached per render: pass the context returned by `getAuth()`. */
export const getUserRole = cache(async (ctx: AuthContext): Promise<UserRole> => {
  const { data, error } = await ctx.supabase.rpc('get_user_role', { p_user_id: ctx.user.id });
  if (error || typeof data !== 'string') return 'user';
  return (['user', 'admin', 'director'] as const).includes(data as UserRole) ? (data as UserRole) : 'user';
});

/** For admin API routes: a director, or throws 401/403. */
export async function requireDirector(): Promise<AuthContext> {
  const ctx = await requireUser();
  if ((await getUserRole(ctx)) !== 'director') throw forbidden('Director access required');
  return ctx;
}
