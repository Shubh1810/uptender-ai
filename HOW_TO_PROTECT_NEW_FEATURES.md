# 🔐 Quick Guide: How to Protect New Features

This guide shows you how to add tier-based restrictions to new features you build.

---

## 📋 Table of Contents

1. [Protect a Page (Blur Overlay)](#protect-a-page-blur-overlay)
2. [Protect a UI Component](#protect-a-ui-component)
3. [Protect an API Endpoint](#protect-an-api-endpoint)
4. [Add a New Feature Flag](#add-a-new-feature-flag)
5. [Check Usage Limits](#check-usage-limits)

---

## 1. Protect a Page (Blur Overlay)

**Use Case:** Block entire pages for free users with upgrade overlay

### Example: New "AI Insights" Page

```typescript
// src/app/dashboard/ai-insights/page.tsx
'use client';

import { PlanGate } from '@/components/guards/PlanGate';

export default function AIInsightsPage() {
  const content = (
    <div className="p-8">
      <h1>AI Insights</h1>
      {/* Your actual content here */}
    </div>
  );

  return (
    <PlanGate 
      allowedPlans={['pro', 'enterprise']}  // Who can access
      blurContent={true}                     // Blur the content
      showOverlay={true}                     // Show upgrade modal
    >
      {content}
    </PlanGate>
  );
}
```

**Result:** Free users see blurred content + upgrade modal

---

## 2. Protect a UI Component

**Use Case:** Hide specific buttons/sections based on plan

### Example: Export Button

```typescript
import { FeatureFlag } from '@/components/guards/FeatureFlag';

export default function TenderList() {
  return (
    <div>
      <h1>Tenders</h1>
      
      {/* Only show export for users with export_data feature */}
      <FeatureFlag 
        feature="export_data"
        showUpgradePrompt={true}
      >
        <button onClick={handleExport}>
          Export to Excel
        </button>
      </FeatureFlag>
      
      {/* Regular content - visible to all */}
      <div>Tender list...</div>
    </div>
  );
}
```

**Options:**

```typescript
// Hide completely if no access (no upgrade prompt)
<FeatureFlag feature="export_data">
  <ExportButton />
</FeatureFlag>

// Show upgrade prompt in place of feature
<FeatureFlag feature="export_data" showUpgradePrompt={true}>
  <ExportButton />
</FeatureFlag>

// Custom fallback message
<FeatureFlag 
  feature="export_data"
  fallback={<div>Upgrade to Pro to export</div>}
>
  <ExportButton />
</FeatureFlag>
```

---

## 3. Protect an API Endpoint

**Use Case:** Enforce limits at the API level (server-side)

### Step 1: Update Feature Type

```typescript
// src/lib/access-control.ts

export type Feature = 
  | 'email_alerts'
  | 'bid_drafting'
  | 'export_data'
  | 'your_new_feature'  // ← Add your feature here
  // ...
```

### Step 2: Protect Your API Route

```typescript
// src/app/api/your-endpoint/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAccess } from '@/lib/access-control';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  
  // 1. Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 2. Check feature access
  const access = await checkAccess(
    user.id, 
    'your_new_feature',        // Feature to check
    'api_calls_today'          // Optional: usage limit
  );
  
  if (!access.allowed) {
    return NextResponse.json({
      error: access.reason,
      upgrade_required: true
    }, { status: 403 });
  }
  
  // 3. Feature is allowed - execute your logic
  // ... your code here
  
  return NextResponse.json({ success: true });
}
```

---

## 4. Add a New Feature Flag

**Step 1:** Update SQL - Add feature to plans

```sql
-- Update the features JSON for each plan

UPDATE subscription_plans
SET features = features || '{"your_new_feature": true}'::jsonb
WHERE id IN ('pro', 'enterprise');

-- Free and Basic don't get this feature (default false)
```

**Step 2:** Add to TypeScript types

```typescript
// src/lib/access-control.ts

export type Feature = 
  | 'email_alerts'
  | 'your_new_feature'  // ← Add here
  // ...
```

**Step 3:** Use in your code

```typescript
// Client-side
const { hasFeature } = useSubscription();
if (hasFeature('your_new_feature')) {
  // Show feature
}

// Server-side
const result = await checkFeatureAccess(userId, 'your_new_feature');
if (result.allowed) {
  // Allow access
}
```

---

## 5. Check Usage Limits

**Use Case:** Limit how many times a user can do something

### Step 1: Add Usage Key

```typescript
// src/lib/access-control.ts

export type UsageKey = 
  | 'tenders_viewed_today'
  | 'saved_tenders'
  | 'your_action_count'  // ← Add your usage key
  // ...
```

### Step 2: Add Limit to Plans

```sql
-- Update the limits JSON for each plan

UPDATE subscription_plans
SET limits = limits || '{"your_action_count": 10}'::jsonb
WHERE id = 'free';

UPDATE subscription_plans
SET limits = limits || '{"your_action_count": 100}'::jsonb
WHERE id = 'basic';

UPDATE subscription_plans
SET limits = limits || '{"your_action_count": -1}'::jsonb  -- -1 = unlimited
WHERE id IN ('pro', 'enterprise');
```

### Step 3: Check Limit in API

```typescript
// src/app/api/your-endpoint/route.ts

import { checkUsageLimit } from '@/lib/access-control';

export async function POST(req: NextRequest) {
  // ... auth check ...
  
  // Check and increment usage (atomic)
  const usage = await checkUsageLimit(
    user.id,
    'your_action_count',
    1  // Increment by 1
  );
  
  if (!usage.allowed) {
    return NextResponse.json({
      error: `Limit reached (${usage.currentUsage}/${usage.limit})`,
      upgrade_required: true
    }, { status: 403 });
  }
  
  // Usage incremented - proceed with action
  // ...
}
```

---

## 🎯 Common Patterns

### Pattern 1: Freemium Model

```typescript
// Free users can use feature but limited
<FeatureFlag 
  feature="basic_feature"
  showUpgradePrompt={false}
>
  <BasicVersion maxItems={5} />
</FeatureFlag>

<FeatureFlag feature="advanced_feature">
  <AdvancedVersion unlimited={true} />
</FeatureFlag>
```

### Pattern 2: Trial/Premium Split

```typescript
// Show different UI based on plan
const { planId } = useSubscription();

return (
  <div>
    {planId === 'free' && <TrialBanner />}
    {planId === 'pro' && <PremiumFeatures />}
  </div>
);
```

### Pattern 3: Soft Limit with Prompt

```typescript
// Allow action but show upgrade hint
const usage = await getUserUsage(userId, 'exports_this_month');

if (usage.percentage > 80) {
  return (
    <div>
      <ExportButton />
      <div className="text-yellow-600">
        You've used {usage.current}/{usage.limit} exports this month.
        <Link href="/pricing">Upgrade for unlimited exports</Link>
      </div>
    </div>
  );
}
```

---

## 📊 Decision Tree: Which Protection Method?

```
Need to protect a feature?
         ↓
    Is it a full page?
    ├── Yes → Use <PlanGate>
    └── No
         ↓
    Is it a UI component/button?
    ├── Yes → Use <FeatureFlag>
    └── No
         ↓
    Is it an API endpoint?
    ├── Yes → Use checkAccess() in API route
    └── No
         ↓
    Need to count usage?
    └── Yes → Use checkUsageLimit()
```

---

## 🚨 Common Mistakes to Avoid

❌ **DON'T:** Check plans only on client-side
```typescript
// BAD - can be bypassed
if (planId === 'free') {
  return <UpgradePrompt />;
}
```

✅ **DO:** Always enforce on server (API)
```typescript
// GOOD - enforced on backend
const access = await checkAccess(userId, 'feature');
if (!access.allowed) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

❌ **DON'T:** Manually count usage
```typescript
// BAD - race conditions possible
const count = await getCount();
if (count >= limit) return error;
await incrementCount();
```

✅ **DO:** Use atomic increment
```typescript
// GOOD - atomic operation
const result = await checkUsageLimit(userId, 'action', 1);
if (!result.allowed) return error;
```

---

## 🧪 Testing Checklist

Before deploying a protected feature:

- [ ] Free user sees upgrade prompt
- [ ] Pro user can access feature
- [ ] API rejects unauthorized requests (test with curl/Postman)
- [ ] Usage limits work correctly
- [ ] Upgrade button links to pricing page
- [ ] Error messages are clear
- [ ] Database limits updated in SQL

---

## 🔄 Quick Copy-Paste Templates

### Template: Protected Page

```typescript
'use client';

import { PlanGate } from '@/components/guards/PlanGate';

export default function YourPage() {
  return (
    <PlanGate allowedPlans={['pro', 'enterprise']} blurContent={true}>
      <div className="p-8">
        {/* Your content */}
      </div>
    </PlanGate>
  );
}
```

### Template: Protected API Route

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAccess } from '@/lib/access-control';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const access = await checkAccess(user.id, 'your_feature');
  
  if (!access.allowed) {
    return NextResponse.json({
      error: access.reason,
      upgrade_required: true
    }, { status: 403 });
  }
  
  // Your logic here
  
  return NextResponse.json({ success: true });
}
```

### Template: Protected Component

```typescript
import { FeatureFlag } from '@/components/guards/FeatureFlag';

export function YourComponent() {
  return (
    <FeatureFlag feature="your_feature" showUpgradePrompt={true}>
      <button>Premium Feature</button>
    </FeatureFlag>
  );
}
```

---

## 📚 Reference

- Access Control Functions: `src/lib/access-control.ts`
- Feature Types: See `Feature` and `UsageKey` in access-control.ts
- Plans in Database: Query `subscription_plans` table
- User's Current Plan: Query `user_subscriptions` table

**Need Help?** Check `TIER_SYSTEM_IMPLEMENTATION.md` for full details.
