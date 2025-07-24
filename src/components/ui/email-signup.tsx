'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailSignupProps {
  className?: string;
}

export function EmailSignup({ className = '' }: EmailSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        console.error('Signup failed:', data.error);
        // You could add error state handling here
        alert(data.error || 'Failed to join waitlist. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 ${className}`}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="h-6 w-6 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white mb-2">Successfully Subscribed</h3>
          <p className="text-white/80 text-sm">
            You'll receive updates about TenderPost AI launch and early access opportunities.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 ${className}`}
    >
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-white mb-3">
            Stay Updated
          </h3>
          <p className="text-white/80 leading-relaxed">
            Get notified about TenderPost AI launch updates and early access opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
            />
          
          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Subscribing...
              </div>
            ) : (
              "Subscribe to Updates"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-white/60 text-xs">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </motion.div>
  );
} 