import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getWelcomeEmailHTML } from '@/components/email-templates/welcome-email';

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

    const { email } = await request.json();

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

    // Send full welcome email to the user from onboarding
    const welcomeEmail = await resend.emails.send({
      from: 'TenderPost Onboarding <onboarding@resend.dev>',
      to: [email],
      subject: '🎉 Welcome to TenderPost - Let\'s Get Started!',
      html: getWelcomeEmailHTML(email),
    });

    console.log('Welcome email response:', welcomeEmail);

    // Check if email was sent successfully
    if (welcomeEmail.error) {
      console.error('Welcome email error:', welcomeEmail.error);
    }

    return NextResponse.json(
      { 
        message: 'Welcome email sent successfully!',
        welcomeId: welcomeEmail.data?.id,
        debug: {
          welcomeSuccess: !welcomeEmail.error,
          welcomeError: welcomeEmail.error
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing user signup:', error);
    
    return NextResponse.json(
      { error: 'Failed to process signup. Please try again.' },
      { status: 500 }
    );
  }
} 