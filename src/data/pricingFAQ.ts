export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'billing' | 'features' | 'account' | 'cancellation' | 'general';
}

export const pricingFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. All payments are processed securely through industry-leading payment providers with full PCI compliance.',
  },
  {
    id: 'faq-2',
    category: 'features',
    question: 'Can I upgrade or downgrade my plan anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll automatically prorate your billing. If you upgrade mid-month, you\'ll only pay for the difference. If you downgrade, any overpayment will be credited to your next billing cycle.',
  },
  {
    id: 'faq-3',
    category: 'cancellation',
    question: 'What\'s your cancellation policy?',
    answer: 'You can cancel your subscription anytime with no cancellation fees or long-term contracts. Your access continues through the end of your current billing period. We\'ll send you a reminder email 7 days before renewal, and you can reactivate your account anytime without losing your saved calculations and scenarios.',
  },
  {
    id: 'faq-4',
    category: 'features',
    question: 'What features are included in the Free tier?',
    answer: 'The Free tier includes up to 5 calculations per month, 2 saved scenarios, basic PDF exports, and 30 days of history retention. It\'s perfect for individuals exploring Lift Metric\'s capabilities. You can upgrade anytime to unlock unlimited calculations and advanced features.',
  },
  {
    id: 'faq-5',
    category: 'billing',
    question: 'Do you offer annual billing discounts?',
    answer: 'Yes! We offer 20% off when you choose annual billing instead of monthly. For example, Pro is $29/month ($348/year) or $279/year with annual billing. Annual plans also include priority support and an extra feature: custom calculation templates at no extra cost.',
  },
  {
    id: 'faq-6',
    category: 'features',
    question: 'What\'s the difference between Pro and Enterprise tiers?',
    answer: 'Pro tier ($29/month) is perfect for power users with unlimited calculations, team collaboration (up to 3 members), API access, and white-label reports. Enterprise ($99/month or custom pricing) includes unlimited team members, dedicated account management, custom integrations, SLA guarantees, and priority support. Contact our sales team for a demo.',
  },
  {
    id: 'faq-7',
    category: 'account',
    question: 'Do you offer a free trial for paid plans?',
    answer: 'Absolutely! All paid plans include a 14-day free trial with full access to all features. No credit card required to start. After the trial ends, your plan will either convert to a paid subscription (if you provided payment info) or revert to the Free tier automatically.',
  },
  {
    id: 'faq-8',
    category: 'general',
    question: 'How is Lift Metric data secured and backed up?',
    answer: 'Your data is encrypted in transit and at rest using industry-standard SSL/TLS protocols. We perform automatic daily backups stored in geographically distributed secure data centers. All data is compliant with GDPR, CCPA, and SOC 2 Type II standards. We never sell or share your data with third parties.',
  },
  {
    id: 'faq-9',
    category: 'features',
    question: 'Can I export my data if I cancel?',
    answer: 'Yes! Before canceling, you can export all your calculations, scenarios, and historical data in multiple formats: CSV, Excel, PDF, or JSON. You\'ll have 30 days after cancellation to download your data. Enterprise customers can use our API for automated data exports anytime.',
  },
  {
    id: 'faq-10',
    category: 'general',
    question: 'What customer support is included with my plan?',
    answer: 'Free tier users get access to our knowledge base and community forums. Basic tier includes email support (24-48 hour response). Pro tier includes priority email support (2-4 hours) and live chat during business hours. Enterprise includes 24/7 phone support, a dedicated account manager, and custom SLA guarantees.',
  },
];
