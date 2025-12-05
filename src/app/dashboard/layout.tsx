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
  X,
  Brain,
  Shield,
  AlertCircle,
  CheckCircle,
  LineChart,
  ChevronDown
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
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  const [onboardingProgress, setOnboardingProgress] = useState<number>(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
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
        { name: 'IntelliGraph™', icon: LineChart, href: '/dashboard/intelligraph' },
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

          {/* User Profile & Menu */}
          <div className="p-3 border-t border-gray-200 relative" ref={userMenuRef}>
            {/* User Profile Section - Clickable */}
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || 'User'}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-sky-400 flex items-center justify-center text-white text-sm font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <ChevronDown 
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  userMenuOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 transform transition-all duration-200 ease-out opacity-100 translate-y-0">
                <button 
                  onClick={() => {
                    setUserMenuOpen(false);
                    // Add settings navigation here if needed
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <div className="h-px bg-gray-100 my-1"></div>
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

      {/* Main Content */}
      <div className="lg:pl-56">
        {/* Top Bar with Search */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-3 h-[69px] flex items-center">
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Onboarding Prompt */}
              <div className="ml-auto flex items-center space-x-3">
                {onboardingCompleted === false && (
                  <>
                    {/* Circular Progress Pill */}
                    <div className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-full text-white text-xs font-bold">
                      {onboardingProgress}%
                    </div>
                    
                    {/* Main Pill Container */}
                    <div className="flex items-center space-x-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm shadow-[0_0_15px_rgba(34,197,94,0.25),0_0_30px_rgba(132,204,22,0.15)]">
                      <span className="hidden sm:inline text-sm text-gray-900 font-bold">
                        Unlock AI tender recommendations
                      </span>
                      <Link
                        href="/onboarding?step=2"
                        className="flex items-center px-4 py-1.5 bg-red-50 border border-red-600 text-red-600 rounded-full text-sm font-medium transition-all"
                      >
                        <span>Set up</span>
                      </Link>
                    </div>
                  </>
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

