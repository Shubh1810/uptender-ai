# 👤 User Properties & Identification Guide

## Overview

This guide defines all user properties you should collect to create rich user profiles for segmentation, personalization, and analytics.

---

## 🎯 Core User Identification

### When to Call `identifyUser()`

Call immediately after:
- ✅ User signs up (new account created)
- ✅ User signs in (returning user)
- ✅ User completes payment
- ✅ User updates profile

```typescript
import { identifyUser } from '@/lib/posthog/events';

// After successful signup/signin
identifyUser({
  userId: user.id, // From Supabase auth
  email: user.email,
  name: user.user_metadata?.full_name || user.user_metadata?.name,
  signupDate: user.created_at,
  plan: 'free' // Update after payment
});
```

---

## 📊 User Properties to Track

### 1. Identity Properties (Set Once)

```typescript
{
  // Basic Identity
  user_id: string,              // Unique identifier from Supabase
  email: string,                 // User email
  name: string,                  // Full name
  phone: string,                 // Optional phone number
  
  // Account Creation
  signup_date: string,           // ISO timestamp of account creation
  signup_method: 'google' | 'email',
  signup_source: string,         // Where they signed up from
  signup_referrer: string,       // Traffic source
  signup_utm_source: string,
  signup_utm_medium: string,
  signup_utm_campaign: string,
  
  // Device (first used)
  first_device_type: 'mobile' | 'tablet' | 'desktop',
  first_browser: string,
  first_os: string,
  first_screen_resolution: string,
  first_language: string
}
```

### 2. Company/Organization Properties

```typescript
{
  // Company Info
  company_name: string,
  company_size: '1-10' | '11-50' | '51-200' | '201-500' | '501+',
  company_industry: string,      // Healthcare, Construction, IT, etc.
  company_country: string,
  company_state: string,
  company_city: string,
  
  // Business Details
  business_type: 'manufacturer' | 'supplier' | 'contractor' | 'consultant' | 'other',
  msme_registered: boolean,
  gst_number: string,           // If provided
  pan_number: string,           // If provided
  tender_categories: string[],  // Categories of interest
}
```

### 3. Subscription & Payment Properties

```typescript
{
  // Subscription Status
  plan: 'free' | 'basic' | 'professional' | 'enterprise',
  plan_amount: number,
  plan_currency: 'INR',
  subscription_status: 'trial' | 'active' | 'cancelled' | 'expired',
  subscription_start_date: string,
  subscription_end_date: string,
  is_paying_customer: boolean,
  
  // Payment History
  total_spent: number,
  first_payment_date: string,
  last_payment_date: string,
  payment_count: number,
  failed_payment_count: number,
  lifetime_value: number,
  
  // Billing
  preferred_payment_method: 'card' | 'upi' | 'netbanking' | 'wallet',
  auto_renewal: boolean,
}
```

### 4. Engagement & Activity Properties

```typescript
{
  // Overall Activity
  last_seen_date: string,
  total_sessions: number,
  total_time_spent_seconds: number,
  average_session_duration: number,
  total_pages_viewed: number,
  total_clicks: number,
  
  // Feature Usage
  tenders_searched: number,
  tenders_viewed: number,
  tenders_saved: number,
  tenders_external_clicked: number,
  searches_performed: number,
  filters_used: number,
  dashboard_visits: number,
  
  // Engagement Level
  engagement_score: number,      // 0-100 calculated score
  engagement_level: 'low' | 'medium' | 'high',
  is_power_user: boolean,        // High engagement flag
  days_since_last_visit: number,
  visit_frequency: 'daily' | 'weekly' | 'monthly' | 'inactive',
}
```

### 5. Behavioral Properties

```typescript
{
  // Preferences
  preferred_tender_categories: string[],
  preferred_states: string[],
  preferred_organizations: string[],
  notification_preferences: {
    email: boolean,
    sms: boolean,
    whatsapp: boolean
  },
  
  // Search Behavior
  most_searched_query: string,
  search_to_view_rate: number,   // % of searches that lead to views
  view_to_click_rate: number,    // % of views that lead to external clicks
  average_search_results_per_query: number,
  
  // Content Consumption
  average_scroll_depth: number,
  average_time_on_tender: number,
  preferred_device: 'mobile' | 'desktop',
  preferred_browser: string,
}
```

