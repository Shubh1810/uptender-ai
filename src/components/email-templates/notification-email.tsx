import React from 'react';

interface NotificationEmailProps {
  email: string;
  signupDate: string;
}

export function NotificationEmailTemplate({ email, signupDate }: NotificationEmailProps) {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0',
      backgroundColor: '#f8fafc'
    }}>
      {/* Header with animated gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        padding: '40px 30px',
        borderRadius: '20px 20px 0 0',
        textAlign: 'center' as const,
        position: 'relative' as const,
        overflow: 'hidden'
      }}>
        {/* Animated background pattern */}
        <div style={{
          position: 'absolute' as const,
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
        
        <div style={{ position: 'relative' as const, zIndex: 10 }}>
          <h1 style={{
            color: 'white',
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            🚀 New Waitlist Signup!
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            margin: '0',
            fontSize: '16px',
            fontWeight: '400'
          }}>
            Someone just joined the TenderPost revolution
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        background: 'white',
        padding: '40px 30px',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        {/* Welcome message */}
        <div style={{
          textAlign: 'center' as const,
          marginBottom: '30px'
        }}>
          <h2 style={{
            color: '#1f2937',
            margin: '0 0 15px 0',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Great news! 🎉
          </h2>
          <p style={{
            color: '#6b7280',
            margin: '0',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Your TenderPost platform just got a new potential user!
          </p>
        </div>

        {/* User info card */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '25px',
          borderRadius: '15px',
          margin: '25px 0',
          border: '1px solid #e2e8f0',
          position: 'relative' as const
        }}>
          <div style={{
            position: 'absolute' as const,
            top: '-10px',
            left: '20px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px'
          }}>
            New Signup
          </div>
          
          <div style={{ marginTop: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px'
              }}>
                <span style={{ color: 'white', fontSize: '18px' }}>📧</span>
              </div>
              <div>
                <p style={{
                  margin: '0',
                  color: '#374151',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {email}
                </p>
                <p style={{
                  margin: '5px 0 0 0',
                  color: '#6b7280',
                  fontSize: '14px'
                }}>
                  Signed up on {signupDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          padding: '20px',
          borderRadius: '15px',
          margin: '25px 0',
          textAlign: 'center' as const
        }}>
          <h3 style={{
            color: '#1e40af',
            margin: '0 0 15px 0',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            🎯 Keep Building!
          </h3>
          <p style={{
            color: '#374151',
            margin: '0',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Every signup brings you closer to launching the future of tender management in India. 
            Your vision is becoming reality! 🚀
          </p>
        </div>

        {/* Action buttons */}
        <div style={{
          textAlign: 'center' as const,
          margin: '30px 0'
        }}>
          <a href="#" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '12px 25px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            margin: '0 10px',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            📊 View Dashboard
          </a>
          <a href="#" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '12px 25px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            margin: '0 10px',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
          }}>
            💬 Contact User
          </a>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          paddingTop: '20px',
          textAlign: 'center' as const
        }}>
          <p style={{
            color: '#9ca3af',
            fontSize: '12px',
            margin: '0',
            lineHeight: '1.5'
          }}>
            This notification was sent automatically from your TenderPost signup form.<br/>
            <strong>TenderPost AI</strong> - Revolutionizing Tender Management in India
          </p>
        </div>
      </div>
    </div>
  );
}

// Export as HTML string for email sending
export function getNotificationEmailHTML(email: string, signupDate: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New TenderPost Signup</title>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @media only screen and (max-width: 600px) {
          .container { padding: 10px !important; }
          .content { padding: 20px !important; }
          .button { display: block !important; margin: 10px 0 !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f8fafc;">
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8fafc;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); padding: 40px 30px; border-radius: 20px 20px 0 0; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%); animation: pulse 4s ease-in-out infinite;"></div>
          <div style="position: relative; z-index: 10;">
            <h1 style="color: white; margin: 0 0 10px 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">🚀 New Waitlist Signup!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px; font-weight: 400;">Someone just joined the TenderPost revolution</p>
          </div>
        </div>

        <!-- Main Content -->
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          
          <!-- Welcome Message -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Great news! 🎉</h2>
            <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Your TenderPost platform just got a new potential user!</p>
          </div>

          <!-- User Info Card -->
          <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 25px; border-radius: 15px; margin: 25px 0; border: 1px solid #e2e8f0; position: relative;">
            <div style="position: absolute; top: -10px; left: 20px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">New Signup</div>
            <div style="margin-top: 10px;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                  <span style="color: white; font-size: 18px;">📧</span>
                </div>
                <div>
                  <p style="margin: 0; color: #374151; font-size: 16px; font-weight: 600;">${email}</p>
                  <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Signed up on ${signupDate}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Section -->
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 20px; border-radius: 15px; margin: 25px 0; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🎯 Keep Building!</h3>
            <p style="color: #374151; margin: 0; font-size: 14px; line-height: 1.5;">Every signup brings you closer to launching the future of tender management in India. Your vision is becoming reality! 🚀</p>
          </div>

          <!-- Action Buttons -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 10px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">📊 View Dashboard</a>
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-size: 14px; font-weight: 600; margin: 0 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">💬 Contact User</a>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">This notification was sent automatically from your TenderPost signup form.<br/><strong>TenderPost AI</strong> - Revolutionizing Tender Management in India</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
} 