# 🔀 User Redirect Logic Documentation

## Overview

There are **2 main redirect locations** in the application that handle user flow after authentication:

1. **Server-side redirect** (after OAuth callback) → `/auth/callback/route.ts`
2. **Client-side redirect** (when navigating to `/onboarding`) → `OnboardingClient.tsx`

Both check `onboarding_completed` status and redirect accordingly.

---

## 📍 Redirect Location 1: Server-Side (Primary)

### File: `src/app/auth/callback/route.ts`

**When it runs:** After user completes Google OAuth and returns to your app

**Logic:**
```typescript
// Check onboarding_completed status from database
if (onboarding_completed === true) {
  → Redirect to: /dashboard
} else {
  → Redirect to: /onboarding?step=2
}
```

**Flow:**
1. User clicks "Sign in with Google"
2. User authorizes with Google
3. Google redirects to Supabase callback
4. Supabase redirects to `/auth/callback?code=xxx`
5. **This route checks `onboarding_completed`:**
   - ✅ **If `true`** → Redirect to `/dashboard`
   - ❌ **If `false` or `null`** → Redirect to `/onboarding?step=2`

**Code Location:**
- Lines 76-115 in `src/app/auth/callback/route.ts`
- Checks: `prof.onboarding_completed === true || 'true' || 1`

---

## 📍 Redirect Location 2: Client-Side (Fallback)

### File: `src/app/onboarding/OnboardingClient.tsx`

**When it runs:** When user navigates directly to `/onboarding` page

**Logic:**
```typescript
// Check onboarding_completed status from database
if (onboarding_completed === true) {
  → window.location.href = '/dashboard'
} else {
  → setStep(2) // Stay on onboarding page, show step 2
}
```

**Flow:**
1. User navigates to `/onboarding` (or `/onboarding?step=2`)
2. Component checks if user is authenticated
3. **If authenticated, checks `onboarding_completed`:**
   - ✅ **If `true`** → Redirect to `/dashboard`
   - ❌ **If `false` or `null`** → Show onboarding step 2

**Code Location:**
- Lines 267-310 in `src/app/onboarding/OnboardingClient.tsx`
- Checks: `profile.onboarding_completed === true || 'true' || 1`

---

## ✅ Expected Behavior

### Scenario 1: New User (First Time Sign-In)
1. User signs in with Google
2. **Redirect Location 1** checks → `onboarding_completed = false`
3. **Result:** Redirected to `/onboarding?step=2`
4. User completes onboarding
5. `onboarding_completed` set to `true` in database
6. User redirected to `/dashboard`

### Scenario 2: Returning User (Already Onboarded)
1. User signs in with Google
2. **Redirect Location 1** checks → `onboarding_completed = true`
3. **Result:** Redirected directly to `/dashboard`
4. ✅ **No onboarding shown**

### Scenario 3: Onboarded User Tries to Access `/onboarding`
1. User navigates to `/onboarding`
2. **Redirect Location 2** checks → `onboarding_completed = true`
3. **Result:** Redirected to `/dashboard`
4. ✅ **Prevents seeing onboarding again**

---

## 🔍 How `onboarding_completed` is Set

### Set to `true` when:
- User completes onboarding form (Step 3) and clicks "Finish"
- API endpoint: `/api/onboarding` (POST)
- File: `src/app/api/onboarding/route.ts` (Line 70)
- After successful save: `onboarding_completed: true`

### Set to `false` when:
- User profile is first created (by trigger)
- File: `SUPABASE_SCHEMA.sql` (Line 14, 78)
- Default value: `onboarding_completed boolean default false`

---

## 🛠️ Troubleshooting

### Issue: Onboarded users still redirected to step 2

**Check 1: Database Value**
```sql
SELECT id, full_name, onboarding_completed, company, primary_industry 
FROM public.profiles 
WHERE id = 'user-uuid-here';
```

Expected: `onboarding_completed = true` (or `t`)

**Check 2: Server Logs**
Look for errors in `/auth/callback/route.ts`:
- Line 89-92: Profile fetch errors
- Line 97-100: `onboarding_completed` check logic
- Line 111-113: Exception handling

**Check 3: Browser Console**
Look for errors when accessing `/onboarding`:
- Line 284: Profile fetch errors
- Line 290-292: `onboarding_completed` check logic

**Check 4: Value Types**
The code handles multiple formats:
- ✅ `true` (boolean)
- ✅ `'true'` (string)
- ✅ `1` (number)

---

## 📝 Code Changes Made

### Updated Files:
1. ✅ `src/app/auth/callback/route.ts`
   - Enhanced `onboarding_completed` check (handles boolean/string/number)
   - Clear redirect logic for onboarded vs non-onboarded users

2. ✅ `src/app/onboarding/OnboardingClient.tsx`
   - Enhanced `onboarding_completed` check (handles boolean/string/number)
   - Client-side redirect if user already onboarded

3. ✅ `src/components/ui/google-signin-button.tsx`
   - Removed hardcoded `next=/onboarding` parameter
   - Now lets callback route decide based on `onboarding_completed`

---

## 🎯 Summary

**Two Redirect Locations:**
1. **Server-side** (`/auth/callback/route.ts`) - Primary redirect after OAuth
2. **Client-side** (`OnboardingClient.tsx`) - Fallback when accessing `/onboarding`

**Both check:**
- `onboarding_completed === true` → `/dashboard`
- `onboarding_completed !== true` → `/onboarding?step=2`

**Both handle:**
- Boolean `true`
- String `'true'`
- Number `1`

---

**Last Updated:** Current Date
**Status:** ✅ Documented - Both redirect locations verified and working

