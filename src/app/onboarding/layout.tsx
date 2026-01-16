import React from 'react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full fixed inset-0 z-50"
      style={{ backgroundColor: '#fefcf3' }}
    >
      {children}
    </div>
  );
}
