# 🚀 PostHog Tracking - Quick Reference Card

## Import Statement
```typescript
import { 
  // Auth
  trackUserSignedIn, trackUserSignedUp, trackUserSignedOut,
  // Tenders
  trackTenderSearch, trackTenderViewed, trackTenderExternalClick, trackTenderSaved,
  // Payment
  trackPaymentPageViewed, trackPaymentInitiated, trackPaymentCompleted, trackPaymentFailed,
  // Email/Waitlist
  trackEmailSignup, trackWaitlistJoined, trackWaitlistOverlayShown,
  // Homepage
  trackCtaClicked, trackPricingPlanSelected, trackFaqExpanded, trackScrollDepth,
  // Dashboard
  trackDashboardViewed, trackDashboardTabChanged, trackFeatureUsed,
  // Forms
  trackFormStarted, trackFormFieldCompleted, trackFormSubmitted, trackFormAbandoned,
  // User Identification
  identifyUser, setUserProperties
} from '@/lib/posthog/events';
```

---

## Most Common Tracking Calls

### Button Clicks
```typescript
<Button onClick={() => trackCtaClicked({
  ctaText: 'Get Started',
  ctaLocation: 'hero_section',
  ctaType: 'button'
})}>
  Get Started
</Button>
```

### Search
```typescript
trackTenderSearch({
  query: searchQuery,
  resultsCount: results.length,
  page: currentPage
});
```

### External Links
```typescript
<a onClick={() => trackTenderExternalClick({
  tenderId: tender.id,
  tenderTitle: tender.title,
  url: tender.url
})}>
  View Tender
</a>
```

### User Login
```typescript
// After successful login
identifyUser({
  userId: user.id,
  email: user.email,
  name: user.name,
  signupDate: user.created_at
});

trackUserSignedIn({
  method: 'google',
  userId: user.id
});
```

### Payment
```typescript
// Page view
trackPaymentPageViewed({
  plan: 'professional',
  amount: 12353,
  source: 'pricing_page'
});

// Initiated
trackPaymentInitiated({
  amount: 12353,
  currency: 'INR',
  plan: 'professional'
});

// Completed
trackPaymentCompleted({
  orderId: razorpay_order_id,
  amount: 12353,
  currency: 'INR',
  plan: 'professional'
});
```

### Form Tracking
```typescript
// Field completion
trackFormFieldCompleted({
  formName: 'payment_form',
  fieldName: 'email',
  fieldIndex: 1,
  timeToComplete: 5,
  isValid: true
});

// Submission
trackFormSubmitted({
  formName: 'payment_form',
  formLocation: 'payment_page',
  timeToComplete: 45,
  fieldsCompleted: 3,
  totalFields: 3,
  success: true
});
```

### Page Engagement
```typescript
// On page leave
trackPageEngagement({
  pagePath: '/dashboard',
  timeOnPage: 120,
  scrollDepth: 75,
  clicksCount: 12
});
```

---

## User Properties

### Set Basic Properties
```typescript
setUserProperties({
  company_name: 'Acme Corp',
  plan: 'professional',
  tenders_viewed: 45,
  engagement_score: 78
});
```

### On Signup
```typescript
identifyUser({
  userId: user.id,
  email: user.email,
  name: user.name,
  signupDate: new Date().toISOString(),
  plan: 'free'
});
```

### On Payment
```typescript
setUserProperties({
  plan: 'professional',
  is_paying_customer: true,
  first_payment_date: new Date().toISOString(),
  total_spent: 12353
});
```

---

## Testing in Browser Console

```javascript
// Check if PostHog is loaded
window.posthog

// See all captured events
window.posthog.get_property('$user_id')

// Test an event
window.posthog.capture('test_event', { test: true })

// See current user properties
window.posthog.get_person_properties()
```

---

## Viewing in PostHog Dashboard

1. Go to https://app.posthog.com
2. **Activity** → **Events** (See all events)
3. **People** → **Persons** (See user profiles)
4. **Product Analytics** → **Insights** (Create analytics)
5. **Product Analytics** → **Funnels** (Conversion funnels)

---

## Common Patterns

### Track + Navigate
```typescript
const handleClick = () => {
  trackCtaClicked({ ... });
  router.push('/payment');
};
```

### Track + API Call
```typescript
const handleSearch = async () => {
  const startTime = Date.now();
  const results = await fetchTenders(query);
  
  trackTenderSearch({
    query,
    resultsCount: results.length,
    searchDuration: Date.now() - startTime
  });
};
```

### Conditional Tracking
```typescript
if (success) {
  trackPaymentCompleted({ ... });
} else {
  trackPaymentFailed({ reason: error.message });
}
```

---

## Event Property Patterns

### Always Include
- `timestamp: new Date().toISOString()`

### User Context
- `user_agent: navigator.userAgent`
- `screen_width: window.innerWidth`
- `screen_height: window.innerHeight`

### Timing
- `time_to_action_seconds: (Date.now() - startTime) / 1000`
- `session_duration_seconds: sessionTime / 1000`

### Engagement
- `scroll_depth_percentage: scrollPercent`
- `clicks_count: clickCount`
- `time_on_page_seconds: pageTime / 1000`

---

## Quick Fixes

### Event Not Showing?
1. Check console for PostHog errors
2. Verify `NEXT_PUBLIC_POSTHOG_KEY` is set
3. Check Network tab for `/ingest` calls
4. Disable ad blocker

### Wrong Data?
1. Check property names (snake_case)
2. Verify timestamp format (ISO string)
3. Check for undefined/null values

### Tracking Too Much?
1. Remove verbose debug properties
2. Batch similar events
3. Sample high-frequency events

---

## Files to Know

- `/src/lib/posthog/events.ts` - All tracking functions
- `/src/lib/posthog/provider.tsx` - PostHog init
- `.env.local` - API key (`NEXT_PUBLIC_POSTHOG_KEY`)

---

## Need Help?

1. **Full docs:** `COMPREHENSIVE_ANALYTICS_TRACKING.md`
2. **Implementation:** `TRACKING_IMPLEMENTATION_GUIDE.md`
3. **User properties:** `USER_PROPERTIES_GUIDE.md`
4. **PostHog docs:** https://posthog.com/docs

---

**Pro Tip:** Use browser DevTools console to see PostHog debug logs in development mode!

