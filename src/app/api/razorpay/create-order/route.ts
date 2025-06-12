import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { z } from 'zod';

// Validation schema for order creation
const createOrderSchema = z.object({
  amount: z.number().min(100, 'Minimum amount is ₹1'), // Minimum ₹1
  currency: z.string().default('INR'),
  receipt: z.string().optional(),
  notes: z.record(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = createOrderSchema.parse(body);
    
    // Create order with Razorpay
    const order = await createRazorpayOrder(validatedData);
    
    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
    
  } catch (error: unknown) {
    console.error('Create order error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data',
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment order' 
      },
      { status: 500 }
    );
  }
} 