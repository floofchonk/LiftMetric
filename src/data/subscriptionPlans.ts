// Easy-to-edit subscription plan configuration
// Update pricing, features, and descriptions here

export type PlanTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  price: number;
  billingPeriod: 'month' | 'year';
  description: string;
  features: string[];
  highlight?: boolean;
  ctaText: string;
  ctaSecondaryText?: string;
  ctaVariant: 'primary' | 'secondary';
  ctaIcon?: string;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingPeriod: 'month',
    description: 'Perfect for trying out Lift Metric with core features',
    features: [
      '5 calculations per month',
      'Basic ROI calculator',
      '2 saved scenarios',
      '14-day history',
      'Email support',
    ],
    ctaText: 'Get Started Free',
    ctaSecondaryText: 'No credit card required',
    ctaVariant: 'secondary',
    ctaIcon: '→',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9,
    billingPeriod: 'month',
    description: 'Perfect for individuals and small projects getting started with ROI calculations',
    features: [
      '10 calculations per month',
      'Basic ROI calculator',
      '5 saved scenarios',
      '30-day history',
      'PDF exports',
      'Email support',
    ],
    ctaText: 'Start Free Trial',
    ctaSecondaryText: 'First 14 days free',
    ctaVariant: 'secondary',
    ctaIcon: '→',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    billingPeriod: 'month',
    description: 'Advanced features for professionals who need powerful analysis and insights',
    features: [
      'Unlimited calculations',
      'Advanced calculator & sensitivity analysis',
      'Unlimited saved scenarios',
      '1-year history',
      'All export formats (PDF, Excel, CSV)',
      'Scenario comparison',
      'Historical trend tracking',
      'Priority email support',
      'API access (100 calls/day)',
    ],
    highlight: true,
    ctaText: 'Subscribe Now',
    ctaSecondaryText: '14-day free trial',
    ctaVariant: 'primary',
    ctaIcon: '✓',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    billingPeriod: 'month',
    description: 'Complete solution for teams and organizations with advanced needs',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Unlimited history & storage',
      'Custom calculation templates',
      'White-label reports',
      'Unlimited API access',
      'Team collaboration tools',
      'Dedicated account manager',
      'Priority phone & chat support',
      'SLA guarantee',
    ],
    ctaText: 'Contact Sales Team',
    ctaSecondaryText: 'Schedule a demo call',
    ctaVariant: 'secondary',
    ctaIcon: '→',
  },
];

// Helper function to get plan by ID
export const getPlanById = (id: PlanTier): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.id === id);
};

// Helper function to format price
export const formatPrice = (plan: SubscriptionPlan): string => {
  return `$${plan.price}/${plan.billingPeriod}`;
};
