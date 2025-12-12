'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/ui/google-signin-button';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities && data.user.identities.length === 0) {
          setError('An account with this email already exists');
          setLoading(false);
          return;
        }

        setMessage('Check your email to confirm your account!');
        setTimeout(() => {
          router.push('/onboarding');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Sign up error:', err);
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
          aria-label="Back to sign in"
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
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 text-lg">Join TenderPost today</p>
          </div>
        </div>
      </div>

      {/* Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8">
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-4">
              {message}
            </div>
          )}

          {/* Social Sign-up Buttons */}
          <div className="space-y-3 mb-6">
            <GoogleSignInButton className="w-full relative bg-white hover:bg-blue-900 text-gray-900 hover:text-white border-2 border-transparent bg-clip-padding shadow-md hover:shadow-lg transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:m-[-2px] before:rounded-[inherit] before:bg-gradient-to-r before:from-blue-900 before:via-blue-600 before:to-sky-400 hover:before:bg-blue-900 px-4 py-2.5" />

            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'apple',
                    options: {
                      redirectTo: `${window.location.origin}/auth/callback`,
                    },
                  });
                  if (error) {
                    setError(error.message);
                    setLoading(false);
                  }
                } catch (err) {
                  setError('Failed to sign up with Apple');
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white border border-gray-800 rounded-lg px-4 py-2.5 font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Sign up with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-900 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Sign In Prompt */}
          <div className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link
              href="/onboarding"
              className="text-blue-600 hover:text-blue-900 hover:underline font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

