'use client';

/**
 * HERO SECTION v2 — TenderPost
 * Changes vs v1:
 *  - Removed badge pill at top
 *  - Heading smaller (3xl/4xl/5xl instead of 5xl/6xl/7xl)
 *  - Search bar + "Get started" button on the same row
 *  - MacBook mockup moved much higher (mt-8)
 *  - Dashboard mockup richer, aligned to macbook.png screen overlay
 *
 * Drop into: src/components/HeroSection.tsx
 * In page.tsx replace the hero <section> with: <HeroSection />
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WavyBackground } from '@/components/ui/wavy-background';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { getLiveTendersCount, type TenderStats } from '@/features/tenders/tender-stats';

export function HeroSection() {
  const router = useRouter();
  const [tenderStats, setTenderStats] = React.useState<TenderStats>({
    liveTendersCount: 0,
    lastUpdated: '',
    isConnected: false,
  });

  React.useEffect(() => {
    const load = async () => {
      try {
        const stats = await getLiveTendersCount();
        setTenderStats(stats);
      } catch {}
    };
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative overflow-hidden pt-28 pb-0"
      style={{ backgroundColor: '#fefcf3' }}
    >
      <WavyBackground
        containerClassName="pointer-events-none absolute inset-0 z-0 -rotate-[10deg] origin-center scale-125 translate-y-16 md:translate-y-24"
        className="h-full w-full"
        backgroundFill="#fefcf3"
        colors={['#1e3a8a', '#1d4ed8', '#3b82f6', '#f97316', '#fb923c']}
        waveWidth={80}
        blur={16}
        speed="slow"
        waveOpacity={0.6}
      />

      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-35"
        style={{
          backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
        }}
      />

      {/* Yellow-gold glow behind MacBook — full hero width */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[40%] z-[1] h-[60%] w-full"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 100%, rgba(253, 224, 71, 0.36) 0%, rgba(250, 204, 21, 0.28) 35%, rgba(202, 138, 4, 0.14) 60%, transparent 85%)',
        }}
      />

      {/* Text content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">

        {/* Headline — smaller */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl"
          style={{
            fontFamily: '"Funnel Display", sans-serif',
            transform: 'scaleX(0.97)',
            display: 'inline-block',
          }}
        >
          Your AI Procurement partner that tells you{' '}
          <span className="relative inline-block" style={{ color: '#b84d00' }}>
            what&apos;s worth bidding.
            <svg
              aria-hidden
              viewBox="0 0 300 10"
              className="absolute -bottom-1.5 left-0 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M2 6 Q75 1 150 6 T298 6"
                stroke="#f97316"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500"
          style={{ fontFamily: 'var(--font-roboto)' }}
        >
          Instant tender alerts, intelligent filtering, and AI-powered bid support.
          Replaces manual tracking, risky bids, and expensive procurement consultants.
        </motion.p>

        {/* Search + CTA on the same row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26 }}
          className="relative top-6 mt-7 flex flex-col items-center gap-3 sm:top-8 sm:flex-row sm:justify-center"
        >
          {/* Search input */}
          <div className="relative flex w-full max-w-md items-center rounded-full border border-gray-200 bg-white/90 shadow-sm backdrop-blur-sm focus-within:border-blue-300 focus-within:shadow-md transition-all duration-200">
            <svg className="ml-4 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder='e.g. "IT, Construction, Healthcare"'
              className="w-full bg-transparent py-3 pl-3 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              onFocus={() => router.push('/onboarding')}
            />
          </div>

          {/* Get started button */}
          <Link href="/onboarding" className="inline-flex flex-shrink-0">
            <HoverBorderGradient
              as="span"
              containerClassName="rounded-full shadow-md shadow-slate-900/20 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
              className="flex items-center gap-2 bg-slate-900 px-6 py-3 text-sm font-semibold text-white whitespace-nowrap"
              duration={0.8}
            >
              Get started for free
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </HoverBorderGradient>
          </Link>
        </motion.div>

        {/* Live tenders pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="relative top-6 mt-3 flex justify-center sm:top-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs shadow-sm backdrop-blur-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${tenderStats.isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="font-semibold text-green-700">{tenderStats.liveTendersCount.toLocaleString()}</span>
            <span className="text-gray-500">Live Tenders · {tenderStats.isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </motion.div>
      </div>

      {/* MacBook mockup — higher up */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="relative w-full">
          {/* The macbook.png frame sits on top (z-10) */}
          <Image
            src="/macbook.png"
            alt="TenderPost dashboard on MacBook"
            width={1400}
            height={880}
            className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
            priority
          />

          {/*
            Screen overlay (z-0, behind the PNG frame so the bezel overlaps it naturally).
            Adjust top/left/right/bottom % to align with YOUR macbook.png screen area.
            Common values for a standard MacBook mockup:
              top: 6–8%   left: 11–13%   right: 11–13%   bottom: 13–16%
          */}
          <div
            className="absolute z-0 overflow-hidden"
            style={{
              top: '10%',
              left: '10.2%',
              right: '10.2%',
              bottom: '10%',
              borderRadius: '4px 4px 0 0',
              background: '#f0f5f6',
            }}
          >
            <DashboardMockup />
          </div>
        </div>

      </motion.div>

      {/* Trusted by — full-width cream bar overlapping bottom quarter of laptop */}
      <TrustedBy />
    </section>
  );
}

