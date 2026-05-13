import { Check, X, Zap, TrendingUp, Building2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  features: { text: string; included: boolean }[];
  cta: string;
  popular?: boolean;
  gradient: string;
  limits: {
    calculations: string;
    scenarios: string;
    history: string;
    exports: string;
  };
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for exploring ROI basics',
    icon: <Sparkles className="w-6 h-6" />,
    gradient: 'from-gray-50 to-gray-100',
    limits: {
      calculations: '5 per month',
      scenarios: '1 saved scenario',
      history: '14 days',
      exports: 'PDF only',
    },
    features: [
      { text: 'Basic ROI calculator', included: true },
      { text: 'Compare up to 2 staffing options', included: true },
      { text: 'Simple cost breakdown', included: true },
      { text: 'Basic ROI calendar', included: true },
      { text: 'PDF export', included: true },
      { text: 'Email support', included: true },
      { text: 'Advanced calculations', included: false },
      { text: 'Unlimited scenarios', included: false },
      { text: 'Historical trends', included: false },
      { text: 'Custom templates', included: false },
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Basic',
    price: '$29',
    description: 'For individuals making regular decisions',
    icon: <TrendingUp className="w-6 h-6" />,
    gradient: 'from-blue-50 to-indigo-100',
    popular: true,
    limits: {
      calculations: '50 per month',
      scenarios: '10 saved scenarios',
      history: '90 days',
      exports: 'PDF, Excel, CSV',
    },
    features: [
      { text: 'Everything in Free, plus:', included: true },
      { text: '50 calculations per month', included: true },
      { text: '10 saved scenarios', included: true },
      { text: 'Compare up to 4 staffing options', included: true },
      { text: 'Advanced ROI calendar', included: true },
      { text: 'Sensitivity analysis', included: true },
      { text: 'Excel & CSV export', included: true },
      { text: '90 day history', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Team collaboration', included: false },
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Pro',
    price: '$99',
    description: 'For teams and power users',
    icon: <Building2 className="w-6 h-6" />,
    gradient: 'from-purple-50 to-pink-100',
    limits: {
      calculations: 'Unlimited',
      scenarios: 'Unlimited saved',
      history: 'Unlimited',
      exports: 'All formats + API',
    },
    features: [
      { text: 'Everything in Basic, plus:', included: true },
      { text: 'Unlimited calculations', included: true },
      { text: 'Unlimited saved scenarios', included: true },
      { text: 'Compare unlimited staffing options', included: true },
      { text: 'Advanced scenario comparison matrix', included: true },
      { text: 'Custom cost & benefit items', included: true },
      { text: 'Historical trend analysis', included: true },
      { text: 'Custom calculation templates', included: true },
      { text: 'Team collaboration (up to 5 users)', included: true },
      { text: 'API access for integrations', included: true },
    ],
    cta: 'Start Free Trial',
  },
];

export function PricingSection() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Start free and scale as you grow. All plans include core ROI calculation features.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl ${
              tier.popular
                ? 'border-blue-500 transform scale-105'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </span>
              </div>
            )}

            <div className={`p-8 bg-gradient-to-br ${tier.gradient} rounded-t-2xl`}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    tier.popular
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
              </div>
              <p className="text-gray-600 mb-6">{tier.description}</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                {tier.price !== '$0' && (
                  <span className="text-gray-600">/month</span>
                )}
              </div>

              {/* Usage Limits */}
              <div className="space-y-2 mb-6 bg-white/50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Calculations:</span>
                  <span className="font-semibold text-gray-900">
                    {tier.limits.calculations}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Saved Scenarios:</span>
                  <span className="font-semibold text-gray-900">
                    {tier.limits.scenarios}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">History:</span>
                  <span className="font-semibold text-gray-900">
                    {tier.limits.history}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Exports:</span>
                  <span className="font-semibold text-gray-900">
                    {tier.limits.exports}
                  </span>
                </div>
              </div>

              <Button
                className={`w-full py-3 font-semibold transition-all duration-200 ${
                  tier.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 hover:border-blue-500'
                }`}
              >
                {tier.cta}
              </Button>
            </div>

            {/* Features List */}
            <div className="p-8">
              <ul className="space-y-3">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        feature.included ? 'text-gray-900' : 'text-gray-400'
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-20 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Detailed Feature Comparison
        </h3>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Feature
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Free
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Basic
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  Monthly Calculations
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">5</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">50</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  Unlimited
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Saved Scenarios</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">1</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">10</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  Unlimited
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">History Retention</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">14 days</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">90 days</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  Unlimited
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  Staffing Options Compared
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">2</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">4</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  Unlimited
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Basic ROI Calculator</td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">ROI Calendar</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">Basic</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">Advanced</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">Advanced</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">
                  Sensitivity Analysis
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  Historical Trend Analysis
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Custom Templates</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">Export Formats</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  PDF
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  PDF, Excel, CSV
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  All + API
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Team Collaboration</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">1 user</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">1 user</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  Up to 5 users
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">API Access</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Support</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  Email
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  Priority Email
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">
                  Priority + Phone
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              What happens when I reach my calculation limit?
            </h4>
            <p className="text-gray-600">
              On the Free plan, you can perform 5 calculations per month. Once you reach
              this limit, you'll be prompted to upgrade to Basic (50/month) or Pro
              (unlimited). Your saved scenario remains accessible regardless of your
              calculation limit.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Can I try paid features before upgrading?
            </h4>
            <p className="text-gray-600">
              Yes! We offer a 14-day free trial of both Basic and Pro plans with full
              access to all features. No credit card required to start your trial.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              What's the difference between Basic and Pro ROI Calendar?
            </h4>
            <p className="text-gray-600">
              The Basic ROI Calendar shows simple timelines and milestones. The Advanced
              ROI Calendar in Basic and Pro plans includes interactive timeline views,
              milestone tracking, custom date ranges, and integration with your saved
              scenarios for comprehensive planning.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              How does scenario storage work?
            </h4>
            <p className="text-gray-600">
              Free users can save 1 scenario with 14 days of history. Basic users get 10
              scenarios with 90 days of history. Pro users have unlimited scenarios with
              unlimited history retention, perfect for tracking long-term trends and
              comparing past decisions.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-12 text-center">
        <Zap className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
        <h3 className="text-3xl font-bold text-white mb-4">
          Ready to Make Smarter Staffing Decisions?
        </h3>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join hundreds of teams using Lift Metric to optimize their implementation costs
          and maximize ROI.
        </p>
        <div className="flex gap-4 justify-center">
          <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Start Free Trial
          </Button>
          <Button className="bg-blue-700 text-white hover:bg-blue-800 px-8 py-3 font-semibold border-2 border-white/30 transform hover:scale-105 transition-all duration-200">
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
