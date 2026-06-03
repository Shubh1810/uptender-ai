'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePostHog } from 'posthog-js/react';
import { Button } from '@/components/ui/button';
import { GetStartedButton } from '@/components/ui/get-started-button';
import { getLiveTendersCount, type TenderStats } from '@/lib/tender-stats';
import { createClient } from '@/lib/supabase/client';
import { resetAuthState, useAuth } from '@/hooks/useAuth';
import { User } from '@supabase/supabase-js';
import { LayoutDashboard, LogOut, Settings, UserCircle } from 'lucide-react';

interface HeaderProps {
  variant?: 'main' | 'simple';
  className?: string;
  showBackButton?: boolean;
  backButtonText?: string;
}

function getInitialsFromUser(user: User | null): string {
  const meta = (user?.user_metadata as Record<string, any>) || {};
  const fullName: string | undefined = meta.full_name || meta.name || meta.fullName;
  const email: string | undefined = user?.email || meta.email;
  // Prefer first name from full name; otherwise use email username
  const source = (fullName && fullName.trim()) || email || '';
  if (!source) return '';
  const namePart = source.includes('@') ? source.split('@')[0] : source;
  const firstName = namePart.trim().split(/\s+/).filter(Boolean)[0] || '';
  const firstInitial = firstName.charAt(0);
  return firstInitial.toUpperCase();
}

function getDisplayNameFromUser(user: User | null): string {
  const meta = (user?.user_metadata as Record<string, any>) || {};
  return meta.full_name || meta.name || meta.display_name || user?.email?.split('@')[0] || 'Account';
}

function handleSignOut() {
  const supabase = createClient();
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

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/api/auth/signout?redirect=/';
  document.body.appendChild(form);
  form.submit();
}

