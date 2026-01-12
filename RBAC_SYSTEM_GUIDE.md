# 🛡️ Role-Based Access Control (RBAC) System

## 🎯 Philosophy: Roles ≠ Plans

This system implements **TWO SEPARATE** access control layers:

1. **Role-Based Access (RBAC)** - Meta-powers (admin capabilities)
2. **Subscription-Based Access** - Feature entitlements

**Critical Separation:**
- ✅ Director role gives you **meta-powers** (change plans, view usage)
- ✅ Director still needs a **subscription plan** (usually Enterprise)
- ✅ Director goes through same usage tracking (honest dogfooding)
- ❌ Director role does NOT bypass feature restrictions

---

## 👤 Three Roles

| Role | Purpose | Powers |
|------|---------|--------|
| **user** | Regular users | Normal subscription features |
| **admin** | Support staff | View user data, help with issues |
| **director** | Owner/Dev (you) | All meta-powers, change plans, view everything |

**Key Point:** Even as director, you still have a plan (usually Enterprise) and consume usage like any other user.

---

## 🗄️ Database Structure

### New Column in `profiles` Table

```sql
ALTER TABLE public.profiles 
ADD COLUMN role TEXT CHECK (role IN ('user', 'admin', 'director')) DEFAULT 'user';
```

### New Table: `admin_audit_log`

```sql
-- Tracks all admin actions for security audit
CREATE TABLE public.admin_audit_log (
  id UUID PRIMARY KEY,
  admin_user_id UUID REFERENCES auth.users(id),
  action TEXT, -- 'change_plan', 'reset_usage', etc.
  target_user_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ
);
```

**Every director action is logged here** - change plans, reset usage, etc.

---

## 🔧 How to Set Yourself as Director

### Step 1: Run the Migration

```sql
-- In Supabase SQL Editor, run:
-- File: MIGRATION_ADD_ROLES.sql

-- UPDATE THIS LINE with your email:
director_email TEXT := 'your-email@example.com'; -- ⚠️ CHANGE THIS
```

### Step 2: Verify You're Director

```sql
SELECT id, email, full_name, role
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE role = 'director';
```

You should see your account with `role = 'director'`.

### Step 3: Assign Yourself Enterprise Plan (Optional)

```sql
-- Give yourself the best plan for dogfooding
UPDATE user_subscriptions
SET plan_id = 'enterprise'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
)
AND status = 'active';
```

---

## 🔑 Director Powers (What You Can Do)

### Power 1: View All Users

**Endpoint:** `GET /api/admin/users`

```bash
curl http://localhost:3000/api/admin/users
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "user_id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "user",
      "plan_id": "free",
      "plan_name": "Free",
      "subscription_status": "active",
      "created_at": "2026-01-12T10:00:00Z"
    }
  ]
}
```

**UI:** Visit `/dashboard/admin` to see all users in a table

---

### Power 2: Change Any User's Plan

**Endpoint:** `POST /api/admin/change-plan`

```typescript
// As director, you can upgrade/downgrade anyone
await fetch('/api/admin/change-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'target-user-uuid',
    plan_id: 'pro',
    reason: 'Beta tester reward'
  })
});
```

**UI:** In admin dashboard, use dropdown to change plans

**Audit:** Action logged in `admin_audit_log` table

---

### Power 3: View Any User's Usage

**Endpoint:** `GET /api/admin/user-usage?user_id=xxx`

```bash
curl http://localhost:3000/api/admin/user-usage?user_id=uuid
```

**Response:**
```json
{
  "success": true,
  "usage": [
    {
      "usage_key": "saved_tenders",
      "current_count": 7,
      "limit_value": 10,
      "percentage": 70
    },
    {
      "usage_key": "ai_queries_today",
      "current_count": 0,
      "limit_value": 0,
      "percentage": 0
    }
  ]
}
```

**UI:** Click "View Usage" button in admin dashboard

---

### Power 4: Reset Any User's Usage

**Endpoint:** `POST /api/admin/reset-usage`

```typescript
// Reset a user's daily AI query count
await fetch('/api/admin/reset-usage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'target-user-uuid',
    usage_key: 'ai_queries_today',
    reason: 'Support request'
  })
});
```

