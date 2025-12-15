import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function BidOptimizerPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lime-100 dark:bg-lime-900/20 mb-2">
          <TrendingUp className="w-8 h-8 text-lime-600 dark:text-lime-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bid Optimizer
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Bid optimization coming soon. Maximize your chances of winning tenders.
        </p>
      </div>
    </div>
  );
}

