# Supabase Google Authentication Setup Guide

## ✅ What's Been Completed

1. ✅ Installed Supabase dependencies (`@supabase/supabase-js`, `@supabase/ssr`)
2. ✅ Created Supabase client utilities
3. ✅ Set up authentication middleware
4. ✅ Created auth callback route handler
5. ✅ Integrated Google Sign-In button in Header
6. ✅ Built Dashboard page with sidebar
7. ✅ Added protected route logic

---

## 🔧 Configuration Required

### Step 1: Get Your Supabase Anon Key

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (URL: `https://yudbacivchnfyqziisao.supabase.co`)
3. Navigate to **Settings** → **API**
4. Copy the **anon/public** key
5. Update `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yudbacivchnfyqziisao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

---

### Step 2: Configure Google Cloud Console

1. **Go to** [Google Cloud Console](https://console.cloud.google.com)
2. **Create a new project** or select existing one
3. **Enable** Google+ API (if not already enabled)
4. **Navigate to** APIs & Services → Credentials
5. **Click** "Create Credentials" → "OAuth client ID"
6. **Choose** "Web application"
7. **Configure:**
   - **Application name:** TenderHub (or your choice)
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://your-production-domain.com
     ```
   - **Authorized redirect URIs:**
     ```
     https://yudbacivchnfyqziisao.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
8. **Click Create** and save your **Client ID** and **Client Secret**

---

### Step 3: Configure Supabase Google Provider

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and toggle it **Enabled**
4. Paste:
   - **Client ID** (from Google Console)
   - **Client Secret** (from Google Console)
5. **Copy** the Callback URL shown:
   ```
   https://yudbacivchnfyqziisao.supabase.co/auth/v1/callback
   ```
6. Make sure this matches what you entered in Google Console
7. Click **Save**

---

## 🚀 Testing the Setup

### Local Development:

1. **Start the dev server:**
   ```bash
   cd tenderhub
   npm run dev
   ```

2. **Open** `http://localhost:3000`

3. **Click** "Sign in with Google" button in the header

4. **Complete** Google OAuth flow

5. **You should be redirected** to `/dashboard` with your profile

---

## 📁 Files Created/Modified

### New Files:
- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server client
- `src/lib/supabase/middleware.ts` - Middleware utilities
- `middleware.ts` - Next.js middleware for auth
- `src/app/auth/callback/route.ts` - OAuth callback handler
- `src/app/dashboard/page.tsx` - Dashboard with sidebar
- `src/components/ui/google-signin-button.tsx` - Google sign-in component
- `.env.local` - Environment variables (YOU NEED TO ADD ANON KEY)

### Modified Files:
- `src/components/Header.tsx` - Added Google Sign-In button

---

## 🔐 Security Notes

1. ⚠️ **Never commit** `.env.local` to Git
2. ✅ The `.env.local` file is already in `.gitignore`
3. ✅ Only the `anon` key is used on the client (safe for public exposure)
4. ✅ Supabase handles Row Level Security (RLS) automatically
5. ⚠️ Make sure to enable RLS on your database tables

---

## 🎯 Next Steps

After authentication is working:

1. **Set up user profiles** in Supabase database
2. **Create tender tables** with RLS policies
3. **Connect backend** for live tender data
4. **Add user preferences** and saved tenders
5. **Implement notifications** system
6. **Add payment integration** for premium features

---

## 🐛 Troubleshooting

### "Invalid OAuth client" error:
- Check that redirect URIs match exactly in Google Console
- Verify callback URL is correct in Supabase settings

### "Auth session missing" error:
- Ensure `.env.local` has the correct anon key
- Restart the dev server after updating environment variables

### Redirect not working:
- Check middleware.ts is in the root directory
- Verify callback route is at `src/app/auth/callback/route.ts`

### Dashboard not showing:
- Check that user is authenticated
- Look for console errors in browser dev tools
- Verify Supabase client is initialized correctly

---

## 📚 Documentation References

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## ✨ Features Implemented

- ✅ Google OAuth Sign-In
- ✅ Protected Dashboard Route
- ✅ User Session Management
- ✅ Automatic Token Refresh
- ✅ Sign Out Functionality
- ✅ Responsive Sidebar Navigation
- ✅ User Profile Display

---

**Need Help?** Check the Supabase and Next.js documentation or reach out to the community!

