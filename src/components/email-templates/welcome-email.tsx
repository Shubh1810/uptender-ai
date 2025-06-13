import React from 'react';

interface WelcomeEmailProps {
  email: string;
}

export function WelcomeEmailTemplate({ email }: WelcomeEmailProps) {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0',
      backgroundColor: '#0f172a'
    }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #db2777 100%)',
        padding: '50px 30px',
        borderRadius: '20px 20px 0 0',
        textAlign: 'center' as const,
        position: 'relative' as const,
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute' as const,
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
        
        <div style={{ position: 'relative' as const, zIndex: 10 }}>
          {/* Logo/Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            <span style={{ fontSize: '32px' }}>🚀</span>
          </div>
          
          <h1 style={{
            color: 'white',
            margin: '0 0 15px 0',
            fontSize: '32px',
            fontWeight: '800',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            letterSpacing: '-0.5px'
          }}>
            Welcome to TenderPost!
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            margin: '0',
            fontSize: '18px',
            fontWeight: '400'
          }}>
            You're now part of the future of tender management 🎉
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        padding: '50px 30px',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        
        {/* Welcome Message */}
        <div style={{
          textAlign: 'center' as const,
          marginBottom: '40px'
        }}>
          <h2 style={{
            color: '#1f2937',
            margin: '0 0 20px 0',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            Thanks for joining our exclusive waitlist! 🎊
          </h2>
          <p style={{
            color: '#4b5563',
            margin: '0',
            fontSize: '18px',
            lineHeight: '1.7',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            We're thrilled to have you on board as we prepare to launch{' '}
            <strong style={{ color: '#1e40af' }}>TenderPost AI</strong> - 
            the revolutionary platform that will transform tender management in India.
          </p>
        </div>

        {/* Features Preview */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
          padding: '30px',
          borderRadius: '20px',
          margin: '30px 0',
          border: '2px solid #dbeafe'
        }}>
          <h3 style={{
            color: '#1e40af',
            margin: '0 0 25px 0',
            fontSize: '22px',
            fontWeight: '700',
            textAlign: 'center' as const
          }}>
            🎯 What's Coming Your Way:
          </h3>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              { icon: '🤖', title: 'AI-Powered Analysis', desc: 'Smart tender recommendations and bid optimization' },
              { icon: '📱', title: 'Multi-Channel Alerts', desc: 'WhatsApp, Email, SMS notifications in real-time' },
              { icon: '📊', title: 'Advanced Analytics', desc: 'Market insights and competitor analysis' },
              { icon: '🎯', title: 'Smart Filtering', desc: 'Only relevant opportunities for your business' },
              { icon: '💼', title: 'Complete Coverage', desc: 'Government, healthcare, and private tenders' }
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.1)'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  fontSize: '20px'
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h4 style={{
                    margin: '0 0 5px 0',
                    color: '#1f2937',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {feature.title}
                  </h4>
                  <p style={{
                    margin: '0',
                    color: '#6b7280',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Early Access Bonus */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '30px',
          borderRadius: '20px',
          margin: '30px 0',
          textAlign: 'center' as const,
          color: 'white',
          position: 'relative' as const,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute' as const,
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}></div>
          <div style={{ position: 'relative' as const, zIndex: 10 }}>
            <h3 style={{
              margin: '0 0 15px 0',
              fontSize: '24px',
              fontWeight: '700'
            }}>
              🎁 Early Access Bonus
            </h3>
            <p style={{
              margin: '0',
              fontSize: '18px',
              fontWeight: '500',
              opacity: 0.95
            }}>
              Special launch pricing just for you!<br/>
              <span style={{ fontSize: '16px', opacity: 0.8 }}>
                Save up to 50% when we launch
              </span>
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          padding: '25px',
          borderRadius: '15px',
          margin: '30px 0',
          textAlign: 'center' as const
        }}>
          <h3 style={{
            color: '#92400e',
            margin: '0 0 15px 0',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            ⏰ Coming Soon
          </h3>
          <p style={{
            color: '#78350f',
            margin: '0',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            We're putting the finishing touches on TenderPost AI.<br/>
            Expected launch: <strong>Next few weeks!</strong>
          </p>
        </div>

        {/* Social Links */}
        <div style={{
          textAlign: 'center' as const,
          margin: '40px 0'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            margin: '0 0 20px 0'
          }}>
            Stay connected and follow our journey:
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' as const }}>
            <a href="#" style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              📧 Get Updates
            </a>
            <a href="#" style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}>
              💬 Join Community
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '2px solid #e5e7eb',
          paddingTop: '30px',
          textAlign: 'center' as const
        }}>
          <p style={{
            color: '#374151',
            fontSize: '16px',
            margin: '0 0 10px 0',
            fontWeight: '500'
          }}>
            Thanks for believing in the future of tender management! 🙏
          </p>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            margin: '0',
            lineHeight: '1.5'
          }}>
            <strong style={{ color: '#1f2937' }}>The TenderPost Team</strong><br/>
            Revolutionizing Tender Management in India 🇮🇳
          </p>
        </div>
      </div>
    </div>
  );
}

