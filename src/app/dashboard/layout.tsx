'use client';

import React, { useState, useEffect } from 'react';
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
  X,
  Brain,
  Shield
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { identifyUser, trackUserSignedOut, trackDashboardViewed } from '@/lib/posthog/events';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

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
    try {
      trackUserSignedOut();
      
      // Get the site URL for redirect (production or localhost)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      // Sign out with redirect option for production
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) {
        console.error('Sign out error:', error);
        // Even if signOut fails, redirect to homepage
      }
      
      // Use window.location.href for a full page reload to clear all state
      // This ensures cookies are cleared properly in production
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out exception:', error);
      // Fallback: force redirect even on error
      window.location.href = '/';
    }
  };

  // Track dashboard section views
  useEffect(() => {
    if (user && pathname) {
      const section = pathname.split('/').pop() || 'home';
      trackDashboardViewed({ section });
    }
  }, [pathname, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navigationSections = [
    {
      title: 'Tender Management',
      items: [
        { name: 'Search Tenders', icon: Search, href: '/dashboard/search' },
        { name: 'My Tenders', icon: FileText, href: '/dashboard/tenders' },
        { name: 'Active Bids', icon: Activity, href: '/dashboard/active-bids' },
        { name: 'Tender History', icon: BarChart3, href: '/dashboard/history' },
        { name: 'Watchlist', icon: Bell, href: '/dashboard/watchlist' },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { name: 'Tender analytics', icon: BarChart3, href: '/dashboard/analytics' },
        { name: 'Bid analytics', icon: TrendingUp, href: '/dashboard/bid-analytics' },
        { name: 'Market insights', icon: Target, href: '/dashboard/insights' },
      ]
    },
    {
      title: 'Notifications',
      items: [
        { name: 'Notifier Manager', icon: Bell, href: '/dashboard/notifier' },
        { name: 'Alert Settings', icon: Settings, href: '/dashboard/alerts' },
        { name: 'Email Preferences', icon: Users, href: '/dashboard/email-prefs' },
      ]
    },
    {
      title: 'AI Tools',
      items: [
        { name: 'AI Bid Draft', icon: Zap, href: '/dashboard/ai-draft' },
        { name: 'AI Review', icon: Brain, href: '/dashboard/ai-review' },
        { name: 'Smart Search', icon: Search, href: '/dashboard/search' },
        { name: 'Document Generator', icon: FileText, href: '/dashboard/doc-generator' },
        { name: 'Compliance Checker', icon: Shield, href: '/dashboard/compliance' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Minimal Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-56 bg-white border-r border-gray-200 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* TenderPost Logo */}
          <div className="p-3 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-1 px-3 py-2">
              <Image
                src="/tplogo.png"
                alt="TenderPost"
                width={24}
                height={24}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-gray-900">
                <span className="font-inter">Tender</span><span className="font-kings -ml-0.5">Post</span>
              </span>
            </Link>
          </div>

          {/* Dashboard Link */}
          <div className="p-3 border-b border-gray-200">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                          isActive
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile & Sign Out */}
          <div className="p-3 border-t border-gray-200 space-y-2">
            <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-56">
        {/* Top Bar with Search */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* User Info */}
              <div className="ml-auto flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name || 'User'}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-sky-400 flex items-center justify-center text-white text-sm font-semibold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}

