'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  variant?: 'main' | 'simple';
  className?: string;
  showBackButton?: boolean;
  backButtonText?: string;
}

export function Header({ 
  variant = 'main', 
  className = '', 
  showBackButton = false,
  backButtonText = 'Back to Home'
}: HeaderProps) {
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  
  const baseClasses = "bg-white/40 backdrop-blur-sm";
  const topPosition = variant === 'main' && announcementVisible ? "top-[44px]" : variant === 'main' ? "top-0" : "";
  const stickyClasses = variant === 'main' ? `fixed ${topPosition} left-0 right-0 z-[90]` : "";
  const patternClasses = variant === 'main' ? "header-dots-pattern" : "";
  
  return (
    <>
      {/* Integrated Announcement Banner */}
      {variant === 'main' && (
        <AnimatePresence>
          {announcementVisible && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white py-2.5 px-4 z-[100]"
              style={{
                background: 'linear-gradient(90deg, #722F37 0%, #8B1538 50%, #722F37 100%)',
                height: '44px'
              }}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>

              <div className="relative flex items-center justify-center max-w-7xl mx-auto">
                <div className="flex items-center space-x-2 text-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    🎉
                  </motion.div>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm font-medium tracking-wide"
                  >
                    <span className="hidden sm:inline">🚀 </span>
                    <strong>GlobalTender eProcurement Data available in a few weeks!!!</strong>
                    <span className="hidden sm:inline"> Get ready for the future of tender management</span>
                    <span className="ml-2">🎊</span>
                  </motion.p>

                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 0.5
                    }}
                  >
                    ✨
                  </motion.div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setAnnouncementVisible(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  aria-label="Close announcement"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Subtle shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      <header className={`${baseClasses} ${stickyClasses} ${patternClasses} ${className} ${variant === 'main' && announcementVisible ? 'border-t-0' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/tplogo.png" 
              alt="TenderPost - AI Tender Notifier Platform for India" 
              className="h-10 w-10 rounded-xl object-contain"
              priority={variant === 'main'}
              width={40}
              height={40}
            />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              <span className="font-inter">Tender</span><span className="font-kings -ml-1">Post</span>
            </span>
            {variant === 'main' && (
              <div className="flex items-center space-x-1 ml-3 bg-white/40 backdrop-blur-sm rounded-full px-2 py-1 border border-white/30 shadow-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
                <span className="font-ubuntu text-xs font-medium text-gray-700">167,725</span>
                <span className="font-ubuntu text-[10px] text-gray-500">Live</span>
              </div>
            )}
          </Link>
          
          {variant === 'main' ? (
            <MainNavigation />
          ) : (
            <InternalPageNavigation />
          )}
        </div>
      </div>
    </header>
    </>
  );
}

function MainNavigation() {
  const triggerWaitlist = () => {
    // Force show waitlist overlay immediately
    localStorage.removeItem('waitlist-overlay-seen');
    // Dispatch a custom event to trigger the overlay
    window.dispatchEvent(new CustomEvent('show-waitlist-overlay'));
  };

  return (
    <nav className="flex items-center space-x-8">
      <div className="hidden md:flex items-center space-x-8 font-ubuntu">
        <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
          Tender Features
        </a>
        <a href="#categories" className="text-gray-600 hover:text-gray-900 transition-colors">
          Tender Categories
        </a>
        <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
          Pricing
        </a>
        <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
          FAQs
        </a>
      </div>
      
      <Link href="/signup">
        <Button className="relative bg-white hover:bg-blue-900 text-gray-900 hover:text-white border-2 border-transparent bg-clip-padding shadow-md hover:shadow-lg transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-blue-900 before:via-blue-600 before:to-sky-400 hover:before:bg-blue-900">
          Sign Up
        </Button>
      </Link>
    </nav>
  );
}

// Alternative navigation for tender-guide and other internal pages
export function InternalPageNavigation() {
  return (
    <nav className="hidden md:flex items-center space-x-8 font-ubuntu">
      <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
        Home
      </Link>
      <Link href="/#features" className="text-gray-600 hover:text-gray-900 transition-colors">
        Features
      </Link>
      <Link href="/#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
        Pricing
      </Link>
      <Link href="/signup">
        <Button className="relative bg-white hover:bg-blue-900 text-gray-900 hover:text-white border-2 border-transparent bg-clip-padding shadow-md hover:shadow-lg transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-blue-900 before:via-blue-600 before:to-sky-400 hover:before:bg-blue-900">
          Sign Up
        </Button>
      </Link>
    </nav>
  );
}

// Specialized header for tender-guide and similar content pages
export function ContentPageHeader({ className = '' }: { className?: string }) {
  return (
    <Header 
      variant="simple" 
      className={`bg-white/80 backdrop-blur-sm border-b border-gray-200 ${className}`}
    />
  );
} 