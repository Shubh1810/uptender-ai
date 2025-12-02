'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePostHog } from 'posthog-js/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/ui/google-signin-button';
import { getLiveTendersCount, type TenderStats } from '@/lib/tender-stats';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

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
            className="flex items-center space-x-2"
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
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
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
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

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
      <div className="hidden md:flex items-center space-x-8 font-ubuntu">
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
        // Logged in user - show clickable avatar linking to dashboard
        <Link href="/dashboard" className="inline-flex items-center">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full border border-gray-300 shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center text-sm font-semibold border border-white/40 shadow-sm">{getInitialsFromUser(user)}</div>
          )}
        </Link>
      ) : (
        // Not logged in - show Get started button
        <GoogleSignInButton hideIcon startOnboarding className="get-started-cta">
          <span className="hidden md:inline">Get started</span>
          <span className="md:hidden">Get started</span>
        </GoogleSignInButton>
      )}
    </nav>
  );
}

// Alternative navigation for tender-guide and other internal pages (Mobile)
export function InternalPageNavigation() {
  const posthog = usePostHog();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

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
        <Link href="/dashboard" className="inline-flex items-center">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full border border-gray-300 shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center text-xs font-semibold border border-white/40 shadow-sm">{getInitialsFromUser(user)}</div>
          )}
        </Link>
      ) : (
        <GoogleSignInButton hideIcon startOnboarding className="get-started-cta text-sm">
          <span>Get started</span>
        </GoogleSignInButton>
      )}
    </nav>
  );
}

// Desktop navigation for internal pages
export function InternalPageDesktopNav() {
  const posthog = usePostHog();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const trackInternalNavClick = (page: string) => {
    posthog?.capture('internal_header_navigation_clicked', {
      page,
      location: 'internal_header',
      timestamp: new Date().toISOString(),
    });
    console.log('📊 PostHog tracked internal nav:', page);
  };

  return (
    <nav className="hidden md:flex items-center space-x-8 font-ubuntu">
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
        <Link href="/dashboard" className="inline-flex items-center">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full border border-gray-300 shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center text-sm font-semibold border border-white/40 shadow-sm">{getInitialsFromUser(user)}</div>
          )}
        </Link>
      ) : (
        <GoogleSignInButton hideIcon startOnboarding className="get-started-cta text-base">
          <span>Get started</span>
        </GoogleSignInButton>
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