function AccountMenu({ user, size = 'md' }: { user: User; size?: 'sm' | 'md' }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarSize = size === 'sm' ? 32 : 36;
  const initialsClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-sm';

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex rounded-full bg-gradient-to-br from-blue-500/80 via-sky-400/70 to-indigo-500/80 p-[2px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-transparent"
        aria-label="Open account menu"
        aria-expanded={open}
      >
        {user.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt="Profile"
            width={avatarSize}
            height={avatarSize}
            className="rounded-full bg-white object-cover"
          />
        ) : (
          <div className={`${initialsClass} rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center font-semibold`}>
            {getInitialsFromUser(user)}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl shadow-slate-900/10 z-[100]">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="truncate text-sm font-semibold text-gray-900">{getDisplayNameFromUser(user)}</p>
            {user.email && <p className="truncate text-xs text-gray-500">{user.email}</p>}
          </div>
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <UserCircle className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>
          <div className="border-t border-gray-100 py-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                handleSignOut();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header({ 
  variant = 'main', 
  className = '', 
  showBackButton = false,
  backButtonText = 'Back to Home'
}: HeaderProps) {
  const posthog = usePostHog();
  const [tenderStats, setTenderStats] = useState<TenderStats>({
    liveTendersCount: 0,
    lastUpdated: '',
    isConnected: false,
  });
  
  const baseClasses = "bg-white/40 backdrop-blur-sm";
  const stickyClasses = variant === 'main' ? "fixed top-0 left-0 right-0 z-[90]" : "";
  const patternClasses = variant === 'main' ? "header-dots-pattern" : "";
  
  // Load live tenders count on mount and listen for updates
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getLiveTendersCount();
        setTenderStats(stats);
        console.log('🔝 Header: Live tenders updated:', stats.liveTendersCount, stats.isConnected ? '✅ Connected' : '⚠️ Not Connected');
      } catch (error) {
        console.error('❌ Header: Failed to load tender stats:', error);
      }
    };
    
    // Initial load
    loadStats();
    
    // Optional: Refresh every 60 seconds to show updated counts from CRON
    const refreshInterval = setInterval(() => {
      console.log('🔄 Header: Refreshing tender stats from Supabase...');
      loadStats();
    }, 60000); // Every 60 seconds
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);
  
  const trackLogoClick = () => {
    posthog?.capture('header_logo_clicked', {
      variant,
      timestamp: new Date().toISOString(),
    });
    console.log('📊 PostHog tracked: Logo clicked');
  };
  
  return (
    <>
      <header className={`${baseClasses} ${stickyClasses} ${patternClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link 
            href="/" 
            className="flex items-center space-x-0"
            onClick={trackLogoClick}
          >
            <Image
              src="/tplogo.png" 
              alt="TenderPost - AI Tender Notifier Platform for India" 
              className="h-10 w-10 rounded-xl object-contain"
              priority={variant === 'main'}
              width={40}
              height={40}
            />
            <span className="text-2xl font-bold text-gray-900 tracking-tight ml-0">
              <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span>
            </span>
            {variant === 'main' && (
              <div className="hidden md:flex items-center space-x-1 ml-3 bg-white/40 backdrop-blur-sm rounded-full px-2 py-1 border border-white/30 shadow-sm">
                <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${tenderStats.isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-ubuntu text-xs font-medium text-gray-700">{tenderStats.liveTendersCount}</span>
                <span className="font-ubuntu text-[10px] text-gray-500">Live</span>
              </div>
            )}
          </Link>
          
          {variant === 'main' ? (
            <MainNavigation />
          ) : (
            <>
              <InternalPageNavigation />
              <InternalPageDesktopNav />
            </>
          )}
        </div>
      </div>
    </header>
    </>
  );
}

function MainNavigation() {
  const posthog = usePostHog();
  const { user } = useAuth(); // Use shared auth hook - single listener for entire app

  const triggerWaitlist = () => {
    // Force show waitlist overlay immediately
    localStorage.removeItem('waitlist-overlay-seen');
    // Dispatch a custom event to trigger the overlay
    window.dispatchEvent(new CustomEvent('show-waitlist-overlay'));
  };

  const trackNavClick = (section: string) => {
    posthog?.capture('header_navigation_clicked', {
      section,
      location: 'main_header',
      timestamp: new Date().toISOString(),
    });
    console.log('📊 PostHog tracked:', section);
  };

  return (
    <nav className="flex items-center space-x-8">
      <div className="hidden md:flex items-center space-x-8 font-ubuntu text-sm">
        <a 
          href="#features" 
          className="text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => trackNavClick('features')}
        >
          Tender Features
        </a>
        <a 
          href="#categories" 
          className="text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => trackNavClick('categories')}
        >
          Tender Categories
        </a>
        <a 
          href="#pricing" 
          className="text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => trackNavClick('pricing')}
        >
          Pricing
        </a>
        <a 
          href="#faq" 
          className="text-gray-600 hover:text-gray-900 transition-colors"
          onClick={() => trackNavClick('faq')}
        >
          FAQs
        </a>
      </div>
      
      {user ? (
        <AccountMenu user={user} />
      ) : (
        // Not logged in - show Get started button
        <GetStartedButton hideIcon startOnboarding className="get-started-cta">
          <span className="hidden md:inline">Get started</span>
          <span className="md:hidden">Get started</span>
        </GetStartedButton>
      )}
    </nav>
  );
}

// Alternative navigation for tender-guide and other internal pages (Mobile)
export function InternalPageNavigation() {
  const posthog = usePostHog();
  const { user } = useAuth(); // Use shared auth hook

  const trackInternalNavClick = (page: string) => {
    posthog?.capture('internal_header_navigation_clicked', {
      page,
      location: 'internal_header',
      timestamp: new Date().toISOString(),
    });
    console.log('📊 PostHog tracked internal nav:', page);
  };

  return (
    <nav className="flex md:hidden items-center space-x-2">
      {user ? (
        <AccountMenu user={user} size="sm" />
      ) : (
        <GetStartedButton hideIcon startOnboarding className="get-started-cta text-sm">
          <span>Get started</span>
        </GetStartedButton>
      )}
    </nav>
  );
}

// Desktop navigation for internal pages
export function InternalPageDesktopNav() {
  const posthog = usePostHog();
  const { user } = useAuth(); // Use shared auth hook

  const trackInternalNavClick = (page: string) => {
    posthog?.capture('internal_header_navigation_clicked', {
      page,
      location: 'internal_header',
      timestamp: new Date().toISOString(),
    });
    console.log('📊 PostHog tracked internal nav:', page);
  };

  return (
    <nav className="hidden md:flex items-center space-x-8 font-ubuntu text-sm">
      <Link 
        href="/" 
        className="text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => trackInternalNavClick('home')}
      >
        Home
      </Link>
      <Link 
        href="/#features" 
        className="text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => trackInternalNavClick('features')}
      >
        Features
      </Link>
      <Link 
        href="/#pricing" 
        className="text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => trackInternalNavClick('pricing')}
      >
        Pricing
      </Link>
      {user ? (
        <AccountMenu user={user} />
      ) : (
        <GetStartedButton hideIcon startOnboarding className="get-started-cta text-base">
          <span>Get started</span>
        </GetStartedButton>
      )}
    </nav>
  );
}

// Specialized header for tender-guide and similar content pages
export function ContentPageHeader({ className = '' }: { className?: string }) {
  return (
    <Header 
      variant="simple" 
      className={`bg-white/80 backdrop-blur-sm border-b border-gray-200 ${className}`}
    />
  );
} 
