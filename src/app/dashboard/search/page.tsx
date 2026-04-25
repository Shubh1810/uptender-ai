'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import {
  Search,
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
  SlidersHorizontal,
  ArrowUpDown,
  Crown,
  X as CloseIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { trackTenderSearch, trackTenderExternalClick } from '@/lib/posthog/events';
import { useSavedTenders } from '@/hooks/useSavedTenders';
import { useSubscription } from '@/hooks/useSubscription';

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
}

interface SidebarFilters {
  keywords: string[];
  excludeKeywords: string[];
  dateType: 'published' | 'closing';
  dateRange: string;
  customDate: string;
  portal: string;
  state: string;
  city: string;
  procurementType: string;
  minAmount: string;
  maxAmount: string;
  organisation: string;
  tenderFeeExempted: boolean;
  emdExempted: boolean;
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

const DATE_QUICK = [
  { label: 'Today',         value: '1' },
  { label: 'Last 7 Days',   value: '7' },
  { label: 'Last 1 Month',  value: '30' },
  { label: 'Last 3 Months', value: '90' },
  { label: 'All',           value: '' },
];

const PORTALS = ['GeM', 'CPPP', 'State Portal', 'Defence', 'Railways', 'NHIDCL'];
const STATES  = ['Andhra Pradesh','Assam','Bihar','Delhi','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];
const PROCUREMENT_TYPES = ['Open Tender', 'Limited Tender', 'Single Tender', 'EOI', 'RFP', 'RFQ', 'Global Tender'];

function AccordionSection({
  title, children, defaultOpen = false,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 dark:border-white/[0.06]">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
      >
        {title}
        <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function KeywordChips({
  chips, onRemove, placeholder, onAdd,
}: { chips: string[]; onRemove: (k: string) => void; placeholder: string; onAdd: (k: string) => void }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !chips.includes(v)) { onAdd(v); setInput(''); }
  };
  return (
    <div className="space-y-2">
      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map(k => (
            <span key={k} className="flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 dark:text-blue-400">
              {k}
              <button onClick={() => onRemove(k)} className="ml-0.5 text-blue-400 hover:text-blue-600">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-1.5">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-gray-200 dark:border-white/[0.10] bg-white dark:bg-black/20 px-3 py-1.5 text-xs text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500/50"
        />
        <button
          onClick={add}
          className="rounded-lg border border-gray-200 dark:border-white/[0.10] bg-white dark:bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [user, setUser]           = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenders, setTenders]     = useState<Tender[]>([]);
  const [loading, setLoading]     = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError]         = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'value_desc' | 'value_asc'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [filters, setFilters] = useState<SidebarFilters>({
    keywords: [],
    excludeKeywords: [],
    dateType: 'published',
    dateRange: '',
    customDate: '',
    portal: '',
    state: '',
    city: '',
    procurementType: '',
    minAmount: '',
    maxAmount: '',
    organisation: '',
    tenderFeeExempted: false,
    emdExempted: false,
    tenderType: '',
  });

  const router = useRouter();
  const supabase = createClient();
  const { isSaved, saveTender, unsaveTender } = useSavedTenders();
  const { hasFeature, plan } = useSubscription();
  const [showExportPopup, setShowExportPopup] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        if (error || !authUser) { if (mounted) window.location.href = '/'; return; }
        if (mounted) setUser(authUser);
      } catch { if (mounted) window.location.href = '/'; }
    };
    init();
    return () => { mounted = false; };
  }, []);

