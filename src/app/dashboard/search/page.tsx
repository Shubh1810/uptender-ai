'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { 
  Search,
  Filter,
  Calendar,
  MapPin,
  Building,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { trackTenderSearch, trackTenderExternalClick } from '@/lib/posthog/events';
import {
  saveTendersToLocalStorage,
  loadTendersFromLocalStorage,
  isStoredDataFresh,
  type StoredTenderData
} from '@/lib/tender-storage';
// Note: We no longer use /api/tenders-cache or saveLiveTendersCount
// Stats are read directly from Supabase latest_snapshot!

interface Tender {
  title: string;
  ref_no: string;
  closing_date: string;
  opening_date: string;
  published_date: string;
  organisation: string;
  url: string;
}

interface TenderResponse {
  source: string;
  count: number;  // Count of items on current page
  live_tenders: number;  // Total live tenders globally
  total_items?: number;  // Total count of matching tenders (after filtering)
  items: Tender[];
  debug_steps?: Array<{
    step: string;
    status: string;
    details: any;
    timestamp: string;
  }>;
  total_processing_time?: number;
  captcha_screenshot?: any;
}

// No local cache - users must search to see tenders

export default function SearchPage() {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastFetchTime, setLastFetchTime] = useState<string | null>(null);
  const [loadedFromCache, setLoadedFromCache] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Increase API page size to handle thousands of tenders per request
  const API_PAGE_LIMIT = 200;

  // Auth check and load saved tenders
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Handle auth errors (like invalid refresh token)
        if (error) {
          console.error('Auth error:', error.message);
          // Clear invalid session and redirect
          await supabase.auth.signOut();
          router.push('/');
          return;
        }
        
        if (!session?.user) {
          router.push('/');
          return;
        }
        
        setUser(session.user);
        
        // Load saved tenders from localStorage
        const savedData = loadTendersFromLocalStorage(session.user.id);
        if (savedData && savedData.tenders.length > 0) {
          setTenders(savedData.tenders);
          setTotalCount(savedData.totalCount);
          setCurrentPage(savedData.page);
          setSearchQuery(savedData.searchQuery);
          setLastFetchTime(new Date(savedData.lastFetched).toLocaleTimeString());
          setLoadedFromCache(true);
          
          // Check if data is fresh
          const isFresh = isStoredDataFresh(savedData.lastFetched);
          console.log(
            `📦 Loaded ${savedData.tenders.length} tenders from localStorage (${isFresh ? 'fresh' : 'stale - consider refreshing'})`
          );
        }
        // Note: If no localStorage data, user clicks "Search" to fetch from Supabase snapshot
      } catch (error) {
        console.error('Error in getUser:', error);
        // On any error, redirect to home
        router.push('/');
      }
    };
    getUser();
  }, [router, supabase.auth]);

  // Fetch tenders from API
  const fetchTenders = async (page = 1, query = '') => {
    const startTime = performance.now();
    console.log('⏱️ Starting tender fetch...');
    
    setLoading(true);
    setLoadingProgress(0);
    setError(null);
    
    // Fast progress animation - completes when data arrives
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev; // Stop at 90% until real data arrives
        return prev + 10; // Fast increments
      });
    }, 200); // Every 200ms for smoother animation
    
    try {
      // Some API deployments accept different pagination param names.
      // To ensure compatibility across environments, we include common ones.
      const params = new URLSearchParams({
        page: page.toString(),
        // Primary param used by local API
        limit: `${API_PAGE_LIMIT}`,
        // Fallbacks for production API variants that may ignore `limit`
        page_size: `${API_PAGE_LIMIT}`,
        per_page: `${API_PAGE_LIMIT}`,
        ...(query && { query }),
      });

      // Use internal Next.js API (fetches from Supabase - instant!)
      console.log('🌐 Using internal API (Supabase snapshot)');

      const fetchStartTime = performance.now();
      const response = await fetch(
        `/api/tenders?${params}`,
        { cache: 'no-store' }
      );
      const fetchEndTime = performance.now();
      console.log(`⏱️ API fetch took: ${((fetchEndTime - fetchStartTime) / 1000).toFixed(2)}s`);

      if (!response.ok) {
        throw new Error('Failed to fetch tenders');
      }

      const parseStartTime = performance.now();
      const data: TenderResponse = await response.json();
      const parseEndTime = performance.now();
      console.log(`⏱️ JSON parse took: ${((parseEndTime - parseStartTime) / 1000).toFixed(2)}s`);
      
      // Check if API returned an error in debug_steps
      const hasError = data.debug_steps?.some(step => step.status === 'error');
      if (hasError && data.items.length === 0) {
        const errorStep = data.debug_steps?.find(step => step.status === 'error');
        throw new Error(errorStep?.details?.message || 'API processing error');
      }
      
      // Complete progress bar IMMEDIATELY
      clearInterval(progressInterval);
      setLoadingProgress(100);

      const fetchedTenders = data.items || [];
      const fetchedCount = data.count || 0;
      const totalItemsCount = data.total_items || fetchedCount; // Use total_items if available, fallback to count
      const liveTendersCount = data.live_tenders || 0;

      // Update UI STATE FIRST - this triggers immediate render
      setTenders(fetchedTenders);
      setTotalCount(totalItemsCount); // Use total_items for accurate count display
      setCurrentPage(page);
      setLoadedFromCache(false);
      setLastFetchTime(new Date().toLocaleTimeString());
      setLoading(false); // End loading IMMEDIATELY after data arrives
      
      const renderTime = performance.now();
      console.log(`⏱️ Total time to render: ${((renderTime - startTime) / 1000).toFixed(2)}s`);
      console.log(`📊 Loaded ${fetchedTenders.length} tenders on page ${page} (${totalItemsCount} total matching tenders, ${liveTendersCount} total live tenders)`);
      
      // ALL post-processing happens AFTER UI updates (non-blocking)
      
      // Save to localStorage for fast reload on next visit (user-specific)
      if (user) {
        const storageData: StoredTenderData = {
          tenders: fetchedTenders,
          totalCount: totalItemsCount, // Use total_items for accurate count
          liveTendersCount: liveTendersCount,
          lastFetched: new Date().toISOString(),
          searchQuery: query,
          page: page,
        };
        saveTendersToLocalStorage(user.id, storageData);
        console.log('💾 Saved to localStorage for quick access');
      }
      
      // Track analytics (non-blocking)
      trackTenderSearch({
        query: query || undefined,
        resultsCount: totalItemsCount, // Use total_items for accurate analytics
        page: page,
      });
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tenders';
      setError(errorMessage);
      console.error('❌ Error fetching tenders:', err);
      setLoading(false);
      setLoadingProgress(0);
    }
    // No finally block needed - loading is set to false in success path
  };

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTenders(1, searchQuery);
  };

  if (!user) return null;

  return (
    <div className="flex-1 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Tenders</h1>
        <p className="text-gray-600">Find tenders from across India</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, organization, or reference number..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Search
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Results Count & Cache Info */}
      {!loading && !error && tenders.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Found <span className="font-semibold text-gray-900">{totalCount}</span> tenders
          </div>
          {lastFetchTime && (
            <div className="text-xs text-gray-500">
              💾 Last updated: {lastFetchTime}
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900 mb-1">Error loading tenders</p>
            <p className="text-sm text-red-700">{error}</p>
            <Button
              onClick={() => fetchTenders(currentPage, searchQuery)}
              className="mt-3 text-xs px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Loading State with Circular Progress */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          {/* Circular Progress Bar */}
          <div className="relative w-32 h-32 mb-6">
            <svg className="transform -rotate-90 w-32 h-32">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={2 * Math.PI * 56 * (1 - loadingProgress / 100)}
                className="text-blue-600 transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{Math.round(loadingProgress)}%</span>
            </div>
          </div>
          
          <p className="text-gray-600 font-medium mb-2">Loading tenders...</p>
          <p className="text-sm text-gray-500">Fetching from database snapshot...</p>
        </div>
      )}

      {/* Tenders List */}
      {!loading && !error && tenders.length === 0 && (
        <div className="text-center py-20">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No tenders found</p>
          <p className="text-sm text-gray-400">Try adjusting your search terms</p>
        </div>
      )}

      {!loading && !error && tenders.length > 0 && (
        <div className="space-y-4">
          {tenders.map((tender, index) => (
            <div
              key={`${tender.ref_no}-${index}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                    {tender.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="h-4 w-4" />
                    <span>{tender.organisation}</span>
                  </div>
                </div>
                <a
                  href={tender.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 ml-4"
                  onClick={() => {
                    trackTenderExternalClick({
                      tenderId: tender.ref_no,
                      tenderTitle: tender.title,
                      url: tender.url,
                    });
                  }}
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </a>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Reference No.</p>
                    <p className="text-sm font-medium text-gray-900">{tender.ref_no}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Published</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(tender.published_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-orange-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Opening Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(tender.opening_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Closing Date</p>
                    <p className="text-sm font-medium text-red-600">
                      {new Date(tender.closing_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                    Active
                  </span>
                  <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">
                    Government
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="text-xs px-3 py-1.5 border-gray-300"
                >
                  Save for Later
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && tenders.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            onClick={() => fetchTenders(currentPage - 1, searchQuery)}
            disabled={currentPage === 1}
            variant="outline"
            className="px-4 py-2"
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {currentPage}
          </span>
          <Button
            onClick={() => fetchTenders(currentPage + 1, searchQuery)}
            disabled={tenders.length < API_PAGE_LIMIT}
            variant="outline"
            className="px-4 py-2"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

