'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Search as SearchIcon } from 'lucide-react';

export default function DashboardHome() {
  return (
    <main className="p-4 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h2>
        <p className="text-gray-600">Here's what's happening with your tenders today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Live Tenders', value: '0', change: 'Search to find', color: 'bg-blue-50 text-blue-600' },
          { label: 'Saved Tenders', value: '0', change: 'No tenders saved', color: 'bg-green-50 text-green-600' },
          { label: 'Notifications', value: '0', change: 'All caught up', color: 'bg-purple-50 text-purple-600' },
          { label: 'Active Bids', value: '0', change: 'No active bids', color: 'bg-orange-50 text-orange-600' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className={`text-xs ${stat.color.split(' ')[1]}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/search">
            <div className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
              <SearchIcon className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Search Tenders</h4>
              <p className="text-sm text-gray-600">Find tenders from across India</p>
            </div>
          </Link>
          <Link href="/dashboard/tenders">
            <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer">
              <FileText className="h-8 w-8 text-gray-600 mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">My Saved Tenders</h4>
              <p className="text-sm text-gray-600">View your saved tenders</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No recent activity yet</p>
          <p className="text-sm text-gray-400 mb-6">
            Start searching for tenders to see your activity here
          </p>
          <Link href="/dashboard/search">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Search Tenders
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
