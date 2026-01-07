# Quick Implementation Guide - Top Priority Features

**Goal:** Get TenderHub from MVP to revenue-generating product in 2 weeks  
**Focus:** Implement the 4 highest-value features first

---

## 🎯 Feature 1: Tender Watchlist (Days 1-3)

### Why This First?
- **Highest user value:** Users need to save tenders they're interested in
- **Easiest to implement:** Simple CRUD operations
- **Enables other features:** Foundation for email notifications and analytics
- **Clear success metric:** % of users who save at least 1 tender

### Implementation Steps

#### Step 1: Create Supabase Table (15 minutes)

```sql
-- Run in Supabase SQL Editor

CREATE TABLE saved_tenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tender_id TEXT NOT NULL,
  tender_title TEXT NOT NULL,
  tender_url TEXT NOT NULL,
  tender_organisation TEXT,
  tender_closing_date TIMESTAMP,
  saved_at TIMESTAMP DEFAULT NOW(),
  notes TEXT, -- Optional: User's notes about this tender
  UNIQUE(user_id, tender_id)
);

-- Create index for faster queries
CREATE INDEX idx_saved_tenders_user_id ON saved_tenders(user_id);
CREATE INDEX idx_saved_tenders_saved_at ON saved_tenders(saved_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE saved_tenders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own saved tenders
CREATE POLICY "Users can view own saved tenders"
  ON saved_tenders FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own saved tenders
CREATE POLICY "Users can insert own saved tenders"
  ON saved_tenders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own saved tenders
CREATE POLICY "Users can delete own saved tenders"
  ON saved_tenders FOR DELETE
  USING (auth.uid() = user_id);
```

#### Step 2: Create API Route (30 minutes)

Create `/src/app/api/saved-tenders/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch saved tenders
    const { data, error } = await supabase
      .from('saved_tenders')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved_tenders: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tender_id, tender_title, tender_url, tender_organisation, tender_closing_date } = body;

    // Validate required fields
    if (!tender_id || !tender_title || !tender_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert saved tender
    const { data, error } = await supabase
      .from('saved_tenders')
      .insert({
        user_id: user.id,
        tender_id,
        tender_title,
        tender_url,
        tender_organisation,
        tender_closing_date,
      })
      .select()
      .single();

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Tender already saved' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, saved_tender: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tender_id = searchParams.get('tender_id');

    if (!tender_id) {
      return NextResponse.json({ error: 'Missing tender_id' }, { status: 400 });
    }

    // Delete saved tender
    const { error } = await supabase
      .from('saved_tenders')
      .delete()
      .eq('user_id', user.id)
      .eq('tender_id', tender_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

#### Step 3: Update Search Page with Save Button (1 hour)

Update `/src/app/dashboard/search/page.tsx`:

```typescript
// Add state for saved tenders
const [savedTenderIds, setSavedTenderIds] = useState<Set<string>>(new Set());

// Fetch saved tenders on mount
useEffect(() => {
  const fetchSavedTenders = async () => {
    try {
      const response = await fetch('/api/saved-tenders');
      const data = await response.json();
      
      if (response.ok && data.saved_tenders) {
        const ids = new Set(data.saved_tenders.map((t: any) => t.tender_id));
        setSavedTenderIds(ids);
      }
    } catch (error) {
      console.error('Error fetching saved tenders:', error);
    }
  };
  
  if (user) {
    fetchSavedTenders();
  }
}, [user]);

// Save tender handler
const handleSaveTender = async (tender: Tender) => {
  try {
    const response = await fetch('/api/saved-tenders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tender_id: tender.ref_no,
        tender_title: tender.title,
        tender_url: tender.url,
        tender_organisation: tender.organisation,
        tender_closing_date: tender.closing_date,
      }),
    });

    if (response.ok) {
      setSavedTenderIds(prev => new Set([...prev, tender.ref_no]));
      // Show success toast
    } else {
      const data = await response.json();
      // Show error toast
    }
  } catch (error) {
    console.error('Error saving tender:', error);
  }
};

