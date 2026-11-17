import React from 'react';
import { Shield } from 'lucide-react';

export default function RiskCompliancePage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900/20 mb-2">
          <Shield className="w-8 h-8 text-slate-600 dark:text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Risk & Compliance Agent
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Risk assessment coming soon. Identify and mitigate tender risks automatically.
        </p>
      </div>
    </div>
  );
}

