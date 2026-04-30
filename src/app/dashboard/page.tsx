'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search as SearchIcon,
  FileText,
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
  Users,
  AlertCircle,
  Eye,
  Crosshair,
  Lock
} from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

type PlanTier = 'basic' | 'pro' | 'enterprise';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  requiredPlan?: PlanTier;
}

const PLAN_LABEL: Record<PlanTier, string> = {
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

const PLAN_RANK: Record<string, number> = { free: 0, basic: 1, pro: 2, enterprise: 3 };

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState('all');
  const { planId } = useSubscription();
  const userRank = PLAN_RANK[planId ?? 'free'] ?? 0;

  const hasAccess = (required?: PlanTier) =>
    !required || userRank >= (PLAN_RANK[required] ?? 0);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'tenders', label: 'Tenders' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'ai-workspace', label: 'AI Workspace' },
    { id: 'notifications', label: 'Notifications' },
  ];

  const tendersItems: NavItem[] = [
    { icon: SearchIcon, label: 'Search Tenders', href: '/dashboard/search' },
    { icon: FileText, label: 'My Tenders', href: '/dashboard/tenders' },
    { icon: Activity, label: 'Active Bids', href: '/dashboard/active-bids' },
    { icon: Clock, label: 'Tender History', href: '/dashboard/history' },
    { icon: Bookmark, label: 'Watchlist', href: '/dashboard/watchlist' },
  ];

  const analyticsItems: NavItem[] = [
    { icon: TrendingUp, label: 'Competitor Analytics', href: '/dashboard/competitor-analytics', requiredPlan: 'basic' },
    { icon: Target, label: 'Bid Analytics', href: '/dashboard/bid-analytics', requiredPlan: 'basic' },
    { icon: LineChart, label: 'IntelliGraph™', href: '/dashboard/intelligraph', requiredPlan: 'pro' },
  ];

  const aiWorkspaceItems: NavItem[] = [
    { icon: Zap, label: 'AI Bid Draft', href: '/dashboard/ai-draft', requiredPlan: 'pro' },
    { icon: Brain, label: 'AI Review', href: '/dashboard/ai-review', requiredPlan: 'pro' },
    { icon: SearchIcon, label: 'Smart Search', href: '/dashboard/smart-search', requiredPlan: 'basic' },
    { icon: FileText, label: 'Document Generator', href: '/dashboard/doc-generator', requiredPlan: 'pro' },
    { icon: CheckCircle, label: 'Compliance Checker', href: '/dashboard/compliance', requiredPlan: 'pro' },
    { icon: TrendingUp, label: 'Bid Optimizer', href: '/dashboard/bid-optimizer', requiredPlan: 'pro' },
    { icon: Crosshair, label: 'Opportunity Finder', href: '/dashboard/opportunity-finder', requiredPlan: 'enterprise' },
    { icon: Eye, label: 'Competitor Intelligence', href: '/dashboard/competitor-intel', requiredPlan: 'enterprise' },
    { icon: Shield, label: 'Risk & Compliance Agent', href: '/dashboard/risk-compliance', requiredPlan: 'enterprise' },
  ];

  const notificationsItems: NavItem[] = [
    { icon: Bell, label: 'Notification Manager', href: '/dashboard/notifications' },
    { icon: AlertCircle, label: 'Alert Settings', href: '/dashboard/alerts', requiredPlan: 'basic' },
    { icon: Users, label: 'Email Preferences', href: '/dashboard/email-prefs', requiredPlan: 'basic' },
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
              placeholder="Search tenders, results, competitor analysis..."
              className="w-full pl-11 pr-4 py-2.5 text-sm text-gray-900 dark:text-white bg-orange-500/[0.04] dark:bg-white/[0.05] border-0 rounded-lg placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/20 focus:bg-orange-50/60 dark:focus:bg-white/[0.08] transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 mt-5 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeTab === tab.id
                  ? 'bg-orange-500/[0.08] dark:bg-white/[0.1] text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-orange-500/[0.05] dark:hover:bg-white/[0.05]'
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
              <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const accessible = hasAccess(item.requiredPlan);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-150 group ${
                        accessible
                          ? 'text-gray-600 dark:text-gray-400 hover:bg-orange-500/[0.05] dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white'
                          : 'text-gray-400 dark:text-gray-600 hover:bg-orange-500/[0.03] dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`h-4 w-4 transition-colors ${
                          accessible
                            ? 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                            : 'text-gray-300 dark:text-gray-700'
                        }`} />
                        <span>{item.label}</span>
                      </div>
                      {!accessible && item.requiredPlan && (
                        <span className="flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-orange-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                          <Lock className="h-2.5 w-2.5" />
                          {PLAN_LABEL[item.requiredPlan]}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
