'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Bell, CheckCircle, Loader2, Lock } from 'lucide-react';
import Image from 'next/image';
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

  // Listen for dev trigger event
  useEffect(() => {
    const handleDevTrigger = () => {
      setIsVisible(true);
    };

    window.addEventListener('show-waitlist-overlay', handleDevTrigger);
    return () => window.removeEventListener('show-waitlist-overlay', handleDevTrigger);
  }, []);

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
          
          {/* Light Blue Blur Spots */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-sky-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Overlay Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Clean Professional Card - Sharp Edges, Wider */}
            <div className="relative bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row">
              {/* Left Half - Waitlist Image with Logo */}
              <div className="hidden md:block w-1/2 relative min-h-[400px]">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('/waitlist.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                {/* Overlay for better logo visibility */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Logo and Branding - Top Center */}
              </div>

              {/* Right Half - Current Waitlist Content */}
              <div className="w-full md:w-1/2 relative p-5 md:p-6">
                {!isSuccess ? (
                  <>
                    {/* Header with TenderPost Logo and Brand Name */}
                    <div className="text-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="flex items-center justify-center space-x-1 mb-3"
                      >
                        <Image
                          src="/tplogo.png" 
                          alt="TenderPost Logo" 
                          className="h-6 w-6 object-contain"
                          width={24}
                          height={24}
                        />
                        <span className="text-gray-900 font-semibold text-sm leading-tight">
                          <span className="font-inter">Tender</span><span className="font-kings -ml-0.5">Post</span>
                        </span>
                      </motion.div>
                      
                      <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl font-bold text-gray-900 mb-2"
                      >
                        Don't Miss Out! 🚀
                      </motion.h2>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm text-gray-600 leading-relaxed"
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
                      className="space-y-1.5 mb-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        <span className="text-sm text-gray-700">Early access to premium features</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        <span className="text-sm text-gray-700">Exclusive launch discounts</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        <span className="text-sm text-gray-700">Priority customer support</span>
                      </div>
                    </motion.div>

                    {/* Email Form */}
                    <motion.form
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      onSubmit={handleSubmit}
                      className="space-y-3"
                    >
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500 shadow-sm text-sm"
                        />
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-2 bg-red-50 border border-red-200"
                        >
                          <p className="text-red-600 text-xs">{error}</p>
                        </motion.div>
                      )}

                      {/* Header-style Gradient Button */}
                      <div className="relative p-[2px] bg-gradient-to-r from-blue-900 via-blue-600 to-sky-400 hover:from-blue-800 hover:via-blue-500 hover:to-sky-300 transition-all duration-300 shadow-md hover:shadow-lg">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-white hover:bg-blue-900 text-gray-900 hover:text-white py-3 px-4 font-semibold transition-all duration-300 disabled:opacity-50 text-sm"
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Joining Waitlist...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <Bell className="h-4 w-4" />
                              <span>Join Waitlist - It's Free!</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </motion.form>

                    {/* Trust Indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="mt-4 text-center"
                    >
                      <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <Lock className="h-3 w-3 text-gray-500" />
                        We respect your privacy. Unsubscribe anytime.
                      </p>
                    </motion.div>
                  </>
                ) : (
                  /* Success State */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-2"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="inline-flex items-center justify-center w-12 h-12 bg-green-100 mb-3"
                    >
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Welcome to the Waitlist! 🎉
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      Thank you for joining! We've sent a confirmation email to <strong>{email}</strong>
                    </p>
                    
                    <div className="bg-blue-50 p-3 mb-3">
                      <p className="text-blue-800 text-xs">
                        💡 <strong>What's next?</strong> You'll be among the first to know when TenderPost launches with exclusive early access!
                      </p>
                    </div>
                    
                    <div className="relative p-[2px] bg-gradient-to-r from-blue-900 via-blue-600 to-sky-400 hover:from-blue-800 hover:via-blue-500 hover:to-sky-300 transition-all duration-300 shadow-md hover:shadow-lg">
                      <button
                        onClick={handleClose}
                        className="bg-white hover:bg-blue-900 text-gray-900 hover:text-white px-4 py-2 font-semibold transition-all duration-300 text-sm"
                      >
                        Continue Exploring
                      </button>
                    </div>
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