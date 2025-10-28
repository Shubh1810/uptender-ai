# 🚀 Tracking Implementation Guide - Quick Start

## Overview

This guide shows you exactly how to implement the comprehensive tracking events in your TenderHub components. Each example is ready to copy and paste.

---

## 📍 Priority Implementations

### 1. Homepage (page.tsx)

#### Track CTA Clicks

```typescript
// Import at top
import { trackCtaClicked, trackPricingPlanSelected } from '@/lib/posthog/events';

// Update CTA button (line ~487-492)
<Button 
  onClick={() => {
    trackCtaClicked({
      ctaText: 'Start Getting Alerts',
      ctaLocation: 'workflow_section',
      ctaType: 'button',
      targetUrl: '/make-payment?plan=professional&amount=12353'
    });
  }}
  className="..."
>
  <Bell className="mr-2 h-5 w-5" />
  Start Getting Alerts
</Button>
```

#### Track Pricing Plan Selection

```typescript
// Update pricing card link (line ~581-591)
<Link 
  href={`/make-payment?plan=${plan.name.toLowerCase()}&amount=${plan.price}`}
  onClick={() => {
    trackPricingPlanSelected({
      planName: plan.name,
      planAmount: plan.price,
      timeToDecide: (Date.now() - pageLoadTime) / 1000
    });
  }}
>
  <Button className="...">Get Started</Button>
</Link>
```

#### Track FAQ Interactions

```typescript
// Import at top
import { trackFaqExpanded, trackFaqCollapsed } from '@/lib/posthog/events';

// Add state for timing
const [faqOpenTime, setFaqOpenTime] = React.useState<Record<number, number>>({});

// Update FAQ button (line ~617-631)
<button
  onClick={() => {
    const isOpening = openFaq !== index;
    
    if (isOpening) {
      setOpenFaq(index);
      setFaqOpenTime({ ...faqOpenTime, [index]: Date.now() });
      trackFaqExpanded({
        question: faq.question,
        questionIndex: index,
        timeToExpand: (Date.now() - pageLoadTime) / 1000
      });
    } else {
      setOpenFaq(null);
      const timeSpent = faqOpenTime[index] ? (Date.now() - faqOpenTime[index]) / 1000 : 0;
      trackFaqCollapsed({
        question: faq.question,
        questionIndex: index,
        timeSpentReading: timeSpent
      });
    }
  }}
  className="..."
>
  {/* FAQ content */}
</button>
```

#### Track Homepage Search

```typescript
// Import at top
import { trackHomepageSearchUsed } from '@/lib/posthog/events';

// Update SearchBar onSearch (line ~285)
<SearchBar 
  placeholder="Search tenders by keyword..."
  onSearch={(query) => {
    console.log('Searching for:', query);
    trackHomepageSearchUsed({
      query,
      source: 'hero',
      convertedToSignup: false // Update to true if they signup after
    });
  }}
  className="max-w-lg w-full"
/>
```

#### Track Scroll Depth

```typescript
// Add to useEffect
React.useEffect(() => {
  const pageLoadTime = Date.now();
  const scrollDepths = { 25: false, 50: false, 75: false, 100: false };

  const handleScroll = () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    Object.keys(scrollDepths).forEach(depth => {
      const depthNum = parseInt(depth);
      if (scrollPercent >= depthNum && !scrollDepths[depthNum]) {
        trackScrollDepth({
          depthPercentage: depthNum,
          pagePath: '/',
          timeToReachDepth: (Date.now() - pageLoadTime) / 1000
        });
        scrollDepths[depthNum] = true;
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

### 2. Payment Page (make-payment/page.tsx)

#### Track Payment Page View

```typescript
// Import at top
import { trackPaymentPageViewed, trackPaymentInitiated, trackPaymentFormFieldFilled } from '@/lib/posthog/events';

// Add to useEffect
useEffect(() => {
  trackPaymentPageViewed({
    plan: selectedPlan.name,
    amount: selectedPlan.amount,
    source: searchParams.get('source') || 'pricing_page'
  });
}, [selectedPlan, searchParams]);
```

#### Track Form Field Interactions

```typescript
// Track field completion
<Input
  id="name"
  name="name"
  value={formData.name}
  onChange={(e) => {
    handleInputChange(e);
    // Track validation
    if (e.target.value.length >= 2) {
      trackPaymentFormFieldFilled({
        fieldName: 'name',
        isValid: true
      });
    }
  }}
  onBlur={() => {
    trackFormFieldCompleted({
      formName: 'payment_form',
      fieldName: 'name',
      fieldIndex: 1,
      timeToComplete: (Date.now() - fieldStartTime) / 1000,
      isValid: formData.name.length >= 2
    });
  }}
  placeholder="Enter your full name"
  required
