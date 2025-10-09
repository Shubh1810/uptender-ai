# 📊 PostHog Analytics Integration - Complete Guide

## ✅ Integration Status: PRODUCTION READY

PostHog is fully integrated into TenderHub with **autocapture** and **custom event tracking**.

---

## 🎯 What's Integrated

### **1. Autocapture (Automatic Tracking)**
PostHog automatically captures these events without any code:

#### **User Interactions:**
- ✅ All button clicks
- ✅ Link clicks
- ✅ Form submissions
- ✅ Input field changes
- ✅ Select/textarea interactions

#### **Page Analytics:**
- ✅ Pageviews on route changes
- ✅ Page leave events
- ✅ Time spent on page
- ✅ Scroll depth
- ✅ URL parameters (UTMs, referrers)

#### **Error Tracking:**
- ✅ JavaScript exceptions
- ✅ Unhandled promise rejections
- ✅ Runtime errors with stack traces

---

### **2. Custom Events (Business-Specific Tracking)**

Custom events are implemented for key user actions:

#### **Authentication Events:**
```typescript
// User signs in with Google
trackUserSignedIn({ method: 'google' })

// User signs out
trackUserSignedOut()

// Identify user in PostHog
identifyUser({
  userId: 'user_123',
  email: 'user@example.com',
  name: 'John Doe'
})
```

#### **Tender Search Events:**
```typescript
// User searches for tenders
trackTenderSearch({
  query: 'healthcare',
  resultsCount: 45,
  page: 1
})

// User clicks external tender link
trackTenderExternalClick({
  tenderId: 'TENDER_123',
  tenderTitle: 'Medical Equipment Tender',
  url: 'https://example.com/tender'
})

// User views tender details
trackTenderViewed({
  tenderId: 'TENDER_123',
  tenderTitle: 'Medical Equipment Tender',
  organization: 'AIIMS Delhi',
  source: 'search_results'
})

// User saves tender
trackTenderSaved({
  tenderId: 'TENDER_123',
  tenderTitle: 'Medical Equipment Tender'
})
```

#### **Payment Events:**
```typescript
// Payment initiated
trackPaymentInitiated({
  amount: 499,
  currency: 'INR',
  plan: 'monthly'
})

// Payment completed
trackPaymentCompleted({
  orderId: 'order_123',
  amount: 499,
  currency: 'INR',
  plan: 'monthly'
})

// Payment failed
trackPaymentFailed({
  orderId: 'order_123',
  amount: 499,
  reason: 'insufficient_funds'
})
```

#### **Waitlist & Email Signup:**
```typescript
// User joins waitlist
trackWaitlistJoined({
  email: 'user@example.com',
  source: 'homepage_banner'
})

// Email signup
trackEmailSignup({
  email: 'user@example.com',
  source: 'footer_form',
  success: true
})
```

#### **Dashboard & Feature Usage:**
```typescript
// Dashboard viewed
trackDashboardViewed({ section: 'search' })

// Generic feature usage
trackFeatureUsed({
  featureName: 'advanced_filters',
  location: 'search_page',
  metadata: { filterType: 'date_range' }
})
```

---

## 🔧 Setup Instructions

### **Step 1: Get PostHog API Key**

