import React from 'react';
import { Activity } from 'lucide-react';

export default function ActiveBidsPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
          <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Active Bids
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No active tenders at the moment. Submit a bid to track it here.
        </p>
      </div>
    </div>
  );
}