/>
```

#### Track Payment Initiation & Completion

```typescript
// In handlePayment function (line ~129)
const handlePayment = async () => {
  const paymentStartTime = Date.now();
  
  // ... existing validation ...

  trackPaymentInitiated({
    amount: formData.amount,
    currency: 'INR',
    plan: selectedPlan.name,
    isFirstPurchase: true, // Check if user has previous payments
    timeToInitiate: (Date.now() - pageLoadTime) / 1000
  });

  try {
    // ... create order ...
    
    // In handler success callback (line ~168)
    handler: async (response: RazorpayResponse) => {
      const verificationResult = await verifyPayment(response);
      
      if (verificationResult.success) {
        trackPaymentCompleted({
          orderId: response.razorpay_order_id,
          amount: formData.amount,
          currency: 'INR',
          plan: selectedPlan.name,
          paymentMethod: 'razorpay',
          transactionDuration: (Date.now() - paymentStartTime) / 1000
        });
        setPaymentStatus({ type: 'success', message: '...' });
      }
    },
    
    // In modal.ondismiss (line ~193)
    modal: {
      ondismiss: () => {
        trackPaymentFailed({
          amount: formData.amount,
          reason: 'user_cancelled',
          attemptNumber: 1
        });
        setPaymentStatus({ type: 'error', message: '...' });
      },
    },
  } catch (error) {
    trackPaymentFailed({
      amount: formData.amount,
      reason: error.message || 'unknown',
      errorCode: error.code,
      attemptNumber: 1
    });
  }
};
```

---

### 3. Dashboard Search (dashboard/search/page.tsx)

#### Enhanced Search Tracking

```typescript
// Update fetchTenders function (line ~112)
const fetchTenders = async (page = 1, query = '') => {
  const searchStartTime = Date.now();
  setLoading(true);
  
  try {
    // ... fetch logic ...
    const data: TenderResponse = await response.json();
    
    // Enhanced tracking
    trackTenderSearch({
      query: query || undefined,
      resultsCount: data.count || 0,
      page: page,
      searchDuration: Date.now() - searchStartTime,
      fromCache: data.cached || false
    });
    
  } catch (err) {
    // Track search errors
    trackError({
      errorName: 'SearchError',
      errorMessage: err.message,
      errorStack: err.stack,
      context: 'tender_search'
    });
  }
};
```

#### Track Tender View with Position

```typescript
// Update tender card (line ~333-367)
{tenders.map((tender, index) => (
  <div key={`${tender.ref_no}-${index}`}>
    {/* ... tender card ... */}
    <a
      href={tender.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackTenderExternalClick({
          tenderId: tender.ref_no,
          tenderTitle: tender.title,
          url: tender.url,
          position: index + 1, // Position in list
          timeSpentViewing: (Date.now() - tenderViewStartTime) / 1000
        });
      }}
    >
      <Button>
        <ExternalLink className="h-4 w-4 mr-2" />
        View
      </Button>
    </a>
  </div>
))}
```

#### Track Save for Later

```typescript
// Update Save button (line ~420-425)
<Button
  variant="outline"
  onClick={() => {
    // Add save logic here
    trackTenderSaved({
      tenderId: tender.ref_no,
      tenderTitle: tender.title,
      source: 'search_results',
      organization: tender.organisation
    });
  }}
  className="text-xs px-3 py-1.5 border-gray-300"
>
  Save for Later
</Button>
```

---

### 4. Dashboard Home (dashboard/page.tsx)

#### Track Dashboard Tab Changes

```typescript
// Import at top
import { trackDashboardTabChanged } from '@/lib/posthog/events';

// Add state
const [tabStartTime, setTabStartTime] = useState<number>(Date.now());
const [previousTab, setPreviousTab] = useState<string>('all');

// Update tab click handler (line ~110-122)
{tabs.map((tab) => (
  <button
    key={tab.id}
    onClick={() => {
      const timeOnPreviousTab = (Date.now() - tabStartTime) / 1000;
      
      trackDashboardTabChanged({
        fromTab: activeTab,
        toTab: tab.id,
        timeOnPreviousTab
      });
      
      setActiveTab(tab.id);
      setPreviousTab(activeTab);
      setTabStartTime(Date.now());
    }}
    className={...}
  >
    {tab.label}
  </button>
))}
```

#### Track Dashboard Search

```typescript
// Add search tracking (line ~95-100)
<input
  type="text"
  placeholder="Search..."
  onChange={(e) => {
    if (e.target.value.length >= 3) {
      trackDashboardSearchUsed({
        query: e.target.value,
        resultsCount: undefined, // Update with actual results
        location: 'dashboard_home'
      });
    }
  }}
  className="..."
