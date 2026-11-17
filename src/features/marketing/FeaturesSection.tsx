'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Bell, CircleDollarSign, Layout, LineChart, Target } from 'lucide-react';
import { GlowingEffect } from '@/features/marketing/effects/glowing-effect';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function StarsIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/stars.png"
      alt="Stars"
      width={32}
      height={32}
      className={className}
      style={{
        filter:
          'brightness(0) saturate(100%) invert(21%) sepia(98%) saturate(2476%) hue-rotate(214deg) brightness(95%) contrast(101%)',
      }}
    />
  );
}

const FEATURES: Feature[] = [
  {
    icon: Bell,
    title: 'Instant Opportunity Alerts',
    description: 'Get only the tenders you can win — instant, relevant alerts delivered to email & WhatsApp. Speed and relevance that customers want.'
  },
  {
    icon: StarsIcon,
    title: 'Auto-Bid Generator',
    description: 'A fully formed draft bid (technical + commercial) created instantly from your past documents, profile, and tender requirements. This flips "I don\'t have the team to bid" into "I can bid 5x more tenders".'
  },
  {
    icon: Target,
    title: 'AI Tender Matchmaking Engine',
    description: 'Not generic alerts. A model that understands what you can fulfill, what you have won/lost before, your pricing, and your business capabilities. Matches you to tenders you actually can win. That\'s the money feature.'
  },
  {
    icon: CircleDollarSign,
    title: 'Competitor & Pricing Intel',
    description: 'AI extracts who usually bids, at what price range, who wins, seasonality patterns, and predicts the competitiveness of a tender. This answers the hardest procurement question: "Should I even compete here?"'
  },
  {
    icon: Layout,
    title: 'Zero-Friction Tender Workspace',
    description: 'A UX layer with one-click save tender, auto extract important fields, generate checklists, track docs, and assign tasks. This reduces chaos for SMBs that have no procurement team.'
  },
  {
    icon: LineChart,
    title: 'Bid Intelligence Graph™',
    description: 'A continuously-learning graph of all tenders, bidders, and outcomes.'
  }
];

/** Starting offset per grid column: cards in columns 2 and 3 start lower and catch up. */
const COLUMN_OFFSET_Y = [0, 80, 160];

function FeatureCard({ feature, index, progress }: { feature: Feature; index: number; progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], [COLUMN_OFFSET_Y[index % 3], 0]);

  return (
    <motion.div
      className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg group"
      style={{
        y,
        boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.2), 0 4px 6px -2px rgba(30, 58, 138, 0.15)',
      }}
    >
      <GlowingEffect spread={40} glow disabled={false} proximity={64} inactiveZone={0.01} />
      <div className="flex items-center mb-6">
        <feature.icon className="h-8 w-8 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900 ml-4">{feature.title}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

/**
 * "Advanced AI-Powered Tender Management Features" grid. Cards slide into line
 * as the grid scrolls from the bottom of the viewport to its middle.
 */
export function FeaturesSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start end', 'start center'] });

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 relative z-10"
      style={{ backgroundImage: 'linear-gradient(to bottom, #fefcf3 0%, #fefcf3 60%, #ffffff 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'var(--font-funnel), sans-serif' }}>
            Advanced AI-Powered Tender Management Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to dominate the government tender landscape with intelligent automation, real-time notifications, and next-generation AI-driven insights.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
