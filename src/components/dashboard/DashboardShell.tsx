'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Bookmark,
  Brain,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Crosshair,
  Eye,
  FileText,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Shield,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  UserCircle,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import DashboardLoadingScreen from '@/components/dashboard/DashboardLoadingScreen';
import { resetAuthState } from '@/hooks/useAuth';
import { identifyUser, trackDashboardViewed, trackUserSignedOut } from '@/lib/posthog/events';

interface Tab {
  id: string;
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardShellProps {
  children: React.ReactNode;
  initialUser: User;
  isDirector: boolean;
}

export default function DashboardShell({
  children,
  initialUser,
  isDirector,
}: DashboardShellProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [themeMounted, setThemeMounted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('sidebar-sections') : null;
      return saved
        ? JSON.parse(saved)
        : { tenders: true, analytics: false, aiWorkspace: false, notifications: false };
    } catch {
      return { tenders: true, analytics: false, aiWorkspace: false, notifications: false };
    }
  });
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const getPageName = (path: string = pathname) => {
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/dashboard/search') return 'Search Tenders';
    if (path === '/dashboard/intelligraph') return 'IntelliGraph™';
    if (path === '/dashboard/alerts') return 'Alert Settings';

    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getPageIcon = (path: string = pathname): React.ComponentType<{ className?: string }> => {
    if (path === '/dashboard') return LayoutDashboard;
    if (path === '/dashboard/search') return Search;
    if (path === '/dashboard/intelligraph') return LineChart;
    if (path === '/dashboard/alerts') return AlertCircle;
    if (path === '/dashboard/tenders') return FileText;
    if (path === '/dashboard/active-bids') return Activity;
    if (path === '/dashboard/history') return Clock;
    if (path === '/dashboard/watchlist') return Bookmark;
    if (path === '/dashboard/tender-analytics') return TrendingUp;
    if (path === '/dashboard/bid-analytics') return Target;
    if (path === '/dashboard/ai-draft') return Zap;
    if (path === '/dashboard/ai-review') return Brain;
    if (path === '/dashboard/smart-search') return Search;
    if (path === '/dashboard/doc-generator') return FileText;
    if (path === '/dashboard/compliance') return CheckCircle;
    if (path === '/dashboard/bid-optimizer') return TrendingUp;
    if (path === '/dashboard/opportunity-finder') return Crosshair;
    if (path === '/dashboard/competitor-intel') return Eye;
    if (path === '/dashboard/risk-compliance') return Shield;
    if (path === '/dashboard/notifications') return Bell;
    if (path === '/dashboard/email-prefs') return Users;
    if (path === '/dashboard/settings') return Settings;
    if (path === '/dashboard/profile') return UserCircle;
    if (path === '/dashboard/admin') return Shield;

    return LayoutDashboard;
  };

  useEffect(() => {
    if (pathname && tabs.length === 0) {
      const initialTab: Tab = {
        id: `tab-${Date.now()}`,
        title: getPageName(pathname),
        path: pathname,
        icon: getPageIcon(pathname),
      };
      setTabs([initialTab]);
      setActiveTabId(initialTab.id);
    }
  }, [pathname, tabs.length]);

  useEffect(() => {
    if (pathname && tabs.length > 0) {
      const existingTab = tabs.find((tab) => tab.path === pathname);
      if (existingTab) {
        setActiveTabId(existingTab.id);
      } else {
        const newTab: Tab = {
          id: `tab-${Date.now()}`,
          title: getPageName(pathname),
          path: pathname,
          icon: getPageIcon(pathname),
        };
        setTabs((prev) => [...prev, newTab]);
        setActiveTabId(newTab.id);
      }
    }

    setSidebarOpen(false);
  }, [pathname, tabs]);

  useEffect(() => {
    setThemeMounted(true);
    const stored = localStorage.getItem('dashboard-theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('dashboard-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    identifyUser({
      userId: initialUser.id,
      email: initialUser.email,
      name: initialUser.user_metadata?.full_name || initialUser.user_metadata?.name,
    });
  }, [initialUser]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  useEffect(() => {
    if (user && pathname) {
      const section = pathname.split('/').pop() || 'home';
      trackDashboardViewed({ section });
    }
  }, [pathname, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-sections', JSON.stringify(expandedSections));
    } catch {}
  }, [expandedSections]);

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [router, user]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('dashboard-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  const addNewTab = () => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    if (pathname !== '/dashboard') {
      router.push('/dashboard');
    }
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    const newTabs = tabs.filter((tab) => tab.id !== tabId);

    if (tabId === activeTabId && newTabs.length > 0) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTabId(newActiveTab.id);
      if (pathname !== newActiveTab.path) {
        router.push(newActiveTab.path);
      }
    }

    setTabs(newTabs);

    if (newTabs.length === 0) {
      addNewTab();
    }
  };

  const switchTab = (tab: Tab) => {
    if (tab.id === activeTabId) return;

    setActiveTabId(tab.id);
    if (pathname !== tab.path) {
      router.push(tab.path);
    }
  };

  const handleSignOut = () => {
    resetAuthState();
    supabase.auth.signOut({ scope: 'local' }).catch(() => {});

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.startsWith('supabase'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      localStorage.removeItem('saved_tender_ids');
      localStorage.removeItem('tender_cache');
      localStorage.removeItem('tender_cache_timestamp');
      localStorage.removeItem('last_refresh_timestamp');
    } catch {}

    try {
      trackUserSignedOut();
    } catch {}

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/auth/signout?redirect=/';
    document.body.appendChild(form);
    form.submit();
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const navigationSections = [
    {
      key: 'tenders',
      title: 'Tenders',
      icon: FileText,
      items: [
        { name: 'Search Tenders', icon: Search, href: '/dashboard/search' },
        { name: 'My Tenders', icon: FileText, href: '/dashboard/tenders' },
        { name: 'Active Bids', icon: Activity, href: '/dashboard/active-bids' },
        { name: 'Tender History', icon: Clock, href: '/dashboard/history' },
        { name: 'Watchlist', icon: Bookmark, href: '/dashboard/watchlist' },
      ],
    },
    {
      key: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      items: [
        { name: 'Tender Analytics', icon: TrendingUp, href: '/dashboard/tender-analytics' },
        { name: 'Bid Analytics', icon: Target, href: '/dashboard/bid-analytics' },
        { name: 'IntelliGraph™', icon: LineChart, href: '/dashboard/intelligraph' },
      ],
    },
    {
      key: 'aiWorkspace',
      title: 'AI Workspace',
      icon: Sparkles,
      items: [
        { name: 'AI Bid Draft', icon: Zap, href: '/dashboard/ai-draft' },
        { name: 'AI Review', icon: Brain, href: '/dashboard/ai-review' },
        { name: 'Smart Search', icon: Search, href: '/dashboard/smart-search' },
        { name: 'Document Generator', icon: FileText, href: '/dashboard/doc-generator' },
        { name: 'Compliance Checker', icon: CheckCircle, href: '/dashboard/compliance' },
        { name: 'Bid Optimizer', icon: TrendingUp, href: '/dashboard/bid-optimizer' },
        { name: 'Opportunity Finder', icon: Crosshair, href: '/dashboard/opportunity-finder' },
        { name: 'Competitor Intelligence', icon: Eye, href: '/dashboard/competitor-intel' },
        { name: 'Risk & Compliance Agent', icon: Shield, href: '/dashboard/risk-compliance' },
      ],
    },
    {
      key: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { name: 'Notification Manager', icon: Bell, href: '/dashboard/notifications' },
        { name: 'Alert Settings', icon: AlertCircle, href: '/dashboard/alerts' },
        { name: 'Email Preferences', icon: Users, href: '/dashboard/email-prefs' },
      ],
    },
  ];

  if (!user) {
    return null;
  }

  const shellReady = Boolean(pathname && themeMounted && tabs.length > 0 && activeTabId);

  if (!shellReady) {
    return <DashboardLoadingScreen />;
  }

  return (
    <div className="min-h-screen dashboard-outer-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-60 glass-sidebar transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-1 px-2 py-1.5">
              <Image
                src={themeMounted && theme === 'dark' ? '/tpllogo-wite.PNG' : '/tplogo.png'}
                alt="TenderPost"
                width={26}
                height={26}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                <span className="font-inter">Tender</span>
                <span className="font-kings -ml-0.5">Post</span>
              </span>
            </Link>

            <button
              onClick={toggleTheme}
              disabled={!themeMounted}
              className="p-1.5 rounded-lg hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {themeMounted && theme === 'dark' ? (
                <Moon className="w-4 h-4 text-blue-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>
          </div>

          <div className="px-3 pt-4 pb-2">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                pathname === '/dashboard'
                  ? 'glass-sidebar-item-active text-gray-800 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white glass-sidebar-item'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto glass-scrollbar">
            {navigationSections.map((section) => {
              const isExpanded = expandedSections[section.key];
              const hasActiveItem = section.items.some((item) => pathname === item.href);

              return (
                <div key={section.key}>
                  <button
                    onClick={() => toggleSection(section.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                      hasActiveItem
                        ? 'glass-sidebar-item-active text-gray-800 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white glass-sidebar-item'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <section.icon className="h-4 w-4" />
                      <span>{section.title}</span>
                    </div>
                    <ChevronRight
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mt-1 ml-4 pl-3 border-l-2 border-orange-400/50 dark:border-orange-500/60 space-y-0.5">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-2.5 px-3 py-1.5 text-sm rounded-lg transition-all duration-150 ${
                              isActive
                                ? 'bg-orange-200/60 dark:bg-orange-900/20 text-gray-800 dark:text-orange-400 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-orange-100/50 dark:hover:bg-white/5'
                            }`}
                          >
                            <item.icon className="h-3.5 w-3.5" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="h-px bg-orange-200/50 dark:bg-gray-700/50 my-3" />

            {isDirector && (
              <Link
                href="/dashboard/admin"
                className={`flex items-center space-x-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  pathname === '/dashboard/admin'
                    ? 'glass-sidebar-item-active text-purple-600 dark:text-purple-400'
                    : 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 glass-sidebar-item'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}

            <Link
              href="/dashboard/settings"
              className={`flex items-center space-x-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                pathname === '/dashboard/settings'
                  ? 'glass-sidebar-item-active text-gray-800 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white glass-sidebar-item'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className={`flex items-center space-x-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                pathname === '/dashboard/profile'
                  ? 'glass-sidebar-item-active text-gray-800 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white glass-sidebar-item'
              }`}
            >
              <UserCircle className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </nav>

          <div className="p-3 relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center space-x-3 px-3 py-2.5 glass-user-card transition-all duration-150"
            >
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || 'User'}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-100"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-orange-100">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                  userMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-3 right-3 mb-2 glass-dropdown py-1 z-50">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    router.push('/dashboard/settings');
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-100/50 transition-colors first:rounded-t-lg"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <div className="h-px bg-orange-200/60 my-1 mx-2" />
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors last:rounded-b-lg"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-sidebar border-b border-white/10 dark:border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>

          <Link href="/dashboard" className="flex items-center space-x-1.5">
            <Image
              src={themeMounted && theme === 'dark' ? '/tpllogo-wite.PNG' : '/tplogo.png'}
              alt="TenderPost"
              width={24}
              height={24}
              className="rounded-lg"
            />
            <span className="text-base font-bold text-gray-800 dark:text-gray-100">
              <span className="font-inter">Tender</span>
              <span className="font-kings -ml-0.5">Post</span>
            </span>
          </Link>

          <div className="w-9" />
        </div>
      </div>

      <div className="lg:pl-60 h-screen p-3 lg:p-4 pt-14 lg:pt-12 overflow-hidden">
        <div
          className={`floating-content-panel h-full flex flex-col overflow-hidden ${
            tabs.length > 0 && activeTabId !== tabs[0]?.id ? 'rounded-top-left' : ''
          }`}
        >
          <div className="tab-bump-container hidden lg:block">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <div
                  key={tab.id}
                  className={`tab-bump ${tab.id === activeTabId ? 'tab-active' : 'tab-inactive'}`}
                  onClick={() => switchTab(tab)}
                >
                  <div className="tab-content">
                    <TabIcon className="tab-bump-icon" />
                    <span className="tab-bump-label">{tab.title}</span>
                  </div>
                  <button
                    className="tab-close-btn"
                    onClick={(e) => closeTab(tab.id, e)}
                    aria-label="Close tab"
                  >
                    ×
                  </button>
                </div>
              );
            })}
            <button className="tab-add-btn" onClick={addNewTab} aria-label="Add tab">
              +
            </button>
          </div>

          <div className="flex-1 overflow-y-auto glass-scrollbar pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
