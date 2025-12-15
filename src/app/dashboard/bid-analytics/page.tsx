import React from 'react';
import { Target } from 'lucide-react';

export default function BidAnalyticsPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/20 mb-2">
          <Target className="w-8 h-8 text-rose-600 dark:text-rose-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bid Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Analytics dashboard coming soon. Analyze your bid performance and success rates.
        </p>
      </div>
    </div>
  );
}