  const fetchTenders = async (page = 1, query = searchQuery, f: SidebarFilters = filters) => {
    setLoading(true);
    setLoadingProgress(0);
    setError(null);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => prev >= 90 ? prev : prev + 15);
    }, 150);

    try {
      const allKeywords = [...f.keywords, ...(query.trim() ? [query.trim()] : [])];
      const params = new URLSearchParams({ page: String(page), limit: String(ITEMS_PER_PAGE) });
      if (allKeywords.length)        params.set('query', allKeywords.join(' '));
      if (f.excludeKeywords.length)  params.set('exclude', f.excludeKeywords.join(','));
      if (f.dateRange)               params.set('date_filter', f.dateRange);
      if (f.portal)                  params.set('source', f.portal);
      if (f.state)                   params.set('location', f.state);
      if (f.city)                    params.set('city', f.city);
      if (f.procurementType)         params.set('tender_type', f.procurementType);
      if (f.minAmount)               params.set('min_amount', f.minAmount);
      if (f.maxAmount)               params.set('max_amount', f.maxAmount);
      if (f.organisation)            params.set('organisation', f.organisation);
      if (f.tenderFeeExempted)       params.set('tender_fee_exempted', 'true');
      if (f.emdExempted)             params.set('emd_exempted', 'true');

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

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchTenders(1); };
  const handleApply  = () => { fetchTenders(1); setMobileSidebarOpen(false); };
  const handleClearAll = () => {
    setSearchQuery('');
    setFilters({ keywords: [], excludeKeywords: [], dateType: 'published', dateRange: '', customDate: '', portal: '', state: '', city: '', procurementType: '', minAmount: '', maxAmount: '', organisation: '', tenderFeeExempted: false, emdExempted: false, tenderType: '' });
    setTenders([]); setTotalCount(0); setCurrentPage(1);
  };
  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchTenders(newPage); window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handleToggleSave = async (tender: Tender) => {
    if (isSaved(tender.ref_no)) {
      await unsaveTender(tender.ref_no);
    } else {
      const result = await saveTender(tender as any);
      if (result && !result.success && result.limitExceeded) {
        if (confirm(`${result.error}\n\nWould you like to upgrade your plan?`)) router.push('/pricing');
      }
    }
  };

  const downloadExcel = () => {
    if (tenders.length === 0) return;

    const headers = [
      'Title',
      'Organisation',
      'Reference No',
      'Tender ID',
      'Source',
      'Published Date',
      'Opening Date',
      'Closing Date',
      'Location',
      'Pincode',
      'Tender Value',
      'EMD Amount',
      'Period of Work Days',
      'Bid Validity Days',
      'Tender Type',
      'Tender Category',
      'Contract Type',
      'Product Category',
      'Sub Category',
      'URL',
    ];

    const escapeCsv = (value: string | number | null) => {
      const stringValue = value == null ? '' : String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const rows = tenders.map((tender) => [
      tender.title,
      tender.organisation,
      tender.ref_no,
      tender.tender_id,
      tender.source,
      tender.published_date,
      tender.opening_date,
      tender.closing_date,
      tender.location,
      tender.pincode,
      tender.tender_value,
      tender.emd_amount,
      tender.period_of_work_days,
      tender.bid_validity_days,
      tender.tender_type,
      tender.tender_category,
      tender.contract_type,
      tender.product_category,
      tender.sub_category,
      tender.url,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsv(cell)).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `tenders-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    if (tenders.length === 0) return;

    if (hasFeature('export_data')) {
      downloadExcel();
      return;
    }

    setShowExportPopup(true);
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
    for (let i = 0; i < refNo.length; i++) { hash = ((hash << 5) - hash) + refNo.charCodeAt(i); hash = hash & hash; }
    return Math.abs(hash % 100);
  };

  const TenderTitle = ({ title }: { title: string }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef      = useRef<HTMLSpanElement>(null);
    const [needsMarquee, setNeedsMarquee] = useState(false);
    useEffect(() => {
      const checkOverflow = () => {
        if (containerRef.current && textRef.current) {
          const temp = document.createElement('span');
          temp.style.cssText = 'visibility:hidden;position:absolute;white-space:nowrap';
          temp.style.fontSize  = window.getComputedStyle(textRef.current).fontSize;
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

  const totalPages       = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const hasActiveFilters = searchQuery || filters.keywords.length || filters.excludeKeywords.length ||
    filters.dateRange || filters.portal || filters.state || filters.city ||
    filters.procurementType || filters.minAmount || filters.maxAmount ||
    filters.organisation || filters.tenderFeeExempted || filters.emdExempted;
  const activeFilterCount = [
    filters.keywords.length > 0, filters.excludeKeywords.length > 0, !!filters.dateRange,
    !!filters.portal, !!filters.state, !!filters.city, !!filters.procurementType,
    !!(filters.minAmount || filters.maxAmount), !!filters.organisation,
    filters.tenderFeeExempted, filters.emdExempted,
  ].filter(Boolean).length;

  /* ── Sidebar ── */
  const Sidebar = () => (
    <aside className="flex h-full flex-col overflow-y-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-[#18181b] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/[0.06]">
        <span className="text-sm font-bold text-gray-900 dark:text-white">Filters</span>
        {hasActiveFilters && (
          <button onClick={handleClearAll} className="text-[11px] font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300">
            Clear all
          </button>
        )}
      </div>

      {/* Saved Filters (static placeholder) */}
      <button className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-50 dark:border-white/[0.06] dark:hover:bg-white/[0.03] transition-colors">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white/70">
          <Bookmark className="h-3.5 w-3.5 text-blue-500" />
          Saved Filters
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-white/30" />
      </button>

      {/* Keywords */}
      <div className="border-b border-gray-100 px-4 py-3 dark:border-white/[0.06] space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-white/40">Keywords</p>
        <KeywordChips
          chips={filters.keywords}
          placeholder="Add keyword..."
          onAdd={k => setFilters(f => ({ ...f, keywords: [...f.keywords, k] }))}
          onRemove={k => setFilters(f => ({ ...f, keywords: f.keywords.filter(x => x !== k) }))}
        />
        <p className="text-[11px] font-medium text-gray-500 dark:text-white/40">Exclude Keywords</p>
        <KeywordChips
          chips={filters.excludeKeywords}
          placeholder="Exclude term..."
          onAdd={k => setFilters(f => ({ ...f, excludeKeywords: [...f.excludeKeywords, k] }))}
          onRemove={k => setFilters(f => ({ ...f, excludeKeywords: f.excludeKeywords.filter(x => x !== k) }))}
        />
      </div>

      {/* Date filter */}
      <div className="border-b border-gray-100 px-4 py-3 dark:border-white/[0.06] space-y-3">
        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-gray-200 dark:border-white/[0.10] p-0.5">
          {(['published', 'closing'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilters(f => ({ ...f, dateType: t }))}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors capitalize ${
                filters.dateType === t
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
              }`}
            >
              <Calendar className="h-3 w-3" />
              {t}
            </button>
          ))}
        </div>

        {/* Quick picks */}
        <div className="flex flex-wrap gap-1.5">
          {DATE_QUICK.map(d => (
            <button
              key={d.label}
              onClick={() => setFilters(f => ({ ...f, dateRange: d.value }))}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filters.dateRange === d.value
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-200 dark:border-white/[0.10] text-gray-600 dark:text-white/55 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {d.label}
            </button>
          ))}
          <button
            onClick={() => setFilters(f => ({ ...f, dateRange: 'pick' }))}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
              filters.dateRange === 'pick'
                ? 'bg-blue-500 text-white'
                : 'border border-gray-200 dark:border-white/[0.10] text-gray-600 dark:text-white/55 hover:border-gray-300 dark:hover:border-white/20'
            }`}
          >
            <Calendar className="h-3 w-3" />
            Pick Date
          </button>
        </div>
        {filters.dateRange === 'pick' && (
          <input
            type="date"
            value={filters.customDate}
            onChange={e => setFilters(f => ({ ...f, customDate: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 dark:border-white/[0.10] bg-white dark:bg-black/20 px-3 py-1.5 text-xs text-gray-900 dark:text-white/90 focus:outline-none"
          />
        )}
      </div>

      {/* Portal */}
      <AccordionSection title="Portal">
        <div className="space-y-2">
          {PORTALS.map(p => (
            <label key={p} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="portal"
                checked={filters.portal === p}
                onChange={() => setFilters(f => ({ ...f, portal: f.portal === p ? '' : p }))}
                className="h-3.5 w-3.5 accent-blue-500"
              />
              <span className="text-xs text-gray-700 dark:text-white/70">{p}</span>
            </label>
          ))}
        </div>
      </AccordionSection>

      {/* State */}
      <AccordionSection title="State">
        <select
          value={filters.state}
          onChange={e => setFilters(f => ({ ...f, state: e.target.value }))}
          className="w-full rounded-lg border border-gray-200 dark:border-white/[0.10] bg-white dark:bg-black/20 px-3 py-2 text-xs text-gray-900 dark:text-white/90 focus:outline-none"
        >
          <option value="">All States</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </AccordionSection>

      {/* City */}
      <AccordionSection title="City">
        <input
          type="text"
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
          placeholder="e.g. Mumbai, Pune..."
          className="w-full rounded-lg border border-gray-200 dark:border-white/[0.10] bg-white dark:bg-black/20 px-3 py-2 text-xs text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none"
        />
      </AccordionSection>

      {/* Procurement Type */}
      <AccordionSection title="Procurement Type">
        <div className="space-y-2">
          {PROCUREMENT_TYPES.map(pt => (
            <label key={pt} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="procType"
                checked={filters.procurementType === pt}
                onChange={() => setFilters(f => ({ ...f, procurementType: f.procurementType === pt ? '' : pt }))}
                className="h-3.5 w-3.5 accent-blue-500"
              />
              <span className="text-xs text-gray-700 dark:text-white/70">{pt}</span>
            </label>
          ))}
        </div>
      </AccordionSection>

      {/* Tender Amount */}
      <AccordionSection title="Tender Amount">
        <div className="space-y-3">
          {/* Min */}
          <div>
            <p className="mb-1.5 text-[11px] font-medium text-gray-500 dark:text-white/40">Minimum</p>
            <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-white/[0.10] bg-white dark:bg-black/20">
              <span className="flex items-center border-r border-gray-200 dark:border-white/[0.10] px-2.5 text-sm text-gray-400 dark:text-white/30">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={filters.minAmount}
                onChange={e => setFilters(f => ({ ...f, minAmount: e.target.value.replace(/[^0-9]/g, '') }))}
                placeholder="Enter Or Select Amount"
                className="flex-1 bg-transparent px-3 py-2 text-xs text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Max */}
          <div>
            <p className="mb-1.5 text-[11px] font-medium text-gray-500 dark:text-white/40">Maximum</p>
            <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-white/[0.10] bg-white dark:bg-black/20">
              <span className="flex items-center border-r border-gray-200 dark:border-white/[0.10] px-2.5 text-sm text-gray-400 dark:text-white/30">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={filters.maxAmount}
                onChange={e => setFilters(f => ({ ...f, maxAmount: e.target.value.replace(/[^0-9]/g, '') }))}
                placeholder="Enter Or Select Amount"
                className="flex-1 bg-transparent px-3 py-2 text-xs text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Quick picks */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '50K', value: '50000' },
              { label: '1L',  value: '100000' },
              { label: '5L',  value: '500000' },
              { label: '10L', value: '1000000' },
              { label: '50L', value: '5000000' },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => setFilters(f => ({
                  ...f,
                  ...(f.minAmount ? { maxAmount: value } : { minAmount: value }),
                }))}
                className="rounded-full border border-gray-200 dark:border-white/[0.10] px-3 py-0.5 text-[11px] font-medium text-gray-600 dark:text-white/55 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Reset / Apply */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setFilters(f => ({ ...f, minAmount: '', maxAmount: '' }))}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="rounded-lg bg-gray-900 dark:bg-white px-4 py-1.5 text-xs font-semibold text-white dark:text-black hover:bg-gray-700 dark:hover:bg-white/90 transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </AccordionSection>

      {/* Organisation */}
      <AccordionSection title="Organisation">
        <input
          type="text"
          value={filters.organisation}
          onChange={e => setFilters(f => ({ ...f, organisation: e.target.value }))}
          placeholder="Search organisation..."
          className="w-full rounded-lg border border-gray-200 dark:border-white/[0.10] bg-white dark:bg-black/20 px-3 py-2 text-xs text-gray-900 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none"
        />
      </AccordionSection>

      {/* Fee preferences */}
      <div className="border-b border-gray-100 px-4 py-3 dark:border-white/[0.06] space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-white/40 mb-2">Fee Preferences</p>
        {[
          { key: 'tenderFeeExempted' as const, label: 'Tender fee exempted' },
          { key: 'emdExempted'       as const, label: 'EMD fee exempted'    },
        ].map(({ key, label }) => (
          <label key={key} className="flex cursor-pointer items-center gap-2.5">
            <div
              onClick={() => setFilters(f => ({ ...f, [key]: !f[key] }))}
              className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                filters[key]
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-white/20'
              }`}
            >
              {filters[key] && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
            </div>
            <span className="text-xs text-gray-700 dark:text-white/70">{label}</span>
          </label>
        ))}
      </div>

      {/* Advanced Filters */}
      <AccordionSection title="Advanced Filters">
        <div className="space-y-2.5">
          <div>
            <p className="mb-1.5 text-[11px] font-medium text-gray-500 dark:text-white/40">Tender Type</p>
            <select
              value={filters.tenderType}
              onChange={e => setFilters(f => ({ ...f, tenderType: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-white/[0.10] bg-white dark:bg-black/20 px-3 py-2 text-xs text-gray-900 dark:text-white/90 focus:outline-none"
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
      </AccordionSection>

      {/* Apply button */}
      <div className="sticky bottom-0 border-t border-gray-100 bg-white px-4 py-3 dark:border-white/[0.06] dark:bg-[#18181b]">
        <button
          onClick={handleApply}
          className="w-full rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  );

  const SORT_OPTIONS = [
    { value: 'newest',     label: 'Newest first'       },
    { value: 'oldest',     label: 'Oldest first'       },
    { value: 'value_desc', label: 'Value: High to Low' },
    { value: 'value_asc',  label: 'Value: Low to High' },
  ] as const;

  /* ── Render ── */
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden px-2 py-0 lg:px-4 lg:py-2">
      {showExportPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div
            className="absolute inset-0"
            onClick={() => setShowExportPopup(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/[0.10] dark:bg-[#18181b]">
            <button
              type="button"
              onClick={() => setShowExportPopup(false)}
              className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600 dark:text-white/30 dark:hover:text-white/60"
              aria-label="Close subscription popup"
            >
              <CloseIcon className="h-4 w-4" />
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10">
              <Crown className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Subscribe To Export Results
            </h3>
            <p className="mb-5 text-sm leading-6 text-gray-600 dark:text-white/60">
              Exporting tender results to Excel is available on paid plans. Upgrade to unlock spreadsheet downloads for the current search results.
            </p>

            <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/[0.08] dark:bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-[0.12em] text-gray-400 dark:text-white/30">
                Current plan
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/80">
                {plan?.display_name || 'Free'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowExportPopup(false)}
                className="flex-1 rounded-xl border-gray-200 dark:border-white/[0.12]"
              >
                Maybe later
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowExportPopup(false);
                  router.push('/pricing');
                }}
                className="flex-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                View plans
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Full-width title row */}
      <div className="mb-3 flex items-end justify-between lg:mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white lg:text-3xl">Search Active Tenders</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 lg:text-sm">
            live tenders across India
            {totalCount > 0 && !loading && (
              <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">
                — {totalCount.toLocaleString()} results
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(v => !v)}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/[0.10] dark:bg-[#18181b] dark:text-white/70 dark:hover:bg-white/[0.05]"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 dark:text-white/30" />
              {SORT_OPTIONS.find(o => o.value === sortOrder)?.label}
              <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform dark:text-white/30 ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/[0.10] dark:bg-[#18181b]">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortOrder(opt.value); setShowSortMenu(false); }}
                      className={`flex w-full items-center px-3 py-2 text-xs transition-colors ${
                        sortOrder === opt.value
                          ? 'bg-blue-50 font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-white/70 dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link href="/dashboard/tenders">
            <Button variant="outline" className="h-8 gap-1.5 px-3 text-xs 
border-green-400 dark:border-green-500/40 
text-green-700 dark:text-green-300 
hover:bg-green-100 dark:hover:bg-green-500/15">
              <Bookmark className="h-3.5 w-3.5" />
              Saved
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute bottom-0 left-0 top-0 w-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Two-column body */}
      <div className="flex min-h-0 flex-1 overflow-hidden gap-3 lg:gap-4">

        {/* Left sidebar — desktop only */}
        <div className="hidden min-h-0 w-64 flex-shrink-0 overflow-hidden lg:flex lg:flex-col">
          <Sidebar />
        </div>

        {/* Right: header + search + results */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">

          {/* Search bar */}
          <div className="mb-3 lg:mb-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              {/* Mobile filter toggle */}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(v => !v)}
                className="flex h-[42px] items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 dark:border-white/[0.10] dark:bg-[#18181b] dark:text-white/70 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.10] dark:bg-[#18181b]">
                <Search className="my-auto ml-3 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by title, organisation, reference no..."
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white/90 dark:placeholder:text-white/40"
                />
                {(searchQuery || hasActiveFilters) && (
                  <button type="button" onClick={handleClearAll} className="mr-1 flex h-full items-center px-1 text-gray-400 hover:text-gray-600 dark:text-white/30 dark:hover:text-white/60">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-[42px] w-[42px] rounded-xl border-none bg-blue-500 p-0 text-white shadow-none hover:bg-blue-600"
                aria-label="Search tenders"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={tenders.length === 0}
                className="flex h-[42px] w-[42px] items-center justify-center bg-transparent p-0 opacity-100 transition-transform duration-150 hover:scale-[1.06] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Export search results"
              >
                <Image
                  src="/excel2.png"
                  alt="Export to Excel"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain opacity-100"
                />
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-500/10">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-1">Error loading tenders</p>
                <p className="text-sm text-red-700 dark:text-red-400/80">{error}</p>
                <Button onClick={() => fetchTenders(currentPage)} className="mt-2 text-xs px-4 py-1.5 h-8 bg-red-600 hover:bg-red-700 text-white">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-4 h-20 w-20">
                <svg className="-rotate-90 h-20 w-20" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-gray-100 dark:text-white/[0.06]" />
                  <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="5" fill="transparent"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - loadingProgress / 100)}
                    className="text-blue-500 transition-all duration-200" strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-bold text-gray-900 dark:text-white">{Math.round(loadingProgress)}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-white/70 mb-1">Loading tenders...</p>
              <p className="text-xs text-gray-400 dark:text-white/40">Searching database...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && tenders.length === 0 && (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-3 h-12 w-12 text-gray-200 dark:text-white/[0.10]" />
              <p className="text-sm font-medium text-gray-500 dark:text-white/60 mb-1">
                {hasActiveFilters ? 'No tenders match your search' : 'Search for tenders to get started'}
              </p>
              <p className="text-xs text-gray-400 dark:text-white/40">
                {hasActiveFilters ? 'Try adjusting your filters or search terms' : 'Enter keywords, organisation name, or reference number'}
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && !error && tenders.length > 0 && (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-gray-200 dark:border-white/[0.08] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tenders.map((tender, index) => {
                  const matchScore   = getMatchScore(tender.ref_no);
                  const colorScheme  = getMatchColorScheme(matchScore);
                  const tenderValue  = formatCurrency(tender.tender_value);
                  const emdAmount    = formatCurrency(tender.emd_amount);
                  const saved        = isSaved(tender.ref_no);
                  const isEven       = index % 2 === 0;

                  return (
                    <div
                      key={`${tender.ref_no}-${index}`}
                      className={`p-3 lg:p-5 transition-colors duration-150 ${
                        index < tenders.length - 1 ? 'border-b border-gray-200 dark:border-white/[0.06]' : ''
                      } ${
                        isEven ? 'bg-white dark:bg-[#18181b]' : 'bg-gray-50 dark:bg-[#111113]'
                      } hover:bg-sky-50/40 dark:hover:bg-white/[0.03]`}
                    >
                      {/* Title + Match */}
                      <div className="flex items-start justify-between mb-2 lg:mb-3">
                        <div className="flex-1 min-w-0 pr-3">
                          <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white/90 mb-1.5 leading-snug">
                            <TenderTitle title={tender.title} />
                          </h3>
                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-white/50">
                            {tender.organisation && (
                              <span className="flex items-center gap-1">
                                <Building className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate max-w-[200px]">{tender.organisation}</span>
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
                        <div className={`${colorScheme.bg} ${colorScheme.border} ${colorScheme.glow} border rounded-lg px-1.5 py-1 flex flex-col items-center min-w-[40px] flex-shrink-0`}>
                          <span className={`text-sm font-bold ${colorScheme.text}`}>{matchScore}%</span>
                          <span className={`text-[7px] ${colorScheme.text} font-medium uppercase tracking-wide`}>Match</span>
                        </div>
                      </div>

                      {/* Key Details Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2.5">
                        {[
                          { icon: <FileText className="h-3 w-3 text-gray-400 dark:text-white/30 mt-0.5 flex-shrink-0" />, label: 'Ref No.', value: tender.ref_no, mono: true },
                          { icon: <Calendar className="h-3 w-3 text-gray-400 dark:text-white/30 mt-0.5 flex-shrink-0" />, label: 'Published', value: formatDate(tender.published_date) },
                          { icon: <Calendar className="h-3 w-3 text-gray-400 dark:text-white/30 mt-0.5 flex-shrink-0" />, label: 'Opening',   value: formatDate(tender.opening_date) },
                          { icon: <Calendar className="h-3 w-3 text-red-400/60 mt-0.5 flex-shrink-0" />,                 label: 'Closing',   value: formatDate(tender.closing_date), red: true },
                        ].map(item => (
                          <div key={item.label} className="flex items-start gap-1.5">
                            {item.icon}
                            <div className="min-w-0">
                              <p className="text-[10px] text-gray-400 dark:text-white/40 mb-0.5">{item.label}</p>
                              <p className={`text-xs font-medium truncate ${item.red ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white/80'} ${item.mono ? 'font-mono' : ''}`}>
                                {item.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Financial Row */}
                      <div className="flex flex-wrap gap-3 lg:gap-5 mb-2.5 py-2 px-2.5 bg-gray-50 dark:bg-white/[0.03] rounded-md">
                        {[
                          { icon: <IndianRupee className="h-3 w-3" />, label: 'Tender Value',  value: tenderValue },
                          { icon: <IndianRupee className="h-3 w-3" />, label: 'EMD',            value: emdAmount },
                          { icon: <Clock       className="h-3 w-3" />, label: 'Period',         value: tender.period_of_work_days ? `${tender.period_of_work_days} days` : null },
                          { icon: <Clock       className="h-3 w-3" />, label: 'Bid Validity',   value: tender.bid_validity_days   ? `${tender.bid_validity_days} days`   : null },
                        ].map(item => (
                          <div key={item.label} className="flex items-center gap-1.5">
                            <span className="text-gray-400 dark:text-white/30">{item.icon}</span>
                            <div>
                              <p className="text-[10px] text-gray-400 dark:text-white/40">{item.label}</p>
                              <p className={`text-xs font-semibold ${item.value ? 'text-gray-800 dark:text-white/80' : 'italic text-gray-400 dark:text-white/30'}`}>
                                {item.value ?? 'Refer to docs'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Work Description */}
                      {tender.work_description && (
                        <p className="text-xs text-gray-500 dark:text-white/40 line-clamp-2 mb-2.5 leading-relaxed">
                          {tender.work_description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-white/[0.06]">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {tender.source && (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/[0.08] text-gray-700 dark:text-white/70 text-[10px] rounded font-medium">
                              {tender.source}
                            </span>
                          )}
                          {tender.product_category && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] rounded font-medium">
                              <Tag className="h-2.5 w-2.5" />{tender.product_category}
                            </span>
                          )}
                          {tender.sub_category && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50/60 dark:bg-blue-500/[0.07] text-blue-600 dark:text-blue-300/80 text-[10px] rounded font-medium">
                              <Tag className="h-2.5 w-2.5" />{tender.sub_category}
                            </span>
                          )}
                          {tender.tender_type && (
                            <span className="px-2 py-0.5 bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-white/50 text-[10px] rounded font-medium">
                              {tender.tender_type}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button variant="outline" onClick={() => handleToggleSave(tender)}
                            className={`text-[10px] px-2.5 py-1 h-7 transition-all ${saved ? 'border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10' : 'border-gray-300 dark:border-white/[0.12] dark:text-white/70'}`}>
                            <Heart className={`h-3 w-3 mr-1 ${saved ? 'fill-current' : ''}`} />
                            {saved ? 'Saved' : 'Save'}
                          </Button>
                          <a href={tender.url} target="_blank" rel="noopener noreferrer"
                            onClick={() => trackTenderExternalClick({ tenderId: tender.ref_no, tenderTitle: tender.title, url: tender.url })}>
                            <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black text-[10px] px-2.5 py-1 h-7">
                              <ExternalLink className="h-3 w-3 mr-1" />View
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex-shrink-0 lg:mt-6">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                      className="p-2 rounded-md text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {(() => {
                      const maxV = 7;
                      let start = Math.max(1, currentPage - Math.floor(maxV / 2));
                      let end   = Math.min(totalPages, start + maxV - 1);
                      if (end - start < maxV - 1) start = Math.max(1, end - maxV + 1);
                      const pages: number[] = [];
                      for (let i = start; i <= end; i++) pages.push(i);
                      return (
                        <>
                          {start > 1 && (<><button onClick={() => handlePageChange(1)} className="px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md">1</button>{start > 2 && <span className="px-1 text-xs text-gray-400">⋯</span>}</>)}
                          {pages.map(p => (
                            <button key={p} onClick={() => handlePageChange(p)}
                              className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors min-w-[2rem] ${p === currentPage ? 'bg-gray-900 dark:bg-white text-white dark:text-black' : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                              {p}
                            </button>
                          ))}
                          {end < totalPages && (<>{end < totalPages - 1 && <span className="px-1 text-xs text-gray-400">⋯</span>}<button onClick={() => handlePageChange(totalPages)} className="px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md">{totalPages}</button></>)}
                        </>
                      );
                    })()}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}
                      className="p-2 rounded-md text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
