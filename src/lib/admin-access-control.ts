// Admin/Director Access Control
// Separate from subscription-based feature access
import { createClient } from '@/lib/supabase/server';

export type UserRole = 'user' | 'admin' | 'director';

export interface DirectorCheckResult {
  isDirector: boolean;
  isAdmin: boolean;
  role: UserRole;
  userId?: string;
  error?: string;
}

/**
 * Check if current user is director (owner/sole dev)
 * Directors have meta-powers but still consume usage like normal users
 */
export async function checkDirectorAccess(): Promise<DirectorCheckResult> {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        isDirector: false,
        isAdmin: false,
        role: 'user',
        error: 'Not authenticated'
      };
    }
    
    // Call RPC function to check role
    const { data: isDirectorResult, error: directorError } = await supabase.rpc('is_director', {
      p_user_id: user.id
    });
    
    if (directorError) {
      console.error('Error checking director status:', directorError);
      return {
        isDirector: false,
        isAdmin: false,
        role: 'user',
        userId: user.id,
        error: 'Failed to verify director status'
      };
    }
    
    // Get full role
    const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', {
      p_user_id: user.id
    });
    
    const role = (roleData || 'user') as UserRole;
    const isAdmin = role === 'admin' || role === 'director';
    
    return {
      isDirector: isDirectorResult === true,
      isAdmin,
      role,
      userId: user.id
    };
  } catch (error) {
    console.error('Exception checking director access:', error);
    return {
      isDirector: false,
      isAdmin: false,
      role: 'user',
      error: 'Exception occurred'
    };
  }
}

/**
 * Check if current user is admin or director
 */
export async function checkAdminAccess(): Promise<DirectorCheckResult> {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        isDirector: false,
        isAdmin: false,
        role: 'user',
        error: 'Not authenticated'
      };
    }
    
    const { data: isAdminResult, error } = await supabase.rpc('is_admin', {
      p_user_id: user.id
    });
    
    if (error) {
      return {
        isDirector: false,
        isAdmin: false,
        role: 'user',
        userId: user.id,
        error: 'Failed to verify admin status'
      };
    }
    
    const { data: roleData } = await supabase.rpc('get_user_role', {
      p_user_id: user.id
    });
    
    const role = (roleData || 'user') as UserRole;
    
    return {
      isDirector: role === 'director',
      isAdmin: isAdminResult === true,
      role,
      userId: user.id
    };
  } catch (error) {
    console.error('Exception checking admin access:', error);
    return {
      isDirector: false,
      isAdmin: false,
      role: 'user',
      error: 'Exception occurred'
    };
  }
}

/**
 * Get user's role
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase.rpc('get_user_role', {
      p_user_id: userId
    });
    
    if (error || !data) {
      return 'user';
    }
    
    return data as UserRole;
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
}

/**
 * Log admin action to audit trail
 */
export async function logAdminAction(
  action: string,
  targetUserId?: string,
  details?: Record<string, any>
) {
  const supabase = await createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;
    
    await supabase.from('admin_audit_log').insert({
      admin_user_id: user.id,
      action,
      target_user_id: targetUserId,
      details: details || {}
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
}
