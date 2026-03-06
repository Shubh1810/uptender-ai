import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Server-side source of truth for plan prices (in rupees, matching landing page)
// monthly = per-month charge; yearly = annual lump-sum (saves ~15% vs monthly×12)
const PLAN_PRICES: Record<string, { monthly: number; yearly: number }> = {
  basic:      { monthly: 1499,  yearly: 14988 },  // yearly = ₹1,249/mo × 12
  pro:        { monthly: 2999,  yearly: 29988 },  // yearly = ₹2,499/mo × 12
  enterprise: { monthly: 7999,  yearly: 81590 },  // yearly ≈ 15% off ₹7,999×12
};

const createOrderSchema = z.object({
  planId: z.enum(['basic', 'pro', 'enterprise']),
  billingCycle: z.enum(['monthly', 'yearly']).default('yearly'),
  currency: z.string().default('INR'),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const amount = PLAN_PRICES[validatedData.planId][validatedData.billingCycle];

    // Create order with server-validated amount; embed userId, planId, billingCycle in notes
    const order = await createRazorpayOrder({
      amount,
      currency: validatedData.currency,
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        planId: validatedData.planId,
        billingCycle: validatedData.billingCycle,
        userEmail: user.email ?? '',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planId: validatedData.planId,
      billingCycle: validatedData.billingCycle,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error: unknown) {
    console.error('Create order error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}