# 📊 Comprehensive Analytics & User Tracking Guide - TenderHub

## 🎯 Overview

This document outlines the complete analytics and user tracking system implemented in TenderHub using PostHog. Our implementation follows industry best practices and is designed to provide deep insights into user behavior, conversion funnels, and engagement metrics.

---

## ✅ PostHog Best Practices Applied

Based on PostHog's official documentation and recommendations:

### 1. **Consistent Naming Conventions**
- ✅ All events use `snake_case` formatting
- ✅ Present-tense verbs for clarity
- ✅ Descriptive property names
- ✅ Structured event categories

### 2. **Rich Event Properties**
- ✅ Timestamps on all events
- ✅ User context (device, screen size, user agent)
- ✅ Behavioral metadata (time spent, scroll depth, clicks)
- ✅ Conversion tracking properties
- ✅ UTM parameters for campaign tracking

### 3. **User Journey Tracking**
- ✅ Complete funnel tracking from landing to conversion
- ✅ Session quality metrics
- ✅ Engagement depth measurement
- ✅ Drop-off point identification

### 4. **Event Versioning & Structure**
- ✅ Categorized events for easy filtering
- ✅ Scalable event structure
- ✅ Backward compatible additions

---

## 📋 Complete Event Catalog

### 🔐 Authentication Events

#### `user_signed_up`
Tracks new user registrations
**Properties:**
- `auth_method`: 'google' | 'email'
- `signup_source`: Where the signup originated
- `referrer`: Traffic source
- `utm_source`, `utm_medium`, `utm_campaign`: Marketing attribution
- `user_agent`: Browser information
- `screen_width`, `screen_height`: Device metrics

**Use Case:** Measure signup conversion rates, identify best signup sources

#### `user_signed_in`
Tracks user login events
**Properties:**
- `auth_method`: Login method used
- `user_id`: Unique identifier
- `is_returning_user`: Boolean flag
- `last_login_days_ago`: Days since last visit

**Use Case:** Track returning user engagement, analyze login patterns

#### `user_signed_out`
Tracks logout events
**Properties:**
- `session_duration_seconds`: Total session length
- `pages_viewed`: Number of pages visited
- `actions_performed`: Total interactions

**Use Case:** Understand session duration, user engagement levels

---

### 🔍 Tender Search & Discovery Events

#### `tender_searched`
Tracks tender search queries
**Properties:**
- `search_query`: Search term used
- `results_count`: Number of results returned
- `page_number`: Current page in results
- `has_query`: Boolean if query was provided
- `search_filters_applied`: Number of filters used
- `search_duration_ms`: API response time
- `from_cache`: Boolean if results came from cache
- `query_length`: Character count

**Use Case:** Optimize search UX, understand user intent, improve result quality

#### `search_filter_applied`
Tracks filter usage
**Properties:**
- `filter_type`: Type of filter applied
- `filter_value`: Selected filter value
- `results_after_filter`: Filtered result count

**Use Case:** Identify most-used filters, optimize filter UI

#### `tender_viewed`
Tracks individual tender clicks
**Properties:**
- `tender_id`, `tender_title`, `organization`: Tender details
- `view_source`: Where the tender was clicked from
- `closing_date`: Tender deadline
- `tender_amount`: Value
- `position_in_list`: Ranking in search results

**Use Case:** Measure tender engagement, A/B test result ordering

#### `tender_external_link_clicked`
Tracks external tender site visits
**Properties:**
- `tender_id`, `tender_title`: Tender details
- `external_url`: Destination URL
- `position_in_list`: Position in results
- `time_spent_viewing_seconds`: Time before clicking

**Use Case:** Conversion tracking, measure user commitment

#### `tender_saved`
Tracks tender bookmarking
**Properties:**
- `tender_id`, `tender_title`, `organization`: Tender details
- `save_source`: Where tender was saved from

**Use Case:** Understand user interest patterns, feature adoption

---

### 💳 Payment & Subscription Events

#### `payment_page_viewed`
Tracks payment page visits
**Properties:**
- `plan`: Selected plan name
- `amount`: Payment amount
- `source`: Referring page