/* ─────────────────────────────────────────────
   Dashboard Mockup — fills MacBook screen overlay
   Modeled on the real /dashboard/search screen:
   dark sidebar nav + "Search Live Tenders" results
   with AI Match badges, key-details grid and the
   financial info row.
   ───────────────────────────────────────────── */

const MATCH_COLOR: Record<'green' | 'lime' | 'orange', string> = {
  green: '#4ade80',
  lime: '#a3e635',
  orange: '#fb923c',
};

interface MockTender {
  title: string;
  org: string;
  location: string;
  match: number;
  matchColor: 'green' | 'lime' | 'orange';
  refNo: string;
  published: string;
  opening: string;
  closing: string;
  value: string;
  emd: string;
  period: string;
  tags: string[];
}

const MOCK_TENDERS: MockTender[] = [
  {
    title: 'Medical Equipment Supply & Installation',
    org: 'AIIMS New Delhi',
    location: 'New Delhi',
    match: 94,
    matchColor: 'green',
    refNo: 'GEM/2024/B/4521',
    published: 'Nov 2, 2024',
    opening: 'Dec 10, 2024',
    closing: 'Dec 15, 2024',
    value: '₹2.4Cr',
    emd: '₹1.2L',
    period: '90 days',
    tags: ['GeM', 'Healthcare'],
  },
  {
    title: 'Road Construction — National Highway NH-48',
    org: 'NHAI',
    location: 'Jaipur, Rajasthan',
    match: 87,
    matchColor: 'lime',
    refNo: 'NHAI/2024/RC/0048',
    published: 'Nov 5, 2024',
    opening: 'Dec 18, 2024',
    closing: 'Dec 20, 2024',
    value: '₹18.6Cr',
    emd: '₹9.3L',
    period: '365 days',
    tags: ['CPPP', 'Infrastructure'],
  },
];

