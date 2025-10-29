import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for live tenders count (shared across all users)
// NOTE: This resets on server restart. For production, use Redis or database.
let globalTenderStats = {
  liveTendersCount: 0,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system',
};

// GET: Retrieve current live tenders count
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: globalTenderStats,
    });
  } catch (error) {
    console.error('❌ Error fetching tender stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tender stats' },
      { status: 500 }
    );
  }
}

// POST: Update live tenders count (called by search page)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { liveTendersCount, updatedBy = 'user' } = body;

    // Validate count
    if (typeof liveTendersCount !== 'number' || liveTendersCount < 0) {
      return NextResponse.json(
        { error: 'Invalid liveTendersCount. Must be a positive number.' },
        { status: 400 }
      );
    }

    // Update global stats
    globalTenderStats = {
      liveTendersCount,
      lastUpdated: new Date().toISOString(),
      updatedBy,
    };

    console.log(`📊 Global tender stats updated: ${liveTendersCount} live tenders (by ${updatedBy})`);

    return NextResponse.json({
      success: true,
      data: globalTenderStats,
      message: 'Tender stats updated successfully',
    });
  } catch (error) {
    console.error('❌ Error updating tender stats:', error);
    return NextResponse.json(
      { error: 'Failed to update tender stats' },
      { status: 500 }
    );
  }
}