### 6. Onboarding & Lifecycle Properties

```typescript
{
  // Onboarding Status
  onboarding_completed: boolean,
  onboarding_completion_date: string,
  onboarding_steps_completed: number,
  onboarding_time_seconds: number,
  
  // Lifecycle Stage
  lifecycle_stage: 'prospect' | 'lead' | 'customer' | 'champion' | 'churned',
  is_new_user: boolean,          // < 7 days old
  is_returning_user: boolean,    // Has previous visits
  is_dormant_user: boolean,      // No activity > 30 days
  days_since_signup: number,
  
  // Activation
  is_activated: boolean,         // Completed key actions
  activation_date: string,
  time_to_activation_hours: number,
}
```

### 7. Risk & Quality Indicators

```typescript
{
  // Quality Indicators
  email_verified: boolean,
  phone_verified: boolean,
  profile_completed: boolean,
  profile_completion_percentage: number,
  
  // Risk Indicators
  payment_failures: number,
  support_tickets: number,
  error_rate: number,
  bounce_rate: number,
  churn_risk_score: number,      // 0-100 calculated score
  churn_risk_level: 'low' | 'medium' | 'high',
}
```

### 8. Marketing & Attribution

```typescript
{
  // Attribution
  first_touch_channel: string,
  last_touch_channel: string,
  conversion_channel: string,
  
  // Campaign Tracking
  latest_utm_source: string,
  latest_utm_medium: string,
  latest_utm_campaign: string,
  latest_utm_term: string,
  latest_utm_content: string,
  
  // Referral
  referred_by: string,           // If referred by another user
  referral_code: string,
  has_referred_users: boolean,
  total_referrals: number,
}
```

---

## 🔄 When to Update Properties

### Continuous Updates (Real-time)

```typescript
import { setUserProperties } from '@/lib/posthog/events';

// After every significant action
setUserProperties({
  last_seen_date: new Date().toISOString(),
  total_sessions: user.sessions + 1,
  tenders_viewed: user.tenders_viewed + 1
});
```

### Batch Updates (Periodic)

```typescript
// Calculate and update weekly
setUserProperties({
  engagement_score: calculateEngagementScore(user),
  engagement_level: user.engagement_score > 70 ? 'high' : 'medium',
  visit_frequency: determineVisitFrequency(user.visits),
  days_since_signup: Math.floor((Date.now() - new Date(user.signup_date).getTime()) / (1000 * 60 * 60 * 24)),
  churn_risk_score: calculateChurnRisk(user)
});
```

### Milestone Updates (Event-based)

```typescript
// When user completes payment
setUserProperties({
  is_paying_customer: true,
  plan: 'professional',
  first_payment_date: new Date().toISOString(),
  lifecycle_stage: 'customer',
  total_spent: amount,
  lifetime_value: amount
});

// When user completes onboarding
setUserProperties({
  onboarding_completed: true,
  onboarding_completion_date: new Date().toISOString(),
  is_activated: true,
  activation_date: new Date().toISOString()
});
```

---

## 📊 Calculated Properties

### Engagement Score Formula

```typescript
function calculateEngagementScore(user: User): number {
  let score = 0;
  
  // Activity recency (0-30 points)
  const daysSinceLastVisit = user.days_since_last_visit || 0;
  score += Math.max(0, 30 - daysSinceLastVisit);
  
  // Visit frequency (0-25 points)
  if (user.total_sessions > 50) score += 25;
  else if (user.total_sessions > 20) score += 20;
  else if (user.total_sessions > 10) score += 15;
  else if (user.total_sessions > 5) score += 10;
  else score += 5;
  
  // Feature usage (0-25 points)
  const featureUsage = (
    (user.tenders_searched > 0 ? 5 : 0) +
    (user.tenders_viewed > 10 ? 10 : user.tenders_viewed / 2) +
    (user.tenders_saved > 0 ? 5 : 0) +
    (user.tenders_external_clicked > 0 ? 5 : 0)
  );
  score += Math.min(25, featureUsage);
  
  // Payment status (0-20 points)
  if (user.is_paying_customer) score += 20;
  else if (user.payment_count > 0) score += 10;
  
  return Math.min(100, score);
}
```

