import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkDirectorAccess } from '@/lib/admin-access-control';

/**
 * GET /api/admin/users
 * Director Power: View all users
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
    
    const supabase = await createClient();
    
    // Get query params
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Call director function to get all users
    const { data, error } = await supabase.rpc('director_get_all_users', {
      p_limit: limit,
      p_offset: offset
    });
    
    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      users: data,
      count: data?.length || 0
    });
    
  } catch (error) {
    console.error('Exception in admin users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
