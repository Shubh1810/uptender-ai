import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkDirectorAccess } from '@/lib/admin-access-control';
import { z } from 'zod';

const ResetUsageSchema = z.object({
  user_id: z.string().uuid(),
  usage_key: z.string(),
  reason: z.string().optional()
});

/**
 * POST /api/admin/reset-usage
 * Director Power: Reset any user's usage counter
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
    const validation = ResetUsageSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    const { user_id, usage_key, reason } = validation.data;
    
    const supabase = await createClient();
    
    // Call director function to reset usage
    const { data, error } = await supabase.rpc('director_reset_user_usage', {
      p_target_user_id: user_id,
      p_usage_key: usage_key,
      p_reason: reason || null
    });
    
    if (error) {
      console.error('Error resetting usage:', error);
      return NextResponse.json(
        { error: 'Failed to reset usage' },
        { status: 500 }
      );
    }
    
    if (data && !data.success) {
      return NextResponse.json(
        { error: data.error || 'Failed to reset usage' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Usage reset successfully'
    });
    
  } catch (error) {
    console.error('Exception in reset usage API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
