'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface AnnouncementBannerProps {
  className?: string;
}

export function AnnouncementBanner({ className = '' }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className={`relative bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white py-2 px-4 shadow-lg z-50 ${className}`}
        style={{
          background: 'linear-gradient(90deg, #722F37 0%, #8B1538 50%, #722F37 100%)'
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
              <strong>TenderPost Procurement Data available in Few Weeks!!!</strong>
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
            onClick={() => setIsVisible(false)}
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
    </AnimatePresence>
  );
} 