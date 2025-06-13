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
    console.log('Notification email:', process.env.NOTIFICATION_EMAIL || 'Not set');

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

    // Send notification email to you
    const notificationEmail = await resend.emails.send({
      from: 'TenderPost Signup <onboarding@resend.dev>',
      to: [process.env.NOTIFICATION_EMAIL || 'your-email@example.com'],
      subject: '🎉 New TenderPost Waitlist Signup!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚀 New Waitlist Signup!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Someone just joined the TenderPost waitlist!</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0; color: #374151;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
                Signed up on: ${new Date().toLocaleString('en-IN', { 
                  timeZone: 'Asia/Kolkata',
                  dateStyle: 'full',
                  timeStyle: 'short'
                })}
              </p>
            </div>
            
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 15px; border-radius: 10px; margin: 20px 0;">
              <p style="color: white; margin: 0; text-align: center; font-weight: bold;">
                🎯 Keep building that amazing TenderPost platform!
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 0;">
              This email was sent automatically from your TenderPost signup form.
            </p>
          </div>
        </div>
      `,
    });

    // Send welcome email to the user
    const welcomeEmail = await resend.emails.send({
      from: 'TenderPost Team <onboarding@resend.dev>',
      to: [email],
      subject: '🎉 Welcome to TenderPost - You\'re on the Waitlist!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to TenderPost! 🚀</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              You're now on our exclusive waitlist
            </p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Thanks for joining our waitlist! 🎊</h2>
            
            <p style="color: #374151; line-height: 1.6;">
              We're thrilled to have you on board as we prepare to launch <strong>TenderPost AI</strong> - 
              the future of tender management and procurement data in India.
            </p>
            
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0;">What's Coming:</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li>🤖 AI-powered tender analysis and recommendations</li>
                <li>📱 Real-time notifications across multiple channels</li>
                <li>📊 Advanced analytics and market insights</li>
                <li>🎯 Smart filtering for relevant opportunities</li>
                <li>💼 Comprehensive procurement data coverage</li>
              </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
              <p style="color: white; margin: 0; font-weight: bold; font-size: 16px;">
                🎁 Early Access Bonus: Special launch pricing just for you!
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              We'll keep you updated on our progress and notify you the moment TenderPost AI is ready. 
              Get ready to transform your tender success rate!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Follow our journey and stay connected:
              </p>
              <div style="margin-top: 15px;">
                <a href="#" style="display: inline-block; margin: 0 10px; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
                  📧 Updates
                </a>
                <a href="#" style="display: inline-block; margin: 0 10px; padding: 8px 16px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
                  💬 Community
                </a>
              </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 0;">
              Thanks for believing in the future of tender management!<br>
              <strong>The TenderPost Team</strong> 🚀
            </p>
          </div>
        </div>
      `,
    });

    console.log('Notification email response:', notificationEmail);
    console.log('Welcome email response:', welcomeEmail);

    // Check if emails were sent successfully
    if (notificationEmail.error) {
      console.error('Notification email error:', notificationEmail.error);
    }
    if (welcomeEmail.error) {
      console.error('Welcome email error:', welcomeEmail.error);
    }

    return NextResponse.json(
      { 
        message: 'Successfully joined waitlist!',
        notificationId: notificationEmail.data?.id,
        welcomeId: welcomeEmail.data?.id,
        debug: {
          notificationSuccess: !notificationEmail.error,
          welcomeSuccess: !welcomeEmail.error,
          notificationError: notificationEmail.error,
          welcomeError: welcomeEmail.error
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