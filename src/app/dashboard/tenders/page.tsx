import React from 'react';
import { FileText } from 'lucide-react';

export default function TendersPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-2">
          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Tenders
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No saved tenders yet. Start searching and save tenders to see them here.
        </p>
      </div>
    </div>
  );
}

