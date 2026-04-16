import React from 'react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*
        Preload the left-panel background image from the Server Component so the
        browser queues the fetch in the initial HTML — before any JS runs.
        Without this, the image only becomes discoverable after the client bundle
        loads and React.Suspense resolves, causing the visible delay.
        q=80 must match the quality prop on the <Image> component below.
      */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="preload"
        as="image"
        imageSrcSet={[
          '/_next/image?url=%2Fonboard5.jpeg&w=640&q=80 640w',
          '/_next/image?url=%2Fonboard5.jpeg&w=750&q=80 750w',
          '/_next/image?url=%2Fonboard5.jpeg&w=828&q=80 828w',
          '/_next/image?url=%2Fonboard5.jpeg&w=1080&q=80 1080w',
          '/_next/image?url=%2Fonboard5.jpeg&w=1200&q=80 1200w',
          '/_next/image?url=%2Fonboard5.jpeg&w=1920&q=80 1920w',
        ].join(', ')}
        imageSizes="50vw"
        href="/_next/image?url=%2Fonboard5.jpeg&w=1920&q=80"
      />
      <div
        className="min-h-screen w-full fixed inset-0 z-50"
        style={{ backgroundColor: '#fefcf3' }}
      >
        {children}
      </div>
    </>
  );
}
