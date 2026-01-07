'use client';

import React from 'react';
import { Heart, ExternalLink, Calendar, Building, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSavedTenders } from '@/hooks/useSavedTenders';

export default function TendersPage() {
  const { savedTenders, loading, error, unsaveTender } = useSavedTenders();

  const handleDelete = async (tender_ref: string) => {
    const result = await unsaveTender(tender_ref);
    
    if (!result.success) {
      console.error('Failed to delete:', result.error);
      // You can add a toast notification here
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  // Calculate days until closing
  const getDaysUntilClosing = (closingDate: string) => {
    if (!closingDate) return null;
    try {
      const now = new Date();
      const closing = new Date(closingDate);
      const diffTime = closing.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 dark:text-white/40" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (savedTenders.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center space-y-4 max-w-md">
          <Heart className="w-16 h-16 text-gray-300 dark:text-white/[0.15] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            No saved tenders yet
          </h2>
          <p className="text-gray-600 dark:text-white/60">
            Start searching and save tenders to see them here.
          </p>
        </div>
      </div>
    );
  }

  // Tenders list
  return (
    <div className="flex-1 p-4 pt-2">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Saved Tenders
        </h1>
        <p className="text-gray-600 dark:text-white/60">
          {savedTenders.length} {savedTenders.length === 1 ? 'tender' : 'tenders'} saved
        </p>
      </div>

      {/* Tenders Grid */}
      <div className="space-y-3">
        {savedTenders.map((tender) => {
          const daysUntilClosing = getDaysUntilClosing(tender.tender_closing_date);
          const isClosingSoon = daysUntilClosing !== null && daysUntilClosing <= 7 && daysUntilClosing >= 0;
          const isClosed = daysUntilClosing !== null && daysUntilClosing < 0;

          return (
            <div
              key={tender.id}
              className="bg-white dark:bg-[#18181b] rounded-lg border border-gray-200 dark:border-white/[0.08] p-5 hover:shadow-md dark:hover:border-white/[0.12] transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white/90 mb-2 leading-snug">
                    {tender.title}
                  </h3>
                  {tender.tender_organisation && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/50">
                      <Building className="h-3.5 w-3.5" />
                      <span>{tender.tender_organisation}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                  <a
                    href={tender.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gray-900 dark:bg-white dark:text-black text-white text-sm px-4 py-2 h-9 hover:bg-gray-800 dark:hover:bg-white/90 transition-colors">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      View
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(tender.tender_ref)}
                    className="h-9 px-3 dark:border-white/[0.12] dark:text-white/70 dark:hover:bg-white/[0.06] hover:border-red-300 hover:text-red-600 dark:hover:border-red-500/30 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {/* Closing Date */}
                {tender.tender_closing_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-white/30" />
                    <span className={`${
                      isClosed 
                        ? 'text-gray-400 dark:text-white/40 line-through' 
                        : isClosingSoon 
                        ? 'text-orange-600 dark:text-orange-400 font-medium' 
                        : 'text-gray-600 dark:text-white/50'
                    }`}>
                      Closing: {formatDate(tender.tender_closing_date)}
                    </span>
                    {isClosingSoon && !isClosed && (
                      <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs rounded font-medium">
                        {daysUntilClosing} {daysUntilClosing === 1 ? 'day' : 'days'} left
                      </span>
                    )}
                    {isClosed && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/[0.08] text-gray-600 dark:text-white/60 text-xs rounded font-medium">
                        Closed
                      </span>
                    )}
                  </div>
                )}

                {/* Saved Date */}
                <div className="text-gray-400 dark:text-white/40 text-xs">
                  Saved {formatDate(tender.created_at)}
                </div>

                {/* Tags */}
                {tender.tags && tender.tags.length > 0 && (
                  <div className="flex gap-1">
                    {tender.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              {tender.notes && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
                  <p className="text-sm text-gray-600 dark:text-white/60 italic">
                    "{tender.notes}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

