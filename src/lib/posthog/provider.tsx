'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Initialize PostHog only on client side
if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: '/ingest',
      ui_host: 'https://us.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: {
        dom_event_allowlist: undefined,
        url_allowlist: undefined,
        element_allowlist: undefined,
        css_selector_allowlist: undefined,
      },
      capture_exceptions: true,
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: '[data-ph-mask]',
      },
      // Fix for "signal is aborted" errors
      request_batching: true, // Batch requests to reduce network calls
      persistence: 'localStorage+cookie', // More reliable persistence
      debug: process.env.NODE_ENV === 'development',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ PostHog loaded successfully');
          console.log('📊 Autocapture enabled - All clicks and pageviews will be tracked');
        }
      },
    });
    
    // Catch and suppress PostHog errors globally
    if (typeof window !== 'undefined') {
      const originalError = console.error;
      console.error = (...args) => {
        // Suppress PostHog abort errors
        if (args[0]?.toString().includes('signal is aborted') || 
            args[0]?.toString().includes('posthog')) {
          return; // Don't log PostHog errors
        }
        originalError.apply(console, args);
      };
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ PostHog key not found. Set NEXT_PUBLIC_POSTHOG_KEY in .env.local');
  }
}

/**
 * PostHog Provider Component
 * Wraps your app to enable analytics and autocapture
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}

/**
 * PostHog Pageview Tracker
 * Note: With capture_pageview: true, this is now optional/redundant
 * Keeping for backwards compatibility - can be removed if not needed
 */
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only fire if pathname changes (PostHog's auto-capture might miss some Next.js navigation)
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      
      // This supplements the automatic pageview tracking
      posthog.capture('$pageview', {
        $current_url: url,
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📍 Pageview tracked:', url);
      }
    }
  }, [pathname, searchParams]);

  return null;
}

