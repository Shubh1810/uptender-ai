import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/server/env';
import { apiHandler, clientIp, parseJson } from '@/server/http';
import { enforceRateLimit } from '@/server/rate-limit';
import { sendEmail } from '@/server/email/client';
import { contactAutoReplyEmail, contactNotificationEmail } from '@/server/email/templates';

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[+\d\s()-]*$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  message: z.string().trim().min(1).max(5000),
});

const HOUR = 60 * 60 * 1000;

export const POST = apiHandler('contact', async (request) => {
  const ip = clientIp(request);
  enforceRateLimit(`contact:ip:${ip}`, 5, HOUR);

  const data = await parseJson(request, schema);
  // Also cap auto-replies per recipient so one address can't be flooded.
  enforceRateLimit(`contact:to:${data.email.toLowerCase()}`, 3, HOUR);

  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const notified = await sendEmail({
    fromName: 'TenderPost Contact',
    to: env().NOTIFICATION_EMAIL,
    subject: 'New contact form submission',
    html: contactNotificationEmail({ ...data, phone: data.phone || undefined, submittedAt }),
    replyTo: data.email,
  });

  if (!notified) {
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email us at sales@tenderpost.org' },
      { status: 502 }
    );
  }

  // The auto-reply is a courtesy; its failure shouldn't fail the submission.
  await sendEmail({
    fromName: 'TenderPost',
    to: data.email,
    subject: 'We received your message - TenderPost',
    html: contactAutoReplyEmail(),
  });

  return NextResponse.json({
    success: true,
    message: 'Message sent successfully! We will get back to you within 24 hours.',
  });
});
