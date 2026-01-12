'use client';

import React from 'react';
import { Zap, Sparkles, FileText, CheckCircle } from 'lucide-react';
import { PlanGate } from '@/components/guards/PlanGate';

export default function AIDraftPage() {
  // Demo content for free users to see (will be blurred)
  const demoContent = (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Zap className="w-8 h-8 text-yellow-600" />
          AI Bid Draft
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Let AI help you create winning tender proposals in minutes
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Smart Proposal Generation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Generate comprehensive bid proposals based on tender requirements
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Multi-Format Export
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Export your proposals in PDF, Word, and other formats
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Compliance Checking
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically verify compliance with tender requirements
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Custom Templates
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use industry-specific templates or create your own
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Form */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Generate Your Bid
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tender Reference Number
            </label>
            <input
              type="text"
              placeholder="e.g., 2024/ABC/12345"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe your project approach and methodology..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled
            />
          </div>
          <button
            disabled
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg opacity-50 cursor-not-allowed"
          >
            Generate AI Draft
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <PlanGate 
      allowedPlans={['pro', 'enterprise']} 
      blurContent={true}
      showOverlay={true}
    >
      {demoContent}
    </PlanGate>
  );
}