function DashboardMockup() {
  return (
    <div
      className="h-full w-full flex overflow-hidden"
      style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', background: '#111113' }}
    >
      {/* Sidebar — mirrors DashboardShell nav */}
      <div
        style={{
          width: 168,
          flexShrink: 0,
          background: '#0a0a0a',
          padding: '12px 9px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* Logo — brand logo + brand fonts (Inter/Geist + Kings) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, paddingLeft: 4 }}>
          <Image
            src="/tpllogo-wite.PNG"
            alt="TenderPost"
            width={18}
            height={18}
            className="rounded-lg shrink-0 object-contain"
          />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 11, letterSpacing: '-0.02em' }} className="inline-flex items-baseline">
            <span className="font-inter">Tender</span><span className="font-kings -ml-0.5">Post</span>
          </span>
        </div>

        <div style={{ padding: '5px 8px', borderRadius: 5, color: 'rgba(255,255,255,0.45)', fontSize: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
          Dashboard
        </div>

        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', paddingLeft: 8, marginTop: 8, marginBottom: 3 }}>Tenders</div>

        {[
          { label: 'Search Tenders', active: true },
          { label: 'My Tenders' },
          { label: 'Active Bids' },
          { label: 'Watchlist' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: '5px 8px',
              marginLeft: 4,
              borderRadius: 5,
              background: item.active ? 'rgba(249,115,22,0.15)' : 'transparent',
              color: item.active ? '#f97316' : 'rgba(255,255,255,0.4)',
              fontSize: 10,
              fontWeight: item.active ? 600 : 400,
              borderLeft: item.active ? '2px solid #f97316' : '2px solid transparent',
            }}
          >
            {item.label}
          </div>
        ))}

        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', paddingLeft: 8, marginTop: 9, marginBottom: 3 }}>Analytics</div>
        {['Tender Analytics', 'Bid Analytics'].map((label) => (
          <div key={label} style={{ padding: '5px 8px', marginLeft: 4, borderRadius: 5, color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>
            {label}
          </div>
        ))}

        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', paddingLeft: 8, marginTop: 9, marginBottom: 3 }}>AI Workspace</div>
        {['AI Bid Draft', 'Compliance Checker'].map((label) => (
          <div key={label} style={{ padding: '5px 8px', marginLeft: 4, borderRadius: 5, color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>
            {label}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '11px 13px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8, background: '#111113' }}>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>Search Live Tenders</span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>2,433 results</span>
          </div>
          <div style={{ height: 20, borderRadius: 5, background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', paddingInline: 7, fontSize: 8, color: 'rgba(255,255,255,0.6)', gap: 4 }}>
            ↕ Newest first ▾
          </div>
        </div>

        {/* Active filter chips */}
        <div style={{ display: 'flex', gap: 5 }}>
          {['GeM', 'Healthcare', 'Closing: Next 30 Days'].map((chip) => (
            <span key={chip} style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, padding: '2px 7px' }}>
              {chip} ✕
            </span>
          ))}
        </div>

        {/* Result cards */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          {MOCK_TENDERS.map((t, i) => (
            <div
              key={t.refNo}
              style={{
                padding: '9px 11px',
                background: i % 2 === 0 ? '#18181b' : '#111113',
                borderBottom: i < MOCK_TENDERS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              {/* Title + match badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6, gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: 'rgba(255,255,255,0.92)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.title}
                  </div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 8, color: 'rgba(255,255,255,0.45)' }}>
                    <span>🏢 {t.org}</span>
                    <span>📍 {t.location}</span>
                  </div>
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    minWidth: 38,
                    borderRadius: 6,
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    padding: '4px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    boxShadow: `inset 0 -2px 0 ${MATCH_COLOR[t.matchColor]}`,
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1, color: MATCH_COLOR[t.matchColor] }}>{t.match}%</span>
                  <span style={{ fontSize: 5.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>AI Match</span>
                </div>
              </div>

              {/* Key details grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 6 }}>
                {[
                  { label: 'Ref No.', value: t.refNo, mono: true },
                  { label: 'Published', value: t.published },
                  { label: 'Opening', value: t.opening },
                  { label: 'Closing', value: t.closing, red: true },
                ].map((d) => (
                  <div key={d.label}>
                    <div style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.35)', marginBottom: 1 }}>{d.label}</div>
                    <div style={{ fontSize: 8, fontWeight: 500, color: d.red ? '#f87171' : 'rgba(255,255,255,0.8)', fontFamily: d.mono ? 'var(--font-geist-mono), monospace' : undefined, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {d.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial row */}
              <div style={{ display: 'flex', gap: 12, padding: '5px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 5, marginBottom: 6 }}>
                {[
                  { label: 'Tender Value', value: t.value },
                  { label: 'EMD', value: t.emd },
                  { label: 'Period', value: t.period },
                ].map((f) => (
                  <div key={f.label}>
                    <div style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.35)' }}>{f.label}</div>
                    <div style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Footer tags + actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {t.tags.map((tag) => (
                    <span key={tag} style={{ fontSize: 7, fontWeight: 500, color: 'rgba(96,165,250,0.9)', background: 'rgba(59,130,246,0.1)', padding: '1.5px 5px', borderRadius: 3 }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ fontSize: 7, fontWeight: 500, color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4, padding: '2px 6px' }}>♡ Save</span>
                  <span style={{ fontSize: 7, fontWeight: 600, color: '#000', background: '#fff', borderRadius: 4, padding: '2px 6px' }}>↗ View</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Trusted By — flagship cream bar, end-to-end, overlaps bottom quarter of laptop */
function TrustedBy() {
  return (
    <div
      className="relative z-20 -mt-32 w-full px-4 pt-16 -pb-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: '#fefcf3' }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale lg:gap-10">
          {[
            { src: '/isop.png', alt: 'ISO Certified', w: 90 },
            { src: '/Make_In_India.png', alt: 'Make In India', w: 130 },
            { src: '/msme2.svg', alt: 'MSME', w: 110 },
            { src: '/ce-mark.png', alt: 'CE Mark', w: 90 },
            { src: '/NSIC.PNG', alt: 'NSIC', w: 140 },

          ].map((logo) => (
            <Image
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={48}
              className="h-10 w-auto object-contain transition-all duration-300 hover:grayscale-0 hover:opacity-100 sm:h-12"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
