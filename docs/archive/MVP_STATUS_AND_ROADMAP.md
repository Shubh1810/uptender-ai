# TenderHub - MVP Status & Product Roadmap

**Last Updated:** January 6, 2026  
**Status:** Production Ready (Core Features)

---

## 🎯 Executive Summary

TenderHub is an AI-powered tender automation platform designed to help businesses discover, track, and win government tenders across India. The MVP is **production-ready** with core infrastructure in place, ready for user acquisition and monetization.

---

## ✅ COMPLETED FEATURES (Production Ready)

### 1. **Authentication & User Management** ⭐
- ✅ Google OAuth 2.0 integration via Supabase Auth
- ✅ Email/password authentication with secure password reset
- ✅ Session management and protected routes
- ✅ Supabase backend with scalable architecture
- **Status**: Fully functional, tested, and secure

### 2. **Landing Page & Marketing** ⭐
- ✅ Professional hero section with real-time tender count
- ✅ Feature showcase (6 AI-powered features)
- ✅ Pricing tiers (₹999, ₹1249, ₹1499/month)
- ✅ SEO-optimized FAQ section with structured data
- ✅ Email waitlist integration
- ✅ Cookie consent banner (GDPR compliant)
- ✅ Responsive design across all devices
- **Status**: Production-ready, SEO-optimized

### 3. **Tender Search & Discovery** ⭐⭐⭐ (Core Feature)
- ✅ Real-time search from Supabase database
- ✅ Advanced pagination (200 tenders per page)
- ✅ Tender details display:
  - Title, organization, reference number
  - Published, opening, and closing dates
  - External link to original tender
- ✅ LocalStorage caching for fast reloads
- ✅ Search query filtering
- ✅ Click tracking for analytics
- **Status**: Fully functional, optimized for performance

### 4. **Payment Integration** ⭐⭐
- ✅ Razorpay gateway integration
- ✅ Order creation and verification APIs
- ✅ Support for multiple pricing plans
- ✅ Secure payment handling
- **Status**: Functional, needs subscription linking

### 5. **Analytics & Tracking** ⭐
- ✅ PostHog integration for product analytics
- ✅ Event tracking:
  - User signups
  - Tender searches
  - External link clicks
  - Feature usage
- ✅ User property tracking
- **Status**: Fully integrated and collecting data

### 6. **Dashboard Infrastructure** ⭐⭐
- ✅ Modern glass-morphism design (macOS-inspired)
- ✅ Chrome-style tab navigation
- ✅ Sidebar with organized sections:
  - Tenders
  - Analytics
  - AI Workspace
  - Notifications
- ✅ Full dark mode support with monochrome minimal UI
- ✅ Responsive layout (mobile, tablet, desktop)
- **Status**: Production-ready, beautiful UI

### 7. **Email Infrastructure** ⭐
- ✅ Resend integration for transactional emails
- ✅ Welcome email template
- ✅ Notification email template
- **Status**: Ready for automation

---

## 🔨 PARTIALLY IMPLEMENTED FEATURES

These features exist as UI shells but lack backend logic:

| Feature | UI Status | Backend Status | Priority |
|---------|-----------|---------------|----------|
| **AI Bid Draft** | ✅ Shell | ❌ Not implemented | High |
| **AI Review** | ✅ Shell | ❌ Not implemented | Medium |
| **Smart Search** | ✅ Shell | ❌ Not implemented | High |
| **Document Generator** | ✅ Shell | ❌ Not implemented | Medium |
| **Compliance Checker** | ✅ Shell | ❌ Not implemented | Medium |
| **Bid Optimizer** | ✅ Shell | ❌ Not implemented | Low |
| **Competitor Intelligence** | ✅ Shell | ❌ Not implemented | High |
| **Tender Analytics** | ✅ Shell | ❌ Not implemented | Medium |
| **Watchlist** | ✅ Shell | ❌ Not implemented | **Critical** |
| **Alerts Manager** | ✅ Shell | ❌ Not implemented | High |

---

## 🚀 RECOMMENDED MVP+ ROADMAP

### **Phase 1: Core User Value (Weeks 1-2)** 🎯

#### 1.1 Tender Watchlist/Bookmarking ⭐⭐⭐ **CRITICAL**
**Priority:** Highest  
**Effort:** 2-3 days  
**Why:** Users need to save tenders they're interested in. This is table stakes for any tender platform.

**Implementation:**
- Create Supabase table: `saved_tenders`
  ```sql
  CREATE TABLE saved_tenders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tender_id TEXT NOT NULL,
    tender_title TEXT,
    tender_url TEXT,
    saved_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, tender_id)
  );
  ```
