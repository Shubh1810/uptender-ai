import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileText, AlertTriangle, Scale, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsAndConditionsPage() {
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
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-600">
            Please read these terms carefully before using our services.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using Uptender AI services, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not 
                use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                2. Use License
              </h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to temporarily access Uptender AI services for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained in the service</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                When you create an account with us, you must provide information that is accurate, 
                complete, and current at all times. You are responsible for safeguarding the password 
                and for all activities that occur under your account.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>You must be at least 18 years old to use our services</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                All payments are processed securely through our payment partners. By making a payment, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide accurate and complete billing information</li>
                <li>Pay all charges incurred by you or any users of your account</li>
                <li>Pay applicable taxes related to your use of the services</li>
                <li>Be responsible for all charges incurred on your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Service Availability</h2>
              <p className="text-gray-700 mb-4">
                We strive to maintain high service availability but cannot guarantee uninterrupted access:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>We aim for 99.9% uptime but do not guarantee continuous availability</li>
                <li>Scheduled maintenance may temporarily interrupt service</li>
                <li>We are not liable for service interruptions beyond our control</li>
                <li>We may modify or discontinue services with reasonable notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The service and its original content, features, and functionality are and will remain 
                the exclusive property of Uptender AI and its licensors:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>All content is protected by copyright, trademark, and other laws</li>
                <li>You may not use our trademarks without written permission</li>
                <li>User-generated content remains owned by the user</li>
                <li>You grant us a license to use your content to provide services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Uses</h2>
              <p className="text-gray-700 mb-4">
                You may not use our service for any unlawful or prohibited activities:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Violating any applicable laws or regulations</li>
                <li>Transmitting harmful or malicious code</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Interfering with or disrupting the service</li>
                <li>Using the service for fraudulent purposes</li>
                <li>Impersonating others or providing false information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data and Privacy</h2>
              <p className="text-gray-700">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and 
                protect your information when you use our service. By using our service, you agree to 
                the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-yellow-600" />
                9. Disclaimer of Warranties
              </h2>
              <p className="text-gray-700 mb-4">
                The information on this service is provided on an 'as is' basis. To the fullest extent 
                permitted by law, we exclude:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>All representations, warranties, and conditions relating to this service</li>
                <li>All liability for any damages arising out of or in connection with your use</li>
                <li>Any guarantees about the accuracy, reliability, or completeness of information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Scale className="h-6 w-6 mr-2 text-blue-600" />
                10. Limitation of Liability
              </h2>
              <p className="text-gray-700">
                In no event shall Uptender AI, nor its directors, employees, partners, agents, suppliers, 
                or affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
              <p className="text-gray-700">
                You agree to defend, indemnify, and hold harmless Uptender AI and its licensee and 
                licensors, and their employees, contractors, agents, officers and directors, from and 
                against any and all claims, damages, obligations, losses, liabilities, costs or debt, 
                and expenses (including but not limited to attorney's fees).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and bar access to the service immediately, 
                without prior notice or liability, under our sole discretion, for any reason whatsoever 
                and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="text-gray-700">
                If you wish to terminate your account, you may simply discontinue using the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be interpreted and governed by the laws of India. Any disputes 
                relating to these terms shall be subject to the exclusive jurisdiction of the courts 
                of [Your City], India.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will provide at least 30 days notice prior to any new terms 
                taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> legal@uptenderai.com</p>
                <p><strong>Address:</strong> Uptender AI Technologies Pvt. Ltd., India</p>
                <p><strong>Phone:</strong> +91-XXXX-XXXXXX</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
} 