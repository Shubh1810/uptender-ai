import 'server-only';
import { BILLING_PERIOD_MONTHS, isPaidPlanId, type PaidPlanId } from '@/config/plans';
import { createAdminClient } from '@/server/supabase/admin';
import { ApiError } from '@/server/http';
import { fetchOrder, fetchPayment } from '@/server/billing/razorpay';

export interface ActivationResult {
  userId: string;
  planId: PaidPlanId;
  alreadyActivated: boolean;
}

/**
 * Activates the subscription paid for by `paymentId` on `orderId`.
 *
 * Called both from the browser callback (after signature verification) and
 * from the Razorpay webhook, so it must be idempotent. Everything it trusts
 * comes from Razorpay's API, not from the client:
 *  - the payment belongs to the order and is captured / the order is paid,
 *  - the plan and user come from the order notes we wrote at creation time.
 *
 * The DB write goes through `activate_subscription` (service role only), which
 * supersedes the old plan and inserts the new one in a single transaction and
 * is a no-op if this payment was already used.
 */
export async function activateSubscriptionFromPayment(orderId: string, paymentId: string): Promise<ActivationResult> {
  const [order, payment] = await Promise.all([fetchOrder(orderId), fetchPayment(paymentId)]);

  if (payment.order_id !== order.id) {
    throw new ApiError(400, 'PAYMENT_MISMATCH', 'Payment does not belong to this order');
  }
  const paid = order.status === 'paid' || payment.status === 'captured';
  if (!paid || payment.amount < order.amount) {
    throw new ApiError(402, 'PAYMENT_NOT_CAPTURED', 'Payment has not been completed');
  }

  const userId = order.notes?.userId;
  const planId = order.notes?.planId;
  if (!userId || !isPaidPlanId(planId)) {
    throw new ApiError(400, 'INVALID_ORDER', 'Order is missing plan details');
  }

  const { data, error } = await createAdminClient().rpc('activate_subscription', {
    p_user_id: userId,
    p_plan_id: planId,
    p_payment_id: payment.id,
    p_order_id: order.id,
    p_period_months: BILLING_PERIOD_MONTHS,
  });

  if (error) {
    console.error('[billing] activate_subscription failed', { orderId, paymentId, error });
    throw new ApiError(500, 'ACTIVATION_FAILED', 'Payment received but activation failed. Our team has been notified.');
  }

  const result = data as { already_activated?: boolean } | null;
  return { userId, planId, alreadyActivated: Boolean(result?.already_activated) };
}
