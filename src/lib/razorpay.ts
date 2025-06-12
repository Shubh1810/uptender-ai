import Razorpay from 'razorpay';
import { CreateOrderRequest, CreateOrderResponse } from './types/razorpay';

// Create Razorpay instance when needed
function createRazorpayInstance() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not found in environment variables');
  }
  
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Create order on server
export async function createRazorpayOrder(
  orderData: CreateOrderRequest
): Promise<CreateOrderResponse> {
  try {
    const razorpay = createRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: orderData.amount * 100, // Convert to paise
      currency: orderData.currency,
      receipt: orderData.receipt || `receipt_${Date.now()}`,
      notes: orderData.notes || {},
    });
    
    return order as CreateOrderResponse;
  } catch (error: unknown) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
}

// Load Razorpay script
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Verify payment signature (should be done on server)
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto');
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    return expectedSignature === signature;
  } catch (error: unknown) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
} 