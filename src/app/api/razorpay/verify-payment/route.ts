import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/server/auth';
import { ApiError, apiHandler, assertSameOrigin, forbidden, parseJson } from '@/server/http';
import { verifyCheckoutSignature } from '@/features/billing/server/razorpay';
import { activateSubscriptionFromPayment } from '@/features/billing/server/activate';

const schema = z.object({
  razorpay_order_id: z.string().min(1).max(64),
  razorpay_payment_id: z.string().min(1).max(64),
  razorpay_signature: z.string().min(1).max(256),
});

/**
 * Called by the checkout page right after Razorpay reports success.
 * The webhook (`/api/razorpay/webhook`) performs the same activation, so the
 * subscription still activates if the user closes the tab before this runs.
 */
export const POST = apiHandler('razorpay/verify-payment', async (request) => {
  assertSameOrigin(request);
  const { user } = await requireUser();
  const body = await parseJson(request, schema);

  if (!verifyCheckoutSignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature)) {
    throw new ApiError(400, 'INVALID_SIGNATURE', 'Payment verification failed');
  }

  const result = await activateSubscriptionFromPayment(body.razorpay_order_id, body.razorpay_payment_id);
  if (result.userId !== user.id) {
    // Activation already happened for the real owner. Don't confirm anything to someone else.
    throw forbidden('Order does not belong to the authenticated user');
  }

  return NextResponse.json({
    success: true,
    message: 'Payment verified and subscription activated',
    planId: result.planId,
  });
});
