// Auto-refresh tenders every 12 hours
// This runs in the browser and triggers the server-side refresh

const AUTO_REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const LAST_REFRESH_KEY = 'tenderpost_last_auto_refresh';

/**
 * Check if auto-refresh is due
 * NOTE: Actual refresh is now handled by CRON (/api/cron/auto-refresh)
 * This function just checks cache freshness and loads data
 */
export async function checkAndTriggerAutoRefresh(): Promise<boolean> {
  try {
    const lastRefresh = localStorage.getItem(LAST_REFRESH_KEY);
    const now = Date.now();
    
    // Check cache age for logging purposes
    if (!lastRefresh) {
      console.log('ℹ️ No previous refresh detected (CRON will handle background refresh)');
      localStorage.setItem(LAST_REFRESH_KEY, now.toString());
    } else {
      const cacheAge = now - parseInt(lastRefresh);
      const hoursOld = Math.floor(cacheAge / (60 * 60 * 1000));
      
      if (cacheAge > AUTO_REFRESH_INTERVAL) {
        console.log(`⏰ Cache is ${hoursOld} hours old. CRON should refresh automatically every 12 hours.`);
      } else {
        const nextRefresh = new Date(parseInt(lastRefresh) + AUTO_REFRESH_INTERVAL);
        console.log(`✅ Cache is fresh (${hoursOld} hours old). Next CRON refresh: ${nextRefresh.toLocaleString()}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Cache check error:', error);
    return false;
  }
}

/**
 * Get cached tenders from global cache
 */
export async function getCachedTenders() {
  try {
    const response = await fetch('/api/tenders-cache', {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.data;
    }
  } catch (error) {
    console.error('❌ Failed to get cached tenders:', error);
  }
  
  return {
    tenders: [],
    totalCount: 0,
    liveTendersCount: 0,
    lastFetched: '',
    source: '',
  };
}

/**
 * Force manual refresh (triggers CRON endpoint manually)
 * NOTE: Requires CRON_SECRET to be accessible or use search button instead
 */
export async function forceRefreshTenders(): Promise<boolean> {
  console.log('🔄 Force refresh: Use the Search button for manual refresh');
  console.log('ℹ️ Background CRON refreshes automatically every 12 hours');
  
  // Clear timestamp to allow fresh check
  localStorage.removeItem(LAST_REFRESH_KEY);
  
  return false;
}

