import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/server/env';
import { apiHandler, clientIp, parseJson } from '@/server/http';
import { enforceRateLimit } from '@/server/rate-limit';
import { sendEmail } from '@/server/email/client';
import { waitlistConfirmationEmail, waitlistSalesEmail } from '@/server/email/templates';

const schema = z.object({
  email: z.email().max(254),
  source: z
    .string()
    .trim()
    .max(50)
    .regex(/^[\w\s-]*$/)
    .default('unknown')
    .catch('unknown'),
});

const HOUR = 60 * 60 * 1000;

/** Waitlist signup: confirmation to the user and a notification to sales. */
export const POST = apiHandler('signup', async (request) => {
  enforceRateLimit(`waitlist:ip:${clientIp(request)}`, 5, HOUR);
  const { email, source } = await parseJson(request, schema);
  enforceRateLimit(`waitlist:to:${email.toLowerCase()}`, 2, 24 * HOUR);

  const signedUpAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const [confirmed] = await Promise.all([
    sendEmail({
      fromName: 'TenderPost Waitlist',
      to: email,
      subject: "You're on the TenderPost Waitlist!",
      html: waitlistConfirmationEmail(),
    }),
    sendEmail({
      fromName: 'TenderPost Analytics',
      to: env().SALES_NOTIFICATION_EMAIL,
      subject: 'New Waitlist Signup - TenderPost',
      html: waitlistSalesEmail(email, source, signedUpAt),
    }),
  ]);

  if (!confirmed) {
    return NextResponse.json({ error: 'Failed to process signup. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ message: 'Successfully joined waitlist!' });
});
