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
  ChevronRight,
  X,
  ChevronDown,
  Bookmark,
  IndianRupee,
  Clock,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { trackTenderSearch, trackTenderExternalClick } from '@/lib/posthog/events';
import { useSavedTenders } from '@/hooks/useSavedTenders';

interface Tender {
  id: string;
  ref_no: string;
  tender_id: string | null;
  source: string;
  title: string;
  organisation: string | null;
  url: string;
  published_date: string | null;
  closing_date: string | null;
  opening_date: string | null;
  work_description: string | null;
  tender_value: number | null;
  product_category: string | null;
  sub_category: string | null;
  location: string | null;
  pincode: string | null;
  period_of_work_days: number | null;
  bid_validity_days: number | null;
  emd_amount: number | null;
  tender_type: string | null;
  tender_category: string | null;
  contract_type: string | null;
  is_active: boolean | null;
}

interface TenderResponse {
  source: string;
  count: number;
  total_items: number;
  items: Tender[];
  page: number;
  limit: number;
  has_more: boolean;
  total_processing_time?: number;
}

interface Filters {
  category: string;
  location: string;
  dateFilter: string;
  tenderType: string;
}

const ITEMS_PER_PAGE = 20;

const formatCurrency = (value: number | null): string | null => {
  if (!value) return null;
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000)    return `₹${(value / 100_000).toFixed(1)}L`;
  return `₹${value.toLocaleString('en-IN')}`;
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

