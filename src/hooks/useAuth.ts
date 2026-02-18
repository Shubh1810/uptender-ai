/**
 * Shared authentication hook — singleton pattern.
 *
 * Only ONE onAuthStateChange listener exists across the entire app,
 * no matter how many components call useAuth().
 *
 * Exports:
 *  - useAuth()        — React hook returning { user, loading }
 *  - resetAuthState() — imperative helper called during sign-out to
 *                        immediately clear cached state and tear down
 *                        the listener so it re-initialises on next mount.
 */
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

// ── Module-level singleton state ──────────────────────────────────────
let cachedUser: User | null = null;
let initialized = false;
let listeners: Set<() => void> = new Set();
let authSubscription: { unsubscribe: () => void } | null = null;

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

/**
 * Call during sign-out to immediately clear the cached user,
 * notify all subscribers, and tear down the global auth listener.
 */
export function resetAuthState() {
  cachedUser = null;
  initialized = false;

  if (authSubscription) {
    authSubscription.unsubscribe();
    authSubscription = null;
  }

  notifyListeners();
}

function initializeAuthListener() {
  if (authSubscription) return;

  const supabase = createClient();

  supabase.auth.getUser().then(({ data: { user } }) => {
    cachedUser = user ?? null;
    initialized = true;
    notifyListeners();
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      cachedUser = null;
      initialized = true;
      notifyListeners();
      authSubscription = null;
      subscription.unsubscribe();
      return;
    }

    cachedUser = session?.user ?? null;
    initialized = true;
    notifyListeners();
  });

  authSubscription = subscription;
}

// ── React hook ────────────────────────────────────────────────────────
export function useAuth() {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!initialized);

  useEffect(() => {
    initializeAuthListener();

    const listener = () => {
      setUser(cachedUser);
      setLoading(!initialized);
    };
    listeners.add(listener);

    // Sync with latest value in case it resolved between render and effect.
    listener();

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { user, loading };
}
