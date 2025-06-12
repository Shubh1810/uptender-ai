import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { z } from 'zod';

// Validation schema for payment verification
const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = verifyPaymentSchema.parse(body);
    
    // Verify payment signature
    const isValid = verifyPaymentSignature(
      validatedData.razorpay_order_id,
      validatedData.razorpay_payment_id,
      validatedData.razorpay_signature
    );
    
    if (isValid) {
      // Payment is valid - you can save to database here
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: validatedData.razorpay_payment_id,
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment verification failed' 
        },
        { status: 400 }
      );
    }
    
  } catch (error: unknown) {
    console.error('Payment verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid payment data',
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Payment verification failed' 
      },
      { status: 500 }
    );
  }
} 