-- ============================================
-- MIGRATION: Enhance saved_tenders table
-- Date: 2026-01-06
-- Purpose: Add more fields and improve performance
-- Safe to run: Yes (backwards compatible)
-- ============================================

-- Step 1: Add new columns (all nullable to preserve existing data)
ALTER TABLE public.saved_tenders 
  ADD COLUMN IF NOT EXISTS tender_organisation TEXT,
  ADD COLUMN IF NOT EXISTS tender_closing_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tender_published_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tender_opening_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Rename tender_ref to tender_id for consistency (optional)
-- Uncomment if you want to rename:
-- ALTER TABLE public.saved_tenders RENAME COLUMN tender_ref TO tender_id;

-- Step 3: Add unique constraint to prevent duplicate saves
-- This uses tender_ref (or tender_id if you renamed it)
DO $$ 
BEGIN
  -- Remove any duplicates first (keep the oldest save)
  DELETE FROM public.saved_tenders a
  USING public.saved_tenders b
  WHERE a.id > b.id 
    AND a.user_id = b.user_id 
    AND a.tender_ref = b.tender_ref;

  -- Add unique constraint
  ALTER TABLE public.saved_tenders 
    ADD CONSTRAINT saved_tenders_user_tender_unique 
    UNIQUE (user_id, tender_ref);
EXCEPTION
  WHEN duplicate_table THEN 
    -- Constraint already exists, skip
    NULL;
  WHEN others THEN
    RAISE WARNING 'Could not add unique constraint: %', SQLERRM;
END $$;

-- Step 4: Add performance indexes
CREATE INDEX IF NOT EXISTS saved_tenders_created_at_idx 
  ON public.saved_tenders (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS saved_tenders_closing_date_idx 
  ON public.saved_tenders (user_id, tender_closing_date) 
  WHERE tender_closing_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS saved_tenders_tags_idx 
  ON public.saved_tenders USING GIN (tags);

-- Step 5: Add UPDATE policy (if it doesn't exist)
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "self-saved-update" ON public.saved_tenders;
  
  CREATE POLICY "self-saved-update" 
    ON public.saved_tenders 
    FOR UPDATE 
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN 
    NULL;
END $$;

-- Step 6: Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_saved_tenders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.saved_tenders;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.saved_tenders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_saved_tenders_updated_at();

-- Step 8: Create a view for saved tenders with computed fields
CREATE OR REPLACE VIEW public.saved_tenders_with_stats AS
SELECT 
  st.*,
  -- Calculate days until closing
  CASE 
    WHEN st.tender_closing_date IS NOT NULL THEN
      EXTRACT(DAY FROM (st.tender_closing_date - NOW()))::INT
    ELSE NULL
  END AS days_until_closing,
  -- Check if closing soon (within 7 days)
  CASE 
    WHEN st.tender_closing_date IS NOT NULL THEN
      st.tender_closing_date <= (NOW() + INTERVAL '7 days')
    ELSE FALSE
  END AS closing_soon,
  -- Check if already closed
  CASE 
    WHEN st.tender_closing_date IS NOT NULL THEN
      st.tender_closing_date < NOW()
    ELSE FALSE
  END AS is_closed
FROM public.saved_tenders st;

-- Grant access to the view
GRANT SELECT ON public.saved_tenders_with_stats TO authenticated;

-- Step 9: Create function to get saved tender count by user
CREATE OR REPLACE FUNCTION public.get_saved_tenders_count(user_uuid UUID)
RETURNS INT AS $$
  SELECT COUNT(*)::INT 
  FROM public.saved_tenders 
  WHERE user_id = user_uuid;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Step 10: Create function to check if tender is saved
CREATE OR REPLACE FUNCTION public.is_tender_saved(
  user_uuid UUID, 
  tender_reference TEXT
)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 
    FROM public.saved_tenders 
    WHERE user_id = user_uuid 
      AND tender_ref = tender_reference
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ============================================
-- Migration complete!
-- ============================================

-- Verify the migration
DO $$ 
DECLARE
  column_count INT;
  index_count INT;
  policy_count INT;
BEGIN
  -- Count new columns
  SELECT COUNT(*) INTO column_count
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'saved_tenders'
    AND column_name IN (
      'tender_organisation', 
      'tender_closing_date', 
      'notes', 
      'tags',
      'updated_at'
    );
  
  -- Count indexes
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE schemaname = 'public'
    AND tablename = 'saved_tenders';
  
  -- Count RLS policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename = 'saved_tenders';
  
  RAISE NOTICE '✅ Migration complete!';
  RAISE NOTICE '   - New columns: %', column_count;
  RAISE NOTICE '   - Total indexes: %', index_count;
  RAISE NOTICE '   - RLS policies: %', policy_count;
END $$;

