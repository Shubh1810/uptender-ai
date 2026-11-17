import React from 'react';
import { Clock } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-2">
          <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tender History
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No tender history yet. Your past bids and closed tenders will appear here.
        </p>
      </div>
    </div>
  );
}

