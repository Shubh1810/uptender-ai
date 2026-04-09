import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SELECT_FIELDS = [
  'id', 'ref_no', 'tender_id', 'source', 'title', 'organisation', 'url',
  'published_date', 'closing_date', 'opening_date', 'work_description',
  'tender_value', 'product_category', 'sub_category', 'location', 'pincode',
  'period_of_work_days', 'bid_validity_days', 'emd_amount',
  'tender_type', 'tender_category', 'contract_type', 'is_active',
].join(', ');

export async function GET(request: NextRequest) {
  const startTime = performance.now();

  try {
    const { searchParams } = new URL(request.url);
    const query      = searchParams.get('query') || '';
    const page       = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit      = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const category   = searchParams.get('category') || '';
    const location   = searchParams.get('location') || '';
    const dateFilter = searchParams.get('date_filter') || '';
    const tenderType = searchParams.get('tender_type') || '';

    const supabase = await createClient();

    let qb = supabase
      .from('tenders')
      .select(SELECT_FIELDS, { count: 'exact' })
      .eq('is_active', true)
      .order('closing_date', { ascending: true, nullsFirst: false });

    if (query) {
      qb = qb.or(
        `title.ilike.%${query}%,organisation.ilike.%${query}%,ref_no.ilike.%${query}%`
      );
    }
    if (category)   qb = qb.ilike('product_category', `%${category}%`);
    if (location)   qb = qb.ilike('location', `%${location}%`);
    if (tenderType) qb = qb.ilike('tender_type', `%${tenderType}%`);

    if (dateFilter) {
      const days = parseInt(dateFilter);
      if (!isNaN(days)) {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        qb = qb.gte('published_date', cutoff);
      }
    }

    const from = (page - 1) * limit;
    const to   = from + limit - 1;
    qb = qb.range(from, to);

    const { data, error, count } = await qb;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tenders', details: error.message },
        { status: 500 }
      );
    }

    const endTime = performance.now();

    return NextResponse.json({
      source: 'supabase_tenders',
      count: data?.length ?? 0,
      total_items: count ?? 0,
      live_tenders: count ?? 0,
      items: data ?? [],
      page,
      limit,
      has_more: count != null ? from + limit < count : false,
      total_processing_time: parseFloat(((endTime - startTime) / 1000).toFixed(3)),
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
