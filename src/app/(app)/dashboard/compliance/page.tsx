import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/20 mb-2">
          <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Compliance Checker
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Compliance checking coming soon. Ensure your bids meet all requirements.
        </p>
      </div>
    </div>
  );
}

