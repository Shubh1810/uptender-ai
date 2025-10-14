'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search as SearchIcon,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Target,
  Zap,
  Activity,
  TrendingUp,
  Brain,
  Shield,
  PenTool,
  CheckCircle,
  Clock,
  Bookmark,
  History,
  Mail,
  Filter,
  Eye
} from 'lucide-react';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'create', label: 'Create new' },
    { id: 'ai-tools', label: 'AI Tools' },
    { id: 'tenders', label: 'Tender management' },
    { id: 'recents', label: 'Recents' },
  ];

  const createNewItems = [
    { icon: SearchIcon, label: 'New tender search', href: '/dashboard/search' },
    { icon: Brain, label: 'New AI bid draft', href: '/dashboard/ai-draft' },
    { icon: PenTool, label: 'New document', href: '/dashboard/doc-generator' },
    { icon: Bell, label: 'New alert', href: '/dashboard/alerts' },
    { icon: Filter, label: 'New saved filter', href: '/dashboard/filters' },
    { icon: Target, label: 'New bid goal', href: '/dashboard/goals' },
  ];

  const aiToolsItems = [
    { icon: Brain, label: 'AI Bid Draft', href: '/dashboard/ai-draft' },
    { icon: Zap, label: 'AI Review', href: '/dashboard/ai-review' },
    { icon: SearchIcon, label: 'Smart Search', href: '/dashboard/search' },
    { icon: FileText, label: 'Document Generator', href: '/dashboard/doc-generator' },
    { icon: Shield, label: 'Compliance Checker', href: '/dashboard/compliance' },
    { icon: CheckCircle, label: 'Bid Optimizer', href: '/dashboard/optimizer' },
  ];

  const tenderManagementItems = [
    { icon: SearchIcon, label: 'Search Tenders', href: '/dashboard/search' },
    { icon: FileText, label: 'My Tenders', href: '/dashboard/tenders' },
    { icon: Activity, label: 'Active Bids', href: '/dashboard/active-bids' },
    { icon: History, label: 'Tender History', href: '/dashboard/history' },
    { icon: Bookmark, label: 'Watchlist', href: '/dashboard/watchlist' },
    { icon: BarChart3, label: 'Bid Analytics', href: '/dashboard/bid-analytics' },
  ];

  const recentsItems = [
    { icon: Clock, label: 'Recent searches', href: '/dashboard/search' },
    { icon: Eye, label: 'Recently viewed', href: '/dashboard/recent' },
    { icon: FileText, label: 'Recent tenders', href: '/dashboard/tenders' },
    { icon: Brain, label: 'Recent AI drafts', href: '/dashboard/ai-draft' },
    { icon: Bell, label: 'Recent alerts', href: '/dashboard/notifier' },
    { icon: BarChart3, label: 'Recent analytics', href: '/dashboard/analytics' },
  ];

  const getSectionData = () => {
    if (activeTab === 'create') return [{ title: 'Create new', items: createNewItems }];
    if (activeTab === 'ai-tools') return [{ title: 'AI Tools', items: aiToolsItems }];
    if (activeTab === 'tenders') return [{ title: 'Tender management', items: tenderManagementItems }];
    if (activeTab === 'recents') return [{ title: 'Recents', items: recentsItems }];
    
    return [
      { title: 'Create new', items: createNewItems },
      { title: 'AI Tools', items: aiToolsItems },
      { title: 'Tender management', items: tenderManagementItems },
      { title: 'Recents', items: recentsItems },
    ];
  };

  return (
    <main className="min-h-screen">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-all">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 blur-sm animate-pulse"></div>
            <div className="absolute inset-0.5 rounded-full bg-gray-100 hover:bg-gray-200"></div>
            <span className="relative z-10">AI</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 mt-4 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {getSectionData().map((section) => (
            <div key={section.title}>
              <h2 className="text-base font-semibold text-gray-900 mb-4">{section.title}</h2>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors group"
                  >
                    <item.icon className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                    <span className="group-hover:text-gray-900">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
