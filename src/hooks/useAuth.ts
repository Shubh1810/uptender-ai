/**
 * Shared authentication hook to prevent multiple auth state listeners.
 * Uses a singleton pattern — only ONE onAuthStateChange listener exists
 * across the entire app, no matter how many components call useAuth().
 *
 * Exports:
 *  - useAuth()        — React hook returning { user }
 *  - resetAuthState() — imperative helper called during sign-out to
 *                        tear down the singleton so it re-initialises
 *                        cleanly on next mount.
 */
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// ── Module-level singleton state ──────────────────────────────────────
let cachedUser: User | null = null;
let listeners: Set<(user: User | null) => void> = new Set();
let authSubscription: { unsubscribe: () => void } | null = null;

function notifyListeners() {
  listeners.forEach((listener) => listener(cachedUser));
}

/**
 * Call this during sign-out to immediately clear the cached user,
 * notify all subscribers, and tear down the global auth listener so
 * it can re-initialise on the next page load.
 */
export function resetAuthState() {
  cachedUser = null;
  notifyListeners();

  if (authSubscription) {
    authSubscription.unsubscribe();
    authSubscription = null;
  }
}

/**
 * Lazily initialises the global auth listener (once per browser tab).
 */
function initializeAuthListener() {
  if (authSubscription) return; // Already initialised

  const supabase = createClient();

  // Initial server-verified check.
  // getUser() hits the Supabase API and validates the JWT — unlike
  // getSession() which reads from local storage without verification.
  supabase.auth.getUser().then(({ data: { user } }) => {
    cachedUser = user ?? null;
    notifyListeners();
  });

  // Listen for auth state changes — SINGLE GLOBAL LISTENER
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      cachedUser = null;
      notifyListeners();
      // Tear down so the listener re-creates cleanly on next mount
      authSubscription = null;
      subscription.unsubscribe();
      return;
    }

    cachedUser = session?.user ?? null;
    notifyListeners();
  });

  authSubscription = subscription;
}

// ── React hook ────────────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser] = useState<User | null>(cachedUser);

  useEffect(() => {
    // Boot the singleton if not already running
    initializeAuthListener();

    // Subscribe this component to user changes
    const listener = (newUser: User | null) => setUser(newUser);
    listeners.add(listener);

    // Sync with the latest cached value (may have resolved between
    // render and effect)
    setUser(cachedUser);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { user };
}
