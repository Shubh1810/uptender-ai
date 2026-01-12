'use client';

import { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';

interface FeatureFlagProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  requiredPlan?: string;
}

export function FeatureFlag({ 
  feature, 
  children, 
  fallback,
  showUpgradePrompt = false,
  requiredPlan = 'Pro'
}: FeatureFlagProps) {
  const { hasFeature, loading } = useSubscription();
  
  if (loading) return null;
  
  if (!hasFeature(feature)) {
    if (showUpgradePrompt) {
      return (
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                This feature requires {requiredPlan} plan
              </p>
              <Link 
                href="/pricing"
                className="inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return fallback || null;
  }
  
  return <>{children}</>;
}
