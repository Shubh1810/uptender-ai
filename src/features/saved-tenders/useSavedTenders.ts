'use client';

import { useState, useEffect, useCallback } from 'react';

/** Minimal shape needed to save a tender (matches rows from /api/tenders). */
export interface SaveableTender {
  ref_no: string;
  title: string;
  url: string;
  organisation?: string | null;
  closing_date?: string | null;
  published_date?: string | null;
  opening_date?: string | null;
}

export interface SavedTender {
  id: string;
  tender_ref: string;
  title: string;
  url: string;
  tender_organisation: string | null;
  tender_closing_date: string | null;
  tender_published_date: string | null;
  tender_opening_date: string | null;
  created_at: string;
  notes?: string | null;
  tags?: string[];
  // Computed by the saved_tenders_with_stats view
  days_until_closing?: number | null;
  closing_soon?: boolean;
  is_closed?: boolean;
}

export type SaveResult =
  | { success: true; message?: string }
  | { success: false; error: string; limitExceeded?: boolean; currentCount?: number; limit?: number };

export function useSavedTenders() {
  const [savedTenderIds, setSavedTenderIds] = useState<Set<string>>(new Set());
  const [savedTenders, setSavedTenders] = useState<SavedTender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedTenders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/saved-tenders');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch saved tenders');

      const rows: SavedTender[] = data.saved_tenders ?? [];
      setSavedTenders(rows);
      setSavedTenderIds(new Set(rows.map((t) => t.tender_ref)));
    } catch (err) {
      console.error('Error fetching saved tenders:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Data fetch on mount; state is set after the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSavedTenders();
  }, [fetchSavedTenders]);

  const saveTender = useCallback(
    async (tender: SaveableTender): Promise<SaveResult> => {
      const tenderId = tender.ref_no;
      const removeId = () =>
        setSavedTenderIds((prev) => {
          const next = new Set(prev);
          next.delete(tenderId);
          return next;
        });

      setSavedTenderIds((prev) => new Set(prev).add(tenderId)); // optimistic

      try {
        const response = await fetch('/api/saved-tenders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tender_ref: tenderId,
            title: tender.title,
            url: tender.url,
            tender_organisation: tender.organisation ?? null,
            tender_closing_date: tender.closing_date ?? null,
            tender_published_date: tender.published_date ?? null,
            tender_opening_date: tender.opening_date ?? null,
          }),
        });
        const data = await response.json();

        if (response.ok) return { success: true };
        if (data.code === 'DUPLICATE_ERROR') return { success: true, message: 'Already saved' }; // keep it marked

        removeId();
        if (data.code === 'LIMIT_EXCEEDED') {
          return {
            success: false,
            error: data.message || data.error,
            limitExceeded: true,
            currentCount: data.current_count,
            limit: data.limit,
          };
        }
        return { success: false, error: data.error || 'Failed to save tender' };
      } catch (err) {
        console.error('Error saving tender:', err);
        removeId();
        return { success: false, error: 'Failed to save tender' };
      }
    },
    []
  );

  const unsaveTender = useCallback(
    async (tenderId: string): Promise<SaveResult> => {
      const previousRows = savedTenders;
      setSavedTenderIds((prev) => {
        const next = new Set(prev);
        next.delete(tenderId);
        return next;
      });
      setSavedTenders((prev) => prev.filter((t) => t.tender_ref !== tenderId));

      const revert = () => {
        setSavedTenderIds((prev) => new Set(prev).add(tenderId));
        setSavedTenders(previousRows);
      };

      try {
        const response = await fetch(`/api/saved-tenders?tender_ref=${encodeURIComponent(tenderId)}`, {
          method: 'DELETE',
        });
        if (response.ok) return { success: true };
        const data = await response.json().catch(() => ({}));
        revert();
        return { success: false, error: data.error || 'Failed to remove tender' };
      } catch (err) {
        console.error('Error unsaving tender:', err);
        revert();
        return { success: false, error: 'Failed to remove tender' };
      }
    },
    [savedTenders]
  );

  const isSaved = useCallback((tenderId: string) => savedTenderIds.has(tenderId), [savedTenderIds]);
  const getSavedCount = useCallback(() => savedTenderIds.size, [savedTenderIds]);

  return {
    savedTenderIds,
    savedTenders,
    loading,
    error,
    saveTender,
    unsaveTender,
    isSaved,
    getSavedCount,
    refetch: fetchSavedTenders,
  };
}
