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
  FileText,
  Heart,
  ChevronLeft,
  ChevronRight
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
import { useSavedTenders } from '@/hooks/useSavedTenders';
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

  // Saved tenders hook - ultra fast with optimistic updates
  const { isSaved, saveTender, unsaveTender } = useSavedTenders();

  // Display 20 tenders per page (client-side pagination)
  const ITEMS_PER_PAGE = 20;

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
      // Fetch all tenders at once (client-side pagination)
      // Since API loads entire snapshot anyway, better to fetch once and paginate client-side
      const params = new URLSearchParams({
        page: '1', // Always fetch page 1 to get all data
        limit: '10000', // Large limit to get all tenders
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

      // Store ALL tenders for client-side pagination
      // Only fetch once, then paginate in browser for instant navigation
      setTenders(fetchedTenders);
      setTotalCount(totalItemsCount); // Use total_items for accurate count display
      setCurrentPage(1); // Reset to page 1 when new data is fetched
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
    setCurrentPage(1); // Reset to page 1 on new search
    fetchTenders(1, searchQuery);
  };

  // Save/Unsave tender handler
  const handleToggleSave = async (tender: Tender) => {
    if (isSaved(tender.ref_no)) {
      await unsaveTender(tender.ref_no);
    } else {
      await saveTender(tender);
    }
  };

  // Component to handle conditional marquee - only animate if text overflows
  const TenderTitle = ({ title }: { title: string }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const textRef = React.useRef<HTMLSpanElement>(null);
    const [needsMarquee, setNeedsMarquee] = React.useState(false);

    React.useEffect(() => {
      const checkOverflow = () => {
        if (containerRef.current && textRef.current) {
          // Create a temporary element to measure text width
          const temp = document.createElement('span');
          temp.style.visibility = 'hidden';
          temp.style.position = 'absolute';
          temp.style.whiteSpace = 'nowrap';
          temp.style.fontSize = window.getComputedStyle(textRef.current).fontSize;
          temp.style.fontWeight = window.getComputedStyle(textRef.current).fontWeight;
          temp.style.fontFamily = window.getComputedStyle(textRef.current).fontFamily;
          temp.textContent = title;
          document.body.appendChild(temp);
          
          const textWidth = temp.offsetWidth;
          const containerWidth = containerRef.current.offsetWidth;
          document.body.removeChild(temp);
          
          setNeedsMarquee(textWidth > containerWidth);
        }
      };

      // Small delay to ensure DOM is ready
      const timer = setTimeout(checkOverflow, 0);
      window.addEventListener('resize', checkOverflow);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkOverflow);
      };
    }, [title]);

    return (
      <div ref={containerRef} className="block overflow-hidden">
        {needsMarquee ? (
          <span className="tender-title-marquee block">
            <span className="tender-title-marquee-wrapper">
              <span className="tender-title-marquee-content">{title}</span>
              <span className="tender-title-marquee-content">{title}</span>
            </span>
          </span>
        ) : (
          <span ref={textRef} className="block whitespace-nowrap truncate">{title}</span>
        )}
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="flex-1 p-2 lg:p-4 pt-2">
      {/* Header */}
      <div className="mb-2 lg:mb-3">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">Search Tenders</h1>
        <p className="text-xs lg:text-base text-gray-600 dark:text-gray-400">Find tenders from across India</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#18181b] rounded-lg border border-gray-200 dark:border-white/[0.08] p-3 lg:p-5 mb-4 lg:mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 lg:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 text-gray-400 dark:text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, organization, or reference number..."
              className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2.5 text-sm lg:text-base border border-gray-300 dark:border-white/[0.12] rounded-lg bg-white dark:bg-black/20 text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/[0.16] focus:border-transparent transition-all"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="px-4 lg:px-8 py-1.5 lg:py-2.5 text-xs lg:text-sm bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1.5 lg:mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4 animate-spin" />
                <span className="hidden sm:inline">Searching...</span>
              </>
            ) : (
              <>
                <Search className="mr-1.5 lg:mr-2 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">Search</span>
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Results Count & Cache Info */}
      {!loading && !error && tenders.length > 0 && (
        <div className="mb-3 lg:mb-4 flex items-center justify-between">
          <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> tenders
          </div>
          {lastFetchTime && (
            <div className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-500">
              💾 {lastFetchTime}
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6 flex items-start gap-2 lg:gap-3">
          <AlertCircle className="h-4 w-4 lg:h-5 lg:w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-xs lg:text-sm font-medium text-red-900 dark:text-red-300 mb-1">Error loading tenders</p>
            <p className="text-xs lg:text-sm text-red-700 dark:text-red-400/80">{error}</p>
            <Button
              onClick={() => fetchTenders(currentPage, searchQuery)}
              className="mt-2 lg:mt-3 text-[10px] lg:text-xs px-3 lg:px-4 py-1.5 lg:py-2 h-7 lg:h-8 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Loading State with Circular Progress */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 lg:py-20">
          {/* Circular Progress Bar */}
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 mb-4 lg:mb-6">
            <svg className="transform -rotate-90 w-24 h-24 lg:w-32 lg:h-32" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200 dark:text-white/[0.08]"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={2 * Math.PI * 56 * (1 - loadingProgress / 100)}
                className="text-gray-900 dark:text-white transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{Math.round(loadingProgress)}%</span>
            </div>
          </div>
          
          <p className="text-sm lg:text-base text-gray-600 dark:text-white/70 font-medium mb-1.5 lg:mb-2">Loading tenders...</p>
          <p className="text-xs lg:text-sm text-gray-500 dark:text-white/50">Fetching from database snapshot...</p>
        </div>
      )}

      {/* Tenders List */}
      {!loading && !error && tenders.length === 0 && (
        <div className="text-center py-12 lg:py-20">
          <FileText className="h-12 w-12 lg:h-16 lg:w-16 text-gray-300 dark:text-white/[0.15] mx-auto mb-3 lg:mb-4" />
          <p className="text-sm lg:text-base text-gray-500 dark:text-white/60 mb-1.5 lg:mb-2 font-medium">No tenders found</p>
          <p className="text-xs lg:text-sm text-gray-400 dark:text-white/40">Try adjusting your search terms</p>
        </div>
      )}

      {!loading && !error && tenders.length > 0 && (() => {
        // Client-side pagination - slice the tenders array
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const displayedTenders = tenders.slice(startIndex, endIndex);
        
        return (
        <div className="space-y-2 lg:space-y-3">
          {displayedTenders.map((tender, index) => (
            <div
              key={`${tender.ref_no}-${index}`}
              className="bg-white dark:bg-[#18181b] rounded-lg border border-gray-200 dark:border-white/[0.08] p-3 lg:p-5 hover:shadow-md dark:hover:border-white/[0.12] transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2 lg:mb-4">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white/90 mb-1.5 lg:mb-2 leading-snug">
                    {/* Single-line title with conditional marquee - only if text overflows */}
                    <TenderTitle title={tender.title} />
                  </h3>
                  <div className="flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm text-gray-600 dark:text-white/50">
                    <Building className="h-3 w-3 lg:h-3.5 lg:w-3.5 flex-shrink-0" />
                    <span className="truncate">{tender.organisation}</span>
                  </div>
                </div>
                <a
                  href={tender.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 ml-2 lg:ml-4"
                  onClick={() => {
                    trackTenderExternalClick({
                      tenderId: tender.ref_no,
                      tenderTitle: tender.title,
                      url: tender.url,
                    });
                  }}
                >
                  <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black text-xs lg:text-sm px-3 lg:px-4 py-1.5 lg:py-2 h-7 lg:h-9">
                    <ExternalLink className="h-3 w-3 lg:h-3.5 lg:w-3.5 mr-1 lg:mr-1.5" />
                    View
                  </Button>
                </a>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-3 lg:mb-4">
                <div className="flex items-start gap-1.5 lg:gap-2">
                  <FileText className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400 dark:text-white/30 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] lg:text-xs text-gray-500 dark:text-white/40 mb-0.5">Reference No.</p>
                    <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white/80 truncate">{tender.ref_no}</p>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 lg:gap-2">
                  <Calendar className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400 dark:text-white/30 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] lg:text-xs text-gray-500 dark:text-white/40 mb-0.5">Published</p>
                    <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white/80">
                      {new Date(tender.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 lg:gap-2">
                  <Calendar className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400 dark:text-white/30 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] lg:text-xs text-gray-500 dark:text-white/40 mb-0.5">Opening Date</p>
                    <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white/80">
                      {new Date(tender.opening_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 lg:gap-2">
                  <Calendar className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400 dark:text-white/30 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] lg:text-xs text-gray-500 dark:text-white/40 mb-0.5">Closing Date</p>
                    <p className="text-xs lg:text-sm font-medium text-red-600 dark:text-white/70">
                      {new Date(tender.closing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2.5 lg:pt-3.5 border-t border-gray-100 dark:border-white/[0.06]">
                <div className="flex gap-1.5 lg:gap-2">
                  <span className="px-2 lg:px-2.5 py-0.5 lg:py-1 bg-gray-100 dark:bg-white/[0.08] text-gray-700 dark:text-white/70 text-[10px] lg:text-xs rounded-md font-medium">
                    Active
                  </span>
                  <span className="px-2 lg:px-2.5 py-0.5 lg:py-1 bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-white/60 text-[10px] lg:text-xs rounded-md font-medium">
                    Government
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleToggleSave(tender)}
                  className={`text-[10px] lg:text-xs px-2 lg:px-3 py-1 lg:py-1.5 h-6 lg:h-7 transition-all duration-200 ${
                    isSaved(tender.ref_no)
                      ? 'border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20'
                      : 'border-gray-300 dark:border-white/[0.12] dark:text-white/70 dark:hover:bg-white/[0.06] dark:hover:border-white/[0.16]'
                  }`}
                >
                  <Heart 
                    className={`h-2.5 w-2.5 lg:h-3 lg:w-3 mr-1 lg:mr-1.5 transition-all ${
                      isSaved(tender.ref_no) ? 'fill-current' : ''
                    }`}
                  />
                  {isSaved(tender.ref_no) ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        );
      })()}

      {/* Pagination */}
      {!loading && !error && tenders.length > 0 && (() => {
        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        const maxVisiblePages = 7; // Show up to 7 page numbers
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
        
        const handlePageChange = (newPage: number) => {
          if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            // Client-side pagination - just update the page, no API call needed
            setCurrentPage(newPage);
            // Scroll to top of results
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        };
        
        return (
          <div className="mt-6 lg:mt-8">
            {/* Minimal Page Info */}
            <div className="flex items-center justify-center mb-3">
              <span className="text-[10px] lg:text-xs text-gray-500 dark:text-white/50">
                {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalCount)} - {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount}
              </span>
            </div>
            
            {/* Minimal Pagination Controls */}
            <div className="flex items-center justify-center gap-0.5 lg:gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 lg:p-2 rounded-md text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </button>
              
              {/* First page */}
              {startPage > 1 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-2 lg:px-2.5 py-1 lg:py-1.5 text-[11px] lg:text-xs font-medium text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors min-w-[1.75rem] lg:min-w-[2rem]"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="px-1 text-[10px] lg:text-xs text-gray-400 dark:text-white/30">⋯</span>
                  )}
                </>
              )}
              
              {/* Page numbers */}
              {pageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-2 lg:px-2.5 py-1 lg:py-1.5 text-[11px] lg:text-xs font-medium rounded-md transition-colors min-w-[1.75rem] lg:min-w-[2rem] ${
                    pageNum === currentPage
                      ? "bg-gray-900 dark:bg-white text-white dark:text-black"
                      : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              
              {/* Last page */}
              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="px-1 text-[10px] lg:text-xs text-gray-400 dark:text-white/30">⋯</span>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-2 lg:px-2.5 py-1 lg:py-1.5 text-[11px] lg:text-xs font-medium text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors min-w-[1.75rem] lg:min-w-[2rem]"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1.5 lg:p-2 rounded-md text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                aria-label="Next page"
              >
                <ChevronRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

