// Tender Statistics Management
// Stores and retrieves live tenders count globally across all users via API
// Count persists forever until next search (no expiration)

export interface TenderStats {
  liveTendersCount: number;
  lastUpdated: string;
  isConnected: boolean;  // Always true if data exists
}

/**
 * Save live tenders count to server (global for all users)
 */
export async function saveLiveTendersCount(count: number): Promise<void> {
  try {
    const response = await fetch('/api/tender-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        liveTendersCount: count,
        updatedBy: 'search-user',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save tender stats to server');
    }

    const data = await response.json();
    console.log(`📊 Saved global live tenders count: ${count}`, data);
    
    // Dispatch event to notify all components on this client
    window.dispatchEvent(new CustomEvent('live-tenders-updated', { 
      detail: { count, timestamp: Date.now() } 
    }));
  } catch (err) {
    console.error('Failed to save live tenders count:', err);
  }
}

/**
 * Get live tenders count from server (global for all users)
 * Count persists forever - always shows as "Connected" if data exists
 */
export async function getLiveTendersCount(): Promise<TenderStats> {
  try {
    const response = await fetch('/api/tender-stats', {
      method: 'GET',
      cache: 'no-store', // Always get fresh data
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tender stats from server');
    }

    const result = await response.json();
    const data = result.data;
    
    if (data && data.liveTendersCount > 0) {
      // Always show as connected if we have data (no expiration)
      return {
        liveTendersCount: data.liveTendersCount,
        lastUpdated: new Date(data.lastUpdated).toLocaleTimeString(),
        isConnected: true,  // Always connected if data exists
      };
    }
  } catch (err) {
    console.error('Failed to get live tenders count:', err);
  }
  
  // Only return disconnected if no data exists
  return {
    liveTendersCount: 0,
    lastUpdated: '',
    isConnected: false,
  };
}

