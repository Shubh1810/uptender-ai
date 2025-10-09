# 🔑 All API Keys Required for .env.local

## Complete `.env.local` File Template

Create a file named `.env.local` in the `tenderhub` folder with these keys:

```bash
# ============================================
# SUPABASE - Authentication & Database
# ============================================
# Required for: Google Sign-In, User Authentication
# Get from: https://supabase.com/dashboard → Settings → API

NEXT_PUBLIC_SUPABASE_URL=https://yudbacivchnfyqziisao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here


# ============================================
# RAZORPAY - Payment Gateway
# ============================================
# Required for: Payment processing, order creation
# Get from: https://dashboard.razorpay.com/app/keys

RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here


# ============================================
# RESEND - Email Service
# ============================================
# Required for: Sending welcome emails, notifications
# Get from: https://resend.com/api-keys

RESEND_API_KEY=re_your_resend_api_key_here
NOTIFICATION_EMAIL=your-email@example.com


# ============================================
# POSTHOG - Analytics (INTEGRATED & PRODUCTION READY)
# ============================================
# Required for: User analytics, autocapture, event tracking
# Get from: https://posthog.com/project/settings
# Status: ✅ Fully integrated with autocapture & custom events
# Region: US (configured via proxy rewrites)

NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key_here


# ============================================
# APPLICATION CONFIGURATION
# ============================================

# App URL (change in production)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Node Environment (automatically set)
NODE_ENV=development
```

---

## 📋 Priority Breakdown

### 🔴 **CRITICAL (Required for Authentication)**
1. ✅ `NEXT_PUBLIC_SUPABASE_URL` - Already set (your Supabase project URL)
2. ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - **YOU MUST ADD THIS**

### 🟡 **HIGH PRIORITY (Required for Core Features)**
3. `RAZORPAY_KEY_ID` - For payment processing
4. `RAZORPAY_KEY_SECRET` - For payment verification
5. `RESEND_API_KEY` - For sending emails
6. `NOTIFICATION_EMAIL` - Your email to receive signup notifications

### 🟢 **LOW PRIORITY (Recommended for Production)**
7. `NEXT_PUBLIC_POSTHOG_KEY` - For user analytics & autocapture (✅ fully integrated)

---

## 🎯 Step-by-Step: How to Get Each Key

### 1️⃣ **SUPABASE_ANON_KEY** (Most Important - Authentication Won't Work Without This)

```bash
1. Go to: https://supabase.com/dashboard
2. Click your project (yudbacivchnfyqziisao)
3. Navigate to: Settings (⚙️) → API
4. Find: "Project API keys" section
5. Copy: "anon" / "public" key (starts with "eyJ...")
6. Paste in .env.local
```

**Example:**
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
```

---

### 2️⃣ **RAZORPAY Keys** (For Payment Processing)

```bash
1. Go to: https://dashboard.razorpay.com/signup
2. Create account / Sign in
3. Navigate to: Settings → API Keys
4. Click: "Generate Test Key" (for development)
5. Copy: Key ID (starts with "rzp_test_")
6. Copy: Key Secret (click "Show" button)
7. Paste both in .env.local
```

**Example:**
```bash
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=abcdefghijklmnopqrstuvwx
```

**Note:** Use Test Keys for development, Live Keys for production

---

### 3️⃣ **RESEND_API_KEY** (For Email Notifications)

```bash
1. Go to: https://resend.com/signup
2. Create account / Sign in
3. Navigate to: API Keys
4. Click: "Create API Key"
5. Name: "TenderHub Dev" (or your choice)
6. Copy: The key (starts with "re_")
7. Paste in .env.local
```

**Example:**
```bash
RESEND_API_KEY=re_1234567890abcdefghijklmnopqr
NOTIFICATION_EMAIL=admin@yoursite.com
```

---

### 4️⃣ **POSTHOG Keys** (✅ Fully Integrated - Production Ready)

**What's Included:**
- ✅ Autocapture (clicks, forms, pageviews, errors)
- ✅ Custom event tracking (search, sign-in, payments)
- ✅ User identification
- ✅ US region optimization
- ✅ Privacy-compliant (GDPR ready)

**How to Get Your Key:**
```bash
1. Go to: https://posthog.com/signup
2. Create account / Sign in
3. Create a new project (select US region)
4. Navigate to: Project Settings → Project API Key
5. Copy: The API key (starts with "phc_")
6. Paste in .env.local
```

**Example:**
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_1234567890abcdefghijklmnopqrstuvwxyz
```

**Note:** PostHog HOST is already configured via proxy rewrites for US region. No need to add NEXT_PUBLIC_POSTHOG_HOST.

**Documentation:** See `POSTHOG_INTEGRATION.md` for complete setup guide.

---

## 🚨 **IMMEDIATE ACTION NEEDED**

To get your app running **RIGHT NOW**, you only need:

### Minimum Viable `.env.local`:
```bash
# Authentication (CRITICAL)
NEXT_PUBLIC_SUPABASE_URL=https://yudbacivchnfyqziisao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_from_supabase

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

This will get:
- ✅ Google Sign-In working
- ✅ Dashboard access working
- ✅ User authentication working

---

## 🔐 Security Best Practices

### ✅ **DO:**
- Keep `.env.local` in `.gitignore` (already done)
- Use different keys for development and production
- Rotate keys regularly
- Use test/sandbox keys for development

### ❌ **DON'T:**
- Commit `.env.local` to Git
- Share keys publicly
- Use production keys in development
- Store keys in frontend code

---

## 🧪 **Testing If Keys Are Working**

### Test Supabase:
```bash
# Run dev server
npm run dev

# Click "Sign in with Google"
# If it redirects to Google → Keys are working ✅
# If you get an error → Check keys ❌
```

### Test Razorpay:
```bash
# Go to: http://localhost:3000/make-payment
# Try to make a payment
# If Razorpay modal opens → Keys are working ✅
```

### Test Resend:
```bash
# Go to homepage
# Enter email in signup form
# Check if email arrives → Keys are working ✅
```

---

## 📝 **Quick Copy-Paste Template**

Save this to `tenderhub/.env.local`:

```bash
# SUPABASE (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://yudbacivchnfyqziisao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# RAZORPAY (FOR PAYMENTS)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# RESEND (FOR EMAILS)
RESEND_API_KEY=
NOTIFICATION_EMAIL=

# POSTHOG (RECOMMENDED FOR PRODUCTION)
NEXT_PUBLIC_POSTHOG_KEY=

# APP CONFIG
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

Then fill in the values after the `=` sign.

---

## 🎯 **Summary**

| Key | Required? | Purpose | Where to Get |
|-----|-----------|---------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ YES | Auth & DB | Already set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ YES | Auth & DB | [Supabase Dashboard](https://supabase.com/dashboard) |
| `RAZORPAY_KEY_ID` | 🟡 For Payments | Payment processing | [Razorpay Dashboard](https://dashboard.razorpay.com) |
| `RAZORPAY_KEY_SECRET` | 🟡 For Payments | Payment verification | [Razorpay Dashboard](https://dashboard.razorpay.com) |
| `RESEND_API_KEY` | 🟡 For Emails | Email notifications | [Resend](https://resend.com) |
| `NOTIFICATION_EMAIL` | 🟡 For Emails | Your admin email | Your email address |
| `NEXT_PUBLIC_POSTHOG_KEY` | 🟢 Recommended | Analytics & Autocapture | [PostHog](https://posthog.com) |

---

**Start with just the Supabase keys to get authentication working, then add others as needed!** 🚀

