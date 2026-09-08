'use client';

/**
 * WORKFLOW SECTION v3 — TenderPost
 *
 * Three steps only. Discovery/alerts is already sold in the hero
 * (search bar + live tender count), so this section skips it entirely
 * and focuses only on the part of the pipeline competitors don't touch:
 *
 *   1. Vault    — one-time credential + document capture   (~15% cumulative)
 *   2. Qualify  — hard eligibility verdict from the NIT     (~45% cumulative)
 *   3. Bid pack — auto-filled annexures & compliance set    (~90% cumulative)
 *
 * The coverage meter is the moat argument made visible: discovery tools
 * stop before this section even starts.
 */

import React, { useRef, useState, useLayoutEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertTriangle,
  Clock,
  FileSignature,
  PenLine,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────
   Step data
   ───────────────────────────────────────────── */

const steps = [
  {
    key: 'vault',
    label: 'Vault',
    title: 'Your company file, entered once',
    description:
      'Udyam, GST, ITRs, audited balance sheets, work orders, licences and DSC details live in one place. We read the numbers out of them — turnover by financial year, similar-work values, validity dates — so no bid ever starts from an empty folder.',
    replaces: 'Replaces 3–4 hours per bid spent re-collecting the same paperwork',
    coverage: 15,
    cta: { href: '/onboarding', text: 'Build your vault' },
  },
  {
    key: 'qualify',
    label: 'Qualify',
    title: 'Bid or skip, answered before you open the PDF',
    description:
      'We read the NIT against your real credentials and return a verdict, not a similarity score. Turnover short by ₹1.8 Cr? You find out in seconds, not on day four of drafting.',
    replaces: 'Replaces reading a 200-page NIT to find six eligibility numbers',
    coverage: 45,
    cta: { href: '/dashboard', text: 'Check a live tender' },
  },
  {
    key: 'pack',
    label: 'Bid pack',
    title: 'The submission, assembled',
    description:
      'Every undertaking, affidavit and annexure filled in that tender’s own format, on your letterhead, ready to sign. Expired certificates get flagged before upload — not after rejection.',
    replaces: 'Replaces two days of retyping declarations a consultant charges ₹1,500 for',
    coverage: 90,
    cta: { href: '/onboarding', text: 'Generate a bid pack' },
  },
] as const;

type StepKey = (typeof steps)[number]['key'];

/* ─────────────────────────────────────────────
   Shared primitives
   ───────────────────────────────────────────── */

const WavyLines = () => (
  <div className="absolute inset-0 pointer-events-none opacity-40">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
      <path d="M0,120 C150,240 300,0 450,120 S750,240 900,120 1050,0 1200,120" stroke="#d4a574" strokeWidth="1.5" fill="none" />
      <path d="M0,220 C150,340 300,100 450,220 S750,340 900,220 1050,100 1200,220" stroke="#c9956c" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M0,320 C150,440 300,200 450,320 S750,440 900,320 1050,200 1200,320" stroke="#be8664" strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  </div>
);

const slotMachineVariants = {
  enter: (direction: 'down' | 'up') => ({
    opacity: 0,
    y: direction === 'down' ? 100 : -100,
    rotateX: direction === 'down' ? -20 : 20,
    scale: 0.9,
  }),
  center: { opacity: 1, y: 0, rotateX: 0, scale: 1 },
  exit: (direction: 'down' | 'up') => ({
    opacity: 0,
    y: direction === 'down' ? -100 : 100,
    rotateX: direction === 'down' ? 20 : -20,
    scale: 0.9,
  }),
};

const slotMachineTransition = {
  duration: 0.12,
  ease: [0.22, 1, 0.36, 1] as const,
};

const cardBase = 'bg-white/95 backdrop-blur-md rounded-2xl shadow-sm';

/** Counts up to `to` when `run` flips true. */
function useCountUp(to: number, run: boolean, duration = 900) {
  const [n, setN] = useState(0);
  React.useEffect(() => {
    if (!run) return;
    const total = Math.max(1, Math.floor(duration / 16));
    let i = 0;
    const t = setInterval(() => {
      i++;
      setN(Math.round((to * i) / total));
      if (i >= total) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [run, to, duration]);
  return n;
}

/* ─────────────────────────────────────────────
   1. VAULT
   ───────────────────────────────────────────── */

const vaultDocs = [
  { name: 'Udyam registration', meta: 'Micro · valid to 12 Mar 2028', state: 'ok' },
  { name: 'Audited balance sheets', meta: 'FY22 · FY23 · FY24 — avg ₹4.1 Cr', state: 'ok' },
  { name: 'Completion certificates', meta: '11 works · highest ₹1.9 Cr', state: 'ok' },
  { name: 'EPF / ESI challans', meta: 'Last filed Jun 2026 — 3 months stale', state: 'warn' },
] as const;

function VaultContent({ direction }: { direction: 'down' | 'up' }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={slotMachineVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slotMachineTransition}
      style={{ transformPerspective: 1200 }}
      className="relative w-full space-y-3"
    >
      <div className={`${cardBase} overflow-hidden`}>
        {vaultDocs.map((d, i) => (
          <React.Fragment key={d.name}>
            {i > 0 && <div className="h-px bg-gray-100 mx-4" />}
            <motion.div
              className="flex items-center gap-3 px-4 py-3"
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.14, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {d.state === 'ok' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{d.name}</div>
                <div className={`text-xs truncate ${d.state === 'warn' ? 'text-amber-600' : 'text-gray-400'}`}>
                  {d.meta}
                </div>
              </div>
            </motion.div>
          </React.Fragment>
        ))}
      </div>

      <motion.div
        className={`${cardBase} px-4 py-3 flex items-center gap-3`}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.75, duration: 0.4 }}
      >
        <ShieldCheck className="h-4 w-4 text-orange-500 flex-shrink-0" />
        <p className="text-sm text-gray-700">
          Entered once. Reused across every bid after this one.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   2. QUALIFY — hard eligibility verdict
   ───────────────────────────────────────────── */

const criteria = [
  { label: 'Avg annual turnover, 3 FYs', need: '≥ ₹3.00 Cr', you: '₹4.10 Cr', pass: true },
  { label: 'Similar work, single order', need: '≥ ₹1.60 Cr', you: '₹1.90 Cr', pass: true },
  { label: 'Contractor class (PWD)', need: 'Class B', you: 'Class B', pass: true },
  { label: 'OEM authorisation (MAF)', need: 'Required', you: 'Not on file', pass: false },
] as const;

function QualifyContent({ direction }: { direction: 'down' | 'up' }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [verdictIn, setVerdictIn] = useState(false);

  React.useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setVerdictIn(true), 300 + criteria.length * 160);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={slotMachineVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slotMachineTransition}
      style={{ transformPerspective: 1200 }}
      className="relative w-full space-y-3"
    >
      <motion.div
        className={`${cardBase} overflow-hidden`}
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="px-4 pt-3.5 pb-2">
          <div className="text-sm font-semibold text-gray-900 truncate">
            Water supply pipeline, Pkg-3
          </div>
          <div className="text-xs text-gray-400">MJP Nashik · ₹2.4 Cr · NIT read in 11 seconds</div>
        </div>

        <div className="h-px bg-gray-100 mx-4" />

        <div className="px-4 py-2.5 space-y-2">
          {criteria.map((c, i) => (
            <motion.div
              key={c.label}
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: -6 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.16, duration: 0.3 }}
            >
              {c.pass ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-600 flex-1 truncate">{c.label}</span>
              <span className="text-xs text-gray-400 tabular-nums flex-shrink-0">{c.need}</span>
              <span
                className={`text-xs font-semibold tabular-nums flex-shrink-0 w-[86px] text-right ${
                  c.pass ? 'text-gray-900' : 'text-red-500'
                }`}
              >
                {c.you}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Verdict */}
      <motion.div
        className={`${cardBase} px-4 py-3.5`}
        initial={{ opacity: 0, y: 12 }}
        animate={verdictIn ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-wide text-amber-700 bg-amber-100 rounded-full px-2.5 py-1 flex-shrink-0">
            Conditional
          </span>
          <p className="text-sm text-gray-800 leading-snug">
            Eligible on all counts except the MAF. Get it from your OEM and this is a real bid.
          </p>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          Flagged on day one, not day four
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   3. BID PACK — generated compliance set
   ───────────────────────────────────────────── */

const packItems = [
  'Annexure I — Bidder declaration',
  'Annexure IV — No-blacklisting affidavit',
  'Bid security declaration (MSE exempt)',
  'Turnover certificate, CA format',
  'Priced BOQ, portal template',
] as const;

function PackContent({ direction }: { direction: 'down' | 'up' }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [done, setDone] = useState<number>(0);
  const [footerIn, setFooterIn] = useState(false);
  const filled = useCountUp(19, inView, 1100);

  React.useEffect(() => {
    if (!inView) return;
    const timers = packItems.map((_, i) =>
      setTimeout(() => setDone((d) => Math.max(d, i + 1)), 350 + i * 190)
    );
    const t = setTimeout(() => setFooterIn(true), 350 + packItems.length * 190 + 150);
    return () => { timers.forEach(clearTimeout); clearTimeout(t); };
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={slotMachineVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={slotMachineTransition}
      style={{ transformPerspective: 1200 }}
      className="relative w-full space-y-3"
    >
      <motion.div
        className={`${cardBase} overflow-hidden`}
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-baseline justify-between px-4 pt-3.5 pb-2.5">
          <div>
            <span className="text-2xl font-bold text-gray-900 tabular-nums leading-none">
              {filled}
            </span>
            <span className="text-sm text-gray-400"> of 22 documents filled</span>
          </div>
          <span className="text-[11px] text-gray-400">3 need your signature</span>
        </div>

        <div className="h-1 bg-gray-100 mx-4 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={inView ? { width: '86%' } : {}}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="px-4 py-3 space-y-2">
          {packItems.map((label, i) => (
            <motion.div
              key={label}
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, x: -6 }}
              animate={done > i ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.28 }}
            >
              <FileSignature className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
              <span className="text-xs text-gray-700 flex-1 truncate">{label}</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className={`${cardBase} px-4 py-3 flex items-center gap-3`}
        initial={{ opacity: 0, y: 10 }}
        animate={footerIn ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
      >
        <PenLine className="h-4 w-4 text-orange-500 flex-shrink-0" />
        <p className="text-sm text-gray-800 leading-snug">
          On your letterhead, in this tender’s format. Sign with your DSC and upload.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Router
   ───────────────────────────────────────────── */

function StepContent({ stepKey, direction }: { stepKey: StepKey; direction: 'down' | 'up' }) {
  if (stepKey === 'vault') return <VaultContent direction={direction} />;
  if (stepKey === 'qualify') return <QualifyContent direction={direction} />;
  return <PackContent direction={direction} />;
}


/* ─────────────────────────────────────────────
   Section
   ───────────────────────────────────────────── */

export function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<'down' | 'up'>('down');

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const section = sectionRef.current;
    const trigger = triggerRef.current;
    const imageContainer = imageContainerRef.current;
    if (!section || !trigger || !imageContainer) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger,
        start: 'top top',
        end: '+=2400', // 800px per step × 3 steps
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const prog = self.progress;
          setProgress(prog * 100);
          setActiveIndex(Math.min(Math.floor(prog * steps.length), steps.length - 1));
          setDirection(self.direction === 1 ? 'down' : 'up');
          imageContainer.style.backgroundPositionY = `${prog * 100}%`;
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const active = steps[activeIndex];

  return (
    <section ref={sectionRef} id="workflow" className="relative z-10" style={{ backgroundColor: '#fefcf3' }}>
      <div ref={triggerRef} className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-5xl mx-auto w-full">

          {/* Tabs — mobile */}
          <div className="flex items-center justify-center gap-4 text-sm font-medium mb-6 lg:hidden">
            {steps.map((s, idx) => (
              <span
                key={s.key}
                className={`transition-all duration-300 ${
                  activeIndex === idx ? 'text-gray-900 font-bold' : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-stretch">

            {/* Left column */}
            <div className="flex flex-col justify-between order-3 lg:order-1">

              {/* Tabs — desktop */}
              <div className="hidden lg:flex w-full max-w-xl mx-auto lg:mx-0 items-center gap-6 text-base font-medium mb-6">
                {steps.map((s, idx) => (
                  <span
                    key={s.key}
                    className={`transition-all duration-300 ${
                      activeIndex === idx ? 'text-gray-900 font-bold' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                ))}
              </div>

              {/* Copy */}
              <div className="flex-1 flex items-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`copy-${activeIndex}`}
                    initial={{ opacity: 0, y: direction === 'down' ? 80 : -80, rotateX: direction === 'down' ? -15 : 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    exit={{ opacity: 0, y: direction === 'down' ? -80 : 80, rotateX: direction === 'down' ? 15 : -15, scale: 0.95 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformPerspective: 1000 }}
                    className="w-full max-w-xl mx-auto text-center lg:text-left"
                  >
                    <h2 className="text-2xl lg:text-[2.4rem] leading-[1.15] font-semibold mb-3 lg:mb-4 text-gray-900 font-lexend">
                      {active.title}
                    </h2>
                    <p className="text-base lg:text-lg text-gray-600 mb-3 font-lexend font-light">
                      {active.description}
                    </p>
                    <p className="text-sm text-gray-500 mb-5 lg:mb-6">
                      {active.replaces}
                    </p>
                    <Link href={active.cta.href}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-full text-base lg:text-lg">
                        {active.cta.text}
                      </Button>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Coverage meter + segment progress */}
              <div className="mt-7 space-y-4">

                <div className="hidden lg:flex gap-2 items-center">
                  {steps.map((_, idx) => {
                    const segStart = (idx / steps.length) * 100;
                    const segEnd = ((idx + 1) / steps.length) * 100;
                    const segProgress = Math.max(0, Math.min(100, ((progress - segStart) / (segEnd - segStart)) * 100));
                    return (
                      <div key={idx} className="h-1 rounded-full bg-gray-200 overflow-hidden relative" style={{ width: 58 }}>
                        <div
                          className="h-full rounded-full absolute left-0 top-0 bg-gray-600"
                          style={{ width: `${segProgress}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="w-full max-w-md mx-auto lg:ml-auto lg:mr-0 order-2 lg:order-2">
              <div
                ref={imageContainerRef}
                className="relative rounded-3xl p-6 shadow-xl h-full min-h-[380px] sm:min-h-[470px] flex items-center overflow-hidden"
                style={{
                  backgroundImage: 'url(/workflow.jpeg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      'linear-gradient(to bottom, rgba(232, 217, 200, 0.3) 0%, rgba(240, 225, 208, 0.2) 50%, rgba(248, 240, 229, 0.3) 100%)',
                  }}
                />
                <WavyLines />
                <AnimatePresence mode="wait">
                  <StepContent key={active.key} stepKey={active.key} direction={direction} />
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 5 && progress < 95 ? 0.6 : 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400"
          >
            <span className="text-xs font-medium tracking-wide">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}