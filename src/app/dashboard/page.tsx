'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search as SearchIcon,
  FileText,
  BarChart3,
  Bell,
  Target,
  Zap,
  Activity,
  TrendingUp,
  Brain,
  Shield,
  CheckCircle,
  Clock,
  Bookmark,
  LineChart,
  Sparkles,
  Users,
  AlertCircle,
  Eye,
  Crosshair
} from 'lucide-react';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'tenders', label: 'Tenders' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'ai-workspace', label: 'AI Workspace' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const tendersItems = [
    { icon: SearchIcon, label: 'Search Tenders', href: '/dashboard/search' },
    { icon: FileText, label: 'My Tenders', href: '/dashboard/tenders' },
    { icon: Activity, label: 'Active Bids', href: '/dashboard/active-bids' },
    { icon: Clock, label: 'Tender History', href: '/dashboard/history' },
    { icon: Bookmark, label: 'Watchlist', href: '/dashboard/watchlist' },
  ];

  const analyticsItems = [
    { icon: TrendingUp, label: 'Tender Analytics', href: '/dashboard/tender-analytics' },
    { icon: Target, label: 'Bid Analytics', href: '/dashboard/bid-analytics' },
    { icon: LineChart, label: 'IntelliGraph™', href: '/dashboard/intelligraph' },
  ];

  const aiWorkspaceItems = [
    { icon: Zap, label: 'AI Bid Draft', href: '/dashboard/ai-draft' },
    { icon: Brain, label: 'AI Review', href: '/dashboard/ai-review' },
    { icon: SearchIcon, label: 'Smart Search', href: '/dashboard/smart-search' },
    { icon: FileText, label: 'Document Generator', href: '/dashboard/doc-generator' },
    { icon: CheckCircle, label: 'Compliance Checker', href: '/dashboard/compliance' },
    { icon: TrendingUp, label: 'Bid Optimizer', href: '/dashboard/bid-optimizer' },
    { icon: Crosshair, label: 'Opportunity Finder', href: '/dashboard/opportunity-finder' },
    { icon: Eye, label: 'Competitor Intelligence', href: '/dashboard/competitor-intel' },
    { icon: Shield, label: 'Risk & Compliance Agent', href: '/dashboard/risk-compliance' },
  ];

  const notificationsItems = [
    { icon: Bell, label: 'Notification Manager', href: '/dashboard/notifications' },
    { icon: AlertCircle, label: 'Alert Settings', href: '/dashboard/alerts' },
    { icon: Users, label: 'Email Preferences', href: '/dashboard/email-prefs' },
  ];

  const getSectionData = () => {
    if (activeTab === 'tenders') return [{ title: 'Tenders', items: tendersItems }];
    if (activeTab === 'analytics') return [{ title: 'Analytics', items: analyticsItems }];
    if (activeTab === 'ai-workspace') return [{ title: 'AI Workspace', items: aiWorkspaceItems }];
    if (activeTab === 'notifications') return [{ title: 'Notifications', items: notificationsItems }];
    
    return [
      { title: 'Tenders', items: tendersItems },
      { title: 'Analytics', items: analyticsItems },
      { title: 'AI Workspace', items: aiWorkspaceItems },
      { title: 'Notifications', items: notificationsItems },
    ];
  };

  return (
    <main className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="px-4 py-2">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search tenders, documents, analytics..."
              className="w-full pl-11 pr-4 py-2.5 text-sm text-gray-900 dark:text-white bg-black/[0.03] dark:bg-white/[0.05] border-0 rounded-lg placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-white/[0.08] transition-all"
            />
          </div>
          <button className="ai-button-gradient">
            <span>AI</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 mt-5 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-black/[0.06] dark:bg-white/[0.1] text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getSectionData().map((section) => (
            <div key={section.title}>
              <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">{section.title}</h2>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white rounded-lg transition-all duration-150 group"
                  >
                    <item.icon className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    <span>{item.label}</span>
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