**Use Case:** Measure payment funnel entry, identify drop-off points

#### `payment_form_field_filled`
Tracks form field completion
**Properties:**
- `field_name`: Field identifier
- `is_valid`: Validation status

**Use Case:** Identify form friction points, validation issues

#### `payment_initiated`
Tracks payment gateway opening
**Properties:**
- `amount`, `currency`, `plan`: Payment details
- `payment_method`: Selected payment type
- `is_first_purchase`: Boolean flag
- `time_to_initiate_seconds`: Time from page load to initiation

**Use Case:** Analyze payment hesitation, method preferences

#### `payment_completed`
Tracks successful payments
**Properties:**
- `order_id`: Transaction reference
- `amount`, `currency`, `plan`: Payment details
- `payment_method`: Method used
- `transaction_duration_seconds`: Time to complete

**Use Case:** Conversion tracking, revenue analytics

#### `payment_failed`
Tracks payment failures
**Properties:**
- `order_id`, `amount`: Transaction details
- `failure_reason`, `error_code`: Error information
- `attempt_number`: Retry count

**Use Case:** Identify payment issues, improve success rates

---

### 📧 Waitlist & Email Signup Events

#### `waitlist_joined`
Tracks waitlist signups
**Properties:**
- `email`: User email
- `signup_source`: Origin point
- `time_on_page_seconds`: Engagement time before signup
- `scroll_depth_percentage`: Page scroll depth
- `utm_source`, `utm_medium`: Marketing attribution

**Use Case:** Measure pre-launch interest, campaign effectiveness

#### `waitlist_overlay_shown`
Tracks modal display
**Properties:**
- `trigger_type`: 'auto' | 'manual' | 'scroll' | 'time'
- `seconds_on_page`: Time before showing

**Use Case:** Optimize modal timing, reduce abandonment

#### `waitlist_overlay_dismissed`
Tracks modal closures
**Properties:**
- `dismiss_method`: How modal was closed
- `time_before_dismiss_seconds`: Engagement time

**Use Case:** Understand user objections, improve conversion

#### `email_signup`
Tracks email captures
**Properties:**
- `email`, `signup_source`: Signup details
- `success`: Boolean outcome
- `error_message`: If failed
- `attempt_number`: Retry count

**Use Case:** Measure email capture effectiveness

---

### 📊 Dashboard & Feature Usage Events

#### `dashboard_viewed`
Tracks dashboard access
**Properties:**
- `section`: Dashboard area viewed
- `is_first_visit`: Boolean flag
- `previous_section`: Navigation history

**Use Case:** Understand dashboard navigation, feature discovery

#### `dashboard_tab_changed`
Tracks tab switching
**Properties:**
- `from_tab`, `to_tab`: Tab navigation
- `time_on_previous_tab_seconds`: Engagement time

**Use Case:** Identify most-used features, optimize layout

#### `dashboard_search_used`
Tracks in-dashboard search
**Properties:**
- `search_query`: Search term
- `results_count`: Results returned
- `location`: Search bar location
- `query_length`: Character count

**Use Case:** Improve internal search, understand user needs

#### `feature_used`
Tracks specific feature interactions
**Properties:**
- `feature_name`: Feature identifier
- `location`: Where feature was accessed
- `time_spent_seconds`: Usage duration
- `successful`: Boolean outcome

**Use Case:** Feature adoption tracking, UX improvements

---

### 🏠 Homepage & Landing Page Events

#### `cta_clicked`
Tracks call-to-action clicks
**Properties:**
- `cta_text`: Button/link text
- `cta_location`: Page section
- `cta_type`: 'button' | 'link' | 'banner'
- `target_url`: Destination

**Use Case:** A/B test CTAs, optimize conversion paths

#### `pricing_plan_viewed`
Tracks pricing plan views
**Properties:**
- `plan_name`, `plan_amount`: Plan details
- `view_duration_seconds`: Time spent viewing

**Use Case:** Understand pricing consideration, optimize pricing page

#### `pricing_plan_selected`
Tracks plan selection
**Properties:**
- `plan_name`, `plan_amount`: Selected plan
- `previous_plan`: If changed
- `time_to_decide_seconds`: Decision time

