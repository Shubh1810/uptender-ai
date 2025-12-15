import React from 'react';
import { Eye } from 'lucide-react';

export default function CompetitorIntelPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-2">
          <Eye className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Competitor Intelligence
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Competitor analysis coming soon. Stay ahead with market intelligence.
        </p>
      </div>
    </div>
  );
}

