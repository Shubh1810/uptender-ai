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
      person_profiles: 'identified_only', // Capture events for all users (anonymous + identified)
      capture_pageview: true, // Automatically capture pageviews on route changes
      capture_pageleave: true, // Track when users leave pages
      autocapture: {
        // Enable autocapture with detailed configuration
        dom_event_allowlist: undefined, // Capture all DOM events (default)
        url_allowlist: undefined, // Capture on all URLs (default)
        element_allowlist: undefined, // Capture all elements (default)
        css_selector_allowlist: undefined, // No CSS restrictions
      },
      capture_exceptions: true, // Capture JavaScript errors
      disable_session_recording: false, // Enable session recordings if configured
      session_recording: {
        maskAllInputs: true, // Mask sensitive input fields
        maskTextSelector: '[data-ph-mask]', // Custom mask selector
      },
      debug: process.env.NODE_ENV === 'development',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ PostHog loaded successfully');
          console.log('📊 Autocapture enabled - All clicks and pageviews will be tracked');
        }
      },
    });
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

