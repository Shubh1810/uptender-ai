'use client';

import React from 'react';
import { Target, TrendingUp, Award, Clock, DollarSign } from 'lucide-react';
import { PlanGate } from '@/components/guards/PlanGate';

export default function BidAnalyticsPage() {
  const demoContent = (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Target className="w-8 h-8 text-rose-600" />
          Bid Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze your bid performance, success rates, and ROI
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <Target className="w-8 h-8 text-blue-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">156</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Bids Submitted</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <Award className="w-8 h-8 text-green-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">42</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Bids Won</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">27%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <DollarSign className="w-8 h-8 text-orange-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">₹2.4Cr</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Contract Value</p>
        </div>
      </div>

      {/* Performance Timeline */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Bid Performance Over Time</h3>
        <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-20 h-20 text-gray-300 dark:text-gray-700" />
        </div>
      </div>

      {/* Recent Bids */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Bid Activity</h3>
        <div className="space-y-3">
          {[
            { title: 'Healthcare Equipment Supply', status: 'won', value: '₹45L', date: '2 days ago' },
            { title: 'IT Infrastructure Upgrade', status: 'pending', value: '₹1.2Cr', date: '5 days ago' },
            { title: 'Construction Materials', status: 'lost', value: '₹80L', date: '1 week ago' },
            { title: 'Office Furniture Supply', status: 'won', value: '₹25L', date: '2 weeks ago' },
          ].map((bid, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{bid.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{bid.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900 dark:text-white">{bid.value}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  bid.status === 'won' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : bid.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </span>
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

