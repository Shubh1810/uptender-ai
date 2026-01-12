import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkDirectorAccess } from '@/lib/admin-access-control';

/**
 * GET /api/admin/user-usage?user_id=xxx
 * Director Power: View any user's usage statistics
 */
export async function GET(req: NextRequest) {
  try {
    // Check director access
    const accessCheck = await checkDirectorAccess();
    
    if (!accessCheck.isDirector) {
      return NextResponse.json(
        { error: 'Unauthorized - Director access required' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user_id parameter' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Call director function to get user usage
    const { data, error } = await supabase.rpc('director_get_user_usage', {
      p_target_user_id: userId
    });
    
    if (error) {
      console.error('Error fetching user usage:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user usage' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      usage: data || []
    });
    
  } catch (error) {
    console.error('Exception in user usage API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
