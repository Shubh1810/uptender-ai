// Tender Statistics Management
// Stores and retrieves live tenders count globally across all users via API

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface TenderStats {
  liveTendersCount: number;
  lastUpdated: string;
  isConnected: boolean;
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
    
    if (data) {
      const now = Date.now();
      const savedTime = new Date(data.lastUpdated).getTime();
      const isRecent = now - savedTime < CACHE_DURATION;
      
      return {
        liveTendersCount: data.liveTendersCount,
        lastUpdated: new Date(data.lastUpdated).toLocaleTimeString(),
        isConnected: isRecent,
      };
    }
  } catch (err) {
    console.error('Failed to get live tenders count:', err);
  }
  
  return {
    liveTendersCount: 0,
    lastUpdated: '',
    isConnected: false,
  };
}

