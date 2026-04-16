import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET: Retrieve the live tender count from the `tenders` table.
 *
 * This mirrors the search dashboard data source so every part of the app
 * reflects the same active-tender total.
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from('tenders')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    if (error) {
      console.error('❌ Supabase error fetching tender stats:', error.message, error.code, error.details);
      return NextResponse.json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        data: {
          liveTendersCount: 0,
          lastUpdated: '',
          isConnected: false,
        }
      }, { status: 500 });
    }

    const liveTendersCount = count ?? 0;
    const isConnected = liveTendersCount > 0;
    const lastUpdated = new Date().toISOString();

    console.log(`📊 Fetched live tender stats from tenders table: ${liveTendersCount} active tenders`);

    return NextResponse.json({
      success: true,
      data: {
        liveTendersCount,
        lastUpdated,
        isConnected,
      }
    });

  } catch (error) {
    console.error('❌ Error fetching tender stats:', error);
    return NextResponse.json({
      success: false,
      data: {
        liveTendersCount: 0,
        lastUpdated: '',
        isConnected: false,
      }
    }, { status: 500 });
  }
}
