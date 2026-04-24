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
        q=75 must match the quality prop on the <Image> component below.
      */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="preload"
        as="image"
        media="(min-width: 1024px)"
        imageSrcSet={[
          '/_next/image?url=%2Fonboard5.webp&w=640&q=75 640w',
          '/_next/image?url=%2Fonboard5.webp&w=750&q=75 750w',
          '/_next/image?url=%2Fonboard5.webp&w=828&q=75 828w',
          '/_next/image?url=%2Fonboard5.webp&w=1080&q=75 1080w',
          '/_next/image?url=%2Fonboard5.webp&w=1200&q=75 1200w',
          '/_next/image?url=%2Fonboard5.webp&w=1920&q=75 1920w',
        ].join(', ')}
        imageSizes="50vw"
        href="/_next/image?url=%2Fonboard5.webp&w=1920&q=75"
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
