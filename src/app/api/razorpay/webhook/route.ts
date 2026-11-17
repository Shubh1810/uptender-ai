import { NextResponse } from 'next/server';
import { ApiError, apiHandler } from '@/server/http';
import { verifyWebhookSignature } from '@/features/billing/server/razorpay';
import { activateSubscriptionFromPayment } from '@/features/billing/server/activate';

interface WebhookEvent {
  event: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string } };
    order?: { entity?: { id?: string } };
  };
}

const HANDLED_EVENTS = new Set(['order.paid', 'payment.captured']);

/**
 * Razorpay webhook. Configure in the Razorpay dashboard:
 *   URL:    https://<your-domain>/api/razorpay/webhook
 *   Events: order.paid, payment.captured
 *   Secret: same value as RAZORPAY_WEBHOOK_SECRET
 *
 * This is the reliable activation path: it runs even if the customer closes the
 * browser after paying. Activation is idempotent, so duplicate deliveries and
 * the browser-side verify call can't create extra subscriptions.
 */
export const POST = apiHandler('razorpay/webhook', async (request) => {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    throw new ApiError(400, 'INVALID_SIGNATURE', 'Invalid webhook signature');
  }

  const event = JSON.parse(rawBody) as WebhookEvent;
  if (!HANDLED_EVENTS.has(event.event)) {
    return NextResponse.json({ received: true, ignored: event.event });
  }

  const payment = event.payload?.payment?.entity;
  const orderId = payment?.order_id ?? event.payload?.order?.entity?.id;
  if (!payment?.id || !orderId) {
    // Payments not created through our order flow; nothing to activate.
    return NextResponse.json({ received: true, ignored: 'no_order' });
  }

  const result = await activateSubscriptionFromPayment(orderId, payment.id);
  return NextResponse.json({ received: true, alreadyActivated: result.alreadyActivated });
});