**Use Case:** Analyze pricing preferences, optimize offerings

#### `faq_expanded` / `faq_collapsed`
Tracks FAQ interactions
**Properties:**
- `faq_question`, `faq_index`: Question details
- `time_to_expand_seconds` / `time_spent_reading_seconds`: Engagement

**Use Case:** Identify common questions, improve documentation

#### `feature_card_viewed`
Tracks feature visibility
**Properties:**
- `feature_title`, `feature_index`: Feature details
- `scroll_depth_percentage`: Visibility depth

**Use Case:** Measure feature awareness, optimize positioning

#### `scroll_depth_reached`
Tracks page scrolling
**Properties:**
- `depth_percentage`: Scroll depth milestone (25%, 50%, 75%, 100%)
- `page_path`: Current page
- `time_to_reach_seconds`: Time to scroll depth

**Use Case:** Understand content engagement, identify drop-off points

#### `homepage_search_used`
Tracks homepage search bar
**Properties:**
- `search_query`: Search term
- `search_source`: 'hero' | 'cta' | 'banner'
- `converted_to_signup`: Boolean conversion

**Use Case:** Measure search-to-signup conversion

---

### 📝 Form Interaction Events

#### `form_started`
Tracks form initiation
**Properties:**
- `form_name`, `form_location`: Form identification
- `fields_count`: Number of fields

**Use Case:** Measure form engagement start

#### `form_field_focused`
Tracks field focus
**Properties:**
- `form_name`, `field_name`, `field_index`: Field details

**Use Case:** Identify field interaction patterns

#### `form_field_completed`
Tracks field completion
**Properties:**
- `form_name`, `field_name`, `field_index`: Field details
- `time_to_complete_seconds`: Completion time
- `is_valid`: Validation status

**Use Case:** Identify slow/problematic fields

#### `form_field_error`
Tracks validation errors
**Properties:**
- `form_name`, `field_name`: Field details
- `error_type`, `error_message`: Error information
- `attempt_number`: Retry count

**Use Case:** Improve validation, reduce errors

#### `form_submitted`
Tracks form submission
**Properties:**
- `form_name`, `form_location`: Form details
- `time_to_complete_seconds`: Total time
- `fields_completed`, `total_fields`: Completion stats
- `completion_rate`: Percentage
- `success`: Boolean outcome

**Use Case:** Measure form completion rates, optimize UX

#### `form_abandoned`
Tracks form abandonment
**Properties:**
- `form_name`, `form_location`: Form details
- `fields_completed`, `total_fields`: Progress stats
- `last_field_completed`: Last interaction
- `time_spent_seconds`: Time before abandoning
- `abandonment_rate`: Percentage

**Use Case:** Identify abandonment points, reduce drop-off

---

### 🎓 Onboarding & User Journey Events

#### `onboarding_step_viewed`
Tracks onboarding step views
**Properties:**
- `step_number`, `step_name`: Step details
- `is_first_time`: Boolean flag

**Use Case:** Track onboarding progression

#### `onboarding_step_completed`
Tracks step completion
**Properties:**
- `step_number`, `step_name`: Step details
- `time_to_complete_seconds`: Completion time
- `skipped`: Boolean flag

**Use Case:** Identify friction points, optimize flow

#### `onboarding_completed`
Tracks full onboarding completion
**Properties:**
- `total_steps`, `steps_completed`: Progress stats
- `total_time_seconds`: Total time
- `completion_rate_percentage`: Success rate

**Use Case:** Measure onboarding effectiveness

#### `onboarding_abandoned`
Tracks onboarding drop-off
**Properties:**
- `last_step_completed`, `last_step_name`: Exit point
- `total_steps`: Total available
- `time_spent_seconds`: Time invested
- `abandonment_point_percentage`: Progress percentage

**Use Case:** Identify problematic onboarding steps

---

### 📈 User Engagement & Session Metrics

#### `page_engagement`
Tracks page-level engagement
**Properties:**
- `page_path`: Current page
- `time_on_page_seconds`: Duration
- `scroll_depth_percentage`: Scroll depth
- `clicks_count`: Total clicks
- `estimated_reading_time_seconds`: Content engagement