**UI:** Click "Reset" button next to usage meters in admin dashboard

**Audit:** Action logged in `admin_audit_log`

---

## 🚫 What Director Does NOT Bypass

Even as director, you:

✅ **Still have a subscription plan** (usually Enterprise)
✅ **Still consume usage** (tracked in usage_tracking table)
✅ **Go through same code paths** (honest dogfooding)
✅ **Subject to same feature checks** (if testing)

**Why?** This keeps your own product usage honest and helps you catch bugs.

---

## 🛠️ Admin Dashboard (`/dashboard/admin`)

Access: **Directors only** (you won't see this link in sidebar unless you're director)

### Features:

1. **User Management**
   - View all users
   - See their plans and roles
   - Change any user's plan
   - View user usage statistics

2. **Usage Management**
   - See real-time usage across all users
   - Reset usage counters if needed
   - Monitor who's hitting limits

3. **Audit Trail**
   - All actions logged automatically
   - Full transparency of admin actions

---

## 🔐 Security Architecture

### RLS Policies

```sql
-- Only directors can read audit logs
CREATE POLICY "directors-can-read-audit-log" 
  ON admin_audit_log 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'director'
    )
  );
```

### Helper Functions (SQL)

```sql
-- Check if user is director
is_director(user_id) → boolean

-- Check if user is admin or director
is_admin(user_id) → boolean

-- Get user's role
get_user_role(user_id) → text

-- Director: Change user plan (logs action)
director_change_user_plan(target_user_id, new_plan_id, reason)

-- Director: Get all users
director_get_all_users(limit, offset)

-- Director: Get user usage
director_get_user_usage(target_user_id)

-- Director: Reset user usage (logs action)
director_reset_user_usage(target_user_id, usage_key, reason)
```

All these functions:
- ✅ Check for director role before executing
- ✅ Log actions to audit trail
- ✅ Return errors if unauthorized

---

## 💻 Code Examples

### Check if Current User is Director (Server-Side)

```typescript
import { checkDirectorAccess } from '@/lib/admin-access-control';

export async function GET(req: NextRequest) {
  const access = await checkDirectorAccess();
  
  if (!access.isDirector) {
    return NextResponse.json(
      { error: 'Director access required' },
      { status: 403 }
    );
  }
  
  // Director powers here
}
```

### Check Role in Client Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function MyComponent() {
  const [isDirector, setIsDirector] = useState(false);
  
  useEffect(() => {
    const checkRole = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data } = await supabase.rpc('is_director', {
        p_user_id: user.id
      });
      
      setIsDirector(data === true);
    };
    
    checkRole();
  }, []);
  
  return (
    <div>
      {isDirector && <AdminPanel />}
    </div>
  );
}
```

---

## 🎯 Use Cases

### Use Case 1: Beta Tester Rewards

```typescript
// Give early users free Pro access
await fetch('/api/admin/change-plan', {
  method: 'POST',
  body: JSON.stringify({
    user_id: 'beta-tester-uuid',
    plan_id: 'pro',
    reason: 'Beta testing reward - 6 months free'
  })
});
```

### Use Case 2: Customer Support

```typescript
// A user accidentally hit their limit
// Reset their usage so they can continue
await fetch('/api/admin/reset-usage', {
  method: 'POST',
  body: JSON.stringify({
    user_id: 'customer-uuid',
    usage_key: 'saved_tenders',
    reason: 'Support request #1234 - accidental deletes'
  })
});
```

### Use Case 3: Monitoring

```typescript
// Check which users are hitting limits
const response = await fetch('/api/admin/users');
const { users } = await response.json();

const heavyUsers = users.filter(u => u.plan_id === 'free');
// Proactively reach out to offer upgrade
```

---

## 📊 Audit Trail Example

Every action you take is logged:

```sql
SELECT * FROM admin_audit_log ORDER BY created_at DESC LIMIT 10;

