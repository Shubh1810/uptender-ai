import 'server-only';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { requireEnv } from '@/server/env';

let instance: Razorpay | null = null;

function razorpay(): Razorpay {
  if (!instance) {
    instance = new Razorpay({
      key_id: requireEnv('RAZORPAY_KEY_ID'),
      key_secret: requireEnv('RAZORPAY_KEY_SECRET'),
    });
  }
  return instance;
}

export function razorpayKeyId(): string {
  return requireEnv('RAZORPAY_KEY_ID');
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  amount_paid: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid' | string;
  notes: Record<string, string>;
}

export interface RazorpayPayment {
  id: string;
  order_id: string;
  amount: number;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed' | string;
}

export async function createOrder(input: {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}): Promise<RazorpayOrder> {
  const order = await razorpay().orders.create({
    amount: input.amountPaise,
    currency: input.currency,
    receipt: input.receipt,
    notes: input.notes,
  });
  return order as unknown as RazorpayOrder;
}

export async function fetchOrder(orderId: string): Promise<RazorpayOrder> {
  return (await razorpay().orders.fetch(orderId)) as unknown as RazorpayOrder;
}

export async function fetchPayment(paymentId: string): Promise<RazorpayPayment> {
  return (await razorpay().payments.fetch(paymentId)) as unknown as RazorpayPayment;
}

function hmacHex(secret: string, payload: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/** Constant-time comparison of two hex signatures. */
export function signaturesMatch(expectedHex: string, actualHex: string): boolean {
  const expected = Buffer.from(expectedHex, 'utf8');
  const actual = Buffer.from(actualHex, 'utf8');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

/** Verifies the signature Razorpay Checkout returns to the browser. */
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string): boolean {
  return signaturesMatch(hmacHex(requireEnv('RAZORPAY_KEY_SECRET'), `${orderId}|${paymentId}`), signature);
}

/** Verifies the `x-razorpay-signature` header on a webhook's raw body. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  return signaturesMatch(hmacHex(requireEnv('RAZORPAY_WEBHOOK_SECRET'), rawBody), signature);
}
