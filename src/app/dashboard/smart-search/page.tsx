import React from 'react';
import { Search } from 'lucide-react';

export default function SmartSearchPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/20 mb-2">
          <Search className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Smart Search
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI-enhanced search coming soon. Find the most relevant tenders with intelligent search.
        </p>
      </div>
    </div>
  );
}