/>
```

#### Track Feature Access

```typescript
// Track feature card clicks (line ~133-142)
{section.items.map((item) => (
  <Link
    key={item.label}
    href={item.href}
    onClick={() => {
      trackFeatureUsed({
        featureName: item.label,
        location: 'dashboard_home',
        successful: true
      });
    }}
    className="..."
  >
    {/* ... item content ... */}
  </Link>
))}
```

---

### 5. Email Signup Component (components/ui/email-signup.tsx)

#### Enhanced Email Tracking

```typescript
// Update handleSubmit (line ~18)
const [attemptCount, setAttemptCount] = useState(1);
const [componentLoadTime] = useState(Date.now());

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) return;

  setIsLoading(true);
  
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsSubmitted(true);
      trackEmailSignup({
        email: email,
        source: 'email_signup_component',
        success: true,
        attemptNumber: attemptCount
      });
      
      trackWaitlistJoined({
        email: email,
        source: 'email_signup_component',
        timeOnPageBeforeSignup: (Date.now() - componentLoadTime) / 1000,
        scrollDepth: (window.scrollY / document.body.scrollHeight) * 100
      });
      
      setEmail('');
    } else {
      console.error('Signup failed:', data.error);
      trackEmailSignup({
        email: email,
        source: 'email_signup_component',
        success: false,
        errorMessage: data.error,
        attemptNumber: attemptCount
      });
      setAttemptCount(attemptCount + 1);
      alert(data.error || 'Failed to join waitlist. Please try again.');
    }
  } catch (error) {
    console.error('Network error:', error);
    trackEmailSignup({
      email: email,
      source: 'email_signup_component',
      success: false,
      errorMessage: 'Network error',
      attemptNumber: attemptCount
    });
    alert('Network error. Please check your connection and try again.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 6. Header Navigation (components/Header.tsx)

#### Track Navigation Clicks

```typescript
// Already implemented! But enhance with destination tracking
const trackNavClick = (section: string, destination: string) => {
  posthog?.capture('header_navigation_clicked', {
    section,
    location: 'main_header',
    destination,
    timestamp: new Date().toISOString(),
  });
  
  // Also track with new function
  trackNavigationClicked({
    linkText: section,
    linkDestination: destination,
    navigationLocation: 'header'
  });
};
```

---

### 7. Waitlist Overlay (components/ui/waitlist-overlay.tsx)

#### Track Overlay Interactions

```typescript
// Add imports
import { trackWaitlistOverlayShown, trackWaitlistOverlayDismissed } from '@/lib/posthog/events';

// Track when shown
useEffect(() => {
  if (isOpen) {
    const showTime = Date.now();
    const secondsOnPage = (showTime - pageLoadTime) / 1000;
    
    trackWaitlistOverlayShown({
      triggerType: 'auto',
      secondsOnPage
    });
    
    setOverlayShowTime(showTime);
  }
}, [isOpen]);

// Track dismissal
const handleClose = (method: 'close_button' | 'outside_click' | 'escape_key') => {
  const timeBeforeDismiss = overlayShowTime ? (Date.now() - overlayShowTime) / 1000 : 0;
  
  trackWaitlistOverlayDismissed({
    dismissMethod: method,
    timeBeforeDismiss
  });
  
  setIsOpen(false);
};
```

---

## 🎯 Session & Page Tracking

### Add to Root Layout

```typescript
// In app/layout.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageEngagement, trackSessionQuality } from '@/lib/posthog/events';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    const pageLoadTime = Date.now();
    let clickCount = 0;
    
    const handleClick = () => clickCount++;
    const handleScroll = () => {
      // Track scroll depth
    };
    
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    
    // Track page engagement on leave
    const handleBeforeUnload = () => {
      const scrollDepth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      trackPageEngagement({
        pagePath: pathname,
        timeOnPage: (Date.now() - pageLoadTime) / 1000,
        scrollDepth: scrollDepth,
        clicksCount: clickCount
      });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      handleBeforeUnload();
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);
  
  return <html>{children}</html>;
}
```

---

## ✅ Testing Your Implementation

### 1. Enable PostHog Debug Mode

Already enabled in development! Check your browser console for:
```
✅ PostHog loaded successfully
📊 Autocapture enabled
📍 Pageview tracked: /
```

### 2. Test Each Event

1. **Homepage:**
   - Click pricing buttons → Check for `pricing_plan_selected`
   - Expand FAQ → Check for `faq_expanded`
   - Scroll page → Check for `scroll_depth_reached`
   - Click CTA → Check for `cta_clicked`

2. **Payment:**
   - Visit payment page → Check for `payment_page_viewed`
   - Fill form fields → Check for `payment_form_field_filled`
   - Complete payment → Check for `payment_completed`

3. **Dashboard:**
   - Switch tabs → Check for `dashboard_tab_changed`
   - Search tenders → Check for `tender_searched`
   - Click tender → Check for `tender_external_link_clicked`

### 3. Verify in PostHog Dashboard

1. Go to https://app.posthog.com
2. Navigate to **Activity** → **Events**
3. Filter by last hour
4. You should see all your custom events

---

## 🚀 Next Steps

1. ✅ Implement tracking in priority components (Homepage, Payment, Search)
2. ⏳ Set up PostHog dashboards for key metrics
3. ⏳ Create alerts for critical events
4. ⏳ A/B test CTAs and pricing
5. ⏳ Enable session recordings for UX insights

---

**Pro Tip:** Start with the most critical conversion points:
1. Homepage CTAs
2. Payment flow
3. Search functionality
4. Dashboard engagement

Then expand to other interactions once core tracking is validated.

