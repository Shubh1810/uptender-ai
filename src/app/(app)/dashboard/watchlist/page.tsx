import React from 'react';
import { Bookmark } from 'lucide-react';

export default function WatchlistPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 mb-2">
          <Bookmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Watchlist
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No tenders in your watchlist. Bookmark tenders to monitor them here.
        </p>
      </div>
    </div>
  );
}

