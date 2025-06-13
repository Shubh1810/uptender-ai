import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    console.log('API Key configured:', process.env.RESEND_API_KEY ? 'Yes' : 'No');

    const { email, source = 'unknown' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const signupDate = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Send waitlist confirmation email to the user
    const waitlistEmail = await resend.emails.send({
      from: 'TenderPost Waitlist <onboarding@resend.dev>',
      to: [email],
      subject: '✅ You\'re on the TenderPost Waitlist!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; backdrop-filter: blur(10px);">
              <span style="font-size: 24px;">✅</span>
            </div>
            <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">You're on the Waitlist!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">TenderPost Procurement Data launching soon</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; margin-top: 0; font-size: 22px;">Thanks for joining! 🎉</h2>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              We're putting the finishing touches on <strong>TenderPost Procurement Data</strong> and you'll be among the first to know when we launch!
            </p>
            
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">What to expect:</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li>🚀 Launch notification in the next few weeks</li>
                <li>🎁 Special early access pricing</li>
                <li>📊 Comprehensive procurement data coverage</li>
                <li>🤖 AI-powered tender insights</li>
              </ul>
            </div>
            
            <p style="color: #374151; line-height: 1.6; text-align: center; margin-bottom: 0;">
              Stay tuned! We'll be in touch very soon.<br>
              <strong style="color: #1e40af;">The TenderPost Team</strong> 🚀
            </p>
          </div>
        </div>
      `,
    });

    // Send simple notification to sales team from analytics
    const salesEmail = await resend.emails.send({
      from: 'TenderPost Analytics <analytics@resend.dev>',
      to: ['shethshubh@gmail.com'],
      subject: 'New Waitlist Signup - TenderPost (Sales Notification)',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Waitlist Signup</title>
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background: #dc2626; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 20px;">🚨 SALES NOTIFICATION</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">New Waitlist Signup</p>
            </div>
            
            <div style="padding: 30px;">
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #374151; font-size: 16px;"><strong>🎯 New Client Email:</strong></p>
                <p style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600; background: #fff; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb;">${email}</p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>📅 Signup Date:</strong> ${signupDate}</p>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;"><strong>📍 Source:</strong> ${source}</p>
              </div>
              
              <div style="background: #f0f9ff; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                  📧 This should go to: sales@tenderpost.org
                </p>
                <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">
                  (Currently sent to your email due to Resend domain verification requirement)
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
                Automated notification from TenderPost Analytics System
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('Waitlist email response:', JSON.stringify(waitlistEmail, null, 2));
    console.log('Sales notification response:', JSON.stringify(salesEmail, null, 2));

    // Check if emails were sent successfully
    if (waitlistEmail.error) {
      console.error('Waitlist email error:', waitlistEmail.error);
    }
    if (salesEmail.error) {
      console.error('Sales email error:', salesEmail.error);
    }

    return NextResponse.json(
      { 
        message: 'Successfully joined waitlist!',
        waitlistId: waitlistEmail.data?.id,
        salesId: salesEmail.data?.id,
        debug: {
          waitlistSuccess: !waitlistEmail.error,
          salesSuccess: !salesEmail.error,
          waitlistError: waitlistEmail.error,
          salesError: salesEmail.error
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing signup:', error);
    
    return NextResponse.json(
      { error: 'Failed to process signup. Please try again.' },
      { status: 500 }
    );
  }
} 