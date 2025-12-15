'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { 
  LayoutDashboard,
  BarChart3,
  Search,
  Bell,
  Settings,
  FileText,
  TrendingUp,
  Target,
  Activity,
  Zap,
  Users,
  LogOut,
  Menu,
  Brain,
  Shield,
  LineChart,
  ChevronDown,
  ChevronRight,
  Moon,
  Sun,
  Clock,
  Eye,
  Bookmark,
  Sparkles,
  CheckCircle,
  TrendingDown,
  Crosshair,
  AlertCircle,
  UserCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { identifyUser, trackUserSignedOut, trackDashboardViewed } from '@/lib/posthog/events';

// Tab interface
interface Tab {
  id: string;
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [onboardingProgress, setOnboardingProgress] = useState<number>(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [themeMounted, setThemeMounted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tenders: true,
    analytics: false,
    aiWorkspace: false,
    notifications: false,
  });
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // Get current page name for tab bump
  const getPageName = (path: string = pathname) => {
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/dashboard/search') return 'Search Tenders';
    if (path === '/dashboard/intelligraph') return 'IntelliGraph™';
    if (path === '/dashboard/alerts') return 'Alert Settings';
    
    // Extract and format page name from pathname
    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get icon for page
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
    
    // Default icon
    return LayoutDashboard;
  };

  // Initialize tabs from current pathname
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

  // Update active tab when pathname changes
  useEffect(() => {
    if (pathname && tabs.length > 0) {
      // Check if tab already exists for this path
      const existingTab = tabs.find(tab => tab.path === pathname);
      if (existingTab) {
        setActiveTabId(existingTab.id);
      } else {
        // Create new tab for new path
        const newTab: Tab = {
          id: `tab-${Date.now()}`,
          title: getPageName(pathname),
          path: pathname,
          icon: getPageIcon(pathname),
        };
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(newTab.id);
      }
    }
  }, [pathname]);

