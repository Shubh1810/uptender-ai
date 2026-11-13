import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDirector } from '@/server/auth';
import { ApiError, apiHandler, assertSameOrigin, parseJson } from '@/server/http';

const schema = z.object({
  user_id: z.uuid(),
  usage_key: z.string().trim().min(1).max(64).regex(/^[a-z0-9_]+$/),
  reason: z.string().trim().max(500).optional(),
});

/** POST /api/admin/reset-usage: director resets a usage counter (audited in SQL). */
export const POST = apiHandler('admin/reset-usage', async (request) => {
  assertSameOrigin(request);
  const { supabase } = await requireDirector();
  const { user_id, usage_key, reason } = await parseJson(request, schema);

  const { data, error } = await supabase.rpc('director_reset_user_usage', {
    p_target_user_id: user_id,
    p_usage_key: usage_key,
    p_reason: reason ?? null,
  });

  if (error) {
    console.error('[api:admin/reset-usage] rpc failed', error);
    throw new ApiError(500, 'DB_ERROR', 'Failed to reset usage');
  }
  const result = data as { success?: boolean; error?: string } | null;
  if (result && result.success === false) {
    throw new ApiError(400, 'RESET_USAGE_FAILED', result.error || 'Failed to reset usage');
  }

  return NextResponse.json({ success: true, message: 'Usage reset successfully' });
});
