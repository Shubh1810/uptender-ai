'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loadRazorpayScript } from '@/lib/razorpay';
import { RazorpayOptions, RazorpayResponse } from '@/lib/types/razorpay';
import Image from 'next/image';

interface PaymentFormData {
  amount: number;
  name: string;
  email: string;
  phone: string;
}

interface PaymentStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export default function MakePaymentPage() {
  const searchParams = useSearchParams();
  
  // Get plan info from URL parameters
  const planFromUrl = searchParams.get('plan') || 'professional';
  const amountFromUrl = parseInt(searchParams.get('amount') || '12353');
  
  console.log('URL Params:', { plan: planFromUrl, amount: amountFromUrl });
  
  // Plan details for display
  const planDetails = {
    basic: { name: 'Basic Plan', amount: 9134, description: 'Essential Procurement Management \n for small businesses' },
    professional: { name: 'Professional Plan', amount: 12353, description: 'Advanced features for growing companies' },
    enterprise: { name: 'Enterprise Plan', amount: 14983, description: 'Complete solution for large organizations' }
  };
  
  const selectedPlan = planDetails[planFromUrl as keyof typeof planDetails] || planDetails.professional;

  const [formData, setFormData] = useState<PaymentFormData>({
    amount: amountFromUrl || selectedPlan.amount,
    name: '',
    email: '',
    phone: '',
  });
  
  console.log('Form Data Amount:', formData.amount, 'Selected Plan Amount:', selectedPlan.amount);
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ type: 'idle' });
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Razorpay script on component mount
  useEffect(() => {
    const loadScript = async () => {
      const scriptLoaded = await loadRazorpayScript();
      setIsScriptLoaded(scriptLoaded);
      if (!scriptLoaded) {
        setPaymentStatus({
          type: 'error',
          message: 'Failed to load payment gateway. Please refresh and try again.',
        });
      }
    };
    loadScript();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const createPaymentOrder = async () => {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: formData.amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: RazorpayResponse) => {
    try {
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      setPaymentStatus({
        type: 'error',
        message: 'Payment gateway not loaded. Please refresh the page.',
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || formData.amount < 1) {
      setPaymentStatus({
        type: 'error',
        message: 'Please fill in all required fields and ensure amount is at least ₹1.',
      });
      return;
    }

    setPaymentStatus({ type: 'loading' });

    try {
      // Create order
      const orderData = await createPaymentOrder();
      
      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TenderPost AI',
        description: 'AI-Powered Tender Management Platform',
        order_id: orderData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verificationResult = await verifyPayment(response);
            
            if (verificationResult.success) {
              setPaymentStatus({
                type: 'success',
                message: `Payment successful! Payment ID: ${response.razorpay_payment_id}`,
              });
                         } else {
               setPaymentStatus({
                 type: 'error',
                 message: 'Payment verification failed. Please contact support.',
               });
             }
           } catch (verificationError: unknown) {
             console.error('Payment verification error:', verificationError);
             setPaymentStatus({
               type: 'error',
               message: 'Payment verification failed. Please contact support.',
             });
           }
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus({
              type: 'error',
              message: 'Payment cancelled by user.',
            });
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (paymentError: unknown) {
      console.error('Payment initiation error:', paymentError);
      setPaymentStatus({
        type: 'error',
        message: 'Failed to initiate payment. Please try again.',
      });
    }
  };

  const resetPayment = () => {
    setPaymentStatus({ type: 'idle' });
    setFormData({
      amount: selectedPlan.amount,
      name: '',
      email: '',
      phone: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <Image 
                              src="/tplogo.png" 
              alt="Tender Post AI Logo" 
              className="h-16 w-16 rounded-2xl object-contain"
              width={64}
              height={64}
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            TenderPost AI
          </h1>
          <p className="text-lg text-gray-600">
            Secure Payment Gateway
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL encrypted</span>
          </div>
        </motion.div>

        {/* Payment Status Display */}
        {paymentStatus.type === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-green-800 font-semibold">Payment Successful!</h3>
                <p className="text-green-700 text-sm mt-1">{paymentStatus.message}</p>
              </div>
            </div>
            <Button 
              onClick={resetPayment}
              className="mt-4 w-full"
              variant="outline"
            >
              Make Another Payment
            </Button>
          </motion.div>
        )}

        {paymentStatus.type === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="text-red-800 font-semibold">Payment Failed</h3>
                <p className="text-red-700 text-sm mt-1">{paymentStatus.message}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Form */}
        {paymentStatus.type !== 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="space-y-6">
              {/* Selected Plan Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-blue-900">{selectedPlan.name}</h3>
                    <p className="text-sm text-blue-700">{selectedPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">₹{selectedPlan.amount.toLocaleString()}</div>
                    <div className="text-sm text-blue-600">one-time payment</div>
                  </div>
                </div>
                <Link href="/#pricing" className="text-blue-600 hover:text-blue-800 text-sm underline">
                  Change plan
                </Link>
              </div>

              {/* Amount (now read-only, shows selected plan amount) */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="text-lg font-semibold bg-gray-50"
                  placeholder="Enter amount"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Amount is set based on your selected plan</p>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Personal Details</span>
                </h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Secure Payment
                  </span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Your payment information is encrypted and secure. Powered by Razorpay.
                </p>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={paymentStatus.type === 'loading' || !isScriptLoaded}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                size="lg"
              >
                {paymentStatus.type === 'loading' ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Pay ₹{formData.amount}</span>
                  </div>
                )}
              </Button>

              {/* Payment Methods */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">Accepted payment methods</p>
                <div className="flex justify-center space-x-4 text-xs text-gray-400">
                  <span>Credit Card</span>
                  <span>•</span>
                  <span>Debit Card</span>
                  <span>•</span>
                  <span>UPI</span>
                  <span>•</span>
                  <span>Net Banking</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <span className="font-semibold text-blue-600">Tender Post AI</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
} 