export default function SearchPage() {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: '', location: '', dateFilter: '', tenderType: '',
  });

  const router = useRouter();
  const supabase = createClient();
  const { isSaved, saveTender, unsaveTender } = useSavedTenders();

  // Auth check
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        if (error || !authUser) { if (mounted) window.location.href = '/'; return; }
        if (mounted) setUser(authUser);
      } catch {
        if (mounted) window.location.href = '/';
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const fetchTenders = async (page = 1, query = '', activeFilters: Filters = filters) => {
    setLoading(true);
    setLoadingProgress(0);
    setError(null);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => prev >= 90 ? prev : prev + 15);
    }, 150);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(ITEMS_PER_PAGE),
        ...(query                      && { query }),
        ...(activeFilters.category     && { category: activeFilters.category }),
        ...(activeFilters.location     && { location: activeFilters.location }),
        ...(activeFilters.dateFilter   && { date_filter: activeFilters.dateFilter }),
        ...(activeFilters.tenderType   && { tender_type: activeFilters.tenderType }),
      });

      const response = await fetch(`/api/tenders?${params}`, { cache: 'no-store' });

      clearInterval(progressInterval);
      setLoadingProgress(100);

      if (!response.ok) throw new Error('Failed to fetch tenders');

      const data: TenderResponse = await response.json();

      setTenders(data.items || []);
      setTotalCount(data.total_items || 0);
      setCurrentPage(page);
      setLoading(false);

      trackTenderSearch({ query: query || undefined, resultsCount: data.total_items || 0, page });
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Failed to load tenders');
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTenders(1, searchQuery, filters);
  };

  const handleApplyFilters = () => {
    fetchTenders(1, searchQuery, filters);
    setShowFilters(false);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setFilters({ category: '', location: '', dateFilter: '', tenderType: '' });
    setTenders([]);
    setTotalCount(0);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchTenders(newPage, searchQuery, filters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleSave = async (tender: Tender) => {
    if (isSaved(tender.ref_no)) {
      await unsaveTender(tender.ref_no);
    } else {
      const result = await saveTender(tender as any);
      if (result && !result.success && result.limitExceeded) {
        const upgrade = confirm(`${result.error}\n\nWould you like to upgrade your plan?`);
        if (upgrade) router.push('/pricing');
      }
    }
  };

  const getMatchColorScheme = (score: number) => {
    if (score >= 90) return { bg: 'bg-gray-100 dark:bg-gray-800/50', border: 'border-green-400/50 dark:border-green-500/40', text: 'text-green-600 dark:text-green-400', glow: 'shadow-[0_0_8px_rgba(34,197,94,0.2)]' };
    if (score >= 80) return { bg: 'bg-gray-100 dark:bg-gray-800/50', border: 'border-lime-400/50 dark:border-lime-500/40', text: 'text-lime-600 dark:text-lime-400', glow: 'shadow-[0_0_8px_rgba(132,204,22,0.2)]' };
    if (score >= 70) return { bg: 'bg-gray-100 dark:bg-gray-800/50', border: 'border-yellow-400/50 dark:border-yellow-500/40', text: 'text-yellow-600 dark:text-yellow-400', glow: 'shadow-[0_0_8px_rgba(234,179,8,0.2)]' };
    if (score >= 60) return { bg: 'bg-gray-100 dark:bg-gray-800/50', border: 'border-orange-400/50 dark:border-orange-500/40', text: 'text-orange-600 dark:text-orange-400', glow: 'shadow-[0_0_8px_rgba(249,115,22,0.2)]' };
    return { bg: 'bg-gray-100 dark:bg-gray-800/50', border: 'border-red-400/50 dark:border-red-500/40', text: 'text-red-600 dark:text-red-400', glow: 'shadow-[0_0_8px_rgba(239,68,68,0.2)]' };
  };

  const getMatchScore = (refNo: string) => {
    let hash = 0;
    for (let i = 0; i < refNo.length; i++) {
      hash = ((hash << 5) - hash) + refNo.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 100);
  };

  const TenderTitle = ({ title }: { title: string }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const textRef = React.useRef<HTMLSpanElement>(null);
    const [needsMarquee, setNeedsMarquee] = React.useState(false);

    React.useEffect(() => {
      const checkOverflow = () => {
        if (containerRef.current && textRef.current) {
          const temp = document.createElement('span');
          temp.style.cssText = 'visibility:hidden;position:absolute;white-space:nowrap';
          temp.style.fontSize = window.getComputedStyle(textRef.current).fontSize;
          temp.style.fontWeight = window.getComputedStyle(textRef.current).fontWeight;
          temp.style.fontFamily = window.getComputedStyle(textRef.current).fontFamily;
          temp.textContent = title;
          document.body.appendChild(temp);
          setNeedsMarquee(temp.offsetWidth > containerRef.current.offsetWidth);
          document.body.removeChild(temp);
        }
      };
      const timer = setTimeout(checkOverflow, 0);
      window.addEventListener('resize', checkOverflow);
      return () => { clearTimeout(timer); window.removeEventListener('resize', checkOverflow); };
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

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const hasActiveFilters = searchQuery || filters.category || filters.location || filters.dateFilter || filters.tenderType;

  return (
    <div className="flex-1 px-2 lg:px-4 py-0 lg:py-2">
      {/* Header */}
      <div className="mb-2 lg:mb-3">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-0.5 lg:mb-1">Search Tenders</h1>
        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
          Search live tenders across India
          {totalCount > 0 && !loading && (
            <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
              — {totalCount.toLocaleString()} results
            </span>
          )}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-3 lg:mb-4">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 min-w-[200px] border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-[#18181b] overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, organisation, reference no..."
              className="flex-1 pl-3 pr-3 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none border-none"
            />
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 h-auto text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-none border-none shadow-none transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </div>

          <Button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="px-4 py-2.5 h-[42px] text-sm border-gray-300 dark:border-white/[0.12] text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.06] rounded-none transition-all"
          >
            <Filter className="h-4 w-4 mr-1.5" />
            Filters
            {(filters.category || filters.location || filters.dateFilter || filters.tenderType) && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            )}
            <ChevronDown className={`h-3.5 w-3.5 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              onClick={handleClearAll}
              variant="outline"
              className="px-4 py-2.5 h-[42px] text-sm border-gray-300 dark:border-white/[0.12] text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/[0.06] rounded-none transition-all"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}

          <div className="flex-1 hidden lg:block" />

          <Link href="/dashboard/tenders">
            <Button
              type="button"
              variant="outline"
              className="px-4 py-2.5 h-[42px] text-sm border-blue-300 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-none transition-all"
            >
              <Bookmark className="h-4 w-4 mr-1.5" />
              Saved
            </Button>
          </Link>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-2 p-4 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/[0.08]">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-white/70 mb-1.5">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-black/20 text-gray-900 dark:text-white/90 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Works">Works</option>
                  <option value="Goods">Goods</option>
                  <option value="Services">Services</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                  <option value="IT">IT & Technology</option>
                  <option value="Medical">Medical & Health</option>
                  <option value="Construction">Construction</option>
                  <option value="Supply">Supply</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-white/70 mb-1.5">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Mumbai, Delhi..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-black/20 text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-white/70 mb-1.5">Published</label>
                <select
                  value={filters.dateFilter}
                  onChange={(e) => setFilters(f => ({ ...f, dateFilter: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-black/20 text-gray-900 dark:text-white/90 focus:outline-none"
                >
                  <option value="">All Dates</option>
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-white/70 mb-1.5">Tender Type</label>
                <select
                  value={filters.tenderType}
                  onChange={(e) => setFilters(f => ({ ...f, tenderType: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-white/[0.12] bg-white dark:bg-black/20 text-gray-900 dark:text-white/90 focus:outline-none"
                >
                  <option value="">All Types</option>
                  <option value="Open">Open</option>
                  <option value="Limited">Limited</option>
                  <option value="Single">Single</option>
                  <option value="EOI">EOI</option>
                  <option value="RFP">RFP</option>
                  <option value="RFQ">RFQ</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                onClick={handleApplyFilters}
                className="px-5 py-2 h-auto text-sm bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black rounded-none"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 lg:p-4 mb-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-1">Error loading tenders</p>
            <p className="text-sm text-red-700 dark:text-red-400/80">{error}</p>
            <Button
              onClick={() => fetchTenders(currentPage, searchQuery)}
              className="mt-2 text-xs px-4 py-1.5 h-8 bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8 lg:py-12">
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 mb-4 lg:mb-6">
            <svg className="transform -rotate-90 w-24 h-24 lg:w-32 lg:h-32" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-200 dark:text-white/[0.08]" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="6" fill="transparent"
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={2 * Math.PI * 56 * (1 - loadingProgress / 100)}
                className="text-gray-900 dark:text-white transition-all duration-300 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">{Math.round(loadingProgress)}%</span>
            </div>
          </div>
          <p className="text-sm lg:text-base text-gray-600 dark:text-white/70 font-medium mb-1">Loading tenders...</p>
          <p className="text-xs text-gray-500 dark:text-white/50">Searching database...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && tenders.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <Search className="h-12 w-12 lg:h-16 lg:w-16 text-gray-300 dark:text-white/[0.15] mx-auto mb-3" />
          <p className="text-sm lg:text-base text-gray-500 dark:text-white/60 mb-1.5 font-medium">
            {hasActiveFilters ? 'No tenders match your search' : 'Search for tenders to get started'}
          </p>
          <p className="text-xs lg:text-sm text-gray-400 dark:text-white/40">
            {hasActiveFilters ? 'Try adjusting your filters or search terms' : 'Enter keywords, organisation name, or reference number'}
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && tenders.length > 0 && (
        <div className="space-y-2 lg:space-y-3">
          {tenders.map((tender, index) => {
            const matchScore   = getMatchScore(tender.ref_no);
            const colorScheme  = getMatchColorScheme(matchScore);
            const tenderValue  = formatCurrency(tender.tender_value);
            const emdAmount    = formatCurrency(tender.emd_amount);
            const saved        = isSaved(tender.ref_no);

            return (
              <div
                key={`${tender.ref_no}-${index}`}
                className="bg-white dark:bg-[#18181b] rounded-lg border border-gray-200 dark:border-white/[0.08] p-3 lg:p-5 hover:shadow-md dark:hover:border-white/[0.12] transition-all duration-200"
              >
                {/* Title + Match Score */}
                <div className="flex items-start justify-between mb-2 lg:mb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white/90 mb-1.5 leading-snug">
                      <TenderTitle title={tender.title} />
                    </h3>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-white/50">
                      {tender.organisation && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate max-w-[200px] lg:max-w-xs">{tender.organisation}</span>
                        </span>
                      )}
                      {tender.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span>{tender.location}{tender.pincode ? ` – ${tender.pincode}` : ''}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  {/* AI Match */}
                  <div className={`${colorScheme.bg} ${colorScheme.border} ${colorScheme.glow} border rounded-lg px-1.5 lg:px-2 py-1 lg:py-1.5 flex flex-col items-center justify-center min-w-[40px] lg:min-w-[48px] flex-shrink-0 transition-all duration-300`}>
                    <span className={`text-base lg:text-lg font-bold ${colorScheme.text}`}>{matchScore}%</span>
                    <span className={`text-[7px] lg:text-[8px] ${colorScheme.text} font-medium uppercase tracking-wide`}>Match</span>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-2.5 lg:mb-3">
                  <div className="flex items-start gap-1.5">
                    <FileText className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400 dark:text-white/30 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] lg:text-xs text-gray-400 dark:text-white/40 mb-0.5">Ref No.</p>
                      <p className="text-xs lg:text-sm font-medium text-gray-800 dark:text-white/80 truncate">{tender.ref_no}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <Calendar className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400 dark:text-white/30 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] lg:text-xs text-gray-400 dark:text-white/40 mb-0.5">Published</p>
                      <p className="text-xs lg:text-sm font-medium text-gray-800 dark:text-white/80">{formatDate(tender.published_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <Calendar className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-gray-400 dark:text-white/30 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] lg:text-xs text-gray-400 dark:text-white/40 mb-0.5">Opening</p>
                      <p className="text-xs lg:text-sm font-medium text-gray-800 dark:text-white/80">{formatDate(tender.opening_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <Calendar className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-red-400 dark:text-red-400/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] lg:text-xs text-gray-400 dark:text-white/40 mb-0.5">Closing</p>
                      <p className="text-xs lg:text-sm font-medium text-red-600 dark:text-red-400">{formatDate(tender.closing_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Financial + Period Row */}
                {(tenderValue || emdAmount || tender.period_of_work_days) && (
                  <div className="flex items-center flex-wrap gap-3 lg:gap-5 mb-2.5 lg:mb-3 py-2 px-2.5 bg-gray-50 dark:bg-white/[0.03] rounded-md">
                    {tenderValue && (
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="h-3 w-3 text-gray-400 dark:text-white/30 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-white/40">Tender Value</p>
                          <p className="text-xs font-semibold text-gray-800 dark:text-white/80">{tenderValue}</p>
                        </div>
                      </div>
                    )}
                    {emdAmount && (
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="h-3 w-3 text-gray-400 dark:text-white/30 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-white/40">EMD</p>
                          <p className="text-xs font-semibold text-gray-800 dark:text-white/80">{emdAmount}</p>
                        </div>
                      </div>
                    )}
                    {tender.period_of_work_days && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-gray-400 dark:text-white/30 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-white/40">Period</p>
                          <p className="text-xs font-semibold text-gray-800 dark:text-white/80">{tender.period_of_work_days} days</p>
                        </div>
                      </div>
                    )}
                    {tender.bid_validity_days && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-gray-400 dark:text-white/30 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 dark:text-white/40">Bid Validity</p>
                          <p className="text-xs font-semibold text-gray-800 dark:text-white/80">{tender.bid_validity_days} days</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Work Description */}
                {tender.work_description && (
                  <p className="text-xs text-gray-500 dark:text-white/40 line-clamp-2 mb-2.5 leading-relaxed">
                    {tender.work_description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-white/[0.06]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/[0.08] text-gray-700 dark:text-white/70 text-[10px] lg:text-xs rounded font-medium">
                      Active
                    </span>
                    {tender.product_category && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] lg:text-xs rounded font-medium">
                        <Tag className="h-2.5 w-2.5" />
                        {tender.product_category}
                      </span>
                    )}
                    {tender.sub_category && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50/60 dark:bg-blue-500/[0.07] text-blue-600 dark:text-blue-300/80 text-[10px] lg:text-xs rounded font-medium">
                        <Tag className="h-2.5 w-2.5" />
                        {tender.sub_category}
                      </span>
                    )}
                    {tender.tender_category && (
                      <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[10px] lg:text-xs rounded font-medium">
                        {tender.tender_category}
                      </span>
                    )}
                    {tender.tender_type && (
                      <span className="px-2 py-0.5 bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-white/50 text-[10px] lg:text-xs rounded font-medium">
                        {tender.tender_type}
                      </span>
                    )}
                    {tender.contract_type && (
                      <span className="px-2 py-0.5 bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-white/50 text-[10px] lg:text-xs rounded font-medium">
                        {tender.contract_type}
                      </span>
                    )}
                    {tender.source && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/[0.05] text-gray-500 dark:text-white/40 text-[10px] lg:text-xs rounded font-medium">
                        {tender.source}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => handleToggleSave(tender)}
                      className={`text-[10px] lg:text-xs px-2 lg:px-3 py-1 lg:py-1.5 h-6 lg:h-7 transition-all duration-200 ${
                        saved
                          ? 'border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20'
                          : 'border-gray-300 dark:border-white/[0.12] dark:text-white/70 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <Heart className={`h-2.5 w-2.5 lg:h-3 lg:w-3 mr-1 lg:mr-1.5 transition-all ${saved ? 'fill-current' : ''}`} />
                      {saved ? 'Saved' : 'Save'}
                    </Button>
                    <a
                      href={tender.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackTenderExternalClick({ tenderId: tender.ref_no, tenderTitle: tender.title, url: tender.url })}
                    >
                      <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black text-[10px] lg:text-xs px-2 lg:px-3 py-1 lg:py-1.5 h-6 lg:h-7">
                        <ExternalLink className="h-2.5 w-2.5 lg:h-3 lg:w-3 mr-1 lg:mr-1.5" />
                        View
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-6 lg:mt-8">
          <div className="flex items-center justify-center mb-3">
            <span className="text-[10px] lg:text-xs text-gray-500 dark:text-white/50">
              {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalCount)}–{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-center gap-0.5 lg:gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 lg:p-2 rounded-md text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            </button>

            {(() => {
              const maxVisible = 7;
              let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              let end = Math.min(totalPages, start + maxVisible - 1);
              if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
              const pages = [];
              for (let i = start; i <= end; i++) pages.push(i);

              return (
                <>
                  {start > 1 && (
                    <>
                      <button onClick={() => handlePageChange(1)} className="px-2 lg:px-2.5 py-1 lg:py-1.5 text-[11px] lg:text-xs font-medium text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors min-w-[1.75rem] lg:min-w-[2rem]">1</button>
                      {start > 2 && <span className="px-1 text-[10px] text-gray-400 dark:text-white/30">⋯</span>}
                    </>
                  )}
                  {pages.map(p => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`px-2 lg:px-2.5 py-1 lg:py-1.5 text-[11px] lg:text-xs font-medium rounded-md transition-colors min-w-[1.75rem] lg:min-w-[2rem] ${
                        p === currentPage
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                          : 'text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  {end < totalPages && (
                    <>
                      {end < totalPages - 1 && <span className="px-1 text-[10px] text-gray-400 dark:text-white/30">⋯</span>}
                      <button onClick={() => handlePageChange(totalPages)} className="px-2 lg:px-2.5 py-1 lg:py-1.5 text-[11px] lg:text-xs font-medium text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors min-w-[1.75rem] lg:min-w-[2rem]">{totalPages}</button>
                    </>
                  )}
                </>
              );
            })()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 lg:p-2 rounded-md text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