// Export as HTML string for email sending
export function getWelcomeEmailHTML(email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to TenderPost!</title>
      <style>
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @media only screen and (max-width: 600px) {
          .container { padding: 15px !important; }
          .content { padding: 25px !important; }
          .feature-grid { grid-template-columns: 1fr !important; }
          .social-links { flex-direction: column !important; }
          .social-links a { margin: 5px 0 !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #0f172a;">
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #0f172a;">
        
        <!-- Hero Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #db2777 100%); padding: 50px 30px; border-radius: 20px 20px 0 0; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 30px 30px; animation: float 20s ease-in-out infinite;"></div>
          <div style="position: relative; z-index: 10;">
            <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3);">
              <span style="font-size: 32px;">🚀</span>
            </div>
            <h1 style="color: white; margin: 0 0 15px 0; font-size: 32px; font-weight: 800; text-shadow: 0 4px 8px rgba(0,0,0,0.3); letter-spacing: -0.5px;">Welcome to TenderPost!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 18px; font-weight: 400;">You're now part of the future of tender management 🎉</p>
          </div>
        </div>

        <!-- Main Content -->
        <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); padding: 50px 30px; border-radius: 0 0 20px 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          
          <!-- Welcome Message -->
          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 28px; font-weight: 700;">Thanks for joining our exclusive waitlist! 🎊</h2>
            <p style="color: #4b5563; margin: 0; font-size: 18px; line-height: 1.7; max-width: 500px; margin-left: auto; margin-right: auto;">We're thrilled to have you on board as we prepare to launch <strong style="color: #1e40af;">TenderPost AI</strong> - the revolutionary platform that will transform tender management in India.</p>
          </div>

          <!-- Features Preview -->
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); padding: 30px; border-radius: 20px; margin: 30px 0; border: 2px solid #dbeafe;">
            <h3 style="color: #1e40af; margin: 0 0 25px 0; font-size: 22px; font-weight: 700; text-align: center;">🎯 What's Coming Your Way:</h3>
            
            <div style="display: grid; gap: 20px;" class="feature-grid">
              <div style="display: flex; align-items: center; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 20px;">🤖</div>
                <div>
                  <h4 style="margin: 0 0 5px 0; color: #1f2937; font-size: 16px; font-weight: 600;">AI-Powered Analysis</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">Smart tender recommendations and bid optimization</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: center; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 20px;">📱</div>
                <div>
                  <h4 style="margin: 0 0 5px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Multi-Channel Alerts</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">WhatsApp, Email, SMS notifications in real-time</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: center; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 20px;">📊</div>
                <div>
                  <h4 style="margin: 0 0 5px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Advanced Analytics</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">Market insights and competitor analysis</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: center; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 20px;">🎯</div>
                <div>
                  <h4 style="margin: 0 0 5px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Smart Filtering</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">Only relevant opportunities for your business</p>
                </div>
              </div>
              
              <div style="display: flex; align-items: center; padding: 15px; background: rgba(255,255,255,0.7); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.1);">
                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 20px;">💼</div>
                <div>
                  <h4 style="margin: 0 0 5px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Complete Coverage</h4>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">Government, healthcare, and private tenders</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Early Access Bonus -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 20px; margin: 30px 0; text-align: center; color: white; position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); opacity: 0.3;"></div>
            <div style="position: relative; z-index: 10;">
              <h3 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 700;">🎁 Early Access Bonus</h3>
              <p style="margin: 0; font-size: 18px; font-weight: 500; opacity: 0.95;">Special launch pricing just for you!<br/><span style="font-size: 16px; opacity: 0.8;">Save up to 50% when we launch</span></p>
            </div>
          </div>

          <!-- Timeline -->
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 25px; border-radius: 15px; margin: 30px 0; text-align: center;">
            <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">⏰ Coming Soon</h3>
            <p style="color: #78350f; margin: 0; font-size: 16px; font-weight: 500;">We're putting the finishing touches on TenderPost AI.<br/>Expected launch: <strong>Next few weeks!</strong></p>
          </div>

          <!-- Social Links -->
          <div style="text-align: center; margin: 40px 0;">
            <p style="color: #6b7280; font-size: 16px; margin: 0 0 20px 0;">Stay connected and follow our journey:</p>
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;" class="social-links">
              <a href="#" style="display: inline-flex; align-items: center; padding: 10px 20px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; border-radius: 25px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">📧 Get Updates</a>
              <a href="#" style="display: inline-flex; align-items: center; padding: 10px 20px; background: linear-gradient(135deg, #10b981 0%, #047857 100%); color: white; text-decoration: none; border-radius: 25px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">💬 Join Community</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 30px; text-align: center;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 10px 0; font-weight: 500;">Thanks for believing in the future of tender management! 🙏</p>
            <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.5;"><strong style="color: #1f2937;">The TenderPost Team</strong><br/>Revolutionizing Tender Management in India 🇮🇳</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
} 