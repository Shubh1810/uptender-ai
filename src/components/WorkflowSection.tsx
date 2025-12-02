'use client';

import React, { useRef, useState, useLayoutEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  CheckCircle, 
  Bell, 
  Target, 
  Save, 
  Trophy, 
  TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Step data
const steps = [
  {
    key: 'save',
    label: 'Save',
    title: 'Save time with auto-filled tender details',
    description:
      'We securely save your preferences, documents and past bids so forms are auto‑filled the next time you apply.',
    cta: { href: '/onboarding', text: 'Start saving' },
    icon: Save,
  },
  {
    key: 'notify',
    label: 'Get notified',
    title: 'Get notified the moment a tender matches',
    description:
      'Real‑time alerts across email and WhatsApp with AI‑selected relevance so you only see what matters.',
    cta: { href: '/make-payment?plan=professional&amount=12353', text: 'Enable alerts' },
    icon: Bell,
  },
  {
    key: 'win',
    label: 'Win tenders',
    title: 'Win tenders with confidence',
    description:
      'Guided checklists, compliance reminders and AI suggestions help you submit stronger, on‑time bids.',
    cta: { href: '/dashboard', text: 'Explore tenders' },
    icon: Trophy,
  },
] as const;

// Static wavy lines background - warm tones
const WavyLines = () => (
  <div className="absolute inset-0 pointer-events-none opacity-40">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
      <path d="M0,120 C150,240 300,0 450,120 S750,240 900,120 1050,0 1200,120" stroke="#d4a574" strokeWidth="1.5" fill="none" />
      <path d="M0,220 C150,340 300,100 450,220 S750,340 900,220 1050,100 1200,220" stroke="#c9956c" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M0,320 C150,440 300,200 450,320 S750,440 900,320 1050,200 1200,320" stroke="#be8664" strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  </div>
);

// Inner content for each step (this is what animates)
function StepContent({ stepKey, direction }: { stepKey: 'save' | 'notify' | 'win'; direction: 'down' | 'up' }) {
  if (stepKey === 'save') {
    return (
      <motion.div 
        key="save-content"
        initial={{ opacity: 0, y: direction === 'up' ? -30 : 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: direction === 'up' ? 30 : -30 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="relative space-y-3 w-full"
      >
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">Profile information</span>
            <span className="text-xs text-gray-500">Name, phone, GSTIN, company details</span>
          </div>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">Saved documents</span>
            <span className="text-xs text-gray-500">PAN, MSME, past bids, templates</span>
          </div>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">Preferred categories</span>
            <span className="text-xs text-gray-500">Sectors, locations, budget range</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (stepKey === 'notify') {
    return (
      <motion.div 
        key="notify-content"
        initial={{ opacity: 0, y: direction === 'up' ? -30 : 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: direction === 'up' ? 30 : -30 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="relative grid gap-3 w-full"
      >
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.273L12 10.91l10.091-7.09h.273c.904 0 1.636.732 1.636 1.636z"/>
              </svg>
            </div>
            <span>Email alert</span>
          </div>
          <span className="text-green-600 text-sm font-medium">Enabled</span>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
              </svg>
            </div>
            <span>WhatsApp alert</span>
          </div>
          <span className="text-green-600 text-sm font-medium">Enabled</span>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span>AI relevance</span>
          </div>
          <span className="text-green-600 text-sm font-medium">High</span>
        </div>
      </motion.div>
    );
  }

  // win
  return (
    <motion.div 
      key="win-content"
      initial={{ opacity: 0, y: direction === 'up' ? -30 : 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: direction === 'up' ? 30 : -30 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="relative space-y-3 w-full"
    >
      <div className="bg-white rounded-xl px-4 py-3 shadow-sm border flex items-center">
        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
        Compliance checklist
      </div>
      <div className="bg-white rounded-xl px-4 py-3 shadow-sm border flex items-center">
        <Target className="h-5 w-5 text-purple-600 mr-3" />
        Competitive insights
      </div>
      <div className="bg-white rounded-xl px-4 py-3 shadow-sm border flex items-center">
        <TrendingUp className="h-5 w-5 text-rose-600 mr-3" />
        Likelihood to win
      </div>
    </motion.div>
  );
}

export function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<'down' | 'up'>('down');

  useLayoutEffect(() => {
    // Skip on server
    if (typeof window === 'undefined') return;
    
    const section = sectionRef.current;
    const trigger = triggerRef.current;
    if (!section || !trigger) return;

    // Create GSAP context for cleanup
    const ctx = gsap.context(() => {
      // Create the ScrollTrigger with pinning
      ScrollTrigger.create({
        trigger: trigger,
        start: 'top top',
        end: '+=2400', // Total scroll distance (800px per step × 3 steps)
        pin: true,
        pinSpacing: true,
        scrub: 0.8, // Smooth scrubbing (0.8 seconds to catch up)
        anticipatePin: 1,
        onUpdate: (self) => {
          // Update progress (0 to 1)
          const prog = self.progress;
          setProgress(prog * 100);
          
          // Calculate active step (0, 1, or 2)
          const step = Math.min(Math.floor(prog * steps.length), steps.length - 1);
          setActiveIndex(step);
          
          // Track direction
          setDirection(self.direction === 1 ? 'down' : 'up');
        },
      });
    }, section);

    // Cleanup
    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="workflow" 
      className="relative z-10"
      style={{ backgroundColor: '#fefcf3' }}
    >
      {/* This div gets pinned */}
      <div 
        ref={triggerRef}
        className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 flex items-center"
      >
        <div className="max-w-5xl mx-auto w-full">
          {/* Main content area with two columns */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Left column - Tabs + Content + Progress */}
            <div className="flex flex-col justify-between order-2 lg:order-1">
              {/* Tabs */}
              <div className="w-full max-w-xl mx-auto lg:mx-0 flex items-center gap-6 text-base md:text-lg font-medium text-gray-600 mb-6 justify-center lg:justify-start">
                {steps.map((s, idx) => (
                  <button
                    key={s.key}
                    type="button"
                    className={`transition-all duration-300 ${
                      activeIndex === idx 
                        ? 'text-gray-900 font-semibold scale-105' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Text content */}
              <div className="flex-1 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${activeIndex}`}
                    initial={{ opacity: 0, x: direction === 'up' ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 'up' ? 50 : -50 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    className="w-full max-w-xl text-center lg:text-left"
                  >
                    <h2 className="text-3xl lg:text-4xl font-semibold mb-4 text-gray-900 font-lexend">
                      {steps[activeIndex].title}
                    </h2>
                    <p className="text-lg text-gray-600 mb-6 font-lexend font-light">
                      {steps[activeIndex].description}
                    </p>
                    <Link href={steps[activeIndex].cta.href}>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6">
                        {steps[activeIndex].cta.text}
                      </Button>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress indicator */}
              <div className="flex justify-center lg:justify-start gap-3 items-center mt-6">
                {steps.map((_, idx) => {
                  const segmentStart = (idx / steps.length) * 100;
                  const segmentEnd = ((idx + 1) / steps.length) * 100;
                  const segmentProgress = Math.max(
                    0,
                    Math.min(100, ((progress - segmentStart) / (segmentEnd - segmentStart)) * 100)
                  );

                  return (
                    <div
                      key={idx}
                      className="h-1.5 rounded-full bg-gray-300 overflow-hidden relative"
                      style={{ width: 48 }}
                    >
                      <motion.div
                        className="h-full bg-blue-600 rounded-full absolute left-0 top-0"
                        style={{ width: `${segmentProgress}%` }}
                        transition={{ duration: 0.05, ease: 'linear' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column - Full height container */}
            <div className="w-full max-w-md mx-auto lg:mx-0 order-1 lg:order-2">
              {/* Static warm-toned container spanning full height */}
              <div 
                className="relative rounded-3xl p-6 border border-amber-200/50 shadow-xl h-full min-h-[450px] flex items-center overflow-hidden"
                style={{ 
                  backgroundImage: 'linear-gradient(145deg, #fdf6e9 0%, #f5e6d3 35%, #efe0d1 60%, #fefcf3 100%)'
                }}
              >
                {/* Static wavy lines background */}
                <WavyLines />
                
                {/* Animated content inside */}
                <AnimatePresence mode="wait">
                  <StepContent 
                    key={steps[activeIndex].key}
                    stepKey={steps[activeIndex].key} 
                    direction={direction} 
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Duplicate progress indicator for mobile (hidden on lg) */}
          <div className="flex justify-center gap-3 items-center mt-8 lg:hidden">
            {steps.map((_, idx) => {
              const segmentStart = (idx / steps.length) * 100;
              const segmentEnd = ((idx + 1) / steps.length) * 100;
              const segmentProgress = Math.max(
                0,
                Math.min(100, ((progress - segmentStart) / (segmentEnd - segmentStart)) * 100)
              );

              return (
                <div
                  key={idx}
                  className="h-1.5 rounded-full bg-gray-300 overflow-hidden relative"
                  style={{ width: 48 }}
                >
                  <motion.div
                    className="h-full bg-blue-600 rounded-full absolute left-0 top-0"
                    style={{ width: `${segmentProgress}%` }}
                    transition={{ duration: 0.05, ease: 'linear' }}
                  />
                </div>
              );
            })}
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

