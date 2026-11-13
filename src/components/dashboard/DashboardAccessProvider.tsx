'use client';

import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import type { SubscriptionPlan } from '@/features/plans/types';

export type { SubscriptionPlan };

interface DashboardAccessContextValue {
  initialUser: User | null;
  initialPlan: SubscriptionPlan | null;
  isDirector: boolean;
}

const DashboardAccessContext = createContext<DashboardAccessContextValue>({
  initialUser: null,
  initialPlan: null,
  isDirector: false,
});

interface DashboardAccessProviderProps extends DashboardAccessContextValue {
  children: React.ReactNode;
}

/**
 * Carries the server-resolved user, plan and role into client components.
 * Values are for display/UX only; the server re-checks access on every API call.
 */
export function DashboardAccessProvider({ children, initialUser, initialPlan, isDirector }: DashboardAccessProviderProps) {
  return (
    <DashboardAccessContext.Provider value={{ initialUser, initialPlan, isDirector }}>
      {children}
    </DashboardAccessContext.Provider>
  );
}

export function useDashboardAccess() {
  return useContext(DashboardAccessContext);
}
