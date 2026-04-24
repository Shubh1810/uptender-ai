'use client';

import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';

export interface SubscriptionPlan {
  plan_id: string;
  display_name: string;
  features: Record<string, unknown>;
  limits: Record<string, number>;
  status: string;
}

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

export function DashboardAccessProvider({
  children,
  initialUser,
  initialPlan,
  isDirector,
}: DashboardAccessProviderProps) {
  return (
    <DashboardAccessContext.Provider value={{ initialUser, initialPlan, isDirector }}>
      {children}
    </DashboardAccessContext.Provider>
  );
}

export function useDashboardAccess() {
  return useContext(DashboardAccessContext);
}
