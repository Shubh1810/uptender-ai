import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET: Retrieve live tenders count directly from Supabase
 * 
 * This endpoint reads from the latest_snapshot table which is updated by CRON.
 * No need for in-memory storage - Supabase IS the source of truth!
 * 
 * Benefits:
 * - Always accurate, never shows 0 on deploy
 * - Works for first-time visitors immediately
 * - Survives server restarts
 * - Single source of truth
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
      return NextResponse.json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? 'Missing Supabase env vars' : undefined,
        data: { liveTendersCount: 0, lastUpdated: '', isConnected: false },
      }, { status: 500 });
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Direct read from Supabase - always fresh, always accurate
    const { data: snapshot, error } = await supabase
      .from('latest_snapshot')
      .select('live_tenders, scraped_at, count')
      .eq('id', 1)
      .single();

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

    if (!snapshot) {
      console.warn('⚠️ No snapshot data found in database');
      return NextResponse.json({
        success: true,
        data: {
          liveTendersCount: 0,
          lastUpdated: '',
          isConnected: false,
        }
      });
    }

    const liveTendersCount = snapshot.live_tenders || snapshot.count || 0;
    const isConnected = liveTendersCount > 0;

    console.log(`📊 Fetched live tender stats: ${liveTendersCount} tenders (scraped at: ${snapshot.scraped_at})`);

    return NextResponse.json({
      success: true,
      data: {
        liveTendersCount,
        lastUpdated: snapshot.scraped_at,
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

