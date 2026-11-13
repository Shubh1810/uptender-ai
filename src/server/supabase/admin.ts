import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, requireEnv } from '@/server/env';

let adminClient: SupabaseClient | null = null;

/**
 * Service-role Supabase client. BYPASSES RLS.
 *
 * Only for trusted server-side operations that users must not be able to do
 * themselves (e.g. activating a paid subscription after verifying payment).
 * Never pass user-controlled IDs into it without checking ownership first.
 */
export function createAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;
  adminClient = createClient(env().NEXT_PUBLIC_SUPABASE_URL, requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
