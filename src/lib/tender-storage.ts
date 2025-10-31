/**
 * Local Storage Manager for Tenders
 * Persists tender search results in browser localStorage
 * Data persists across sessions and survives logout/login
 */

export interface StoredTenderData {
  tenders: any[];
  totalCount: number;
  liveTendersCount: number;
  lastFetched: string;
  searchQuery: string;
  page: number;
}

const STORAGE_KEY_PREFIX = 'tenderhub_tenders_';

/**
 * Get the storage key for a specific user
 */
function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

/**
 * Save tenders to localStorage for a specific user
 */
export function saveTendersToLocalStorage(
  userId: string,
  data: StoredTenderData
): void {
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`💾 Tenders saved to localStorage for user ${userId}`);
  } catch (error) {
    console.error('❌ Failed to save tenders to localStorage:', error);
    // Handle quota exceeded or other localStorage errors
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('⚠️ localStorage quota exceeded, clearing old data');
      clearTendersFromLocalStorage(userId);
    }
  }
}

/**
 * Load tenders from localStorage for a specific user
 */
export function loadTendersFromLocalStorage(
  userId: string
): StoredTenderData | null {
  try {
    const key = getStorageKey(userId);
    const data = localStorage.getItem(key);
    
    if (!data) {
      console.log('📭 No saved tenders found in localStorage');
      return null;
    }
    
    const parsed = JSON.parse(data) as StoredTenderData;
    console.log(`✅ Loaded ${parsed.tenders.length} tenders from localStorage`);
    return parsed;
  } catch (error) {
    console.error('❌ Failed to load tenders from localStorage:', error);
    return null;
  }
}

/**
 * Clear tenders from localStorage for a specific user
 */
export function clearTendersFromLocalStorage(userId: string): void {
  try {
    const key = getStorageKey(userId);
    localStorage.removeItem(key);
    console.log('🗑️ Tenders cleared from localStorage');
  } catch (error) {
    console.error('❌ Failed to clear tenders from localStorage:', error);
  }
}

/**
 * Check if stored data is still fresh (within 24 hours)
 */
export function isStoredDataFresh(lastFetched: string, maxAgeHours = 24): boolean {
  const lastFetchedTime = new Date(lastFetched).getTime();
  const now = new Date().getTime();
  const ageHours = (now - lastFetchedTime) / (1000 * 60 * 60);
  return ageHours < maxAgeHours;
}

/**
 * Get all stored tender keys (for cleanup/debugging)
 */
export function getAllStoredTenderKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
      keys.push(key);
    }
  }
  return keys;
}

