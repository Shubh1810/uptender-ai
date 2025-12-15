import React from 'react';
import { Zap } from 'lucide-react';

export default function AIDraftPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-2">
          <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Bid Draft
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered bid drafting coming soon. Let AI help you create winning bids.
        </p>
      </div>
    </div>
  );
}

