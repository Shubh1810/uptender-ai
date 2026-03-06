import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature, fetchRazorpayOrder } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

// Plan IDs accepted as valid subscription plans
const VALID_PLAN_IDS = new Set(['basic', 'pro', 'enterprise']);

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
    const validatedData = verifyPaymentSchema.parse(body);

    // Verify the cryptographic signature first (fast, no external call)
    const isValid = verifyPaymentSignature(
      validatedData.razorpay_order_id,
      validatedData.razorpay_payment_id,
      validatedData.razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Fetch the order from Razorpay to read server-stored notes
    const order = await fetchRazorpayOrder(validatedData.razorpay_order_id);

    // Ensure this order was created for the authenticated user
    if (order.notes?.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Order does not belong to the authenticated user' },
        { status: 403 }
      );
    }

    const planId = order.notes?.planId;
    if (!planId || !VALID_PLAN_IDS.has(planId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan in order' },
        { status: 400 }
      );
    }

    // Activate subscription: upsert into user_subscriptions
    // Expires 1 year from now; set any existing active subscription to superseded
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // Deactivate any existing active subscription for this user
    await supabase
      .from('user_subscriptions')
      .update({ status: 'superseded' })
      .eq('user_id', user.id)
      .eq('status', 'active');

    // Insert new active subscription
    const { error: insertError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_id: planId,
        status: 'active',
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        payment_id: validatedData.razorpay_payment_id,
        order_id: validatedData.razorpay_order_id,
      });

    if (insertError) {
      console.error('Failed to activate subscription:', insertError);
      return NextResponse.json(
        { success: false, error: 'Payment verified but subscription activation failed. Contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
      paymentId: validatedData.razorpay_payment_id,
      planId,
    });

  } catch (error: unknown) {
    console.error('Payment verification error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}