# 🔧 Fix: Profile Auto-Creation Trigger

## Problem
Users are signing up via Google Auth and appearing in `auth.users`, but profiles aren't being created in the `profiles` table.

## Root Causes
1. **Existing Users**: Users who signed up BEFORE the trigger was created don't have profiles
2. **Trigger Issues**: The trigger might not be extracting the name correctly from Google metadata
3. **Silent Failures**: The trigger might be failing but not reporting errors

---

## ✅ Solution: Run This SQL in Supabase

### Step 1: Fix the Trigger Function

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open the file: `SUPABASE_TRIGGER_FIX.sql`
3. Copy and paste **the entire file** into SQL Editor
4. Click **Run** (you may see the warning about destructive operation - click "Run this query")

This will:
- ✅ Improve the trigger function to better extract names from Google Sign-In
- ✅ Add error handling so failures don't break user creation
- ✅ Recreate the trigger properly
- ✅ **Backfill existing users** - Create profiles/preferences for users who signed up before the trigger existed

---

## Step 2: Verify It's Working

After running the fix SQL, run this verification query in SQL Editor:

```sql
select 
  'Users Summary' as check_type,
  (select count(*) from auth.users) as total_auth_users,
  (select count(*) from public.profiles) as total_profiles,
  (select count(*) from public.user_preferences) as total_preferences,
  (select count(*) from auth.users u 
   left join public.profiles p on u.id = p.id 
   where p.id is null) as users_missing_profiles,
  (select count(*) from auth.users u 
   left join public.user_preferences up on u.id = up.user_id 
   where up.user_id is null) as users_missing_preferences;
```

**Expected Result:**
- `users_missing_profiles` should be `0`
- `users_missing_preferences` should be `0`
- `total_profiles` should equal `total_auth_users`
- `total_preferences` should equal `total_auth_users`

---

## Step 3: Test with a New Sign-In

1. Sign out of your app
2. Sign in with Google again (as a test)
3. Check in **Table Editor** → `profiles` table
4. You should see a new row with:
   - `id` = your user UUID
   - `full_name` = your name from Google (if available)
   - `onboarding_completed` = `false`

---

## What the Fix Does

### Improved Trigger Function
- **Better name extraction**: Tries `full_name`, `name`, and `display_name` from Google metadata
- **Error handling**: Won't break user creation if profile creation fails
- **Silent conflicts**: Uses `ON CONFLICT DO NOTHING` to prevent errors

### Backfill Existing Users
- Creates `profiles` rows for all existing `auth.users` who don't have profiles
- Creates `user_preferences` rows for all existing `auth.users` who don't have preferences
- Safe to run multiple times (uses `ON CONFLICT DO NOTHING`)

---

## Troubleshooting

### Still Not Working?

1. **Check if trigger exists:**
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
   ```

2. **Check trigger function:**
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

3. **Test trigger manually** (replace `'your-user-id-here'` with an actual UUID):
   ```sql
   -- This simulates what the trigger should do
   INSERT INTO public.profiles (id, full_name, onboarding_completed)
   VALUES ('your-user-id-here', 'Test User', false)
   ON CONFLICT (id) DO NOTHING;
   ```

4. **Check Supabase Logs:**
   - Go to **Logs** → **Postgres Logs** in Supabase Dashboard
   - Look for any errors related to `handle_new_user`

---

## After Fix: Expected Behavior

### For New Users:
1. User signs in with Google → `auth.users` row created
2. Trigger fires automatically → `profiles` row created with `onboarding_completed = false`
3. Trigger fires automatically → `user_preferences` row created with defaults
4. User redirected to `/onboarding?step=2`
5. User completes onboarding → `onboarding_completed` set to `true`

### For Existing Users:
- After running the backfill SQL, all existing users will have:
  - ✅ A row in `profiles` table
  - ✅ A row in `user_preferences` table
  - ✅ They can now complete onboarding normally

---

## Quick Reference

**Where to see user data:**
- Authentication info: **Dashboard** → **Authentication** → **Users**
- Profile data: **Table Editor** → `profiles`
- Preferences: **Table Editor** → `user_preferences`

**Verify trigger is active:**
- The trigger runs automatically on every new user signup
- You can test by signing in with a new Google account
- Check `profiles` table immediately after sign-in

