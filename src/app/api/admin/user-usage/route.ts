import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDirector } from '@/server/auth';
import { ApiError, apiHandler, badRequest } from '@/server/http';

/** GET /api/admin/user-usage?user_id=<uuid>: director-only usage stats. */
export const GET = apiHandler('admin/user-usage', async (request) => {
  const { supabase } = await requireDirector();

  const userId = z.uuid().safeParse(new URL(request.url).searchParams.get('user_id'));
  if (!userId.success) throw badRequest('Missing or invalid user_id parameter');

  const { data, error } = await supabase.rpc('director_get_user_usage', { p_target_user_id: userId.data });
  if (error) {
    console.error('[api:admin/user-usage] rpc failed', error);
    throw new ApiError(500, 'DB_ERROR', 'Failed to fetch user usage');
  }

  return NextResponse.json({ success: true, usage: data ?? [] });
});
