'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useSubscription } from '@/features/plans/useSubscription';
import { PAID_PLANS, isPaidPlanId } from '@/config/plans';

interface PlanGateProps {
  children: ReactNode;
  /** Plan IDs allowed to see the content, e.g. ['pro', 'enterprise']. */
  allowedPlans: string[];
  /** Show a blurred placeholder behind the upgrade prompt. */
  blurContent?: boolean;
  showOverlay?: boolean;
}

/**
 * Client-side paywall for premium screens.
 *
 * Locked content is never rendered (not even blurred) because anything in the
 * DOM can be read with devtools. Any data behind a premium feature must also
 * be enforced by its API route.
 */
export function PlanGate({ children, allowedPlans, blurContent = false, showOverlay = true }: PlanGateProps) {
  const { planId } = useSubscription();

  if (allowedPlans.includes(planId)) return <>{children}</>;

  const planNames = allowedPlans.filter(isPaidPlanId).map((id) => PAID_PLANS[id].name);
  const cheapest = allowedPlans.find(isPaidPlanId);
  const upgradeHref = cheapest ? `/make-payment?plan=${PAID_PLANS[cheapest].checkoutKey}` : '/make-payment';

  return (
    <div className="relative min-h-[400px]">
      {blurContent && <LockedPlaceholder />}

      {showOverlay && (
        <div className={`${blurContent ? 'absolute inset-0 bg-black/40' : 'min-h-[400px]'} flex items-center justify-center`}>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upgrade Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {planNames.length > 0
                ? `This feature is available on the ${planNames.join(', ')} plan${planNames.length > 1 ? 's' : ''}.`
                : 'This feature is not available on your current plan.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href={upgradeHref} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
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

/** Generic skeleton shown behind the paywall instead of the real content. */
function LockedPlaceholder() {
  return (
    <div className="pointer-events-none select-none space-y-4 p-6" style={{ filter: 'blur(6px)' }} aria-hidden>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-800" />
      <div className="h-40 rounded-xl bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}
