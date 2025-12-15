import React from 'react';
import { Brain } from 'lucide-react';

export default function AIReviewPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-900/20 mb-2">
          <Brain className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Review
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered bid review coming soon. Get intelligent feedback on your bids.
        </p>
      </div>
    </div>
  );
}

