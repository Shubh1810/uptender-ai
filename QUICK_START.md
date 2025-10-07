# 🚀 Quick Start - Google Authentication

## 3 Steps to Get Running

### Step 1: Create `.env.local` file
```bash
# In the tenderhub folder, create a file named .env.local
# Add these lines:

NEXT_PUBLIC_SUPABASE_URL=https://yudbacivchnfyqziisao.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

**Get your anon key:**
1. Go to https://supabase.com/dashboard
2. Click your project
3. Settings → API
4. Copy the "anon/public" key
5. Paste it in `.env.local`

---

### Step 2: Configure Google Console
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth Client ID (Web application)
3. Add redirect URI: `https://yudbacivchnfyqziisao.supabase.co/auth/v1/callback`
4. Add origin: `http://localhost:3000`
5. Save and copy Client ID & Client Secret

---

### Step 3: Configure Supabase
1. Go to https://supabase.com/dashboard
2. Authentication → Providers → Google
3. Toggle ON
4. Paste Client ID and Client Secret from Google Console
5. Click Save

---

## ✅ Test It!

```bash
cd tenderhub
npm run dev
```

Open http://localhost:3000 and click "Sign in with Google"

---

## 🎉 Done!

After signing in, you'll be redirected to your dashboard at `/dashboard`

**Full setup guide:** See `GOOGLE_AUTH_COMPLETE.md`

