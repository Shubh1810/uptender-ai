import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    const submissionDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    // Create email HTML for notification
    const notificationEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              📬 New Contact Form Submission
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">
              Someone reached out via TenderPost contact form
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            
            <!-- Contact Details Card -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px; border-radius: 15px; margin: 25px 0; border: 1px solid #e2e8f0;">
              
              <!-- Name -->
              <div style="margin-bottom: 20px;">
                <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 5px 0; font-weight: 600;">Name</p>
                <p style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0;">${name}</p>
              </div>

              <!-- Email -->
              <div style="margin-bottom: 20px;">
                <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 5px 0; font-weight: 600;">Email</p>
                <a href="mailto:${email}" style="color: #3b82f6; font-size: 16px; font-weight: 500; text-decoration: none;">${email}</a>
              </div>

              ${phone ? `
              <!-- Phone -->
              <div style="margin-bottom: 20px;">
                <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 5px 0; font-weight: 600;">Phone</p>
                <a href="tel:${phone}" style="color: #3b82f6; font-size: 16px; font-weight: 500; text-decoration: none;">${phone}</a>
              </div>
              ` : ''}

              <!-- Date -->
              <div>
                <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 5px 0; font-weight: 600;">Submitted On</p>
                <p style="color: #1f2937; font-size: 14px; margin: 0;">${submissionDate}</p>
              </div>
            </div>

            <!-- Message Card -->
            <div style="background: #fffbeb; padding: 25px; border-radius: 15px; margin: 25px 0; border: 1px solid #fef3c7;">
              <p style="color: #92400e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 15px 0; font-weight: 600;">Message</p>
              <p style="color: #1f2937; font-size: 15px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>

            <!-- Quick Actions -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 5px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                📧 Reply to ${name.split(' ')[0]}
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
                This notification was sent automatically from your TenderPost contact form.<br/>
                <strong>TenderPost</strong> - AI-powered Tender Management Platform
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send notification email to admin
    const notificationEmail = await resend.emails.send({
      from: 'TenderPost Contact <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL || 'sales@tenderpost.org',
      subject: `New Contact Form: ${name}`,
      html: notificationEmailHTML,
      replyTo: email,
    });

    // Optional: Send auto-reply to user
    const autoReplyHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting TenderPost</title>
      </head>
      <body style="margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ✅ Message Received!
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">
              Thank you for reaching out to TenderPost
            </p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                Hi ${name}! 👋
              </h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">
                We've received your message and our team will get back to you within <strong>24 hours</strong>.
              </p>
            </div>

            <!-- What's Next -->
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 15px; margin: 25px 0;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                📋 What happens next?
              </h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                <li>Our team reviews your message</li>
                <li>We'll respond to <strong>${email}</strong></li>
                <li>You'll hear from us within 24 hours</li>
              </ul>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://tenderpost.org" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-size: 14px; font-weight: 600; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                🏠 Visit TenderPost
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
                <strong>TenderPost</strong> - AI-powered Tender Management Platform<br/>
                Revolutionizing Tender Management in India 🇮🇳
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: 'TenderPost <onboarding@resend.dev>',
      to: email,
      subject: 'We received your message - TenderPost',
      html: autoReplyHTML,
    });

    console.log('✅ Contact form email sent:', notificationEmail);

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! We will get back to you within 24 hours.',
        data: { notificationEmailId: notificationEmail.data?.id },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to send message. Please try again or contact us directly at sales@tenderpost.org',
      },
      { status: 500 }
    );
  }
}