### Churn Risk Formula

```typescript
function calculateChurnRisk(user: User): number {
  let riskScore = 0;
  
  // Inactivity risk (0-40 points)
  if (user.days_since_last_visit > 30) riskScore += 40;
  else if (user.days_since_last_visit > 14) riskScore += 25;
  else if (user.days_since_last_visit > 7) riskScore += 10;
  
  // Engagement risk (0-30 points)
  if (user.engagement_score < 30) riskScore += 30;
  else if (user.engagement_score < 50) riskScore += 15;
  
  // Payment failures (0-20 points)
  riskScore += Math.min(20, user.failed_payment_count * 5);
  
  // Support tickets (0-10 points)
  riskScore += Math.min(10, user.support_tickets * 2);
  
  return Math.min(100, riskScore);
}
```

---

## 🎯 Implementation in Dashboard Layout

```typescript
// In dashboard/layout.tsx
'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { identifyUser, setUserProperties } from '@/lib/posthog/events';

export default function DashboardLayout({ children }) {
  const supabase = createClient();
  
  useEffect(() => {
    const loadUserAndTrack = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Identify user
        identifyUser({
          userId: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name,
          signupDate: session.user.created_at
        });
        
        // Load additional user data from your database
        const { data: userData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (userData) {
          // Set comprehensive properties
          setUserProperties({
            // Company info
            company_name: userData.company_name,
            company_size: userData.company_size,
            company_industry: userData.industry,
            
            // Subscription
            plan: userData.plan || 'free',
            is_paying_customer: userData.plan !== 'free',
            
            // Activity stats (calculate from your events table)
            total_sessions: userData.session_count,
            tenders_viewed: userData.tenders_viewed_count,
            tenders_saved: userData.tenders_saved_count,
            
            // Calculated metrics
            engagement_score: calculateEngagementScore(userData),
            days_since_signup: Math.floor(
              (Date.now() - new Date(session.user.created_at).getTime()) / (1000 * 60 * 60 * 24)
            ),
            
            // Profile completion
            profile_completed: !!(
              userData.company_name && 
              userData.phone && 
              userData.company_industry
            )
          });
        }
        
        // Update last_seen
        await supabase
          .from('user_profiles')
          .update({ last_seen: new Date().toISOString() })
          .eq('user_id', session.user.id);
      }
    };
    
    loadUserAndTrack();
  }, []);
  
  return <>{children}</>;
}
```

---

## 🎯 Segmentation Examples

### High-Value Users
```
plan IN ['professional', 'enterprise']
AND engagement_score > 70
AND churn_risk_score < 30
```

### At-Risk Customers
```
is_paying_customer = true
AND days_since_last_visit > 7
AND churn_risk_score > 50
```

### Power Users (Champions)
```
total_sessions > 50
AND tenders_viewed > 100
AND engagement_score > 80
```

### Dormant Users (Re-engagement Campaign)
```
days_since_last_visit > 30
AND is_paying_customer = false
AND total_sessions > 5
```

### High-Intent Prospects
```
is_paying_customer = false
AND tenders_viewed > 20
AND tenders_saved > 5
AND days_since_signup < 30
```

---

## 📈 Analytics Queries to Run

### User Cohorts
- Signups by month/week
- Retention by cohort
- Conversion rate by cohort

### Engagement Analysis
- Active users (DAU/WAU/MAU)
- Feature adoption rates
- Power user identification

### Revenue Analysis
- MRR/ARR tracking
- Plan distribution
- Customer lifetime value

### Churn Analysis
- Churn rate by plan
- Churn indicators
- Win-back opportunities

---

**Last Updated:** October 28, 2025

