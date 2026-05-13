import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { pricingFAQs, type FAQItem } from '../data/pricingFAQ';

export default function PricingFAQ() {
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const categories = ['general', 'billing', 'features', 'account', 'cancellation'] as const;
  const categoryLabels: Record<typeof categories[number], string> = {
    general: 'General',
    billing: 'Billing & Payment',
    features: 'Features & Plans',
    account: 'Account',
    cancellation: 'Cancellation & Support',
  };

  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about Lift Metric pricing and plans
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {pricingFAQs.map((faq: FAQItem) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow duration-300"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start gap-3 text-left flex-1">
                  {/* Category Badge */}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-0.5 flex-shrink-0">
                    {categoryLabels[faq.category]}
                  </span>
                  {/* Question Text */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                {/* Chevron Icon */}
                <ChevronDown
                  size={24}
                  className={`flex-shrink-0 ml-3 text-gray-500 transition-transform duration-300 ${
                    expandedId === faq.id ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer - Animated Expansion */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedId === faq.id ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-200 hover:bg-blue-50 transition-all duration-200">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
