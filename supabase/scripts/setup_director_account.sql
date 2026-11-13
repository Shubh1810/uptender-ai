-- ============================================
-- QUICK SETUP: Set Your Account as Director
-- ============================================
-- This is a simplified version for quick setup
-- Run this AFTER you've run MIGRATION_ADD_ROLES.sql

-- ⚠️ STEP 1: UPDATE YOUR EMAIL HERE
-- Replace 'your-email@example.com' with your actual email
-- ============================================

DO $$ 
DECLARE
  director_email TEXT := 'your-email@example.com'; -- ⚠️ CHANGE THIS TO YOUR EMAIL
  director_user_id UUID;
BEGIN
  -- Find your user ID by email
  SELECT id INTO director_user_id
  FROM auth.users
  WHERE email = director_email
  LIMIT 1;
  
  IF director_user_id IS NULL THEN
    RAISE EXCEPTION '❌ User not found with email: %. Please update the email in this script.', director_email;
  END IF;
  
  -- Set role to director
  UPDATE public.profiles
  SET role = 'director'
  WHERE id = director_user_id;
  
  -- Give yourself Enterprise plan (optional but recommended)
  UPDATE public.user_subscriptions
  SET plan_id = 'enterprise',
      updated_at = NOW()
  WHERE user_id = director_user_id
  AND status = 'active';
  
  RAISE NOTICE '✅ SUCCESS!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '🎉 Your account has been set up:';
  RAISE NOTICE '';
  RAISE NOTICE '   Email: %', director_email;
  RAISE NOTICE '   Role: director';
  RAISE NOTICE '   Plan: enterprise';
  RAISE NOTICE '';
  RAISE NOTICE '📍 Next Steps:';
  RAISE NOTICE '   1. Logout and login again';
  RAISE NOTICE '   2. Visit /dashboard/admin';
  RAISE NOTICE '   3. You should see the Admin Panel link in sidebar';
  RAISE NOTICE '==========================================';
END $$;

-- ============================================
-- VERIFICATION: Check Your Setup
-- ============================================

SELECT 
  u.email,
  p.role,
  us.plan_id,
  sp.display_name AS plan_name
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
LEFT JOIN public.subscription_plans sp ON us.plan_id = sp.id
WHERE p.role = 'director';

-- You should see your account listed here with role='director'
