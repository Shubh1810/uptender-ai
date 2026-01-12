'use client';

import React from 'react';
import { LineChart, Sparkles, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { PlanGate } from '@/components/guards/PlanGate';

export default function IntelliGraphPage() {
  const demoContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-lime-500 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
              <LineChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IntelliGraph™</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create and visualize your tender data analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area with Demo Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Sample Visualizations */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Tender Volume by Month</h3>
                <BarChart3 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="h-48 bg-gradient-to-br from-emerald-50 to-lime-50 dark:from-emerald-900/10 dark:to-lime-900/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-16 h-16 text-gray-300 dark:text-gray-700" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Success Rate by Category</h3>
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg flex items-center justify-center">
                <PieChart className="w-16 h-16 text-gray-300 dark:text-gray-700" />
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div
            className="
              bg-white dark:bg-gray-900
              border-2 border-dashed border-gray-300 dark:border-gray-700
              rounded-xl
              min-h-[400px]
              flex items-center justify-center
              hover:border-emerald-500/50 dark:hover:border-emerald-500/30
              hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5
              transition-all duration-200
            "
          >
            <div className="text-center max-w-md px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-lime-100 dark:from-emerald-900/20 dark:to-lime-900/20 mb-4">
                <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Drag & Drop Canvas
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Build custom visualizations by dragging data sources, charts, and insights onto this canvas
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  disabled
                  className="
                    px-5 py-2.5
                    bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
                    rounded-lg
                    font-medium
                    shadow-lg
                    opacity-70 cursor-not-allowed
                    transition-all duration-200
                  "
                >
                  Create New Visualization
                </button>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <BarChart3 className="w-6 h-6 text-emerald-600 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Custom Charts</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Create bar, line, pie, and more</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Real-time Data</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Connect to live tender feeds</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <Sparkles className="w-6 h-6 text-purple-600 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">AI Insights</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Automated pattern detection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PlanGate allowedPlans={['basic', 'pro', 'enterprise']} blurContent={true} showOverlay={true}>
      {demoContent}
    </PlanGate>
  );
}

