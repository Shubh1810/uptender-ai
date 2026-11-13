/**
 * Tender Statistics Management - Simplified Architecture
 *
 * Reads the live tender count from the same Supabase `tenders` table query
 * used by the dashboard search experience.
 */

export interface TenderStats {
  liveTendersCount: number;
  lastUpdated: string;
  isConnected: boolean;
}

/**
 * Get live tenders count from Supabase (via API route).
 *
 * This stays aligned with the search dashboard by counting active rows from
 * the `tenders` table.
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
