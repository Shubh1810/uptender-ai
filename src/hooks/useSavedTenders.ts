'use client';

import { useState, useEffect, useCallback } from 'react';

interface Tender {
  ref_no: string;
  title: string;
  url: string;
  organisation: string;
  closing_date: string;
  published_date: string;
  opening_date: string;
}

interface SavedTenderData {
  id: string;
  tender_ref: string;
  title: string;
  url: string;
  tender_organisation: string;
  tender_closing_date: string;
  tender_published_date: string;
  tender_opening_date: string;
  created_at: string;
  notes?: string;
  tags?: string[];
  // Computed fields from view
  days_until_closing?: number;
  closing_soon?: boolean;
  is_closed?: boolean;
}

export function useSavedTenders() {
  const [savedTenderIds, setSavedTenderIds] = useState<Set<string>>(new Set());
  const [savedTenders, setSavedTenders] = useState<SavedTenderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // Fetch all saved tenders
  // ========================================
  const fetchSavedTenders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/saved-tenders');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch saved tenders');
      }

      setSavedTenders(data.saved_tenders || []);
      
      // Create Set of IDs for fast O(1) lookup
      const ids = new Set(
        (data.saved_tenders || []).map((t: SavedTenderData) => t.tender_ref)
      );
      setSavedTenderIds(ids);

      // Cache in localStorage for instant load on next visit
      if (typeof window !== 'undefined') {
        localStorage.setItem('saved_tender_ids', JSON.stringify([...ids]));
      }

    } catch (err) {
      console.error('Error fetching saved tenders:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================
  // Load from localStorage on mount (instant)
  // Then fetch from server (accurate)
  // ========================================
  useEffect(() => {
    // INSTANT load from cache
    if (typeof window !== 'undefined') {
      const cachedIds = localStorage.getItem('saved_tender_ids');
      if (cachedIds) {
        try {
          const ids = JSON.parse(cachedIds);
          setSavedTenderIds(new Set(ids));
          setLoading(false); // Instant feedback
        } catch (e) {
          console.error('Error parsing cached IDs:', e);
        }
      }
    }

    // Then fetch fresh data from server
    fetchSavedTenders();
  }, [fetchSavedTenders]);

  // ========================================
  // Save tender (OPTIMISTIC UPDATE - Ultra Fast!)
  // ========================================
  const saveTender = useCallback(async (tender: Tender) => {
    const tenderId = tender.ref_no;

    // STEP 1: Optimistic update - INSTANT UI feedback (0ms)
    setSavedTenderIds((prev) => new Set([...prev, tenderId]));

    try {
      // STEP 2: Save to server (background - 100-200ms)
      const response = await fetch('/api/saved-tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tender_ref: tenderId,
          title: tender.title,
          url: tender.url,
          tender_organisation: tender.organisation,
          tender_closing_date: tender.closing_date,
          tender_published_date: tender.published_date,
          tender_opening_date: tender.opening_date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update on error
        setSavedTenderIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(tenderId);
          return newSet;
        });

        // Handle duplicate error gracefully (already saved)
        if (data.code === 'DUPLICATE_ERROR') {
          return { success: true, message: 'Already saved' };
        }

        // Handle limit exceeded error
        if (data.code === 'LIMIT_EXCEEDED') {
          return { 
            success: false, 
            error: data.message || data.error,
            limitExceeded: true,
            currentCount: data.current_count,
            limit: data.limit,
            upgradeRequired: true
          };
        }

        throw new Error(data.error || 'Failed to save tender');
      }

      // STEP 3: Update localStorage cache
      if (typeof window !== 'undefined') {
        const currentIds = [...savedTenderIds, tenderId];
        localStorage.setItem('saved_tender_ids', JSON.stringify(currentIds));
      }

      return { success: true, data: data.saved_tender };

    } catch (err) {
      console.error('Error saving tender:', err);
      
      // Revert optimistic update
      setSavedTenderIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tenderId);
        return newSet;
      });

      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to save tender' 
      };
    }
  }, [savedTenderIds]);

  // ========================================
  // Unsave tender (OPTIMISTIC UPDATE - Ultra Fast!)
  // ========================================
  const unsaveTender = useCallback(async (tenderId: string) => {
    // STEP 1: Optimistic update - INSTANT UI feedback (0ms)
    setSavedTenderIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(tenderId);
      return newSet;
    });

    // Also remove from savedTenders array
    setSavedTenders((prev) => prev.filter(t => t.tender_ref !== tenderId));

    try {
      // STEP 2: Delete from server (background)
      const response = await fetch(`/api/saved-tenders?tender_ref=${tenderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update on error
        setSavedTenderIds((prev) => new Set([...prev, tenderId]));
        throw new Error(data.error || 'Failed to remove tender');
      }

      // STEP 3: Update localStorage cache
      if (typeof window !== 'undefined') {
        const currentIds = [...savedTenderIds].filter(id => id !== tenderId);
        localStorage.setItem('saved_tender_ids', JSON.stringify(currentIds));
      }

      return { success: true };

    } catch (err) {
      console.error('Error unsaving tender:', err);
      
      // Revert optimistic update
      setSavedTenderIds((prev) => new Set([...prev, tenderId]));

      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to remove tender' 
      };
    }
  }, [savedTenderIds]);

  // ========================================
  // Check if tender is saved (O(1) lookup)
  // ========================================
  const isSaved = useCallback((tenderId: string) => {
    return savedTenderIds.has(tenderId);
  }, [savedTenderIds]);

  // ========================================
  // Get count of saved tenders
  // ========================================
  const getSavedCount = useCallback(() => {
    return savedTenderIds.size;
  }, [savedTenderIds]);

  return {
    // State
    savedTenderIds,
    savedTenders,
    loading,
    error,
    
    // Actions
    saveTender,
    unsaveTender,
    isSaved,
    
    // Utilities
    getSavedCount,
    refetch: fetchSavedTenders,
  };
}

