import { NextResponse } from 'next/server';
import { z } from 'zod';
import { CURRENCY, PAID_PLAN_IDS, getPlanPricing } from '@/config/plans';
import { requireUser } from '@/server/auth';
import { apiHandler, assertSameOrigin, parseJson } from '@/server/http';
import { enforceRateLimit } from '@/server/rate-limit';
import { createOrder, razorpayKeyId } from '@/server/billing/razorpay';

const schema = z.object({
  planId: z.enum(PAID_PLAN_IDS),
});

export const POST = apiHandler('razorpay/create-order', async (request) => {
  assertSameOrigin(request);
  const { user } = await requireUser();
  enforceRateLimit(`create-order:${user.id}`, 10, 60_000);

  const { planId } = await parseJson(request, schema);
  const pricing = getPlanPricing(planId);

  // Amount, plan and user all come from the server. The order notes are the
  // source of truth when the payment is later verified or webhooked.
  const order = await createOrder({
    amountPaise: pricing.totalPaise,
    currency: CURRENCY,
    receipt: `rcpt_${Date.now()}_${user.id.slice(0, 8)}`, // Razorpay caps receipts at 40 chars
    notes: {
      userId: user.id,
      planId,
      billingCycle: 'yearly',
      basePrice: String(pricing.base),
      gst: String(pricing.gst),
    },
  });

  return NextResponse.json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    planId,
    keyId: razorpayKeyId(),
  });
});
