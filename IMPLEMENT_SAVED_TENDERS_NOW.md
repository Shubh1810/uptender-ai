# 🚀 Implement Saved Tenders - Quick Start

**Current Status:** Your database schema is already good! Just need to add the API and UI.

---

## ✅ What You Already Have

Your `saved_tenders` table exists with:
- ✅ `id`, `user_id`, `tender_ref`, `title`, `url`
- ✅ `metadata` JSONB field (perfect for extra data!)
- ✅ `created_at` timestamp
- ✅ Row-Level Security (RLS) policies
- ✅ Index on `user_id`

**This is already production-ready!** 🎉

---

## 🎯 Two Options for You

### **Option 1: Use Current Schema (Recommended - Fastest)**
✅ Works right now  
✅ No migration needed  
✅ Use `metadata` JSONB for flexible data storage  
✅ Implement in 2-3 hours  

**Go with this if:** You want to launch quickly

### **Option 2: Enhance Schema (Better - More Features)**
✅ Add dedicated columns (organisation, dates, notes, tags)  
✅ Add more indexes for performance  
✅ Add unique constraint to prevent duplicates  
✅ Add helper functions  
✅ Implement in 3-4 hours  

**Go with this if:** You want the best long-term solution

---

## 🚀 Quick Implementation (Option 1 - Current Schema)

### Step 1: Create API Route (30 minutes)

Create `/src/app/api/saved-tenders/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const SaveTenderSchema = z.object({
  tender_ref: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  metadata: z.record(z.any()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('saved_tenders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = SaveTenderSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const { tender_ref, title, url, metadata } = validationResult.data;

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_tenders')
      .select('id')
      .eq('user_id', user.id)
      .eq('tender_ref', tender_ref)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Already saved' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('saved_tenders')
      .insert({
        user_id: user.id,
        tender_ref,
        title,
        url,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, saved_tender: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tender_ref = searchParams.get('tender_ref');

    if (!tender_ref) {
      return NextResponse.json({ error: 'Missing tender_ref' }, { status: 400 });
    }

    const { error } = await supabase
      .from('saved_tenders')
      .delete()
      .eq('user_id', user.id)
      .eq('tender_ref', tender_ref);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 2: Create Custom Hook (30 minutes)

Create `/src/hooks/useSavedTenders.ts`:

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useSavedTenders() {
  const [savedTenderIds, setSavedTenderIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchSavedTenders = useCallback(async () => {
    try {
      const response = await fetch('/api/saved-tenders');
      const data = await response.json();

      if (response.ok && data.saved_tenders) {
        const ids = new Set(data.saved_tenders.map((t: any) => t.tender_ref));
        setSavedTenderIds(ids);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedTenders();
  }, [fetchSavedTenders]);

  const saveTender = useCallback(async (tender: any) => {
    const tenderId = tender.ref_no;

    // Optimistic update
    setSavedTenderIds(prev => new Set([...prev, tenderId]));

    try {
      const response = await fetch('/api/saved-tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tender_ref: tenderId,
          title: tender.title,
          url: tender.url,
          metadata: {
            organisation: tender.organisation,
            closing_date: tender.closing_date,
          },
        }),
      });

      if (!response.ok) {
        // Revert on error
        setSavedTenderIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(tenderId);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSavedTenderIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tenderId);
        return newSet;
      });
    }
  }, []);

  const unsaveTender = useCallback(async (tenderId: string) => {
    // Optimistic update
    setSavedTenderIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(tenderId);
      return newSet;
    });

    try {
      const response = await fetch(`/api/saved-tenders?tender_ref=${tenderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Revert on error
        setSavedTenderIds(prev => new Set([...prev, tenderId]));
      }
    } catch (error) {
      console.error('Error:', error);
      setSavedTenderIds(prev => new Set([...prev, tenderId]));
    }
  }, []);

  const isSaved = useCallback((tenderId: string) => {
    return savedTenderIds.has(tenderId);
  }, [savedTenderIds]);

  return { savedTenderIds, loading, saveTender, unsaveTender, isSaved };
}
```

### Step 3: Update Search Page (30 minutes)

In `/src/app/dashboard/search/page.tsx`:

```typescript
import { useSavedTenders } from '@/hooks/useSavedTenders';
import { Heart } from 'lucide-react';

