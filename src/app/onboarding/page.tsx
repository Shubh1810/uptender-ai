import React from 'react';
import OnboardingClient from './OnboardingClient';

export default function OnboardingPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen" />}> 
      <OnboardingClient />
    </React.Suspense>
  );
}


