import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkDirectorAccess } from '@/lib/admin-access-control';
import { z } from 'zod';

const ChangePlanSchema = z.object({
  user_id: z.string().uuid(),
  plan_id: z.enum(['free', 'basic', 'pro', 'enterprise']),
  reason: z.string().optional()
});

/**
 * POST /api/admin/change-plan
 * Director Power: Change any user's plan
 */
export async function POST(req: NextRequest) {
  try {
    // Check director access
    const accessCheck = await checkDirectorAccess();
    
    if (!accessCheck.isDirector) {
      return NextResponse.json(
        { error: 'Unauthorized - Director access required' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const validation = ChangePlanSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    const { user_id, plan_id, reason } = validation.data;
    
    const supabase = await createClient();
    
    // Call director function to change plan
    const { data, error } = await supabase.rpc('director_change_user_plan', {
      p_target_user_id: user_id,
      p_new_plan_id: plan_id,
      p_reason: reason || null
    });
    
    if (error) {
      console.error('Error changing plan:', error);
      return NextResponse.json(
        { error: 'Failed to change plan' },
        { status: 500 }
      );
    }
    
    if (data && !data.success) {
      return NextResponse.json(
        { error: data.error || 'Failed to change plan' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Plan changed successfully'
    });
    
  } catch (error) {
    console.error('Exception in change plan API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
