'use client';

import { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';

interface PlanGateProps {
  children: ReactNode;
  allowedPlans: string[]; // e.g., ['basic', 'pro', 'enterprise']
  blurContent?: boolean;
  showOverlay?: boolean;
}

export function PlanGate({ 
  children, 
  allowedPlans,
  blurContent = false,
  showOverlay = true
}: PlanGateProps) {
  const { planId, loading } = useSubscription();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }
  
  const hasAccess = planId && allowedPlans.includes(planId);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // Free user trying to access premium feature
  return (
    <div className="relative">
      {/* Blurred content */}
      {blurContent && (
        <div className="pointer-events-none select-none" style={{ filter: 'blur(8px)' }}>
          {children}
        </div>
      )}
      
      {/* Upgrade overlay */}
      {showOverlay && (
        <div className={`${blurContent ? 'absolute inset-0' : ''} flex items-center justify-center ${blurContent ? 'bg-black/40' : 'min-h-[400px]'}`}>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Upgrade Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This feature is available on Pro and Enterprise plans. Upgrade now to unlock powerful AI features.
            </p>
            <div className="flex gap-3 justify-center">
              <Link 
                href="/pricing"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                View Plans
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
              >
                Go Back
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
