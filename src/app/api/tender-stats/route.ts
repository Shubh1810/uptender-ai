import { NextResponse } from 'next/server';
import { createClient } from '@/server/supabase/server';

/**
 * GET /api/tender-stats: public count of active tenders (landing page, header).
 *
 * Anonymous visitors can't read the `tenders` table (see the security
 * hardening migration), so the count comes from the `active_tender_count()`
 * SECURITY DEFINER function. Cached at the CDN for 5 minutes.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('active_tender_count');
    if (error) throw error;

    const liveTendersCount = Number(data ?? 0);
    return NextResponse.json(
      {
        success: true,
        data: { liveTendersCount, lastUpdated: new Date().toISOString(), isConnected: liveTendersCount > 0 },
      },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (error) {
    console.error('[api:tender-stats] failed', error);
    return NextResponse.json(
      { success: false, data: { liveTendersCount: 0, lastUpdated: '', isConnected: false } },
      { status: 500 }
    );
  }
}
