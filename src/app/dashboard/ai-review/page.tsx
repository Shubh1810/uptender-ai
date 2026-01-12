'use client';

import React from 'react';
import { Brain, CheckCircle, AlertTriangle, Target } from 'lucide-react';
import { PlanGate } from '@/components/guards/PlanGate';

export default function AIReviewPage() {
  const demoContent = (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Brain className="w-8 h-8 text-cyan-600" />
          AI Review
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get intelligent feedback and suggestions on your tender proposals
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Quality Check</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive quality analysis</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Risk Assessment</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Identify potential issues</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <Target className="w-6 h-6 text-blue-600 mb-2" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Optimization</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Suggestions for improvement</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Upload Your Proposal</h3>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Drag and drop your proposal here</p>
          <button disabled className="px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed">
            Select File
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PlanGate allowedPlans={['pro', 'enterprise']} blurContent={true} showOverlay={true}>
      {demoContent}
    </PlanGate>
  );
}

