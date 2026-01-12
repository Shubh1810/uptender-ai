'use client';

import React from 'react';
import { TrendingUp, BarChart, PieChart, Activity, ArrowUp } from 'lucide-react';
import { PlanGate } from '@/components/guards/PlanGate';

export default function TenderAnalyticsPage() {
  const demoContent = (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-indigo-600" />
          Tender Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track tender trends, success rates, and market insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <BarChart className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              12%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Tenders Viewed</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              8%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">67%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Match Rate</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              24%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Bids</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              15%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">45%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tender Trends</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg flex items-center justify-center">
            <BarChart className="w-16 h-16 text-gray-300 dark:text-gray-700" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg flex items-center justify-center">
            <PieChart className="w-16 h-16 text-gray-300 dark:text-gray-700" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Performing Categories</h3>
        <div className="space-y-3">
          {['Healthcare', 'IT & Software', 'Construction', 'Manufacturing'].map((category, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{category}</span>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${85 - i * 10}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{85 - i * 10}%</span>
              </div>
            </div>
          ))}
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

