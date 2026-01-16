# Onboarding Schema Migration Guide

## Overview
This guide explains how to migrate your Supabase database to support the updated onboarding flow with new Step 3 fields from "Bid Intelligence Setup".

## What Changed

### New Fields Added to `user_preferences` Table
1. **`roles`** (text[]) - Business roles selected by user
   - Values: Manufacturer, Authorized Dealer/Distributor, Contractor/EPC, Service Provider, Consultant, New Bidder (≤ 2 years)
   - Multiple selections allowed

2. **`user_goal`** (text) - User's primary objective
   - Values: `relevant_tenders`, `ai_bid_drafting`, `both`
   - Optional field

3. **`tender_documentation_comfort`** (text) - User's experience level
   - Values: `experienced`, `guided`, `new`
   - Constrained by CHECK constraint
   - Optional field

### Fields Retained (Not Modified)
- `notify_whatsapp`, `notify_sms` - Still in database for settings page
- `categories`, `regions` - Still in database for post-onboarding configuration
- All notification and alert preferences remain unchanged

## Migration Steps

### Step 1: Run the Migration Script
Execute the migration file in your Supabase SQL Editor:

```bash
# Navigate to project directory
cd /Users/shubh/Desktop/3-Startup/Tenderpost/Tenderpost_web

# Copy the migration script content
cat MIGRATION_UPDATE_ONBOARDING_PREFERENCES.sql
```

Then:
1. Go to your Supabase Dashboard → SQL Editor
2. Paste the contents of `MIGRATION_UPDATE_ONBOARDING_PREFERENCES.sql`
3. Click "Run" to execute the migration

**What this does:**
- Adds 3 new columns to `user_preferences`
- Creates indexes for performance (GIN index on `roles` array, regular indexes on `user_goal` and `tender_documentation_comfort`)
- Adds CHECK constraint on `tender_documentation_comfort`
- Creates/updates trigger for automatic `updated_at` timestamp
- Adds helpful column comments

### Step 2: Verify the Migration
Run these verification queries in Supabase SQL Editor:

```sql
-- Check that new columns exist
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_preferences'
AND column_name IN ('roles', 'user_goal', 'tender_documentation_comfort');

-- Check indexes were created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_preferences'
AND (indexname LIKE '%role%' OR indexname LIKE '%goal%' OR indexname LIKE '%comfort%');

-- View sample data (should show NULL for existing users)
SELECT
  user_id,
  roles,
  user_goal,
  tender_documentation_comfort,
  created_at,
  updated_at
FROM public.user_preferences
LIMIT 5;
```

### Step 3: Deploy Updated API Code
The API endpoint has already been updated in this commit to:
1. Accept the new fields in validation schema
2. Save the new fields to the database

**Files Modified:**
- `src/app/api/onboarding/route.ts` - Updated Zod schema and save logic

**No additional deployment steps needed** - just commit and push the changes.

### Step 4: Test the Onboarding Flow
1. Create a test user account (or use an existing account that hasn't completed onboarding)
2. Go through the onboarding flow at `/onboarding`
3. Complete all 3 steps including the new Step 3 fields
4. Verify data is saved:

```sql
-- Check that new user has all preferences saved
SELECT
  p.full_name,
  p.company,
  up.roles,
  up.user_goal,
  up.tender_documentation_comfort
FROM profiles p
JOIN user_preferences up ON p.id = up.user_id
WHERE p.full_name = 'YOUR_TEST_USER_NAME';
```

## Database Schema Changes Summary

### Before Migration
```sql
CREATE TABLE user_preferences (
  user_id uuid PRIMARY KEY,
  notify_whatsapp boolean DEFAULT false,
  notify_sms boolean DEFAULT false,
  notify_email boolean DEFAULT true,
  notify_inapp boolean DEFAULT true,
  frequency text CHECK (frequency IN ('real_time','daily','weekly')),
  alert_threshold int CHECK (alert_threshold BETWEEN 0 AND 100),
  keywords text[] DEFAULT '{}',
  categories text[] DEFAULT '{}',
  regions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### After Migration
```sql
CREATE TABLE user_preferences (
  user_id uuid PRIMARY KEY,
  notify_whatsapp boolean DEFAULT false,
  notify_sms boolean DEFAULT false,
  notify_email boolean DEFAULT true,
  notify_inapp boolean DEFAULT true,
  frequency text CHECK (frequency IN ('real_time','daily','weekly')),
  alert_threshold int CHECK (alert_threshold BETWEEN 0 AND 100),
  keywords text[] DEFAULT '{}',
  categories text[] DEFAULT '{}',
  regions text[] DEFAULT '{}',
  roles text[] DEFAULT '{}',                    -- NEW
  user_goal text,                                -- NEW
  tender_documentation_comfort text              -- NEW
    CHECK (tender_documentation_comfort IN ('experienced', 'guided', 'new')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Rollback Plan (If Needed)

If you need to rollback this migration:

```sql
-- Remove the new columns
ALTER TABLE public.user_preferences
DROP COLUMN IF EXISTS roles,
DROP COLUMN IF EXISTS user_goal,
DROP COLUMN IF EXISTS tender_documentation_comfort;

-- Remove the indexes
DROP INDEX IF EXISTS user_preferences_user_goal_idx;
DROP INDEX IF EXISTS user_preferences_comfort_idx;
DROP INDEX IF EXISTS user_preferences_roles_idx;

-- Revert API code to previous commit
```

## Impact Assessment

### ✅ Backward Compatible
- Existing users' data remains intact
- New columns are nullable/have defaults
- Old settings page still works with `categories` and `regions`

### ✅ No Breaking Changes
- Frontend already sends the new fields
- API validation already expects them
- Database now stores them properly

### ⚠️ Considerations
- **Existing Users**: Will have `NULL` values for new fields until they update preferences
- **Analytics**: You may want to track completion rates for new Step 3 fields
- **Data Quality**: Consider adding a migration to prompt existing users to complete Step 3

## Post-Migration Tasks

### Optional: Backfill Existing Users
If you want to set defaults for existing users:

```sql
UPDATE public.user_preferences
SET
  roles = '{}',
  user_goal = NULL,
  tender_documentation_comfort = NULL
WHERE roles IS NULL;
```

### Optional: Prompt Existing Users
Consider adding a modal or banner in the dashboard prompting existing users to complete their "Bid Intelligence Setup" to improve tender recommendations.

## Monitoring

After migration, monitor:
1. **Error rates** in `/api/onboarding` endpoint
2. **Onboarding completion rates** - should remain stable or improve
3. **Database query performance** - new indexes should improve queries filtering by roles/goals

## Support

If you encounter any issues:
1. Check Supabase logs for database errors
2. Check browser console for API validation errors
3. Verify migration was applied correctly with verification queries
4. Review the `MIGRATION_UPDATE_ONBOARDING_PREFERENCES.sql` file for details

---

**Migration Created:** 2026-01-16
**Version:** 1.0
**Status:** Ready for Production
