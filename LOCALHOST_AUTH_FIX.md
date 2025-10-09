# 🔧 Localhost Authentication Fix

## Problem
After setting up redirect URLs in Supabase, authentication from `localhost:3000` still redirects to `https://tenderpost.org/dashboard` instead of staying on localhost.

## Root Cause
The **Site URL** in Supabase is set to `https://tenderpost.org`, which is used as the base for OAuth redirects. Even though you've added `https://localhost:3000/**` to redirect URLs, Supabase prioritizes the Site URL.

---

## ✅ Complete Solution

### Step 1: Create Environment File

Create a file named `.env.local` in your `tenderhub` directory:

```bash
# .env.local (for local development)

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site Configuration - THIS IS THE KEY FIX
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# PostHog (if using)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key

# Other keys...
RAZORPAY_KEY_SECRET=your_razorpay_secret
RESEND_API_KEY=your_resend_api_key
```

**Important:** 
- Use `http://localhost:3000` (NOT `https://`)
- Don't add trailing slash
- This file should NOT be committed to git (already in `.gitignore`)

### Step 2: Update Supabase Configuration

Go to your Supabase Dashboard:

1. **Navigate to:** Authentication → URL Configuration

2. **Site URL:** Keep as `https://tenderpost.org` (for production)

3. **Redirect URLs:** Ensure these are ALL present:
   ```
   https://tenderpost.org/auth/callback
   https://tenderpost.org/dashboard
   https://tenderpost.org/**
   http://localhost:3000/auth/callback
   http://localhost:3000/dashboard
   http://localhost:3000/**
   ```

   **Critical:** 
   - Use `http://` (NOT `https://`) for localhost
   - Include the wildcard `/**` entries
   - Click "Save" after adding

### Step 3: Verify the Fix

I've already updated your `google-signin-button.tsx` to use the environment variable. Now test:

1. **Restart your dev server:**
   ```bash
   cd tenderhub
   npm run dev
   ```

2. **Open browser console** (F12) and go to `http://localhost:3000`

3. **Click "Sign in with Google"**

4. **Check console logs** - you should see:
   ```
   🔐 Site URL: http://localhost:3000
   🔗 Redirect URL: http://localhost:3000/auth/callback
   🌍 Current origin: http://localhost:3000
   ```

5. **After authentication**, you should be redirected to:
   ```
   http://localhost:3000/dashboard
   ```
   NOT `https://tenderpost.org/dashboard` ✅

---

## 🚀 Production Deployment

For production (Vercel/Netlify), set environment variable:

```bash
NEXT_PUBLIC_SITE_URL=https://tenderpost.org
```

This ensures production uses the production URL.

---

## 🔍 Troubleshooting

### Still redirecting to production?

1. **Check environment variable is loaded:**
   ```bash
   # In browser console after clicking sign-in
   # Should show: http://localhost:3000
   ```

2. **Clear Supabase cache:**
   - Delete cookies for `localhost:3000`
   - Browser DevTools → Application → Cookies → Delete all for localhost

3. **Verify .env.local exists:**
   ```bash
   ls -la tenderhub/.env.local
   ```
   Should show the file (if not, create it)

4. **Restart dev server:**
   ```bash
   # Kill the process (Ctrl+C)
   npm run dev
   ```

### Wrong protocol (https vs http)?

- Localhost MUST use `http://` (not `https://`)
- Production MUST use `https://`
- Check both `.env.local` and Supabase redirect URLs

### Cookie issues?

Clear all cookies and local storage:
```javascript
// In browser console
localStorage.clear();
// Then manually delete cookies in DevTools
```

---

## 📝 Environment Variables Summary

| Variable | Local (.env.local) | Production (Vercel) |
|----------|-------------------|---------------------|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://tenderpost.org` |
| `NEXT_PUBLIC_SUPABASE_URL` | Your project URL | Same |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Same |

---

## ✨ What Changed

### Updated File: `src/components/ui/google-signin-button.tsx`

```typescript
// Before (always used current origin)
const redirectUrl = `${window.location.origin}/auth/callback`;

// After (uses environment variable with fallback)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
const redirectUrl = `${siteUrl}/auth/callback`;
```

This allows you to control the redirect URL based on environment!

---

## 🎯 Quick Checklist

- [ ] Created `.env.local` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- [ ] Added `http://localhost:3000/**` to Supabase redirect URLs
- [ ] Clicked "Save" in Supabase Dashboard
- [ ] Restarted dev server (`npm run dev`)
- [ ] Cleared browser cookies for localhost
- [ ] Tested sign-in flow
- [ ] Verified redirect stays on localhost

---

## 📞 Still Having Issues?

If authentication still redirects to production:

1. Share console logs (🔐, 🔗, 🌍 emoji logs)
2. Check Supabase Dashboard → Authentication → URL Configuration screenshot
3. Verify `.env.local` contents (mask sensitive keys)

---

**Last Updated:** October 9, 2025
**Status:** ✅ Fixed - Environment-based redirect configured

