import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, RotateCcw, CreditCard, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';

export default function CancellationAndRefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <Header variant="simple" showBackButton={true} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <RotateCcw className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cancellation and Refund Policy</h1>
          <p className="text-lg text-gray-600">
            Clear and transparent policies for cancellations and refunds.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-blue-600" />
                Subscription Cancellation
              </h2>
              <p className="text-gray-700 mb-4">
                You can cancel your Uptender AI subscription at any time through your account dashboard 
                or by contacting our customer support team.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Immediate Effect:</strong> Cancellations take effect at the end of your current billing period</li>
                <li><strong>Data Access:</strong> You'll retain access to your data until the end of your paid period</li>
                <li><strong>No Penalty:</strong> No cancellation fees or penalties apply</li>
                <li><strong>Data Export:</strong> You can export your data before the subscription ends</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
                Refund Eligibility
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">7-Day Money-Back Guarantee</h3>
                <p className="text-green-700">
                  We offer a full refund if you cancel within 7 days of your initial subscription, 
                  no questions asked.
                </p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Conditions:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>New Customers:</strong> 7-day full refund for first-time subscribers</li>
                <li><strong>Technical Issues:</strong> Refunds for service unavailability exceeding 24 hours</li>
                <li><strong>Billing Errors:</strong> Full refund for incorrect charges</li>
                <li><strong>Duplicate Payments:</strong> Immediate refund for accidental double payments</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Process</h2>
              <p className="text-gray-700 mb-4">
                To request a refund, please follow these steps:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Contact Support</h4>
                    <p className="text-gray-700">Email us at refunds@uptenderai.com with your request</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Provide Information</h4>
                    <p className="text-gray-700">Include your account email, subscription details, and reason for refund</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Review Process</h4>
                    <p className="text-gray-700">We'll review your request within 2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Refund Processing</h4>
                    <p className="text-gray-700">Approved refunds are processed within 5-7 business days</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Timeframes</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Credit Card Refunds</h3>
                  <p className="text-blue-800 text-sm">3-5 business days</p>
                  <p className="text-blue-700 text-sm mt-2">Refunds appear on your next statement</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">UPI/Net Banking Refunds</h3>
                  <p className="text-blue-800 text-sm">2-3 business days</p>
                  <p className="text-blue-700 text-sm mt-2">Directly credited to your account</p>
                </div>
              </div>
            </section>

            <section className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="h-6 w-6 mr-2 text-yellow-600" />
                Non-Refundable Items
              </h2>
              <p className="text-gray-700 mb-4">
                The following items are not eligible for refunds:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Used Services:</strong> Subscriptions used for more than 7 days (except for technical issues)</li>
                <li><strong>Custom Development:</strong> Any custom development work or integrations</li>
                <li><strong>Training Services:</strong> Completed training sessions or consultations</li>
                <li><strong>Third-party Costs:</strong> Costs incurred with third-party services</li>
                <li><strong>Promotional Offers:</strong> Heavily discounted or promotional subscriptions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Partial Refunds</h2>
              <p className="text-gray-700 mb-4">
                In certain circumstances, we may offer partial refunds:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Pro-rated Refunds:</strong> For downgrades within the billing period</li>
                <li><strong>Service Interruptions:</strong> Proportional refunds for extended outages</li>
                <li><strong>Feature Unavailability:</strong> Partial refunds if advertised features are not available</li>
                <li><strong>Data Migration Issues:</strong> Refunds for data loss or migration problems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                If you&apos;re not satisfied with our refund decision:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Escalation:</strong> Request escalation to our senior management</li>
                <li><strong>Mediation:</strong> We're open to third-party mediation for disputes</li>
                <li><strong>Chargeback Rights:</strong> You retain the right to dispute charges with your bank</li>
                <li><strong>Customer Advocacy:</strong> We prioritize customer satisfaction in all decisions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Reactivation</h2>
              <p className="text-gray-700 mb-4">
                After cancellation, you can reactivate your account:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Data Retention:</strong> We keep your data for 30 days after cancellation</li>
                <li><strong>Easy Reactivation:</strong> Simple one-click reactivation during the retention period</li>
                <li><strong>New Subscription:</strong> Fresh start with a new subscription after data deletion</li>
                <li><strong>Migration Assistance:</strong> Help with data migration if needed</li>
              </ul>
            </section>

            <section className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-700 mb-4">
                For cancellations, refunds, or any questions about this policy, contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> refunds@uptenderai.com</p>
                <p><strong>Support Email:</strong> support@uptenderai.com</p>
                <p><strong>Phone:</strong> +91-XXXX-XXXXXX</p>
                <p><strong>Support Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM IST</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
} 