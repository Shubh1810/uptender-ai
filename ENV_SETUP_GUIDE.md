# 🔐 Environment Variables Setup Guide

## Required Environment Variables for `.env.local`

Your `.env.local` file needs the following variables. Copy this template and fill in your actual values:

```bash
# ==============================================
# UPTENDER AI - Environment Variables
# ==============================================

# ----------------------------------------------
# 🔐 SUPABASE CONFIGURATION (Required)
# ----------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://yudbacivchnfyqziisao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# ----------------------------------------------
# 📊 POSTHOG ANALYTICS (Required)
# ----------------------------------------------
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_api_key_here

# ----------------------------------------------
# 💳 RAZORPAY PAYMENT GATEWAY (Optional)
# ----------------------------------------------
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# ----------------------------------------------
# 🌐 APPLICATION CONFIGURATION
# ----------------------------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📝 How to Get Each Value

### 1. **Supabase Credentials** (REQUIRED)

**Where to find:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (URL: `https://yudbacivchnfyqziisao.supabase.co`)
3. Navigate to **Settings** → **API**
4. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Example:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://yudbacivchnfyqziisao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 2. **PostHog Analytics** (REQUIRED)

**Where to find:**
1. Go to [PostHog Dashboard](https://app.posthog.com)
2. Sign up or log in
3. Create a new project (or select existing)
4. Navigate to **Project Settings** → **Project API Key**
5. Copy the API key (starts with `phc_`)

**Example:**
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_1234567890abcdefghijklmnopqrstuvwxyz
```

---

### 3. **Razorpay Payment** (Optional - for payment features)

**Where to find:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up or log in
3. Navigate to **Settings** → **API Keys**
4. For testing: Use **Test Mode** keys
5. For production: Use **Live Mode** keys (requires KYC)

**Example:**
```bash
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=your_secret_key_here_never_expose
```

**Test Cards for Razorpay:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

---

### 4. **Application URL**

**For Local Development:**
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For Production (Vercel):**
```bash
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

---

## ✅ Quick Setup Steps

1. **Copy the template above**
2. **Open your `.env.local` file** (you created with 2 lines)
3. **Replace it with the full template**
4. **Fill in the actual values** from the sources above
5. **Restart your dev server:**
   ```bash
   npm run dev
   ```

---

## 🚨 Important Security Notes

1. ⚠️ **NEVER commit `.env.local` to Git**
2. ✅ `.env.local` is already in `.gitignore` - keep it that way!
3. ✅ Only `NEXT_PUBLIC_*` variables are exposed to the browser
4. ⚠️ Keep `RAZORPAY_KEY_SECRET` secret - never expose in client code
5. ✅ For production, add these variables in Vercel Dashboard → Settings → Environment Variables

---

## 🐛 Troubleshooting

### Error: "Your project's URL and API key are required"
**Solution:** Make sure you have both Supabase variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### PostHog not tracking
**Solution:** Check that `NEXT_PUBLIC_POSTHOG_KEY` starts with `phc_`

### Payment not working
**Solution:** Verify Razorpay keys are correct and using Test Mode for development

### Changes not reflecting
**Solution:** Restart the dev server after modifying `.env.local`:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## 📦 For Production Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable one by one
5. Click **Save**
6. Redeploy your application

---

## 🔗 Quick Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [PostHog Dashboard](https://app.posthog.com)
- [Razorpay Dashboard](https://dashboard.razorpay.com)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

**Need the exact values?** Check your email or cloud provider dashboards where you originally set up these services.

