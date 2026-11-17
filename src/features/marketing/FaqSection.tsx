'use client';

import { useState } from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { FAQ } from '@/features/marketing/faq';

/** Landing page FAQ accordion. The FAQPage JSON-LD is rendered by HomePage on the server. */
export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-6 text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about government tenders and
            AI-powered tender notifications in India
          </p>
        </div>

        <div className="space-y-4">
          {FAQ.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xs sm:text-lg font-semibold text-gray-900 pr-2 sm:pr-4 leading-tight">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openFaq === index ? (
                    <MinusCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  ) : (
                    <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  )}
                </div>
              </button>
              {openFaq === index && (
                <div className="px-4 sm:px-6 pb-4 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed pt-4 text-sm sm:text-base">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