1. Go to [PostHog Dashboard](https://app.posthog.com)
2. Sign up or log in
3. Create a new project (or use existing)
4. Navigate to: **Project Settings** → **Project API Key**
5. Copy your API key (starts with `phc_`)

### **Step 2: Add Environment Variable**

Create or update `.env.local` file in the `tenderhub` folder:

```bash
# PostHog Analytics (US Region)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_actual_posthog_key_here
```

**Important:** 
- The key MUST start with `NEXT_PUBLIC_` to be accessible in the browser
- US region is already configured in the proxy rewrites

### **Step 3: Deploy**

PostHog will automatically start tracking once deployed with the environment variable set.

**For Vercel:**
```bash
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: NEXT_PUBLIC_POSTHOG_KEY = phc_your_key
5. Redeploy
```

---

## 📁 File Structure

```
tenderhub/
├── src/
│   ├── lib/
│   │   └── posthog/
│   │       ├── provider.tsx          # PostHog initialization & provider
│   │       └── events.ts              # Custom event tracking functions
│   ├── app/
│   │   ├── layout.tsx                 # PostHog provider wrapper
│   │   └── dashboard/
│   │       ├── layout.tsx             # User identification & dashboard tracking
│   │       └── search/
│   │           └── page.tsx           # Search event tracking
│   └── components/
│       └── ui/
│           ├── email-signup.tsx       # Email signup tracking
│           └── google-signin-button.tsx # Sign-in tracking
├── next.config.ts                     # Proxy rewrites for US region
└── instrumentation-client.ts          # (Deprecated - kept for reference)
```

---

## 🚀 Features Enabled

### **Autocapture Configuration:**
```typescript
{
  autocapture: true,                    // Capture all clicks, forms, inputs
  capture_pageview: false,              // Manual pageview (for better control)
  capture_pageleave: true,              // Track when users leave
  capture_exceptions: true,             // JavaScript error tracking
  person_profiles: 'identified_only',   // Only track identified users
  session_recording: {
    maskAllInputs: true,                // Mask sensitive data
    maskTextSelector: '[data-ph-mask]', // Custom mask selector
  },
  debug: true (in development),         // Console logs in dev mode
}
```

### **US Region Proxy:**
All PostHog requests are proxied through `/ingest` to:
- Bypass ad-blockers
- Improve data collection reliability
- Avoid CORS issues
- Faster response times

---

## 📊 What You Can Track

### **In PostHog Dashboard:**

1. **User Journeys:**
   - Homepage → Sign Up → Dashboard → Search → External Link
   - Identify drop-off points
   - Funnel analysis

2. **Feature Adoption:**
   - Most clicked buttons
   - Most used features
   - Search query patterns
   - Tender view rates

3. **Conversion Metrics:**
   - Sign-up conversion rate
   - Email capture rate
   - Tender click-through rate
   - Payment completion rate

4. **Error Monitoring:**
   - JavaScript errors by page
   - Error frequency and impact
   - User context when errors occur

5. **User Segmentation:**
   - Active vs inactive users
   - Feature usage by user type
   - Geographic distribution
   - Device and browser stats

---

## 🔐 Privacy & Security

### **Data Privacy:**
- ✅ Sensitive input fields are **automatically masked**
- ✅ Only **identified users** get full profiles
- ✅ Anonymous users get basic analytics only
- ✅ GDPR compliant (cookie consent required)
- ✅ User can opt-out via cookie banner

### **Custom Masking:**
Add `data-ph-mask` attribute to any element to mask it:
```html
<input type="password" data-ph-mask />
<div data-ph-mask>Sensitive content</div>
```

---

## 🎨 How to Add Custom Events

### **Example 1: Track Custom Feature**

```typescript
import { trackFeatureUsed } from '@/lib/posthog/events';

function AdvancedFilterButton() {
  const handleClick = () => {
    trackFeatureUsed({
      featureName: 'advanced_filters',
      location: 'search_page',
      metadata: { filterType: 'category' }
    });
    // ... rest of logic
  };
  
  return <button onClick={handleClick}>Advanced Filters</button>;
}
```

### **Example 2: Track Tender Save**

```typescript
import { trackTenderSaved } from '@/lib/posthog/events';

function SaveTenderButton({ tender }) {
  const handleSave = async () => {
    await saveTenderToDatabase(tender);
    
    trackTenderSaved({
      tenderId: tender.ref_no,
      tenderTitle: tender.title
    });
  };
  
  return <button onClick={handleSave}>Save Tender</button>;
}
```

### **Example 3: Track Custom Payment Event**

```typescript
import posthog from 'posthog-js';

function trackPlanUpgrade(plan: string, amount: number) {
  posthog.capture('plan_upgraded', {
    plan_name: plan,
    amount: amount,
    currency: 'INR',
    timestamp: new Date().toISOString()
  });
}
```

---

## 🧪 Testing PostHog Integration

### **1. Local Testing (Development):**

```bash
# Start dev server
npm run dev

# Open browser console
# You should see: "PostHog loaded successfully"

# Perform actions:
- Sign in with Google
- Search for tenders
- Click external tender link

# Check console for PostHog events
```

### **2. Verify in PostHog Dashboard:**

```
1. Go to https://app.posthog.com
2. Navigate to: Activity → Events
3. Filter by: Last 24 hours
4. You should see:
   - $pageview events
   - $autocapture events
   - Custom events (user_signed_in, tender_searched, etc.)
```

### **3. Test User Identification:**

```
1. Sign in to your app
2. Go to PostHog Dashboard
3. Navigate to: People → Persons
4. Search for your email
5. You should see your user profile with properties
```

---

## 🐛 Troubleshooting

### **Events Not Showing Up:**

1. **Check Environment Variable:**
   ```bash
   # Verify in browser console
   console.log(process.env.NEXT_PUBLIC_POSTHOG_KEY)
   # Should output: phc_...
   ```

2. **Check PostHog Initialization:**
   ```bash
   # Open browser console
   # You should see: "PostHog loaded successfully"
   ```

3. **Check Network Requests:**
   ```
   - Open browser DevTools → Network tab
   - Filter by: "ingest"
   - Perform an action (click, navigate)
   - You should see POST requests to /ingest
   ```

4. **Ad Blocker:**
   - Disable ad blockers temporarily
   - Proxy rewrites should bypass most blockers, but test anyway

### **TypeScript Errors:**

If you get TypeScript errors related to PostHog:
```bash
npm install --save-dev @types/posthog-js
```

---

## 📈 Analytics Best Practices

### **1. Event Naming:**
- Use snake_case: `tender_searched` (not `TenderSearched`)
- Be specific: `payment_completed` (not just `payment`)
- Use consistent prefixes: `user_*`, `tender_*`, `payment_*`

### **2. Event Properties:**
- Include relevant context
- Add timestamps for time-based analysis
- Keep property names consistent
- Avoid sensitive data (PII, passwords, etc.)

### **3. User Identification:**
- Identify users after successful sign-in
- Reset PostHog on sign-out
- Don't identify anonymous users

---

## 🚦 What's Tracked Automatically vs. Manually

| Event Type | Tracking Method | Examples |
|------------|----------------|----------|
| **Button Clicks** | Automatic (Autocapture) | All buttons, links |
| **Form Submissions** | Automatic (Autocapture) | All forms |
| **Page Views** | Manual (Better control) | Route changes |
| **Tender Search** | Manual (Custom event) | Search with metadata |
| **Tender View** | Manual (Custom event) | View with tender details |
| **Payment Events** | Manual (Custom event) | Payment flow tracking |
| **User Sign-in** | Manual (Custom event) | Authentication tracking |
| **Errors** | Automatic (Exception capture) | JavaScript errors |

---

## 📝 Next Steps

### **Recommended Enhancements:**

1. **Session Recordings:**
   ```typescript
   // Enable in posthog config
   session_recording: {
     recordCrossOriginIframes: true,
     recordCanvas: true
   }
   ```

2. **Feature Flags:**
   ```typescript
   import { useFeatureFlagEnabled } from 'posthog-js/react';
   
   function NewFeature() {
     const isEnabled = useFeatureFlagEnabled('new_search_ui');
     return isEnabled ? <NewSearchUI /> : <OldSearchUI />;
   }
   ```

3. **A/B Testing:**
   ```typescript
   import { usePostHog } from 'posthog-js/react';
   
   function CTAButton() {
     const posthog = usePostHog();
     const variant = posthog.getFeatureFlag('cta_button_test');
     
     return variant === 'control' ? <BlueButton /> : <GreenButton />;
   }
   ```

4. **Custom Dashboards:**
   - Create dashboards in PostHog for key metrics
   - Set up alerts for important events
   - Build funnels for conversion tracking

---

## 🎯 Summary

You now have:
- ✅ Full PostHog autocapture enabled
- ✅ Custom event tracking for business logic
- ✅ User identification system
- ✅ Error tracking
- ✅ Privacy-compliant configuration
- ✅ US region optimization
- ✅ Production-ready setup

**Just add your PostHog API key and deploy!** 🚀

---

## 📞 Support

- **PostHog Docs:** https://posthog.com/docs
- **PostHog Community:** https://posthog.com/questions
- **API Reference:** https://posthog.com/docs/api

---

**Last Updated:** October 9, 2025

