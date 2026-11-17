'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'tenderpost-waitlist-overlay-seen';

/** Pages where the waitlist overlay must never appear. */
const EXCLUDED_PATHS = [
  '/make-payment',
  '/signup',
  '/login',
  '/checkout',
  '/thank-you',
  '/privacy-policy',
  '/terms-and-conditions',
  '/cancellation-and-refund',
  '/shipping-and-delivery',
];

const listeners = new Set<() => void>();

function hasSeenOverlay(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return true; // storage blocked: don't nag
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useWaitlistOverlay() {
  const pathname = usePathname();
  // Server snapshot = "seen", so the overlay never flashes during hydration.
  const seen = useSyncExternalStore(subscribe, hasSeenOverlay, () => true);
  const excluded = EXCLUDED_PATHS.some((path) => pathname.startsWith(path));

  const markAsSeen = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  }, []);

  return { shouldShow: !seen && !excluded, markAsSeen };
}
