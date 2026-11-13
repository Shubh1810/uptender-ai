import 'server-only';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/server/supabase/server';
import { forbidden, unauthorized } from '@/server/http';

export type UserRole = 'user' | 'admin' | 'director';

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export interface AuthContext {
  supabase: SupabaseServerClient;
  user: User;
}

/** Returns the signed-in user (verified with Supabase Auth), or null. */
export async function getAuth(): Promise<AuthContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { supabase, user };
}

/** For API routes: the signed-in user, or throws a 401 `ApiError`. */
export async function requireUser(): Promise<AuthContext> {
  const auth = await getAuth();
  if (!auth) throw unauthorized();
  return auth;
}

export async function getUserRole(ctx: AuthContext): Promise<UserRole> {
  const { data, error } = await ctx.supabase.rpc('get_user_role', { p_user_id: ctx.user.id });
  if (error || typeof data !== 'string') return 'user';
  return (['user', 'admin', 'director'] as const).includes(data as UserRole) ? (data as UserRole) : 'user';
}

/** For admin API routes: a director, or throws 401/403. */
export async function requireDirector(): Promise<AuthContext> {
  const ctx = await requireUser();
  if ((await getUserRole(ctx)) !== 'director') throw forbidden('Director access required');
  return ctx;
}
