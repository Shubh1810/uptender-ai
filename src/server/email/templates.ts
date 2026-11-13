import 'server-only';
import { escapeHtml } from '@/lib/escape-html';

/**
 * Email templates. Every user-supplied value MUST pass through `escapeHtml`
 * (the `e` helper below). Never interpolate raw input into these strings.
 */
const e = escapeHtml;

function layout(title: string, headerColor: string, heading: string, subheading: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${e(title)}</title>
</head>
<body style="margin:0;padding:20px;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
    <div style="background:${headerColor};padding:36px 30px;text-align:center;">
      <h1 style="color:#ffffff;margin:0 0 8px 0;font-size:26px;font-weight:700;">${heading}</h1>
      <p style="color:rgba(255,255,255,0.9);margin:0;font-size:15px;">${subheading}</p>
    </div>
    <div style="padding:32px 30px;">
      ${body}
      <div style="border-top:1px solid #e5e7eb;padding-top:20px;text-align:center;margin-top:30px;">
        <p style="color:#9ca3af;font-size:12px;margin:0;line-height:1.5;">
          <strong>TenderPost</strong> · AI-powered Tender Management Platform
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function field(label: string, valueHtml: string) {
  return `<div style="margin-bottom:18px;">
    <p style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px 0;font-weight:600;">${label}</p>
    <div style="color:#1f2937;font-size:15px;margin:0;">${valueHtml}</div>
  </div>`;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
}

/** Internal notification to the sales inbox. */
export function contactNotificationEmail(c: ContactSubmission): string {
  const body = `
    <div style="background:#f8fafc;padding:22px;border-radius:12px;border:1px solid #e2e8f0;">
      ${field('Name', e(c.name))}
      ${field('Email', `<a href="mailto:${e(c.email)}" style="color:#3b82f6;text-decoration:none;">${e(c.email)}</a>`)}
      ${c.phone ? field('Phone', `<a href="tel:${e(c.phone)}" style="color:#3b82f6;text-decoration:none;">${e(c.phone)}</a>`) : ''}
      ${field('Submitted on', e(c.submittedAt))}
    </div>
    <div style="background:#fffbeb;padding:22px;border-radius:12px;margin-top:20px;border:1px solid #fef3c7;">
      <p style="color:#92400e;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 12px 0;font-weight:600;">Message</p>
      <p style="color:#1f2937;font-size:15px;line-height:1.6;margin:0;white-space:pre-wrap;">${e(c.message)}</p>
    </div>`;
  return layout('New contact form submission', '#1e40af', 'New Contact Form Submission', 'Someone reached out via the TenderPost contact form', body);
}

/**
 * Auto-reply to the person who submitted the form. Deliberately contains NO
 * user-supplied content, so the form can't be used to send attacker-written
 * text to arbitrary inboxes from our domain.
 */
export function contactAutoReplyEmail(): string {
  const body = `
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px 0;">Hi there,</p>
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 16px 0;">
      Thanks for contacting TenderPost. We've received your message and our team will get back to you within <strong>24 hours</strong>.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="https://tenderpost.org" style="display:inline-block;background:#1e40af;color:#ffffff;padding:12px 24px;border-radius:24px;text-decoration:none;font-size:14px;font-weight:600;">Visit TenderPost</a>
    </div>`;
  return layout('We received your message', '#059669', 'Message Received', 'Thank you for reaching out to TenderPost', body);
}

/** Confirmation sent to someone who joined the waitlist. */
export function waitlistConfirmationEmail(): string {
  const body = `
    <h2 style="color:#1f2937;margin:0 0 12px 0;font-size:20px;">Thanks for joining!</h2>
    <p style="color:#374151;line-height:1.6;margin:0 0 20px 0;">
      We're putting the finishing touches on <strong>TenderPost</strong> and you'll be among the first to know when we launch.
    </p>
    <div style="background:#eff6ff;padding:18px;border-radius:10px;border-left:4px solid #3b82f6;">
      <p style="color:#1e40af;margin:0 0 8px 0;font-weight:600;">What to expect</p>
      <ul style="color:#374151;margin:0;padding-left:20px;line-height:1.8;">
        <li>Launch notification in the next few weeks</li>
        <li>Special early access pricing</li>
        <li>Comprehensive procurement data coverage</li>
        <li>AI-powered tender insights</li>
      </ul>
    </div>`;
  return layout("You're on the TenderPost waitlist", '#4f46e5', "You're on the Waitlist!", 'TenderPost is launching soon', body);
}

/** Internal notification about a new waitlist signup. */
export function waitlistSalesEmail(email: string, source: string, signedUpAt: string): string {
  const body = `
    <div style="background:#fef2f2;padding:20px;border-radius:10px;border-left:4px solid #dc2626;">
      ${field('Email', e(email))}
      ${field('Signed up', e(signedUpAt))}
      ${field('Source', e(source))}
    </div>`;
  return layout('New waitlist signup', '#dc2626', 'New Waitlist Signup', 'Sales notification', body);
}
