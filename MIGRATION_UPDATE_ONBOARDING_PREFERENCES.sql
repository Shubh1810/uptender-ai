-- =====================================================
-- Migration: Update User Preferences for New Onboarding
-- =====================================================
-- Purpose: Add new Step 3 fields from Bid Intelligence Setup
-- Date: 2026-01-16
-- Author: TenderPost Team
-- =====================================================

-- Add new columns to user_preferences table
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS roles text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS user_goal text,
ADD COLUMN IF NOT EXISTS tender_documentation_comfort text
  CHECK (tender_documentation_comfort IN ('experienced', 'guided', 'new'));

-- Add comment documentation for new fields
COMMENT ON COLUMN public.user_preferences.roles IS
  'Business roles: Manufacturer, Authorized Dealer/Distributor, Contractor/EPC, Service Provider, Consultant, New Bidder';

COMMENT ON COLUMN public.user_preferences.user_goal IS
  'User intent: relevant_tenders, ai_bid_drafting, or both';

COMMENT ON COLUMN public.user_preferences.tender_documentation_comfort IS
  'User comfort level with tender documentation: experienced, guided, or new';

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS user_preferences_user_goal_idx
  ON public.user_preferences (user_goal)
  WHERE user_goal IS NOT NULL;

CREATE INDEX IF NOT EXISTS user_preferences_comfort_idx
  ON public.user_preferences (tender_documentation_comfort)
  WHERE tender_documentation_comfort IS NOT NULL;

-- Create GIN index for roles array queries
CREATE INDEX IF NOT EXISTS user_preferences_roles_idx
  ON public.user_preferences USING GIN (roles);

-- =====================================================
-- Update trigger to set updated_at on changes
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_preferences_updated_at_trigger ON public.user_preferences;
CREATE TRIGGER user_preferences_updated_at_trigger
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_preferences_updated_at();

-- =====================================================
-- Optional: Backfill existing users with defaults
-- =====================================================
-- Uncomment the following if you want to set defaults for existing users
-- UPDATE public.user_preferences
-- SET
--   roles = '{}',
--   user_goal = NULL,
--   tender_documentation_comfort = NULL
-- WHERE roles IS NULL;

-- =====================================================
-- Verification Queries
-- =====================================================
-- Run these after migration to verify:

-- 1. Check column additions
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'user_preferences'
-- AND column_name IN ('roles', 'user_goal', 'tender_documentation_comfort');

-- 2. Check indexes
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'user_preferences'
-- AND indexname LIKE '%role%' OR indexname LIKE '%goal%' OR indexname LIKE '%comfort%';

-- 3. Sample data check
-- SELECT user_id, roles, user_goal, tender_documentation_comfort, created_at
-- FROM public.user_preferences
-- LIMIT 5;