| admin_user_id | action       | target_user_id | details                          | created_at |
|---------------|--------------|----------------|----------------------------------|------------|
| your-id       | change_plan  | user-123       | {"new_plan_id": "pro", ...}      | 2026-01-12 |
| your-id       | reset_usage  | user-456       | {"usage_key": "saved_tenders"}   | 2026-01-12 |
```

This creates **transparency** and **accountability** for admin actions.

---

## 🚀 Getting Started (Quick Setup)

### 1. Run Migration

```bash
# In Supabase SQL Editor
# 1. Update director_email in MIGRATION_ADD_ROLES.sql
# 2. Run the entire script
# 3. Verify you're director
```

### 2. Check Your Role

```sql
SELECT role FROM profiles WHERE id = auth.uid();
-- Should return: 'director'
```

### 3. Access Admin Dashboard

```bash
# Visit in browser (will only show if you're director)
http://localhost:3000/dashboard/admin
```

You'll see:
- Total users
- Paying vs free users breakdown
- Full user list with plan management
- Usage reset capabilities

---

## 🔄 How It Works with Subscriptions

### Example: You (Director) Using the Product

```typescript
// Your profile:
role: 'director'           // Meta-powers
plan_id: 'enterprise'      // Subscription features

// When you use AI features:
checkAccess(your_id, 'bid_drafting', 'ai_queries_today')
  ↓
✅ Feature check passes (enterprise plan has bid_drafting)
✅ Usage check passes (enterprise has unlimited AI queries)
✅ Usage is still tracked (for honest dogfooding)

// When you access admin panel:
checkDirectorAccess()
  ↓
✅ Role check passes (you're director)
✅ Can view/modify all users
```

**Separation is key:**
- Subscription checks = Product features
- Role checks = Meta-powers

---

## 🧪 Testing Your Setup

### Test 1: Verify Director Role

```bash
# Login to your account
# Visit /dashboard/admin
# Should see admin dashboard (not "Access Denied")
```

### Test 2: Change a User's Plan

```bash
# In admin dashboard
# Select a test user
# Change their plan from Free → Pro
# Verify in database:

SELECT plan_id FROM user_subscriptions 
WHERE user_id = 'test-user-id' AND status = 'active';
```

### Test 3: Check Audit Log

```sql
SELECT * FROM admin_audit_log 
WHERE admin_user_id = YOUR_ID
ORDER BY created_at DESC;

-- Should see your plan change action logged
```

### Test 4: View User Usage

```bash
# In admin dashboard
# Click "View Usage" on any user
# Should see their usage stats
```

---

## 📚 API Reference

### Admin Endpoints (Director Only)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/users` | List all users |
| POST | `/api/admin/change-plan` | Change user's plan |
| GET | `/api/admin/user-usage` | View user's usage |
| POST | `/api/admin/reset-usage` | Reset usage counter |

**All endpoints:**
- ✅ Check director role first
- ✅ Return 403 if not director
- ✅ Log action to audit trail
- ✅ Return clear error messages

---

## ⚡ Common Admin Tasks

### Task 1: Give Someone Free Pro Access

```typescript
// Reward a helpful community member
await fetch('/api/admin/change-plan', {
  method: 'POST',
  body: JSON.stringify({
    user_id: 'helpful-user-id',
    plan_id: 'pro',
    reason: 'Community contribution reward'
  })
});
```

### Task 2: Debug Usage Issues

```typescript
// User reports they can't save tenders
// 1. Check their usage
const response = await fetch(`/api/admin/user-usage?user_id=${userId}`);
const { usage } = await response.json();

// 2. If they hit limit incorrectly, reset it
await fetch('/api/admin/reset-usage', {
  method: 'POST',
  body: JSON.stringify({
    user_id: userId,
    usage_key: 'saved_tenders',
    reason: 'Bug investigation - incorrect limit'
  })
});
```

### Task 3: Monitor Heavy Users

```typescript
// Get all users
const { users } = await fetch('/api/admin/users').then(r => r.json());

// Find users close to upgrading
const potentialUpgrades = users.filter(u => 
  u.plan_id === 'free' && 
  u.created_at > '2026-01-01' // Recent signups
);

// Proactively reach out with discount offers
```

---

## 🔒 Security Best Practices

### 1. Never Share Director Credentials

- Use MFA on your director account
- Never share director login with anyone
- Consider creating separate 'admin' accounts for support staff

### 2. Always Provide Reason for Actions

```typescript
// GOOD - documented action
director_change_user_plan(userId, 'pro', 'Support ticket #123 - billing error')

// BAD - unclear why this happened
director_change_user_plan(userId, 'pro', null)
```

### 3. Review Audit Logs Regularly

```sql
-- Check what actions were taken this week
SELECT * FROM admin_audit_log 
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### 4. Limit Director Accounts

- Only create director role for yourself initially
- Add 'admin' role for support staff (if you hire)
- Never make regular users admins

---

## 🎭 Example: Your Daily Workflow

### Morning: Check Dashboard

```bash
1. Visit /dashboard/admin
2. See how many new signups
3. See how many free → paid conversions
4. Check for users hitting limits (potential upgrades)
```

### Support Request: User Hit Limit

```bash
1. User emails: "Can't save more tenders"
2. Find user in admin dashboard
3. Click "View Usage"
4. See: saved_tenders = 10/10 (100%)
5. Options:
   a) Reset their usage (temporary fix)
   b) Upgrade them to Basic (permanent fix)
   c) Check if it's a bug (investigate)