**Use Case:** Understand content engagement, optimize pages

#### `session_quality`
Tracks overall session quality
**Properties:**
- `session_duration_seconds`: Total time
- `pages_visited`: Page count
- `events_count`: Total interactions
- `bounced`: Boolean flag
- `converted`: Boolean flag

**Use Case:** Segment high-quality vs low-quality sessions

#### `user_inactive`
Tracks inactivity periods
**Properties:**
- `inactive_duration_seconds`: Idle time
- `current_page`: Where user is idle
- `last_action`: Last interaction

**Use Case:** Identify engagement drop-off, trigger re-engagement

#### `user_returned`
Tracks return from inactivity
**Properties:**
- `return_after_seconds`: Idle duration
- `current_page`: Return location

**Use Case:** Measure content stickiness

---

### 🎬 Video & Media Events

#### `video_played`
Tracks video playback
**Properties:**
- `video_title`, `video_location`: Video details
- `autoplay`: Boolean flag

**Use Case:** Measure video engagement

#### `video_completed`
Tracks video completion
**Properties:**
- `video_title`: Video identifier
- `video_duration_seconds`: Length
- `completion_rate_percentage`: Percentage watched

**Use Case:** Understand content engagement depth

---

### 🏆 Social Proof & Trust Events

#### `trust_badge_clicked`
Tracks badge interactions
**Properties:**
- `badge_name`: Badge identifier
- `badge_position`: Display position

**Use Case:** Measure trust signal effectiveness

#### `social_proof_viewed`
Tracks proof element visibility
**Properties:**
- `proof_type`: 'testimonial' | 'stat' | 'logo' | 'badge'
- `content`: Proof text/identifier
- `position`: Display position

**Use Case:** Optimize social proof placement

---

## 🎯 User Properties & Identification

### Enhanced User Identification

Use `identifyUser()` to track user details:

```typescript
import { identifyUser } from '@/lib/posthog/events';

identifyUser({
  userId: 'user_12345',
  email: 'user@example.com',
  name: 'John Doe',
  signupDate: '2025-01-01',
  plan: 'professional'
});
```

### Person Properties

Set additional user properties anytime:

```typescript
import { setUserProperties } from '@/lib/posthog/events';

setUserProperties({
  company: 'Acme Corp',
  industry: 'Healthcare',
  company_size: '50-200',
  role: 'Procurement Manager',
  phone_verified: true,
  email_verified: true,
  onboarding_completed: true,
  first_payment_date: '2025-01-15',
  lifetime_value: 12353,
  tenders_viewed: 145,
  tenders_saved: 23,
  searches_performed: 67
});
```

---

## 📊 Key Analytics Use Cases

### 1. **Conversion Funnel Analysis**

Track complete user journey:
```
Homepage Visit → Email Signup → Account Creation → Dashboard Visit → 
First Search → Tender View → External Click → Payment Initiation → Payment Completion
```

### 2. **User Segmentation**

Segment users by:
- **Engagement Level:** Time on site, pages viewed, features used
- **Intent:** Search queries, tenders viewed, pricing plans explored
- **Conversion Stage:** Waitlist, signed up, paid, active user
- **Demographics:** Industry, company size, role
- **Behavior:** Returning vs new, mobile vs desktop, traffic source

### 3. **Feature Adoption Tracking**

Measure:
- Dashboard feature usage rates
- Search vs browse behavior
- Filter adoption
- Save/bookmark feature usage
- Mobile app engagement (when available)

### 4. **Revenue Analytics**

Track:
- Plan preference (Basic vs Professional vs Enterprise)
- Payment method distribution
- Time from signup to payment
- Failed payment recovery
- Lifetime value by cohort

### 5. **User Experience Optimization**

Identify:
- Page abandonment points
- Form field friction
- Search result quality
- Loading time impact on conversion
- Mobile vs desktop experience gaps

### 6. **Marketing Attribution**

Track:
- UTM campaign performance
- Referral sources
- Channel-specific conversion rates
- Landing page effectiveness
- Email campaign ROI