- Add "Save" button to each tender card
- Create `/dashboard/tenders` page to show saved tenders
- Add ability to remove from watchlist

**Success Metrics:**
- % of users who save at least 1 tender
- Average tenders saved per user
- Conversion rate from saved → clicked

---

#### 1.2 Email Notifications for New Tenders ⭐⭐⭐
**Priority:** Highest  
**Effort:** 3-4 days  
**Why:** Keeps users engaged without requiring them to log in daily. Drives retention.

**Implementation:**
- Create notification preferences in user profile
- Build email digest system using Resend
- Options:
  - Daily digest (7 AM IST)
  - Weekly digest (Monday 7 AM IST)
  - Real-time alerts (for premium users)
- Filter by user industry/location preferences
- Track email open rates and clicks

**Success Metrics:**
- Email open rate (target: 25%+)
- Click-through rate (target: 10%+)
- User retention improvement

---

#### 1.3 User Profile & Preferences ⭐⭐
**Priority:** High  
**Effort:** 2-3 days  
**Why:** Enables personalized tender matching and filtering.

**Implementation:**
- Add profile page: `/dashboard/profile`
- Collect:
  - Company name
  - Industry/sector (dropdown: Healthcare, IT, Construction, etc.)
  - Location (state/city)
  - Budget range (₹0-10L, ₹10L-1Cr, ₹1Cr+)
  - Notification preferences
- Store in Supabase `user_profiles` table
- Use for filtering and matching

**Success Metrics:**
- % of users who complete profile
- Correlation between completed profile and retention

---

#### 1.4 Advanced Tender Filtering ⭐⭐
**Priority:** High  
**Effort:** 2-3 days  
**Why:** Users need to narrow down thousands of tenders to relevant ones.

**Implementation:**
- Add filter UI to `/dashboard/search`:
  - Date range (published in last 7/30/90 days)
  - Closing date (closing in next 7/15/30 days)
  - Organization type (Central Govt, State Govt, PSU)
  - Location (state/region)
  - Estimated budget (if available)
- Update API to support filter params
- Save filter preferences per user

**Success Metrics:**
- % of searches using filters
- Time spent on search page
- Tenders clicked per session

---

### **Phase 2: AI Features (Weeks 3-4)** 🤖

#### 2.1 AI Tender Summarization ⭐⭐
**Priority:** High  
**Effort:** 3-4 days  
**Why:** Saves users hours of reading lengthy documents. Clear value prop.

**Implementation:**
- Integrate OpenAI API (GPT-4 or Claude)
- On tender page, show:
  - **Key Requirements**: What they need
  - **Eligibility**: Who can bid
  - **Budget**: Estimated value
  - **Deadlines**: Important dates
  - **Documents Required**: Checklist
- Cache summaries in Supabase to reduce API costs
- Limit to Premium/Enterprise plans

**Success Metrics:**
- % of users who view summaries
- Time saved per tender
- User satisfaction (survey)

---

#### 2.2 AI Tender Matching Score ⭐⭐
**Priority:** Medium  
**Effort:** 4-5 days  
**Why:** Core differentiator. Helps users focus on winnable tenders.

**Implementation:**
- Simple scoring algorithm (v1):
  - Location match: +30 points
  - Industry match: +30 points
  - Budget range match: +20 points
  - Past win rate: +20 points
- Display "Match Score" badge on each tender (0-100%)
- Sort tenders by match score by default
- V2: Use ML to learn from user behavior

**Success Metrics:**
- Correlation between match score and user engagement
- Conversion rate on high vs low match tenders
- User feedback on relevance

---

### **Phase 3: Monetization (Weeks 5-6)** 💰

#### 3.1 Subscription Management ⭐⭐⭐
**Priority:** Critical for revenue  
**Effort:** 3-4 days  
**Why:** Connect payments to user access. Start generating revenue.

**Implementation:**
- Create `subscriptions` table in Supabase:
  ```sql
  CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    plan_name TEXT NOT NULL,
    razorpay_subscription_id TEXT,
    status TEXT, -- active, cancelled, expired
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    amount INTEGER,
    UNIQUE(user_id)
  );
  ```
- Link Razorpay payment to subscription creation
- Show subscription status in dashboard
- Handle renewal/cancellation
- Send expiry reminder emails

**Success Metrics:**
- Monthly Recurring Revenue (MRR)
- Churn rate
- Lifetime Value (LTV)

---