```

### Beta Testing: Reward Contributors

```bash
1. Beta tester gives great feedback
2. Change their plan: free → pro
3. Reason: "Beta testing contribution"
4. User gets Pro features immediately
5. Action logged in audit trail
```

---

## 📈 Combining Roles + Plans

### Recommended Setup for You (Director)

```typescript
// Your account setup:
{
  email: "your-email@example.com",
  role: "director",           // Meta-powers
  plan_id: "enterprise",      // Product features
  
  // You can:
  can_change_plans: true,     // Role power
  can_view_all_users: true,   // Role power
  can_use_ai_features: true,  // Plan feature
  has_unlimited_saves: true,  // Plan feature
  
  // Your usage is still tracked:
  saved_tenders_count: 47,    // Still counted
  ai_queries_today: 12        // Still counted
}
```

**This setup:**
- ✅ Gives you meta-powers to manage users
- ✅ Gives you all product features for dogfooding
- ✅ Tracks your usage so you understand user experience
- ✅ Keeps admin powers separate from product features

---

## 🎯 Key Takeaways

1. **Role = Meta-powers, Plan = Features**
   - Don't conflate them
   - Director doesn't automatically get unlimited features
   - Director gets admin capabilities

2. **Audit Everything**
   - Every plan change is logged
   - Every usage reset is logged
   - Full transparency

3. **Honest Dogfooding**
   - You still have a plan
   - You still consume usage
   - You experience the product like users do

4. **Security by Design**
   - Role checks at API level
   - RLS prevents data leaks
   - Audit trail for accountability

---

## 📁 Files Reference

| File | Purpose |
|------|---------|
| `MIGRATION_ADD_ROLES.sql` | Database migration to add roles |
| `src/lib/admin-access-control.ts` | Role check functions |
| `src/app/api/admin/users/route.ts` | View all users endpoint |
| `src/app/api/admin/change-plan/route.ts` | Change plan endpoint |
| `src/app/api/admin/user-usage/route.ts` | View usage endpoint |
| `src/app/api/admin/reset-usage/route.ts` | Reset usage endpoint |
| `src/app/dashboard/admin/page.tsx` | Admin dashboard UI |

---

## ✅ Setup Checklist

- [ ] Run `MIGRATION_ADD_ROLES.sql` in Supabase
- [ ] Update `director_email` in migration script with your email
- [ ] Verify you're director: `SELECT role FROM profiles WHERE id = auth.uid()`
- [ ] Assign yourself Enterprise plan (optional)
- [ ] Visit `/dashboard/admin` to test
- [ ] Try changing a test user's plan
- [ ] Check `admin_audit_log` to verify logging works

---

## 🚀 You're Ready!

You now have:
✅ Clean separation of roles and plans
✅ Director meta-powers for user management
✅ Audit trail for all admin actions
✅ Honest dogfooding (you still have a plan)
✅ Secure, role-based admin access

**Go set yourself as director and test the admin dashboard!** 🎉
