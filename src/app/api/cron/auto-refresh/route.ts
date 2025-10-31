import { NextRequest, NextResponse } from 'next/server';

/**
 * CRON Job: Auto-refresh tenders every 12 hours
 * This endpoint should be called by:
 * 1. Vercel Cron (vercel.json)
 * 2. External cron service (cron-job.org, EasyCron)
 * 3. GitHub Actions (scheduled workflow)
 * 
 * No user login required - runs independently
 */

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key-here';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.log('❌ Unauthorized cron attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 CRON: Starting scheduled tender auto-refresh...');

    // Determine API URL based on environment
    const isDevelopment = process.env.NODE_ENV === 'development';
    const apiBaseUrl = isDevelopment 
      ? 'http://localhost:8000'
      : 'https://tenderpost-api.onrender.com';

    // Fetch tenders from external API
    const params = new URLSearchParams({
      page: '1',
      limit: '50',
    });

    const apiResponse = await fetch(`${apiBaseUrl}/api/tenders?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`External API responded with status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    
    // Extract data
    const tenders = data.items || [];
    const totalCount = data.count || 0;
    const liveTendersCount = data.live_tenders || 0;

    console.log(`✅ CRON: Fetched ${tenders.length} tenders, ${liveTendersCount} live tenders`);

    // Get the base URL for internal API calls
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    (isDevelopment ? 'http://localhost:3000' : 'https://tenderpost.org');

    // Update global tender cache
    const cacheResponse = await fetch(`${baseUrl}/api/tenders-cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenders,
        totalCount,
        liveTendersCount,
        source: 'cron-auto-refresh',
      }),
    });

    if (!cacheResponse.ok) {
      console.error('❌ CRON: Failed to update tender cache');
    } else {
      console.log('✅ CRON: Updated tender cache');
    }

    // Update live tenders stats
    const statsResponse = await fetch(`${baseUrl}/api/tender-stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        liveTendersCount,
        updatedBy: 'cron-auto-refresh',
      }),
    });

    if (!statsResponse.ok) {
      console.error('❌ CRON: Failed to update tender stats');
    } else {
      console.log('✅ CRON: Updated tender stats');
    }

    return NextResponse.json({
      success: true,
      message: 'CRON auto-refresh completed successfully',
      data: {
        tendersCount: tenders.length,
        totalCount,
        liveTendersCount,
        timestamp: new Date().toISOString(),
        source: 'cron',
      },
    });

  } catch (error) {
    console.error('❌ CRON: Auto-refresh error:', error);
    return NextResponse.json(
      { 
        error: 'CRON auto-refresh failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Allow POST as well for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}

