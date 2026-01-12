'use client';

import React from 'react';
import { Eye, TrendingUp, Users, BarChart } from 'lucide-react';
import { PlanGate } from '@/components/guards/PlanGate';

export default function CompetitorIntelPage() {
  const demoContent = (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Eye className="w-8 h-8 text-red-600" />
          Competitor Intelligence
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and analyze competitor bidding patterns and win rates
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <Users className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Competitor Profiles</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active competitors tracked</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Win Rate Analysis</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">67%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Average competitor win rate</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <BarChart className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Bidding Patterns</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">142</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Patterns identified</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Competitor Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Competitor {i}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bid on 3 tenders this week</p>
              </div>
              <button disabled className="px-3 py-1 bg-blue-600 text-white rounded text-sm opacity-50 cursor-not-allowed">
                View Details
              </button>
            </div>
          ))}
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