---

## 🔧 Implementation Examples

### Homepage CTA Tracking

```typescript
import { trackCtaClicked } from '@/lib/posthog/events';

<Button onClick={() => {
  trackCtaClicked({
    ctaText: 'Start Getting Alerts',
    ctaLocation: 'hero_section',
    ctaType: 'button',
    targetUrl: '/make-payment'
  });
}}>
  Start Getting Alerts
</Button>
```

### Form Field Tracking

```typescript
import { trackFormFieldFocused, trackFormFieldCompleted } from '@/lib/posthog/events';

<Input
  onFocus={() => trackFormFieldFocused({
    formName: 'payment_form',
    fieldName: 'email',
    fieldIndex: 1
  })}
  onBlur={(e) => trackFormFieldCompleted({
    formName: 'payment_form',
    fieldName: 'email',
    fieldIndex: 1,
    timeToComplete: Date.now() - startTime,
    isValid: validateEmail(e.target.value)
  })}
/>
```

### Scroll Depth Tracking

```typescript
import { trackScrollDepth } from '@/lib/posthog/events';

useEffect(() => {
  const handleScroll = () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent >= 25 && !tracked25) {
      trackScrollDepth({ depthPercentage: 25, pagePath: window.location.pathname, timeToReachDepth: Date.now() - pageLoadTime });
      setTracked25(true);
    }
    // Repeat for 50%, 75%, 100%
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

---

## 📈 Dashboard & Reporting Recommendations

### Essential Dashboards to Create in PostHog

1. **Conversion Funnel Dashboard**
   - Homepage visits → Signups → Payments
   - Identify biggest drop-off points
   - A/B test variations

2. **User Engagement Dashboard**
   - Daily/Weekly/Monthly active users
   - Session duration trends
   - Feature adoption rates
   - Retention cohorts

3. **Revenue Dashboard**
   - MRR (Monthly Recurring Revenue)
   - Plan distribution
   - Payment success rates
   - Customer lifetime value

4. **Product Analytics Dashboard**
   - Most searched queries
   - Most viewed tenders
   - Feature usage heatmap
   - Error rates by page

5. **Marketing Performance Dashboard**
   - Traffic source breakdown
   - UTM campaign performance
   - Landing page conversion rates
   - Email campaign effectiveness

---

## 🎯 Client Onboarding Insights

### Key Metrics to Present to Clients

1. **User Acquisition:**
   - Total signups (weekly/monthly trend)
   - Signup sources breakdown
   - Campaign ROI

2. **User Engagement:**
   - Average session duration
   - Pages per session
   - Feature adoption rates
   - Returning user percentage

3. **Conversion Metrics:**
   - Signup → Payment conversion rate
   - Time to first payment
   - Plan preference distribution

4. **User Behavior:**
   - Most searched tender categories
   - Average tenders viewed per session
   - Save/bookmark rates
   - External link click-through rates

5. **Technical Performance:**
   - Page load times
   - Search response times
   - Error rates
   - Mobile vs desktop usage

---

## 🚀 Next Steps

### Immediate Actions:

1. ✅ **Enhanced event tracking implemented** (DONE)
2. ⏳ **Integrate tracking into components** (NEXT)
3. ⏳ **Set up PostHog dashboards**
4. ⏳ **Create alert triggers for critical metrics**
5. ⏳ **A/B test key conversion points**

### Future Enhancements:

1. **Session Recordings:** Enable for error debugging
2. **Feature Flags:** A/B test new features
3. **Cohort Analysis:** Track user retention
4. **Heatmaps:** Visualize click patterns
5. **User Interviews:** Qualitative insights

---

## 📞 Support & Resources

- **PostHog Docs:** https://posthog.com/docs
- **Event Tracking Guide:** https://posthog.com/tutorials/event-tracking-guide
- **Best Practices:** https://posthog.com/docs/product-analytics/best-practices
- **Funnel Analysis:** https://posthog.com/docs/product-analytics/funnels

---

**Last Updated:** October 28, 2025
**Version:** 2.0 - Comprehensive Analytics Edition

