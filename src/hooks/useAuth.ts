/**
 * Shared authentication hook to prevent multiple auth state listeners
 * Use this instead of creating individual auth listeners in components
 */
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

let cachedUser: User | null = null;
let listeners: Set<(user: User | null) => void> = new Set();
let authSubscription: { unsubscribe: () => void } | null = null;

// Singleton pattern to ensure only one auth listener across the app
function initializeAuthListener() {
  if (authSubscription) return; // Already initialized

  const supabase = createClient();

  // Initial check
  supabase.auth.getSession().then(({ data: { session } }) => {
    cachedUser = session?.user || null;
    notifyListeners();
  });

  // Listen for changes - SINGLE GLOBAL LISTENER
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    cachedUser = session?.user || null;
    notifyListeners();
  });

  authSubscription = subscription;
}

function notifyListeners() {
  listeners.forEach(listener => listener(cachedUser));
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(cachedUser);

  useEffect(() => {
    // Initialize global listener if not already done
    initializeAuthListener();

    // Subscribe this component to user changes
    const listener = (newUser: User | null) => setUser(newUser);
    listeners.add(listener);

    // Set initial value
    setUser(cachedUser);

    // Cleanup: remove this component's listener
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return { user };
}
