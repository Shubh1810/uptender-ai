import { NextResponse } from 'next/server';
import { requireDirector } from '@/server/auth';
import { ApiError, apiHandler } from '@/server/http';

function intParam(value: string | null, fallback: number, min: number, max: number) {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

/** GET /api/admin/users: director-only user listing. */
export const GET = apiHandler('admin/users', async (request) => {
  const { supabase } = await requireDirector();
  const params = new URL(request.url).searchParams;

  const { data, error } = await supabase.rpc('director_get_all_users', {
    p_limit: intParam(params.get('limit'), 100, 1, 500),
    p_offset: intParam(params.get('offset'), 0, 0, 1_000_000),
  });

  if (error) {
    console.error('[api:admin/users] rpc failed', error);
    throw new ApiError(500, 'DB_ERROR', 'Failed to fetch users');
  }

  return NextResponse.json({ success: true, users: data ?? [], count: data?.length ?? 0 });
});
