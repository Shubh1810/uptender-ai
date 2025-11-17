import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Tender {
  title: string;
  ref_no: string;
  closing_date: string;
  opening_date: string;
  published_date: string;
  organisation: string;
  url: string;
}

// GET: Fetch tenders from Supabase latest_snapshot table
export async function GET(request: NextRequest) {
  const startTime = performance.now();
  console.log('🚀 Internal API: Starting tender fetch from Supabase...');
  
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '200');
    
    // Create Supabase client
    const supabase = await createClient();
    
    // Fetch the latest snapshot from Supabase
    const { data: snapshot, error } = await supabase
      .from('latest_snapshot')
      .select('payload, live_tenders, count, scraped_at')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch tenders from database',
          details: error.message 
        },
        { status: 500 }
      );
    }

    if (!snapshot || !snapshot.payload) {
      console.warn('⚠️ No snapshot data found in database');
      return NextResponse.json({
        source: 'supabase_snapshot',
        count: 0,
        live_tenders: 0,
        items: [],
        scraped_at: new Date().toISOString(),
        message: 'No tender data available yet'
      });
    }

    // Parse payload - it contains the array of tenders
    const allTenders: Tender[] = Array.isArray(snapshot.payload) 
      ? snapshot.payload 
      : [];

    console.log(`📦 Found ${allTenders.length} tenders in snapshot`);

    // Client-side filtering by search query
    let filteredTenders = allTenders;
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredTenders = allTenders.filter(tender => 
        tender.title?.toLowerCase().includes(lowerQuery) ||
        tender.organisation?.toLowerCase().includes(lowerQuery) ||
        tender.ref_no?.toLowerCase().includes(lowerQuery)
      );
      console.log(`🔍 Filtered to ${filteredTenders.length} tenders matching query: "${query}"`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit;
    const paginatedTenders = filteredTenders.slice(from, to);

    const endTime = performance.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(3);
    
    console.log(`✅ Internal API completed in ${processingTime}s - returning ${paginatedTenders.length} tenders (page ${page})`);

    return NextResponse.json({
      source: 'supabase_snapshot',
      count: paginatedTenders.length,
      live_tenders: snapshot.live_tenders || filteredTenders.length,
      items: paginatedTenders,
      total_items: filteredTenders.length,
      total_processing_time: parseFloat(processingTime),
      scraped_at: snapshot.scraped_at,
      page: page,
      limit: limit,
      has_more: to < filteredTenders.length,
    });

  } catch (err) {
    console.error('❌ Internal API error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

