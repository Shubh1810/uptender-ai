'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useWaitlistOverlay() {
  const [shouldShow, setShouldShow] = useState(false);
  const pathname = usePathname();

  // Pages where overlay should NOT appear
  const excludedPaths = [
    '/make-payment',
    '/signup',
    '/login',
    '/checkout',
    '/thank-you',
    '/privacy-policy',
    '/terms-and-conditions',
    '/cancellation-and-refund',
    '/shipping-and-delivery'
  ];

  useEffect(() => {
    // Don't show on excluded paths
    if (excludedPaths.some(path => pathname.startsWith(path))) {
      setShouldShow(false);
      return;
    }

    // Check if user has already seen the overlay
    const hasSeenOverlay = localStorage.getItem('tenderpost-waitlist-overlay-seen');
    
    if (!hasSeenOverlay) {
      setShouldShow(true);
    }
  }, [pathname]);

  const markAsSeen = () => {
    localStorage.setItem('tenderpost-waitlist-overlay-seen', 'true');
    setShouldShow(false);
  };

  return {
    shouldShow,
    markAsSeen
  };
} 