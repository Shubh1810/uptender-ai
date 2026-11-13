-- ============================================
-- MIGRATION: Add Role-Based Access Control (RBAC)
-- Date: 2026-01-12
-- Purpose: Add user roles (user, admin, director) separate from subscription plans
-- ============================================

-- ============================================
-- PART 1: ADD ROLE COLUMN TO PROFILES
-- ============================================

-- Add role column to profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN role TEXT CHECK (role IN ('user', 'admin', 'director')) DEFAULT 'user';
  END IF;
END $$;

-- Create index on role for fast lookups
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- ============================================
-- PART 2: SET YOUR ACCOUNT AS DIRECTOR
-- ============================================

-- Update the director's email here (replace with your actual email)
-- This should be run ONCE to set up the initial director account

-- IMPORTANT: Replace 'your-email@example.com' with your actual email
DO $$ 
DECLARE
  director_email TEXT := 'your-email@example.com'; -- ⚠️ CHANGE THIS TO YOUR EMAIL
  director_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO director_user_id
  FROM auth.users
  WHERE email = director_email
  LIMIT 1;
  
  IF director_user_id IS NOT NULL THEN
    -- Set role to director
    UPDATE public.profiles
    SET role = 'director'
    WHERE id = director_user_id;
    
    RAISE NOTICE '✅ Director role assigned to: %', director_email;
  ELSE
    RAISE WARNING '⚠️  User not found with email: %. Please update the script with the correct email.', director_email;
  END IF;
END $$;

-- ============================================
-- PART 3: CREATE ADMIN AUDIT LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'change_plan', 'view_user_data', 'grant_entitlement', etc.
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}'::JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS admin_audit_log_admin_user_idx ON public.admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_target_user_idx ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx ON public.admin_audit_log(created_at DESC);

-- RLS: Only directors can read audit logs
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "directors-can-read-audit-log" 
  ON public.admin_audit_log 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'director'
    )
  );

-- ============================================
-- PART 4: HELPER FUNCTIONS FOR ROLE CHECKS
-- ============================================

