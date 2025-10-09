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
      person_profiles: 'identified_only', // Only create profiles for identified users
      capture_pageview: false, // We'll manually capture pageviews for better control
      capture_pageleave: true, // Track when users leave pages
      autocapture: true, // Enable autocapture for clicks, form interactions
      capture_exceptions: true, // Capture JavaScript errors
      disable_session_recording: false, // Enable session recordings if configured
      session_recording: {
        maskAllInputs: true, // Mask sensitive input fields
        maskTextSelector: '[data-ph-mask]', // Custom mask selector
      },
      debug: process.env.NODE_ENV === 'development',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('PostHog loaded successfully');
        }
      },
    });
  } else if (process.env.NODE_ENV === 'development') {
    console.warn('PostHog key not found. Set NEXT_PUBLIC_POSTHOG_KEY in .env.local');
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
 * Tracks pageviews on route changes in Next.js App Router
 */
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