#### 3.2 Feature Gating & Usage Limits ⭐⭐
**Priority:** High  
**Effort:** 2-3 days  
**Why:** Create clear value difference between plans. Drive upgrades.

**Plan Tiers:**

| Feature | Free | Basic (₹999) | Pro (₹1249) | Enterprise (₹1499) |
|---------|------|--------------|-------------|-------------------|
| Searches | 10/month | Unlimited | Unlimited | Unlimited |
| Saved Tenders | 5 | 50 | Unlimited | Unlimited |
| Email Alerts | ❌ | Weekly | Daily | Real-time |
| AI Summaries | ❌ | 10/month | 50/month | Unlimited |
| Match Score | ❌ | ✅ | ✅ | ✅ |
| Analytics | ❌ | Basic | Advanced | Custom |
| API Access | ❌ | ❌ | ❌ | ✅ |

**Implementation:**
- Add middleware to check plan limits
- Show "Upgrade" prompts when limits hit
- Track usage in Supabase
- Beautiful paywall UI

**Success Metrics:**
- Free-to-paid conversion rate
- Revenue per user
- Feature adoption by plan

---

### **Phase 4: Growth Features (Weeks 7-8)** 📈

#### 4.1 Referral Program
- Give 1 month free for each referral
- Track referral codes
- Leaderboard for top referrers

#### 4.2 Mobile App (React Native)
- Push notifications for tender alerts
- Quick save and bookmark
- Offline tender viewing

#### 4.3 WhatsApp Integration
- Send tender alerts via WhatsApp
- Two-way chatbot for search
- Use WhatsApp Business API

---

## 📊 SUCCESS METRICS TO TRACK

### **User Acquisition**
- Signups per day/week
- Source of signup (Google, email, organic)
- Landing page conversion rate

### **Activation**
- % of users who perform first search
- % of users who save first tender
- Time to first value

### **Engagement**
- Daily/Weekly Active Users (DAU/WAU)
- Searches per user per week
- Session duration
- Feature usage (which dashboard pages used)

### **Retention**
- Day 1, 7, 30 retention rates
- Churn rate by cohort
- Reasons for churn (exit survey)

### **Revenue**
- Monthly Recurring Revenue (MRR)
- Average Revenue Per User (ARPU)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV:CAC ratio (target: 3:1)

---

## 🎨 RECENT UI IMPROVEMENTS

### Dark Mode Tender Cards - Monochrome Minimal Design
**Updated:** January 6, 2026

Transformed tender search results from blue-heavy design to sleek monochrome aesthetic in dark mode:

**Changes:**
- ✅ Card backgrounds: `#18181b` (dark charcoal) instead of gray-800
- ✅ Borders: `white/[0.08]` (subtle white outline) for minimal look
- ✅ Text: White with varying opacity (90%, 70%, 50%, 40%) for hierarchy
- ✅ Buttons: Black on white in light mode, white on black in dark mode
- ✅ Icons: Monochrome with 30-40% opacity
- ✅ Badges: Subtle white/[0.08] backgrounds instead of blue
- ✅ Loading spinner: Monochrome progress circle
- ✅ Search bar: Minimal with refined borders
- ✅ Pagination: Consistent monochrome styling

**Result:** Clean, modern, professional look that reduces visual noise and improves readability in dark mode.

---

## 🔥 IMMEDIATE ACTION ITEMS (This Week)

1. **Implement Tender Watchlist** (3 days)
   - Highest user value
   - Easiest to implement
   - Foundation for other features

2. **Set up Email Notifications** (3 days)
   - Critical for retention
   - Use existing Resend integration

3. **Add User Profile Page** (2 days)
   - Required for personalization
   - Quick win

4. **Connect Payments to Subscriptions** (2 days)
   - Start generating revenue
   - Track MRR

---

## 🎯 30-DAY GOAL

**Target:** Launch full MVP with paying customers

- ✅ Week 1: Watchlist + Profile
- ✅ Week 2: Email notifications + Filtering
- ✅ Week 3: Subscription management + Paywalls
- ✅ Week 4: AI Summarization (Premium feature)

**Success Definition:**
- 100+ signups
- 10+ paying customers
- ₹15,000+ MRR
- 40% D7 retention

---

## 📞 NEXT STEPS

1. Review this roadmap and prioritize based on your goals
2. Set up analytics dashboard in PostHog for key metrics
3. Start building Phase 1 features (Watchlist is highest priority)
4. Consider user interviews to validate feature priorities
5. Plan go-to-market strategy for launch

---

**Questions?** Let's discuss which features to prioritize based on your timeline and resources.

