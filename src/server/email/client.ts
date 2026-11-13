import 'server-only';
import { Resend } from 'resend';
import { env, requireEnv } from '@/server/env';

let resend: Resend | null = null;

function client(): Resend {
  if (!resend) resend = new Resend(requireEnv('RESEND_API_KEY'));
  return resend;
}

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  /** Display name to use with the configured EMAIL_FROM address. */
  fromName?: string;
}

function fromAddress(fromName?: string): string {
  const from = env().EMAIL_FROM;
  if (!fromName) return from;
  const address = from.match(/<([^>]+)>/)?.[1] ?? from;
  return `${fromName} <${address}>`;
}

/**
 * Sends an email. Returns true on success; logs and returns false on failure
 * so callers can decide whether a failed email should fail the request.
 *
 * NOTE: EMAIL_FROM defaults to Resend's sandbox sender, which only delivers to
 * your own Resend account email. Verify tenderpost.org in Resend and set
 * EMAIL_FROM="TenderPost <hello@tenderpost.org>" for real delivery.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const { error } = await client().emails.send({
    from: fromAddress(message.fromName),
    to: message.to,
    subject: message.subject,
    html: message.html,
    replyTo: message.replyTo,
  });
  if (error) {
    console.error('[email] send failed', { subject: message.subject, error });
    return false;
  }
  return true;
}
