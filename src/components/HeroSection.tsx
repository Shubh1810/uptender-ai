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
import Image from 'next/image';
import { motion } from 'framer-motion';
import { WavyBackground } from '@/components/ui/wavy-background';
import { getLiveTendersCount, type TenderStats } from '@/lib/tender-stats';

export function HeroSection() {
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
        colors={['#0ea5e9', '#22c55e', '#14b8a6', '#1d4ed8']}
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

      {/* Text content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">

        {/* Headline — smaller */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl"
          style={{ fontFamily: '"Funnel Display", sans-serif' }}
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
          style={{ fontFamily: 'var(--font-ubuntu)' }}
        >
          Instant tender alerts, intelligent filtering, and AI-powered bid support.
          Replaces manual tracking, risky bids, and expensive procurement consultants.
        </motion.p>

        {/* Search + CTA on the same row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26 }}
          className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
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
              onFocus={() => { window.location.href = '/onboarding'; }}
            />
          </div>

          {/* Get started button */}
          <Link
            href="/onboarding"
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
          >
            Get started for free
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </motion.div>

        {/* Live tenders pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="mt-3 flex justify-center"
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
   ───────────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div
      className="h-full w-full flex overflow-hidden"
      style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif', background: '#f0f5f6' }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 176,
          flexShrink: 0,
          background: '#0a0a0a',
          padding: '14px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* Logo — brand logo + brand fonts (Inter/Geist + Kings) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, paddingLeft: 4 }}>
          <Image
            src="/tpllogo-wite.PNG"
            alt="TenderPost"
            width={20}
            height={20}
            className="rounded-lg shrink-0 object-contain"
          />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: '-0.02em' }} className="inline-flex items-baseline">
            <span className="font-inter">Tender</span><span className="font-kings -ml-0.5">Post</span>
          </span>
        </div>

        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', paddingLeft: 8, marginBottom: 4 }}>Main</div>

        {[
          { label: 'Dashboard', active: true },
          { label: 'My Tenders' },
          { label: 'Saved Tenders' },
          { label: 'Bid Drafts' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: '6px 8px',
              borderRadius: 5,
              background: item.active ? 'rgba(249,115,22,0.15)' : 'transparent',
              color: item.active ? '#f97316' : 'rgba(255,255,255,0.45)',
              fontSize: 11,
              fontWeight: item.active ? 600 : 400,
            }}
          >
            {item.label}
          </div>
        ))}

        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', paddingLeft: 8, marginTop: 10, marginBottom: 4 }}>Intelligence</div>

        {['Alerts', 'Analytics', 'Billing'].map((label) => (
          <div key={label} style={{ padding: '6px 8px', borderRadius: 5, color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
            {label}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '12px 14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>Overview</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ height: 24, width: 130, borderRadius: 5, background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', paddingLeft: 7, gap: 4 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span style={{ fontSize: 8, color: '#9ca3af' }}>Search tenders...</span>
            </div>
            <div style={{ height: 24, borderRadius: 5, background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', paddingInline: 7, fontSize: 8, color: '#6b7280', gap: 3 }}>
              📅 November 2024
            </div>
            <div style={{ height: 24, borderRadius: 5, background: '#f97316', display: 'flex', alignItems: 'center', paddingInline: 9, fontSize: 8, color: '#fff', fontWeight: 600, gap: 2 }}>
              + Add Tender
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
          {[
            { label: 'Live Tenders', value: '2,433', delta: '+13%' },
            { label: 'Bids Drafted', value: '48', delta: '+8%' },
            { label: 'Win Rate', value: '34%', delta: '+2.1%' },
            { label: 'Saved', value: '127', delta: '+4.2%' },
          ].map((s) => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 7, padding: '7px 9px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 8, color: '#6b7280', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111', lineHeight: 1.2 }}>{s.value}</div>
              <div style={{ fontSize: 8, color: '#16a34a', marginTop: 2 }}>↑ {s.delta} vs last month</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 7 }}>
          {/* Line chart */}
          <div style={{ background: '#fff', borderRadius: 7, padding: '9px 11px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#111' }}>Tender Activity</span>
              <span style={{ fontSize: 8, color: '#6b7280', background: '#f3f4f6', padding: '1px 5px', borderRadius: 3 }}>Monthly ▾</span>
            </div>
            <div style={{ fontSize: 8, color: '#6b7280', marginBottom: 3 }}>
              Total: <strong style={{ color: '#111' }}>343,245</strong> <span style={{ color: '#16a34a' }}>↑ 13%</span>
              &nbsp;&nbsp;On Delivery: <strong style={{ color: '#111' }}>2,162</strong> <span style={{ color: '#16a34a' }}>↑ 4.25%</span>
            </div>
            <svg width="100%" height="72" viewBox="0 0 260 72" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tg3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.22"/>
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[18,36,54].map(y=><line key={y} x1={0} y1={y} x2={260} y2={y} stroke="#f3f4f6" strokeWidth="1"/>)}
              <path d="M0,58 Q32,44 65,48 T130,28 T195,15 T260,22" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M0,58 Q32,44 65,48 T130,28 T195,15 T260,22 L260,72 L0,72Z" fill="url(#tg3)"/>
              <path d="M0,64 Q32,60 65,57 T130,53 T195,50 T260,48" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
              <circle cx="130" cy="28" r="3" fill="#f97316"/>
              {['Nov 1','2','3','4','5','6','7'].map((l,i)=>(
                <text key={l} x={i*42} y={71} fontSize="6" fill="#9ca3af">{l}</text>
              ))}
            </svg>
          </div>

          {/* Bar chart */}
          <div style={{ background: '#fff', borderRadius: 7, padding: '9px 11px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#111' }}>Win Rate</span>
              <span style={{ fontSize: 8, color: '#6b7280' }}>Export ↗</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              {[['#f97316','Income'],['#e2e8f0','Target']].map(([c,l])=>(
                <span key={l} style={{ fontSize: 7, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <span style={{ width: 5, height: 5, background: c, borderRadius: 1, display: 'inline-block' }}/>
                  {l}
                </span>
              ))}
            </div>
            <svg width="100%" height="72" viewBox="0 0 170 72">
              {[18,36,54].map(y=><line key={y} x1={0} y1={y} x2={170} y2={y} stroke="#f3f4f6" strokeWidth="1"/>)}
              {[
                {x:2,h1:46,h2:58},{x:26,h1:38,h2:50},{x:50,h1:54,h2:62},
                {x:74,h1:34,h2:46},{x:98,h1:50,h2:58},{x:122,h1:40,h2:54},{x:146,h1:44,h2:56},
              ].map((b,i)=>(
                <g key={b.x}>
                  <rect x={b.x} y={72-b.h2} width={8} height={b.h2} rx={2} fill="#e2e8f0"/>
                  <rect x={b.x+9} y={72-b.h1} width={8} height={b.h1} rx={2} fill="#f97316"/>
                  <text x={b.x+6} y={71} fontSize="6" fill="#9ca3af" textAnchor="middle">{i+1}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Recent tenders table */}
        <div style={{ background: '#fff', borderRadius: 7, padding: '7px 11px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#f97316', borderBottom: '1.5px solid #f97316', paddingBottom: 2 }}>Recent Tenders</span>
              <span style={{ fontSize: 9, color: '#9ca3af' }}>Saved</span>
              <span style={{ fontSize: 9, color: '#9ca3af' }}>Closing Soon</span>
            </div>
            <span style={{ fontSize: 8, color: '#9ca3af', background: '#f3f4f6', padding: '1px 5px', borderRadius: 3 }}>Monthly ▾</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { org: 'AIIMS New Delhi', title: 'Medical Equipment Supply & Installation', match: '94%', closing: 'Dec 15', status: 'Active' },
              { org: 'NHAI', title: 'Road Construction — National Highway NH-48', match: '87%', closing: 'Dec 20', status: 'Active' },
              { org: 'MeitY', title: 'IT Infrastructure & Cloud Migration', match: '81%', closing: 'Jan 3', status: 'New' },
            ].map((t) => (
              <div key={t.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 6px', borderRadius: 5, background: '#f9fafb' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 8, fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                  <div style={{ fontSize: 7, color: '#9ca3af' }}>{t.org}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                  <span style={{ fontSize: 7, color: '#16a34a', fontWeight: 600, background: '#dcfce7', padding: '1px 4px', borderRadius: 99 }}>{t.match} match</span>
                  <span style={{ fontSize: 7, color: '#6b7280' }}>Closes {t.closing}</span>
                  <span style={{ fontSize: 7, color: t.status === 'New' ? '#7c3aed' : '#2563eb', background: t.status === 'New' ? '#ede9fe' : '#dbeafe', padding: '1px 4px', borderRadius: 99 }}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
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