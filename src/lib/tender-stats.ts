/**
 * Tender Statistics Management - Simplified Architecture
 * 
 * Reads live tender count directly from Supabase latest_snapshot table.
 * No more in-memory storage, no more POST updates, no more events!
 * 
 * CRON job updates Supabase → API reads from Supabase → Display shows data
 * Simple, reliable, always accurate!
 */

export interface TenderStats {
  liveTendersCount: number;
  lastUpdated: string;
  isConnected: boolean;
}

/**
 * Get live tenders count from Supabase (via API route)
 * 
 * This always reflects the latest CRON scrape data.
 * Works for first-time visitors, logged-out users, and survives deploys!
 */
export async function getLiveTendersCount(): Promise<TenderStats> {
  try {
    const response = await fetch('/api/tender-stats', {
      method: 'GET',
      cache: 'no-store', // Always get fresh data from Supabase
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tender stats');
    }

    const result = await response.json();
    const data = result.data;
    
    return {
      liveTendersCount: data.liveTendersCount || 0,
      lastUpdated: data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : '',
      isConnected: data.isConnected || false,
    };
  } catch (err) {
    console.error('Failed to get live tenders count:', err);
    return {
      liveTendersCount: 0,
      lastUpdated: '',
      isConnected: false,
    };
  }
}

