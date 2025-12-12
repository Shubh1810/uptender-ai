'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Force light mode on auth pages
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
    return () => {
      const storedTheme = localStorage.getItem('dashboard-theme');
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for the password reset link!');
        setEmail('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#fefcf3',
        backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 8px 8px',
      }}
    >
      {/* Back Arrow */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/onboarding"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200"
          aria-label="Back to onboarding"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
      </div>

      {/* Logo & Branding */}
      <div className="pt-12 pb-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-2">
            <Image
              src="/tplogo.png"
              alt="TenderPost"
              className="h-8 w-8 rounded-lg object-contain"
              priority
              width={32}
              height={32}
            />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              <span className="font-inter">Tender</span>
              <span className="font-kings -ml-1">Post</span>
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-600 text-lg">
              Enter your email to receive a reset link
            </p>
          </div>
        </div>
      </div>

      {/* Reset Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleResetPassword} className="space-y-4">
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link
                href="/onboarding"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

