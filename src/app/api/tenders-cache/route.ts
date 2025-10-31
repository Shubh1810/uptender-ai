import { NextRequest, NextResponse } from 'next/server';

// Global tender cache (shared across all users)
// NOTE: This resets on server restart. For production, use Redis or database.
let globalTenderCache = {
  tenders: [] as any[],
  totalCount: 0,
  liveTendersCount: 0,
  lastFetched: new Date().toISOString(),
  source: '',
};

// GET: Retrieve cached tenders
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: globalTenderCache,
      cached: true,
    });
  } catch (error) {
    console.error('❌ Error fetching tender cache:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tender cache' },
      { status: 500 }
    );
  }
}

// POST: Update tender cache (called by search page or auto-refresh)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenders, totalCount, liveTendersCount, source } = body;

    // Validate data
    if (!Array.isArray(tenders)) {
      return NextResponse.json(
        { error: 'Invalid tenders array.' },
        { status: 400 }
      );
    }

    // Update global cache
    globalTenderCache = {
      tenders,
      totalCount: totalCount || tenders.length,
      liveTendersCount: liveTendersCount || 0,
      lastFetched: new Date().toISOString(),
      source: source || 'manual',
    };

    console.log(`📦 Global tender cache updated: ${tenders.length} tenders, ${liveTendersCount} live tenders (source: ${source})`);

    return NextResponse.json({
      success: true,
      data: globalTenderCache,
      message: 'Tender cache updated successfully',
    });
  } catch (error) {
    console.error('❌ Error updating tender cache:', error);
    return NextResponse.json(
      { error: 'Failed to update tender cache' },
      { status: 500 }
    );
  }
}

