import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireDirector } from '@/server/auth';
import { ApiError, apiHandler, assertSameOrigin, parseJson } from '@/server/http';

const schema = z.object({
  user_id: z.uuid(),
  plan_id: z.enum(['free', 'basic', 'pro', 'enterprise']),
  reason: z.string().trim().max(500).optional(),
});

/** POST /api/admin/change-plan: director sets any user's plan (audited in SQL). */
export const POST = apiHandler('admin/change-plan', async (request) => {
  assertSameOrigin(request);
  const { supabase } = await requireDirector();
  const { user_id, plan_id, reason } = await parseJson(request, schema);

  const { data, error } = await supabase.rpc('director_change_user_plan', {
    p_target_user_id: user_id,
    p_new_plan_id: plan_id,
    p_reason: reason ?? null,
  });

  if (error) {
    console.error('[api:admin/change-plan] rpc failed', error);
    throw new ApiError(500, 'DB_ERROR', 'Failed to change plan');
  }
  const result = data as { success?: boolean; error?: string } | null;
  if (result && result.success === false) {
    throw new ApiError(400, 'CHANGE_PLAN_FAILED', result.error || 'Failed to change plan');
  }

  return NextResponse.json({ success: true, message: 'Plan changed successfully' });
});
