import React from 'react';
import { Crosshair } from 'lucide-react';

export default function OpportunityFinderPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-2">
          <Crosshair className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Opportunity Finder
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI opportunity finder coming soon. Discover the best tenders for your business.
        </p>
      </div>
    </div>
  );
}