export default function SearchPage() {
  // Add this hook
  const { isSaved, saveTender, unsaveTender } = useSavedTenders();

  // Add this handler
  const handleToggleSave = async (tender: Tender) => {
    if (isSaved(tender.ref_no)) {
      await unsaveTender(tender.ref_no);
    } else {
      await saveTender(tender);
    }
  };

  // Update the "Save for Later" button:
  <Button
    variant="outline"
    onClick={() => handleToggleSave(tender)}
    className={`text-xs px-3 py-1.5 h-7 transition-all ${
      isSaved(tender.ref_no)
        ? 'border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
        : 'border-gray-300 dark:border-white/[0.12] dark:text-white/70'
    }`}
  >
    <Heart className={`h-3 w-3 mr-1.5 ${isSaved(tender.ref_no) ? 'fill-current' : ''}`} />
    {isSaved(tender.ref_no) ? 'Saved' : 'Save'}
  </Button>
}
```

### Step 4: Test! (15 minutes)

1. Open `/dashboard/search`
2. Click "Save" on a tender
3. Button should instantly show "Saved" ✅
4. Refresh page - still saved ✅
5. Click "Saved" to unsave ✅

---

## 🎯 Enhanced Implementation (Option 2)

If you want the enhanced version:

1. **Run the migration:**
   ```bash
   # Copy MIGRATION_ENHANCE_SAVED_TENDERS.sql
   # Paste into Supabase SQL Editor
   # Click "Run"
   ```

2. **Follow the updated SAVED_TENDERS_IMPLEMENTATION.md**
   - All code has been updated to use your existing schema
   - Enhanced features available after migration

---

## 📊 What Each Field Does

### Your Current Schema:
```sql
tender_ref     -- Unique ID (ref_no from tender)
title          -- Tender title
url            -- Link to original tender
metadata       -- JSONB - store ANY extra data:
               -- { organisation, closing_date, notes, tags, etc. }
created_at     -- When user saved it
```

**The `metadata` JSONB field is powerful!** You can store anything:
```json
{
  "organisation": "Ministry of Health",
  "closing_date": "2026-02-15",
  "notes": "High priority - discuss with team",
  "tags": ["healthcare", "urgent"],
  "custom_field": "anything you want"
}
```

---

## ✅ Checklist

- [ ] Create API route: `/src/app/api/saved-tenders/route.ts`
- [ ] Create hook: `/src/hooks/useSavedTenders.ts`
- [ ] Update search page with save button
- [ ] Test save functionality
- [ ] Test unsave functionality
- [ ] Test refresh (data persists)
- [ ] Optional: Run migration for enhanced features

---

## 🚀 Time Estimate

| Task | Time |
|------|------|
| API Route | 30 min |
| Custom Hook | 30 min |
| Update UI | 30 min |
| Testing | 15 min |
| **Total** | **~2 hours** |

---

## 🎯 What You Get

After implementation:
- ✅ Users can save tenders with one click
- ✅ Instant UI feedback (optimistic updates)
- ✅ Works across devices (synced via Supabase)
- ✅ Secure (RLS ensures user isolation)
- ✅ Fast (indexed queries)
- ✅ Scalable (handles millions of saves)

---

## 💡 Pro Tips

1. **Use metadata creatively:**
   ```typescript
   metadata: {
     organisation: tender.organisation,
     closing_date: tender.closing_date,
     priority: 'high',
     status: 'under_review',
     notes: 'Discuss with CEO',
     reminder_set: true,
   }
   ```

2. **Add analytics:**
   ```typescript
   // After save
   posthog.capture('tender_saved', {
     tender_id: tender.ref_no,
     organisation: tender.organisation,
   });
   ```

3. **Add toast notifications:**
   ```bash
   npm install sonner
   ```
   ```typescript
   import { toast } from 'sonner';
   
   // After save
   toast.success('Tender saved!');
   ```

---

**Ready to implement? Start with Step 1!** 🚀

The code is copy-paste ready. You'll have saved tenders working in 2 hours.

