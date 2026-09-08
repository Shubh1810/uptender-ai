import React from 'react';
import OnboardingClient from './OnboardingClient';
import { LoadingScreen } from '@/components/ui/loading-screen';

export default function OnboardingPage() {
  return (
    <React.Suspense fallback={<LoadingScreen message="Loading onboarding" />}>
      <OnboardingClient />
    </React.Suspense>
  );
}


