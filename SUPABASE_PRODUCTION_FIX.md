# 🔧 Supabase Production Configuration Fix

## Problem
Onboarded users are being redirected to step 2 instead of dashboard in production. Also need to configure Supabase for both production and localhost.

## ✅ Solution

### Important: Supabase Site URL vs Redirect URLs

**Supabase allows:**
- ✅ **ONE Site URL** (this should be your production domain)
- ✅ **Multiple Redirect URLs** (you can add as many as needed)

**You CANNOT set 2 Site URLs**, but you CAN add multiple Redirect URLs to support both production and localhost.

---

## 📋 Step 1: Configure Supabase Dashboard

### Go to Supabase Dashboard:
1. Navigate to: **Authentication** → **URL Configuration**

### Set Site URL:
- **Site URL:** `https://your-production-domain.com` (e.g., `https://tenderpost.org`)
  - This MUST be your production domain
  - Use `https://` (NOT `http://`)
  - No trailing slash

### Add Redirect URLs:
Click "Add URL" and add ALL of these:

```
https://your-production-domain.com/auth/callback
https://your-production-domain.com/dashboard
https://your-production-domain.com/**
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
http://localhost:3000/**
```

**Important Notes:**
- Use `https://` for production URLs
- Use `http://` for localhost (NOT `https://`)
- Include wildcards `/**` to allow all routes under that domain
- Click "Save" after adding each URL

---

## 🔍 Step 2: Verify Database Values

The issue might also be with how `onboarding_completed` is stored. Check your database:

### Option A: Check via Supabase Dashboard
1. Go to **Table Editor** → **profiles**
2. Find a user who completed onboarding
3. Check the `onboarding_completed` column
4. It should be `true` (boolean) or `t` (if displayed as text)

### Option B: Run SQL Query
```sql
SELECT id, full_name, onboarding_completed 
FROM public.profiles 
WHERE onboarding_completed = true;
```

If you see `onboarding_completed` as `false`, `f`, `null`, or `0`, that's the issue.

---

## 🛠️ Step 3: Fix Existing Users (If Needed)

If some users have incorrect values, update them:

```sql
-- Update users who have completed onboarding
UPDATE public.profiles 
SET onboarding_completed = true 
WHERE company IS NOT NULL 
  AND primary_industry IS NOT NULL 
  AND onboarding_completed = false;
```

Or manually update specific users:
```sql
UPDATE public.profiles 
SET onboarding_completed = true 
WHERE id = 'user-uuid-here';
```

---

## ✅ Step 4: Code Fixes Applied

I've updated the code to handle multiple data types:

### Fixed Files:
1. **`src/app/onboarding/OnboardingClient.tsx`**
   - Now checks for `true`, `'true'`, or `1`
   - More robust comparison

2. **`src/app/auth/callback/route.ts`**
   - Same improved check for onboarding status
   - Handles boolean, string, and number formats

---

## 🧪 Step 5: Test the Fix

### Production Testing:
1. **Sign in** with Google on production
2. **Complete onboarding** (all 3 steps)
3. **Sign out** and **sign in again**
4. **Verify** you're redirected to `/dashboard` (NOT `/onboarding?step=2`)

### Localhost Testing:
1. **Sign in** with Google on localhost
2. **Verify** redirect works correctly
3. **Complete onboarding**
4. **Sign out and sign in again**
5. **Verify** you go to dashboard

---

## 🐛 Debugging Tips

If users still get redirected to step 2:

### Check 1: Database Value
```sql
SELECT onboarding_completed, company, primary_industry 
FROM public.profiles 
WHERE id = 'user-id-here';
```

### Check 2: Browser Console
Open DevTools Console and look for:
- Any errors when checking profile
- The value of `onboarding_completed` in the response

### Check 3: Network Tab
1. Go to Network tab in DevTools
2. Find the request to `/api/onboarding`
3. Check the response - should have `onboarding_completed: true`

### Check 4: Server Logs
Check your production logs for:
- Errors from Supabase queries
- The actual values being checked

---

## 📝 Final Configuration Checklist

- [ ] **Site URL** set to production domain (`https://your-domain.com`)
- [ ] **Redirect URLs** include both production and localhost
- [ ] **Wildcards** (`/**`) added for both domains
- [ ] **Saved** changes in Supabase Dashboard
- [ ] **Code updated** (already done)
- [ ] **Database checked** - `onboarding_completed` values are correct
- [ ] **Tested** on production - onboarded users go to dashboard
- [ ] **Tested** on localhost - works correctly

---

## 🎯 Summary

**For Supabase:**
- You can only have **ONE Site URL** (production)
- You can have **MULTIPLE Redirect URLs** (production + localhost)
- Use wildcards `/**` to allow all routes

**For the Bug:**
- Fixed code to handle boolean/string/number comparisons
- Check database values match expected format
- Update any incorrect values if needed

---

**Last Updated:** Current Date
**Status:** ✅ Fixed - Code updated, configuration guide provided