  // Add new tab
  const addNewTab = () => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    // Don't navigate, just switch tabs
    if (pathname !== '/dashboard') {
      router.push('/dashboard');
    }
  };

  // Close tab
  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    // If closing active tab, switch to another tab
    if (tabId === activeTabId && newTabs.length > 0) {
      // Switch to the previous tab, or the next one if it's the first tab
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTabId(newActiveTab.id);
      // Only navigate if the path is different
      if (pathname !== newActiveTab.path) {
        router.push(newActiveTab.path);
      }
    }
    
    setTabs(newTabs);
    
    // If no tabs left, create a new one
    if (newTabs.length === 0) {
      addNewTab();
    }
  };

  // Switch to tab
  const switchTab = (tab: Tab) => {
    if (tab.id === activeTabId) return; // Already active
    
    setActiveTabId(tab.id);
    // Only navigate if the path is different from current
    if (pathname !== tab.path) {
      router.push(tab.path);
    }
  };

  // Theme initialization and toggle - defaults to dark mode
  useEffect(() => {
    setThemeMounted(true);
    const stored = localStorage.getItem('dashboard-theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    } else {
      // Default to dark mode for new users
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('dashboard-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('dashboard-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      return next;
    });
  };

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          setUser(session.user);
          setLoading(false);
          
          // Identify user in PostHog
          identifyUser({
            userId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          });
        } else if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(getUser, retryCount * 500);
        } else {
          if (mounted) {
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
        if (mounted) {
          router.push('/');
        }
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && mounted) {
        setUser(session.user);
        setLoading(false);
      } else if (_event === 'SIGNED_OUT' && mounted) {
        router.push('/');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    trackUserSignedOut();
    try {
      // Sign out from Supabase - this should clear the session
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Force redirect to ensure logout is processed
      // Using window.location instead of router to ensure full page reload
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even on error
      window.location.href = '/';
    }
  };

  // Check onboarding status and progress
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      
      try {
        const { data: prof, error } = await supabase
          .from('profiles')
          .select('onboarding_completed, full_name, company, primary_industry')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking onboarding:', error);
          setOnboardingCompleted(null);
          setOnboardingProgress(0);
        } else if (prof) {
          const isCompleted = prof.onboarding_completed === true || 
                             prof.onboarding_completed === 'true' || 
                             prof.onboarding_completed === 1;
          setOnboardingCompleted(isCompleted);
          
          // Calculate progress based on filled fields (3 steps total)
          if (isCompleted) {
            setOnboardingProgress(100);
          } else {
            let progress = 0;
            if (prof.full_name) progress += 33; // Step 1
            if (prof.company) progress += 33; // Step 2
            if (prof.primary_industry) progress += 34; // Step 3
            setOnboardingProgress(Math.min(100, progress));
          }
        } else {
          setOnboardingCompleted(false);
          setOnboardingProgress(0);
        }
      } catch (error) {
        console.error('Exception checking onboarding:', error);
        setOnboardingCompleted(null);
        setOnboardingProgress(0);
      }
    };
    
    checkOnboarding();
  }, [user, supabase]);

  // Track dashboard section views
  useEffect(() => {
    if (user && pathname) {
      const section = pathname.split('/').pop() || 'home';
      trackDashboardViewed({ section });
    }
  }, [pathname, user]);

  // Close user menu when clicking outside
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Toggle section expansion
  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Navigation structure with collapsible sections
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
      ]
    },
    {
      key: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      items: [
        { name: 'Tender Analytics', icon: TrendingUp, href: '/dashboard/tender-analytics' },
        { name: 'Bid Analytics', icon: Target, href: '/dashboard/bid-analytics' },
        { name: 'IntelliGraph™', icon: LineChart, href: '/dashboard/intelligraph' },
      ]
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
      ]
    },
    {
      key: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { name: 'Notification Manager', icon: Bell, href: '/dashboard/notifications' },
        { name: 'Alert Settings', icon: AlertCircle, href: '/dashboard/alerts' },
        { name: 'Email Preferences', icon: Users, href: '/dashboard/email-prefs' },
      ]
    }
  ];

  return (
    <div className="min-h-screen dashboard-outer-bg">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* macOS-Style Glass Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-60 glass-sidebar transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* TenderPost Logo & Theme Toggle */}
          <div className="p-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-1 px-2 py-1.5">
              <Image
                src={themeMounted && theme === 'dark' ? "/tpllogo-wite.PNG" : "/tplogo.png"}
                alt="TenderPost"
                width={26}
                height={26}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                <span className="font-inter">Tender</span><span className="font-kings -ml-0.5">Post</span>
              </span>
            </Link>
            
            {/* Minimal Theme Toggle */}
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

          {/* Dashboard Link */}
          <div className="px-3 pt-4 pb-2">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                pathname === '/dashboard' 
                  ? 'glass-sidebar-item-active text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white glass-sidebar-item'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Navigation Sections - Collapsible */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto glass-scrollbar">
            {navigationSections.map((section) => {
              const isExpanded = expandedSections[section.key];
              const hasActiveItem = section.items.some(item => pathname === item.href);
              
              return (
                <div key={section.key}>
                  {/* Section Header - Clickable Dropdown Button */}
                  <button
                    onClick={() => toggleSection(section.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                      hasActiveItem
                        ? 'glass-sidebar-item-active text-gray-900 dark:text-white'
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
                  
                  {/* Dropdown Items */}
                  {isExpanded && (
                    <div className="mt-1 ml-4 pl-3 border-l-2 border-gray-200/50 dark:border-gray-700/50 space-y-0.5">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center space-x-2.5 px-3 py-1.5 text-sm rounded-lg transition-all duration-150 ${
                              isActive
                                ? 'bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50/50 dark:hover:bg-white/5'
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

            {/* Separator */}
            <div className="h-px bg-gray-200/50 dark:bg-gray-700/50 my-3"></div>

            {/* Settings Link */}
            <Link
              href="/dashboard/settings"
              className={`flex items-center space-x-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                pathname === '/dashboard/settings'
                  ? 'glass-sidebar-item-active text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white glass-sidebar-item'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>

            {/* Profile Link */}
            <Link
              href="/dashboard/profile"
              className={`flex items-center space-x-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                pathname === '/dashboard/profile'
                  ? 'glass-sidebar-item-active text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white glass-sidebar-item'
              }`}
            >
              <UserCircle className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </nav>

          {/* User Profile & Menu */}
          <div className="p-3 relative" ref={userMenuRef}>
            {/* User Profile Section - Clickable */}
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
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white/80">
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
            
            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-3 right-3 mb-2 glass-dropdown py-1 z-50">
                <button 
                  onClick={() => {
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-black/5 transition-colors first:rounded-t-lg"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <div className="h-px bg-black/5 my-1 mx-2"></div>
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

      {/* Main Content Area with Floating Panel */}
      <div className="lg:pl-60 h-screen p-3 lg:p-4 pt-10 lg:pt-12 overflow-hidden">
        <div className="floating-content-panel h-full flex flex-col overflow-hidden">
          {/* Chrome-style Tab Bump */}
          <div className="tab-bump-container">
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
            <button 
              className="tab-add-btn"
              onClick={addNewTab}
              aria-label="Add tab"
            >
              +
            </button>
          </div>

          {/* Top Bar with Search */}
          <header className="flex-shrink-0">
            <div className="px-6 py-4 flex items-center">
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                
                {/* Onboarding Prompt */}
                <div className="ml-auto flex items-center space-x-3">
                  {onboardingCompleted === false && (
                    <div className="flex items-center space-x-2 px-4 py-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-full shadow-sm">
                      <span className="hidden sm:inline text-sm text-gray-800 dark:text-white font-semibold">
                        Unlock AI tender recommendations
                      </span>
                      <Link
                        href="/onboarding?step=2"
                        className="flex items-center px-4 py-1.5 bg-red-50 border border-red-500/50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-all"
                      >
                        <span>Set up</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto glass-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

