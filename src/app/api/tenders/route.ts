import { NextResponse } from 'next/server';
import { requireUser } from '@/server/auth';
import { ApiError, apiHandler } from '@/server/http';
import { enforceRateLimit } from '@/server/rate-limit';
import { sanitizeSearchTerm, sanitizeSearchTerms } from '@/features/tenders/search-terms';

const SELECT_FIELDS = [
  'id', 'ref_no', 'tender_id', 'source', 'title', 'organisation', 'url',
  'published_date', 'closing_date', 'opening_date', 'work_description',
  'tender_value', 'product_category', 'sub_category', 'location', 'pincode',
  'period_of_work_days', 'bid_validity_days', 'emd_amount',
  'tender_type', 'tender_category', 'contract_type', 'is_active',
].join(', ');

const TEXT_SEARCH_COLUMNS = ['title', 'organisation', 'ref_no', 'work_description'];
const MAX_PAGE = 500;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function intParam(value: string | null, fallback: number, min: number, max: number) {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

function numberParam(value: string | null): number | null {
  if (!value) return null;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** `title.ilike.%term%,organisation.ilike.%term%,...` for an already-sanitised term. */
function anyColumnMatches(term: string) {
  return TEXT_SEARCH_COLUMNS.map((col) => `${col}.ilike.%${term}%`).join(',');
}

/**
 * GET /api/tenders: authenticated, paginated search over active tenders.
 *
 * Text matching: the search box (`query`) and each keyword chip (`keyword`,
 * repeatable) must each appear in at least one of title / organisation /
 * ref no / description, so adding keywords narrows results. Exclude terms are
 * removed by title.
 */
export const GET = apiHandler('tenders', async (request) => {
  const { supabase, user } = await requireUser();
  enforceRateLimit(`tenders:${user.id}`, 120, 60_000);

  const params = new URL(request.url).searchParams;
  const page = intParam(params.get('page'), 1, 1, MAX_PAGE);
  const limit = intParam(params.get('limit'), 20, 1, 50);

  const includeTerms = sanitizeSearchTerms([params.get('query') ?? '', ...params.getAll('keyword')]);
  const excludeTerms = sanitizeSearchTerms((params.get('exclude') ?? '').split(','));

  const ilikeFilters: Array<[column: string, param: string]> = [
    ['product_category', 'category'],
    ['location', 'location'],
    ['location', 'city'],
    ['tender_type', 'tender_type'],
    ['source', 'source'],
    ['organisation', 'organisation'],
  ];

  const today = startOfToday();
  let qb = supabase
    .from('tenders')
    .select(SELECT_FIELDS, { count: 'exact' })
    .eq('is_active', true)
    .gte('closing_date', today.toISOString())
    .order('closing_date', { ascending: true, nullsFirst: false });

  for (const term of includeTerms) qb = qb.or(anyColumnMatches(term));
  for (const term of excludeTerms) qb = qb.not('title', 'ilike', `%${term}%`);

  for (const [column, param] of ilikeFilters) {
    const value = sanitizeSearchTerm(params.get(param) ?? '');
    if (value) qb = qb.ilike(column, `%${value}%`);
  }

  const minAmount = numberParam(params.get('min_amount'));
  const maxAmount = numberParam(params.get('max_amount'));
  if (minAmount !== null) qb = qb.gte('tender_value', minAmount);
  if (maxAmount !== null) qb = qb.lte('tender_value', maxAmount);

  if (params.get('emd_exempted') === 'true') {
    qb = qb.or('emd_amount.is.null,emd_amount.eq.0');
  }

  const dateFilter = params.get('date_filter') ?? '';
  if (dateFilter) {
    const isClosing = params.get('date_type') === 'closing';
    const dateCol = isClosing ? 'closing_date' : 'published_date';
    const days = Number.parseInt(dateFilter.replace(/^next_/, ''), 10);

    if (ISO_DATE.test(dateFilter)) {
      qb = qb.gte(dateCol, dateFilter);
    } else if (Number.isFinite(days) && days >= 0 && days <= 3650) {
      qb = isClosing
        ? qb.lte(dateCol, endOfDay(addDays(today, days)).toISOString())
        : qb.gte(dateCol, addDays(today, -days).toISOString());
    }
  }

  const from = (page - 1) * limit;
  const { data, error, count } = await qb.range(from, from + limit - 1);

  if (error) {
    console.error('[api:tenders] query failed', error);
    throw new ApiError(500, 'DB_ERROR', 'Failed to fetch tenders');
  }

  return NextResponse.json({
    source: 'supabase_tenders',
    count: data?.length ?? 0,
    total_items: count ?? 0,
    items: data ?? [],
    page,
    limit,
    has_more: count != null ? from + limit < count : false,
  });
});
