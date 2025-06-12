import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Zap, Download, Cloud, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ShippingAndDeliveryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/uptenderlogo.png" 
                alt="Uptender AI Logo" 
                className="h-10 w-10 rounded-xl object-contain"
              />
              <span className="text-2xl font-bold text-gray-900">Uptender AI</span>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Delivery</h1>
          <p className="text-lg text-gray-600">
            Instant access to our AI-powered tender management platform.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Digital Service Delivery
              </h2>
              <p className="text-green-700">
                Uptender AI is a cloud-based software service. There are no physical products to ship. 
                All services are delivered digitally through instant account activation.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-blue-600" />
                Instant Access
              </h2>
              <p className="text-gray-700 mb-4">
                Upon successful payment verification, you'll receive immediate access to your Uptender AI account:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Immediate Activation:</strong> Account activated within seconds of payment confirmation</li>
                <li><strong>Login Credentials:</strong> Instant email with login instructions and temporary password</li>
                <li><strong>Dashboard Access:</strong> Full access to your personalized AI dashboard</li>
                <li><strong>Feature Availability:</strong> All subscribed features available immediately</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Cloud className="h-6 w-6 mr-2 text-blue-600" />
                Cloud-Based Access
              </h2>
              <p className="text-gray-700 mb-4">
                Our platform is delivered through secure cloud infrastructure:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Web Application</h3>
                  <p className="text-blue-800 text-sm">Access via any modern web browser</p>
                  <p className="text-blue-700 text-sm mt-2">No software installation required</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Mobile Responsive</h3>
                  <p className="text-blue-800 text-sm">Optimized for mobile devices</p>
                  <p className="text-blue-700 text-sm mt-2">Access anywhere, anytime</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Setup Process</h2>
              <p className="text-gray-700 mb-4">
                Here's what happens after your payment is processed:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Payment Verification</h4>
                    <p className="text-gray-700">Automatic verification through secure payment gateway (usually instant)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Account Creation</h4>
                    <p className="text-gray-700">Automated account setup with your chosen subscription plan</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Welcome Email</h4>
                    <p className="text-gray-700">Comprehensive onboarding email with login details and quick start guide</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Platform Access</h4>
                    <p className="text-gray-700">Immediate access to all features included in your subscription</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Download className="h-6 w-6 mr-2 text-blue-600" />
                Data and Resources
              </h2>
              <p className="text-gray-700 mb-4">
                Additional resources available for download:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>User Manual:</strong> Comprehensive PDF guide available in your dashboard</li>
                <li><strong>Template Library:</strong> Downloadable tender templates and documents</li>
                <li><strong>API Documentation:</strong> For Enterprise users requiring integrations</li>
                <li><strong>Training Materials:</strong> Video tutorials and best practice guides</li>
                <li><strong>Mobile App:</strong> Optional mobile application for iOS and Android</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-green-900 mb-2">99.9% Uptime</h3>
                  <p className="text-green-700 text-sm">Industry-leading reliability</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">24/7 Access</h3>
                  <p className="text-blue-700 text-sm">Available around the clock</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-purple-900 mb-2">Global CDN</h3>
                  <p className="text-purple-700 text-sm">Fast loading worldwide</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Requirements</h2>
              <p className="text-gray-700 mb-4">
                Minimum requirements to access Uptender AI services:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Web Browser</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Chrome 90+ (Recommended)</li>
                    <li>• Firefox 88+</li>
                    <li>• Safari 14+</li>
                    <li>• Edge 90+</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Internet Connection</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Minimum: 1 Mbps</li>
                    <li>• Recommended: 5+ Mbps</li>
                    <li>• Stable connection required</li>
                    <li>• HTTPS support essential</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Support and Onboarding</h2>
              <p className="text-gray-700 mb-4">
                We ensure smooth onboarding for all new users:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Welcome Call:</strong> Optional onboarding call for Enterprise customers</li>
                <li><strong>Live Chat Support:</strong> Instant help during business hours</li>
                <li><strong>Video Tutorials:</strong> Step-by-step guidance for key features</li>
                <li><strong>Knowledge Base:</strong> Comprehensive self-help documentation</li>
                <li><strong>Community Forum:</strong> Connect with other users and experts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Interruptions</h2>
              <p className="text-gray-700 mb-4">
                In the rare event of service interruptions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Advance Notice:</strong> Planned maintenance announced 48 hours in advance</li>
                <li><strong>Status Page:</strong> Real-time status updates at status.uptenderai.com</li>
                <li><strong>Email Notifications:</strong> Automatic alerts for any service issues</li>
                <li><strong>Compensation:</strong> Service credits for unplanned outages exceeding 1 hour</li>
              </ul>
            </section>

            <section className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Assistance?</h2>
              <p className="text-gray-700 mb-4">
                For technical support or questions about service delivery:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Technical Support:</strong> support@uptenderai.com</p>
                <p><strong>Onboarding Help:</strong> onboarding@uptenderai.com</p>
                <p><strong>Phone Support:</strong> +91-XXXX-XXXXXX</p>
                <p><strong>Live Chat:</strong> Available 24/7 in your dashboard</p>
                <p><strong>Status Page:</strong> status.uptenderai.com</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
} 