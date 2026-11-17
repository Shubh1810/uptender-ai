'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Shield, Cookie } from 'lucide-react';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom duration-500">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm dark:from-black/40" />
      
      {/* Cookie Banner */}
      <div className="relative border-t-4 border-t-blue-900 bg-[#fefcf3] shadow-2xl dark:border-t-blue-400 dark:bg-slate-950/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-6 sm:pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Icon + Message */}
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0">
                <Shield className="h-7 w-7 text-gray-700 dark:text-slate-200" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="mb-1 text-sm font-medium text-gray-900 dark:text-slate-100">
                  We use cookies
                </p>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-slate-300">
                  We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic.{' '}
                  <Link
                    href="/privacy-policy"
                    className="underline text-blue-900 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={handleDecline}
                variant="outline"
                className="flex-1 border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex-none"
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 bg-blue-900 px-6 py-2 text-sm text-white hover:bg-blue-800 dark:bg-blue-500 dark:text-slate-950 dark:hover:bg-blue-400 sm:flex-none"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal version (even more compact)
export function CookieBannerMinimal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleClose = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[100] animate-in slide-in-from-bottom duration-500">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-950/95">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Cookie className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="mb-1 text-sm font-medium text-gray-900 dark:text-slate-100">
              Cookie Notice
            </p>
            <p className="mb-3 text-xs text-gray-600 dark:text-slate-300">
              We use cookies for authentication and analytics.{' '}
              <Link href="/privacy-policy" className="text-orange-600 hover:underline dark:text-orange-400">
                Learn more
              </Link>
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleAccept}
                className="h-auto flex-1 bg-orange-600 px-4 py-1.5 text-xs text-white hover:bg-orange-700 dark:bg-orange-500 dark:text-slate-950 dark:hover:bg-orange-400"
              >
                Accept
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="h-auto border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Decline
              </Button>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