-- Check if user is director
CREATE OR REPLACE FUNCTION public.is_director(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id
    AND role = 'director'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Check if user is admin or director
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = p_user_id
    AND role IN ('admin', 'director')
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = p_user_id;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- PART 5: DIRECTOR POWERS - CHANGE USER PLAN
-- ============================================

CREATE OR REPLACE FUNCTION public.director_change_user_plan(
  p_target_user_id UUID,
  p_new_plan_id TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_admin_user_id UUID;
  v_is_director BOOLEAN;
BEGIN
  -- Get current user
  v_admin_user_id := auth.uid();
  
  IF v_admin_user_id IS NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Not authenticated');
  END IF;
  
  -- Check if current user is director
  v_is_director := public.is_director(v_admin_user_id);
  
  IF NOT v_is_director THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Unauthorized - Director access required');
  END IF;
  
  -- Verify plan exists
  IF NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE id = p_new_plan_id) THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Invalid plan ID');
  END IF;
  
  -- Update user's subscription
  UPDATE public.user_subscriptions
  SET 
    plan_id = p_new_plan_id,
    updated_at = NOW()
  WHERE user_id = p_target_user_id
  AND status = 'active';
  
  -- Log the action
  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, details)
  VALUES (
    v_admin_user_id,
    'change_plan',
    p_target_user_id,
    jsonb_build_object(
      'new_plan_id', p_new_plan_id,
      'reason', p_reason
    )
  );
  
  RETURN jsonb_build_object(
    'success', TRUE,
    'message', 'Plan updated successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 6: DIRECTOR POWERS - VIEW ALL USERS
-- ============================================

CREATE OR REPLACE FUNCTION public.director_get_all_users(
  p_limit INT DEFAULT 100,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  plan_id TEXT,
  plan_name TEXT,
  subscription_status TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Check if current user is director
  IF NOT public.is_director(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized - Director access required';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id AS user_id,
    u.email,
    p.full_name,
    p.role,
    us.plan_id,
    sp.display_name AS plan_name,
    us.status AS subscription_status,
    u.created_at,
    u.last_sign_in_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  LEFT JOIN public.user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
  LEFT JOIN public.subscription_plans sp ON us.plan_id = sp.id
  ORDER BY u.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 7: DIRECTOR POWERS - VIEW USER USAGE
-- ============================================

CREATE OR REPLACE FUNCTION public.director_get_user_usage(
  p_target_user_id UUID
)
RETURNS TABLE (
  usage_key TEXT,
  current_count INT,
  limit_value INT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  percentage INT
) AS $$
BEGIN
  -- Check if current user is director
  IF NOT public.is_director(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized - Director access required';
  END IF;
  
  RETURN QUERY
  SELECT 
    ut.usage_key,
    ut.count AS current_count,
    COALESCE((sp.limits->>ut.usage_key)::INT, 0) AS limit_value,
    ut.period_start,
    ut.period_end,
    CASE 
      WHEN COALESCE((sp.limits->>ut.usage_key)::INT, 0) = -1 THEN 0
      WHEN COALESCE((sp.limits->>ut.usage_key)::INT, 0) = 0 THEN 100
      ELSE (ut.count::FLOAT / COALESCE((sp.limits->>ut.usage_key)::INT, 1) * 100)::INT
    END AS percentage
  FROM public.usage_tracking ut
  LEFT JOIN public.user_subscriptions us ON ut.user_id = us.user_id AND us.status = 'active'
  LEFT JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE ut.user_id = p_target_user_id
  ORDER BY ut.usage_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 8: DIRECTOR POWERS - RESET USER USAGE
-- ============================================

CREATE OR REPLACE FUNCTION public.director_reset_user_usage(
  p_target_user_id UUID,
  p_usage_key TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_admin_user_id UUID;
BEGIN
  v_admin_user_id := auth.uid();
  
  -- Check if current user is director
  IF NOT public.is_director(v_admin_user_id) THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'Unauthorized - Director access required');
  END IF;
  
  -- Reset usage
  UPDATE public.usage_tracking
  SET count = 0, updated_at = NOW()
  WHERE user_id = p_target_user_id
  AND usage_key = p_usage_key;
  
  -- Log the action
  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, details)
  VALUES (
    v_admin_user_id,
    'reset_usage',
    p_target_user_id,
    jsonb_build_object(
      'usage_key', p_usage_key,
      'reason', p_reason
    )
  );
  
  RETURN jsonb_build_object('success', TRUE, 'message', 'Usage reset successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION
-- ============================================

DO $$ 
DECLARE
  director_count INT;
  role_column_exists BOOLEAN;
BEGIN
  -- Check if role column was added
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) INTO role_column_exists;
  
  -- Count directors
  SELECT COUNT(*) INTO director_count
  FROM public.profiles
  WHERE role = 'director';
  
  RAISE NOTICE '✅ RBAC MIGRATION COMPLETE!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '📊 Summary:';
  RAISE NOTICE '   - Role column added: %', role_column_exists;
  RAISE NOTICE '   - Directors configured: %', director_count;
  RAISE NOTICE '   - Admin audit log table: Created';
  RAISE NOTICE '   - Role check functions: Created';
  RAISE NOTICE '   - Director power functions: Created';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  IMPORTANT: Update the director_email in this script';
  RAISE NOTICE '    with your actual email address and re-run to set';
  RAISE NOTICE '    yourself as director.';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next Steps:';
  RAISE NOTICE '   1. Update director_email in line 28 of this script';
  RAISE NOTICE '   2. Re-run the script to assign director role';
  RAISE NOTICE '   3. Create admin dashboard UI';
  RAISE NOTICE '   4. Implement admin API routes';
  RAISE NOTICE '==========================================';
END $$;

-- ============================================
-- MIGRATION COMPLETE ✅
-- ============================================
