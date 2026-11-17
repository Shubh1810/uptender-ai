export interface TenderStats {
  liveTendersCount: number;
  lastUpdated: string;
  isConnected: boolean;
}

const EMPTY: TenderStats = { liveTendersCount: 0, lastUpdated: '', isConnected: false };

/** Matches the CDN cache on /api/tender-stats; polling faster than this just re-reads the cache. */
const TTL_MS = 60_000;

let cached: { at: number; promise: Promise<TenderStats> } | null = null;

async function fetchStats(): Promise<TenderStats> {
  try {
    const response = await fetch('/api/tender-stats');
    if (!response.ok) return EMPTY;

    const { data } = await response.json();
    return {
      liveTendersCount: data?.liveTendersCount || 0,
      lastUpdated: data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : '',
      isConnected: Boolean(data?.isConnected),
    };
  } catch {
    return EMPTY;
  }
}

/**
 * Live count of active tenders (via `active_tender_count()`).
 *
 * Shared across the page: the Header and Hero both call this (and re-poll),
 * but concurrent and repeat calls within 60s reuse one request. Never throws;
 * returns a "not connected" result on failure.
 */
export function getLiveTendersCount(): Promise<TenderStats> {
  const now = Date.now();
  if (!cached || now - cached.at > TTL_MS) {
    cached = { at: now, promise: fetchStats() };
  }
  return cached.promise;
}
