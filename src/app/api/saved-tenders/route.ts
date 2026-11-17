import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/server/auth';
import { ApiError, apiHandler, assertSameOrigin, badRequest, parseJson } from '@/server/http';
import { getActivePlan, planLimit } from '@/features/plans/server/active-plan';
import { UNLIMITED } from '@/features/plans/types';

/** Used only if a plan row has no `saved_tenders` limit configured. */
const DEFAULT_SAVED_TENDERS_LIMIT = 10;

const optionalText = (max: number) => z.string().max(max).nullish();

const SaveTenderSchema = z.object({
  tender_ref: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(1000),
  url: z.url().max(2000).refine((u) => /^https?:\/\//i.test(u), 'URL must be http(s)'),
  tender_organisation: optionalText(500),
  tender_closing_date: optionalText(64),
  tender_published_date: optionalText(64),
  tender_opening_date: optionalText(64),
  notes: optionalText(5000),
  tags: z.array(z.string().max(50)).max(20).optional(),
});

// GET: all saved tenders for the current user
export const GET = apiHandler('saved-tenders:get', async () => {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from('saved_tenders_with_stats')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[api:saved-tenders] fetch failed', error);
    throw new ApiError(500, 'DB_ERROR', 'Failed to fetch saved tenders');
  }

  return NextResponse.json({ saved_tenders: data ?? [], total_count: data?.length ?? 0 });
});

// POST: save a tender, enforcing the plan's saved-tender limit
export const POST = apiHandler('saved-tenders:post', async (request) => {
  assertSameOrigin(request);
  const { supabase, user } = await requireUser();
  const tender = await parseJson(request, SaveTenderSchema);

  // Users without a subscription row fall back to the free plan's limits.
  const plan = await getActivePlan(supabase, user.id);
  const limit = planLimit(plan, 'saved_tenders', DEFAULT_SAVED_TENDERS_LIMIT);

  if (limit !== UNLIMITED) {
    const { count, error: countError } = await supabase
      .from('saved_tenders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (countError) {
      console.error('[api:saved-tenders] count failed', countError);
      throw new ApiError(500, 'DB_ERROR', 'Failed to save tender');
    }

    if ((count ?? 0) >= limit) {
      throw new ApiError(403, 'LIMIT_EXCEEDED', 'Saved tender limit reached', {
        current_count: count,
        limit,
        upgrade_required: true,
        message: `You've reached your saved tender limit (${limit}). Upgrade to save more tenders.`,
      });
    }
  }

  const { data, error } = await supabase
    .from('saved_tenders')
    .insert({
      user_id: user.id,
      tender_ref: tender.tender_ref,
      title: tender.title,
      url: tender.url,
      tender_organisation: tender.tender_organisation ?? null,
      tender_closing_date: tender.tender_closing_date ?? null,
      tender_published_date: tender.tender_published_date ?? null,
      tender_opening_date: tender.tender_opening_date ?? null,
      notes: tender.notes ?? null,
      tags: tender.tags ?? [],
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new ApiError(409, 'DUPLICATE_ERROR', 'Tender already saved', { already_saved: true });
    }
    console.error('[api:saved-tenders] insert failed', error);
    throw new ApiError(500, 'DB_ERROR', 'Failed to save tender');
  }

  return NextResponse.json({ success: true, saved_tender: data }, { status: 201 });
});

// DELETE: remove a saved tender (?tender_ref=...)
export const DELETE = apiHandler('saved-tenders:delete', async (request) => {
  assertSameOrigin(request);
  const { supabase, user } = await requireUser();

  const tenderRef = new URL(request.url).searchParams.get('tender_ref');
  if (!tenderRef || tenderRef.length > 200) throw badRequest('Missing or invalid tender_ref parameter');

  const { error } = await supabase
    .from('saved_tenders')
    .delete()
    .eq('user_id', user.id)
    .eq('tender_ref', tenderRef);

  if (error) {
    console.error('[api:saved-tenders] delete failed', error);
    throw new ApiError(500, 'DB_ERROR', 'Failed to delete tender');
  }

  return NextResponse.json({ success: true, message: 'Tender removed from saved list' });
});
