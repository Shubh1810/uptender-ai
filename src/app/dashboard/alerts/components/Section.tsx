import React from 'react';

export function Section({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        border border-neutral-200
        shadow-sm
        px-6 md:px-10
        py-8 md:py-12
        space-y-10
      "
    >
      {children}
    </div>
  );
}