// Unsave tender handler
const handleUnsaveTender = async (tender_id: string) => {
  try {
    const response = await fetch(`/api/saved-tenders?tender_id=${tender_id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setSavedTenderIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tender_id);
        return newSet;
      });
    }
  } catch (error) {
    console.error('Error unsaving tender:', error);
  }
};

// Update the "Save for Later" button in the tender card:
<Button
  variant="outline"
  onClick={() => {
    if (savedTenderIds.has(tender.ref_no)) {
      handleUnsaveTender(tender.ref_no);
    } else {
      handleSaveTender(tender);
    }
  }}
  className="text-xs px-3 py-1.5 h-7 border-gray-300 dark:border-white/[0.12] dark:text-white/70 dark:hover:bg-white/[0.06] dark:hover:border-white/[0.16] transition-colors"
>
  {savedTenderIds.has(tender.ref_no) ? (
    <>
      <Heart className="h-3 w-3 mr-1.5 fill-current" />
      Saved
    </>
  ) : (
    <>
      <Heart className="h-3 w-3 mr-1.5" />
      Save
    </>
  )}
</Button>
```

#### Step 4: Create "My Tenders" Page (1 hour)

Update `/src/app/dashboard/tenders/page.tsx`:

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Heart, ExternalLink, Calendar, Building, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SavedTender {
  id: string;
  tender_id: string;
  tender_title: string;
  tender_url: string;
  tender_organisation: string;
  tender_closing_date: string;
  saved_at: string;
}

export default function MyTendersPage() {
  const [savedTenders, setSavedTenders] = useState<SavedTender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedTenders();
  }, []);

  const fetchSavedTenders = async () => {
    try {
      const response = await fetch('/api/saved-tenders');
      const data = await response.json();
      
      if (response.ok) {
        setSavedTenders(data.saved_tenders);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tender_id: string) => {
    try {
      const response = await fetch(`/api/saved-tenders?tender_id=${tender_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedTenders(prev => prev.filter(t => t.tender_id !== tender_id));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (savedTenders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <Heart className="w-16 h-16 text-gray-300 dark:text-white/[0.15] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            No saved tenders yet
          </h2>
          <p className="text-gray-600 dark:text-white/60">
            Start searching and save tenders to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 pt-2">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Saved Tenders</h1>
        <p className="text-gray-600 dark:text-gray-400">{savedTenders.length} tenders saved</p>
      </div>

      <div className="space-y-3">
        {savedTenders.map((tender) => (
          <div
            key={tender.id}
            className="bg-white dark:bg-[#18181b] rounded-lg border border-gray-200 dark:border-white/[0.08] p-5 hover:shadow-md dark:hover:border-white/[0.12] transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white/90 mb-2 leading-snug">
                  {tender.tender_title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/50">
                  <Building className="h-3.5 w-3.5" />
                  <span>{tender.tender_organisation}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <a
                  href={tender.tender_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-gray-900 dark:bg-white dark:text-black text-white text-sm px-4 py-2 h-9">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(tender.tender_id)}
                  className="h-9 px-3 dark:border-white/[0.12] dark:text-white/70 dark:hover:bg-white/[0.06]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-white/30" />
                <span className="text-gray-600 dark:text-white/50">
                  Closing: {new Date(tender.tender_closing_date).toLocaleDateString()}
                </span>
              </div>
              <div className="text-gray-400 dark:text-white/40">
                Saved {new Date(tender.saved_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Step 5: Track Analytics (30 minutes)

Add PostHog events in `/src/lib/posthog/events.ts`:

```typescript
export const trackTenderSaved = (properties: {
  tenderId: string;
  tenderTitle: string;
  organisation: string;
}) => {
  if (typeof window !== 'undefined') {
    posthog.capture('tender_saved', properties);
  }
};

export const trackTenderUnsaved = (properties: {
  tenderId: string;
}) => {
  if (typeof window !== 'undefined') {
    posthog.capture('tender_unsaved', properties);
  }
};
```

---

## 🎯 Feature 2: User Profile & Preferences (Days 4-5)

### Why This Next?
- **Enables personalization:** Required for tender matching
- **Improves relevance:** Filter tenders by user interests
- **Quick to build:** Simple form + database table

### Implementation Steps

#### Step 1: Create Supabase Table (15 minutes)

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT,
  industry TEXT[], -- Array of industries
  location TEXT[], -- Array of locations (states/cities)
  budget_range TEXT, -- e.g., "0-10L", "10L-1Cr", "1Cr+"
  notification_preferences JSONB DEFAULT '{"email_daily": false, "email_weekly": true}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### Step 2: Create Profile Page (2 hours)

Create `/src/app/dashboard/profile/page.tsx` - Full implementation with form, validation, and API integration.

---

## 🎯 Feature 3: Email Notifications (Days 6-8)

### Why This Next?
- **Drives retention:** Users come back without opening app
- **Increases engagement:** Regular touchpoints
- **Uses existing Resend integration**

### Implementation Overview

1. **Create notification queue table** in Supabase
2. **Build daily/weekly digest generator** (cron job or Vercel cron)
3. **Use Resend to send emails** (already integrated)
4. **Track opens and clicks** in PostHog

---

## 🎯 Feature 4: Subscription Management (Days 9-10)

### Why This Last (but critical)?
- **Start generating revenue**
- **Track MRR and churn**
- **Gate premium features**

### Implementation Overview

1. **Create subscriptions table** in Supabase
2. **Link Razorpay payments to subscriptions**
3. **Add middleware to check plan limits**
4. **Create paywall UI components**
5. **Handle renewal and cancellation**

---

## 📊 Success Metrics to Track

After implementing these 4 features, track:

| Metric | Target | Why |
|--------|--------|-----|
| **Activation Rate** | 60% | % of signups who save at least 1 tender |
| **D7 Retention** | 40% | % of users who return after 7 days |
| **Email Open Rate** | 25% | How many users engage with notifications |
| **Free-to-Paid** | 5-10% | Conversion rate to paid plans |
| **MRR** | ₹15,000+ | Monthly recurring revenue after 2 weeks |

---

## ⏰ 2-Week Timeline

| Days | Feature | Output |
|------|---------|--------|
| 1-3 | Tender Watchlist | Users can save/unsave tenders, view saved list |
| 4-5 | User Profile | Complete profile page with preferences |
| 6-8 | Email Notifications | Daily/weekly digests sent to users |
| 9-10 | Subscription Management | Payment → subscription → feature gating |
| 11-14 | Testing, Polish, Launch | Bug fixes, onboarding, marketing prep |

---

## 🚀 Quick Wins (Do These Too)

1. **Add toast notifications** for user feedback (use `sonner` package)
2. **Improve empty states** with helpful CTAs
3. **Add loading skeletons** instead of spinners
4. **Create onboarding checklist** for new users
5. **Add keyboard shortcuts** for power users

---

## 📝 Files You'll Touch

```
Tenderpost_web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── saved-tenders/route.ts          [NEW]
│   │   │   ├── user-profile/route.ts           [NEW]
│   │   │   └── subscriptions/route.ts          [NEW]
│   │   └── dashboard/
│   │       ├── tenders/page.tsx                [UPDATE]
│   │       ├── profile/page.tsx                [NEW]
│   │       └── search/page.tsx                 [UPDATE]
│   ├── components/
│   │   └── ui/
│   │       ├── toast.tsx                       [NEW]
│   │       └── paywall.tsx                     [NEW]
│   └── lib/
│       ├── posthog/events.ts                   [UPDATE]
│       └── supabase/
│           └── queries.ts                      [NEW]
└── SUPABASE_SCHEMA.sql                         [UPDATE]
```

---

## 🎯 What Success Looks Like

After 2 weeks:
- ✅ Users can save and manage tenders
- ✅ Users receive personalized email notifications
- ✅ Users can upgrade to paid plans
- ✅ You're tracking all key metrics
- ✅ You have 10+ paying customers
- ✅ You're generating ₹15,000+ MRR

---

**Let's build! 🚀**

Start with the Watchlist feature today. It's the foundation for everything else.

