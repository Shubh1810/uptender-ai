'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles, Bell, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWaitlistOverlay } from '@/hooks/useWaitlistOverlay';

interface WaitlistOverlayProps {
  onClose?: () => void;
}

export function WaitlistOverlay({ onClose }: WaitlistOverlayProps) {
  const { shouldShow, markAsSeen } = useWaitlistOverlay();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (shouldShow) {
      // Show overlay after 6-7 seconds (random between 6000-7000ms)
      const delay = Math.random() * 1000 + 6000;
      
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [shouldShow]);

  const handleClose = () => {
    setIsVisible(false);
    markAsSeen();
    onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'waitlist-overlay'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        markAsSeen();
        
        // Track conversion event (if analytics is available)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'conversion', {
            event_category: 'waitlist',
            event_label: 'overlay_signup',
            value: 1
          });
        }
        
        // Auto-close after success
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          {/* Backdrop blur effect */}
          <div className="absolute inset-0 backdrop-blur-sm" onClick={handleClose} />
          
          {/* Overlay Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Glassmorphism Card */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50" />
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors shadow-lg"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>

              {/* Content */}
              <div className="relative p-8">
                {!isSuccess ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg"
                      >
                        <Sparkles className="h-8 w-8 text-white" />
                      </motion.div>
                      
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-gray-900 mb-2"
                      >
                        Don't Miss Out! 🚀
                      </motion.h2>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600 leading-relaxed"
                      >
                        Join <span className="font-semibold text-blue-600">5,000+</span> businesses already on our waitlist. 
                        Be the first to access AI-powered tender notifications when we launch!
                      </motion.p>
                    </div>

                    {/* Benefits */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3 mb-6"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm text-gray-700">Early access to premium features</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm text-gray-700">Exclusive launch discounts</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-sm text-gray-700">Priority customer support</span>
                      </div>
                    </motion.div>

                    {/* Email Form */}
                    <motion.form
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                        />
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-3 bg-red-50 border border-red-200 rounded-xl"
                        >
                          <p className="text-red-600 text-sm">{error}</p>
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Joining Waitlist...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Bell className="h-5 w-5" />
                            <span>Join Waitlist - It's Free!</span>
                          </div>
                        )}
                      </Button>
                    </motion.form>

                    {/* Trust Indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-6 text-center"
                    >
                      <p className="text-xs text-gray-500">
                        🔒 We respect your privacy. Unsubscribe anytime.
                      </p>
                    </motion.div>
                  </>
                ) : (
                  /* Success State */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4"
                    >
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Welcome to the Waitlist! 🎉
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      Thank you for joining! We've sent a confirmation email to <strong>{email}</strong>
                    </p>
                    
                    <div className="bg-blue-50 rounded-xl p-4 mb-4">
                      <p className="text-blue-800 text-sm">
                        💡 <strong>What's next?</strong> You'll be among the first to know when TenderPost launches with exclusive early access!
                      </p>
                    </div>
                    
                    <Button
                      onClick={handleClose}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl"
                    >
                      Continue Exploring
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 