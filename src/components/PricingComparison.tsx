import { Check, X, Zap, Crown, Building2, TrendingUp } from 'lucide-react';
import { useBranding } from '../hooks/useBranding';

type Feature = {
  name: string;
  description?: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
  highlight?: boolean;
};

const features: Feature[] = [
  {
    name: 'Basic ROI Calculations',
    description: 'Calculate ROI, NPV, and payback period',
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Saved Projections',
    description: 'Save and access your financial models',
    free: '3 projects',
    pro: 'Unlimited',
    enterprise: 'Unlimited',
    highlight: true,
  },
  {
    name: 'Data Visualizations',
    description: 'Interactive charts and graphs',
    free: 'Basic charts',
    pro: 'All chart types',
    enterprise: 'All chart types',
  },
  {
    name: 'Scenario Modeling',
    description: 'Compare multiple financial scenarios',
    free: '1 scenario',
    pro: '5 scenarios',
    enterprise: 'Unlimited',
    highlight: true,
  },
  {
    name: 'Export Options',
    description: 'Download reports and data',
    free: 'CSV only',
    pro: 'CSV, PDF, PNG',
    enterprise: 'All formats + API',
    highlight: true,
  },
  {
    name: 'Custom Branding',
    description: 'Add your company logo and colors',
    free: false,
    pro: true,
    enterprise: true,
    highlight: true,
  },
  {
    name: 'AI-Assisted Scenario Generation',
    description: 'Let AI suggest optimal financial models',
    free: false,
    pro: '10/month',
    enterprise: 'Unlimited',
    highlight: true,
  },
  {
    name: 'Advanced Analytics',
    description: 'IRR, MIRR, sensitivity analysis',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'Collaboration Tools',
    description: 'Share projects with team members',
    free: false,
    pro: '5 team members',
    enterprise: 'Unlimited',
  },
  {
    name: 'Multi-Currency Support',
    description: 'Work with international currencies',
    free: 'USD only',
    pro: '50+ currencies',
    enterprise: '150+ currencies',
  },
  {
    name: 'White-Label Reports',
    description: 'Fully branded export documents',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    name: 'API Access',
    description: 'Integrate with your systems',
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'Automated Email Reports',
    description: 'Schedule recurring financial updates',
    free: false,
    pro: 'Weekly',
    enterprise: 'Custom schedule',
  },
  {
    name: 'Priority Support',
    description: 'Get help when you need it',
    free: 'Community',
    pro: 'Email (24h)',
    enterprise: 'Phone + Email (2h)',
  },
  {
    name: 'Custom Integrations',
    description: 'Connect to your ERP, CRM, etc.',
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'Dedicated Account Manager',
    description: 'Personal onboarding and support',
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'SLA Guarantee',
    description: '99.9% uptime commitment',
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    name: 'Custom Training Sessions',
    description: 'Onboard your entire team',
    free: false,
    pro: false,
    enterprise: true,
  },
];

type PricingTier = {
  name: string;
  price: string;
  period?: string;
  description: string;
  icon: typeof Zap;
  color: string;
  bgColor: string;
  popular?: boolean;
  cta: string;
};

const tiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for individuals and small projects',
    icon: Zap,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    cta: 'Get Started Free',
  },
  {
    name: 'Lift Metric Pro',
    price: '$29',
    period: 'per month',
    description: 'For growing teams and professional analysis',
    icon: Crown,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    popular: true,
    cta: 'Start Pro Trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with advanced needs',
    icon: Building2,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    cta: 'Contact Sales',
  },
];

export default function PricingComparison() {
  const { brandSettings } = useBranding();

  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return (
        <div className="flex justify-center">
          <Check className="w-5 h-5 text-green-600" />
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="flex justify-center">
          <X className="w-5 h-5 text-gray-300" />
        </div>
      );
    }
    return (
      <div className="text-center text-sm font-medium text-gray-700">
        {value}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-10 h-10" style={{ color: brandSettings.primaryColor }} />
            <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our core financial analysis tools.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`relative bg-white rounded-xl shadow-lg border-2 ${
                  tier.popular ? 'border-blue-500 scale-105' : 'border-gray-200'
                } p-8 transition-all duration-300 hover:shadow-2xl`}
              >
                {tier.popular && (
                  <div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-semibold"
                    style={{ backgroundColor: brandSettings.primaryColor }}
                  >
                    Most Popular
                  </div>
                )}

                <div className={`${tier.bgColor} rounded-lg p-4 mb-6`}>
                  <Icon className={`w-8 h-8 ${tier.color} mx-auto mb-2`} />
                  <h3 className="text-2xl font-bold text-gray-900 text-center">
                    {tier.name}
                  </h3>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-gray-600">/{tier.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">{tier.description}</p>
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    tier.popular
                      ? 'text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                  style={
                    tier.popular
                      ? { backgroundColor: brandSettings.primaryColor }
                      : {}
                  }
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white text-center">
              Detailed Feature Comparison
            </h2>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="py-4 px-6 text-left font-semibold text-gray-900 w-2/5">
                    Feature
                  </th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-900 w-1/5">
                    Free
                  </th>
                  <th className="py-4 px-6 text-center font-semibold text-blue-600 w-1/5 bg-blue-50">
                    Lift Metric Pro
                  </th>
                  <th className="py-4 px-6 text-center font-semibold text-purple-600 w-1/5">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      feature.highlight ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-2">
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {feature.name}
                            {feature.highlight && (
                              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          {feature.description && (
                            <div className="text-sm text-gray-600 mt-1">
                              {feature.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{renderValue(feature.free)}</td>
                    <td className="py-4 px-6 bg-blue-50/30">
                      {renderValue(feature.pro)}
                    </td>
                    <td className="py-4 px-6">
                      {renderValue(feature.enterprise)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 ${feature.highlight ? 'bg-yellow-50' : ''}`}
              >
                <div className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  {feature.name}
                  {feature.highlight && (
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                {feature.description && (
                  <div className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-2 font-medium">
                      Free
                    </div>
                    {renderValue(feature.free)}
                  </div>
                  <div>
                    <div className="text-xs text-blue-600 mb-2 font-medium">
                      Pro
                    </div>
                    {renderValue(feature.pro)}
                  </div>
                  <div>
                    <div className="text-xs text-purple-600 mb-2 font-medium">
                      Enterprise
                    </div>
                    {renderValue(feature.enterprise)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I switch plans at any time?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we'll prorate your billing.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial for Pro?
              </h3>
              <p className="text-gray-600">
                Absolutely! Try Lift Metric Pro free for 14 days. No credit card
                required. You'll have full access to all Pro features.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens to my data if I downgrade?
              </h3>
              <p className="text-gray-600">
                Your data is always safe. If you downgrade, you'll keep access to
                your most recent projects up to your plan's limit. All other data
                remains archived and accessible if you upgrade again.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer discounts for annual billing?
              </h3>
              <p className="text-gray-600">
                Yes! Pay annually and get 2 months free (equivalent to ~17% off).
                Enterprise plans have custom billing options.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Financial Analysis?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals making smarter decisions with Lift Metric
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
