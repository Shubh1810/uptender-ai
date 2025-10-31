# CRON Auto-Refresh Setup Guide

## Overview
This system automatically refreshes tender data every 12 hours **WITHOUT requiring any user to log in**. It runs completely in the background on the server.

---

## 🎯 How It Works

```
Every 12 hours (automatically):
    ↓
Vercel Cron triggers: /api/cron/auto-refresh
    ↓
Fetches latest tenders from external API
    ↓
Updates global cache (all users see new data)
    ↓
Updates live tenders count
    ↓
Logs: "✅ CRON: Auto-refresh completed"
```

**No user login required!** Runs 24/7 in the background.

---

## 🔧 Setup Instructions

### 1. **Add Environment Variables**

Add to your `.env.local` (development) and Vercel Environment Variables (production):

```env
# CRON Secret Key (generate a random string)
CRON_SECRET=your-super-secret-random-key-here-change-this

# Site URL (for internal API calls)
NEXT_PUBLIC_SITE_URL=https://tenderpost.org
```

**Generate a secure CRON_SECRET:**
```bash
# Use this command to generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. **Vercel Cron Setup** (Production)

The `vercel.json` is already configured:

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-refresh",
      "schedule": "0 */12 * * *"
    }
  ]
}
```

**Schedule Explanation:**
- `0 */12 * * *` = Every 12 hours (at minute 0)
- Runs at: 12:00 AM, 12:00 PM daily

**To change schedule:**
- Every 6 hours: `0 */6 * * *`
- Every 24 hours: `0 0 * * *` (midnight daily)
- Every 8 hours: `0 */8 * * *`

### 3. **Vercel Deployment**

1. Push code to GitHub
2. Vercel will auto-deploy
3. Cron will activate automatically (Vercel Pro plan required)
4. Check logs in Vercel Dashboard → Functions → Cron

---

## 🆓 Alternative: Free Cron Services (No Vercel Pro)

If you don't have Vercel Pro, use external cron services:

### **Option A: cron-job.org** (Free, Reliable)

1. Go to [cron-job.org](https://cron-job.org)
2. Create free account
3. Add new cron job:
   - **URL:** `https://tenderpost.org/api/cron/auto-refresh`
   - **Schedule:** Every 12 hours
   - **HTTP Method:** GET
   - **Headers:** 
     - `Authorization: Bearer your-cron-secret-here`

### **Option B: EasyCron** (Free Tier Available)

1. Go to [easycron.com](https://easycron.com)
2. Create account (free tier: 20 jobs/month)
3. Add cron job:
   - **URL:** `https://tenderpost.org/api/cron/auto-refresh`
   - **Cron Expression:** `0 */12 * * *`
   - **Custom Headers:** `Authorization: Bearer your-cron-secret`

### **Option C: GitHub Actions** (Free for Public Repos)

Create `.github/workflows/auto-refresh.yml`:

```yaml
name: Auto-Refresh Tenders

on:
  schedule:
    - cron: '0 */12 * * *'  # Every 12 hours
  workflow_dispatch:  # Allow manual trigger

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Auto-Refresh
        run: |
          curl -X GET https://tenderpost.org/api/cron/auto-refresh \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

Add `CRON_SECRET` to GitHub Repository Secrets.

---

## 🧪 Testing

### **Test Locally:**

```bash
# Set environment variable
export CRON_SECRET=your-secret-key

# Test the endpoint
curl -X GET http://localhost:3000/api/cron/auto-refresh \
  -H "Authorization: Bearer your-secret-key"
```

### **Test in Production:**

```bash
curl -X GET https://tenderpost.org/api/cron/auto-refresh \
  -H "Authorization: Bearer your-actual-cron-secret"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "CRON auto-refresh completed successfully",
  "data": {
    "tendersCount": 50,
    "totalCount": 19,
    "liveTendersCount": 2197,
    "timestamp": "2025-10-29T15:30:00Z",
    "source": "cron"
  }
}
```

---

## 📊 Monitoring

### **Check Vercel Logs:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" → "Cron"
4. View execution logs

### **Check Server Logs:**
Look for these console logs:

```
✅ Success:
🔄 CRON: Starting scheduled tender auto-refresh...
✅ CRON: Fetched 50 tenders, 2197 live tenders
✅ CRON: Updated tender cache
✅ CRON: Updated tender stats

❌ Errors:
❌ Unauthorized cron attempt
❌ CRON: Failed to update tender cache
❌ CRON: Auto-refresh error: [error details]
```

---

## 🔒 Security

**IMPORTANT:** Keep your `CRON_SECRET` secure!

- Never commit it to git
- Use Vercel Environment Variables
- Rotate the secret periodically
- Use HTTPS only

**Authorization Header:**
```
Authorization: Bearer your-cron-secret-here
```

Without this header, the endpoint returns 401 Unauthorized.

---

## 🎯 Benefits

| Aspect | Without CRON | With CRON |
|--------|--------------|-----------|
| **Refresh Trigger** | User must log in | Automatic every 12 hours |
| **Availability** | Only when users search | 24/7 background |
| **User Experience** | May see stale data | Always fresh (<12hrs) |
| **Dependency** | Requires user activity | Independent |
| **Reliability** | Depends on traffic | Guaranteed refresh |

---

## 🔄 How Users Benefit

**Before CRON:**
```
No users log in for 2 days
    ↓
Data becomes 2 days old
    ↓
First user logs in → sees stale data
```

**With CRON:**
```
No users log in for 2 days
    ↓
CRON runs every 12 hours automatically
    ↓
First user logs in → sees fresh data (<12hrs old)
```

---

## 📝 Schedule Examples

```bash
# Every 12 hours (current)
"0 */12 * * *"  → 12:00 AM, 12:00 PM

# Every 6 hours
"0 */6 * * *"   → 12:00 AM, 6:00 AM, 12:00 PM, 6:00 PM

# Every 8 hours  
"0 */8 * * *"   → 12:00 AM, 8:00 AM, 4:00 PM

# Every 24 hours (midnight)
"0 0 * * *"     → 12:00 AM daily

# Twice daily (9 AM, 9 PM)
"0 9,21 * * *"  → 9:00 AM, 9:00 PM
```

---

## 🚀 Deployment Checklist

- [ ] Add `CRON_SECRET` to Vercel Environment Variables
- [ ] Add `NEXT_PUBLIC_SITE_URL` to Vercel Environment Variables
- [ ] Deploy to Vercel
- [ ] Verify cron is active in Vercel Dashboard
- [ ] Test endpoint manually
- [ ] Monitor first automatic execution
- [ ] Check logs after 12 hours

---

## 🐛 Troubleshooting

**Problem:** Cron not running
- **Solution:** Check Vercel plan (Pro required for cron)
- **Alternative:** Use free external cron service

**Problem:** 401 Unauthorized
- **Solution:** Check `CRON_SECRET` matches in both places

**Problem:** External API fails
- **Solution:** Check API is accessible from Vercel
- **Check:** `https://tenderpost-api.onrender.com/api/tenders`

**Problem:** Internal API calls fail
- **Solution:** Verify `NEXT_PUBLIC_SITE_URL` is correct

---

Your tender data will now refresh automatically every 12 hours, 24/7, without requiring any user to log in! 🎉

