import { Check, Zap, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon: React.ReactNode;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Lift Metric and small projects",
    icon: <Zap className="w-6 h-6 text-blue-600" />,
    features: [
      "Up to 3 saved scenarios",
      "Basic ROI calculations",
      "Export to PDF & CSV",
      "Standard staffing models",
      "Email support",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Professional",
    price: "$49",
    period: "per month",
    description: "For teams making data-driven staffing decisions",
    icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
    popular: true,
    features: [
      "Unlimited saved scenarios",
      "Advanced analytics & charts",
      "Scenario comparison (up to 5)",
      "Break-even analysis",
      "Custom cost & benefit items",
      "Priority email support",
      "Downloadable reports",
      "Scenario ratings & feedback",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "per month",
    description: "Advanced features for organizations with complex needs",
    icon: <Users className="w-6 h-6 text-green-600" />,
    features: [
      "Everything in Professional",
      "Unlimited scenario comparisons",
      "Team collaboration features",
      "Custom branding on exports",
      "API access",
      "Dedicated account manager",
      "Phone & video support",
      "Training sessions",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
            Transparent Pricing
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose the Perfect Plan for Your Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make smarter staffing decisions with data-driven ROI analysis. Start free, upgrade when you need more.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative transition-all duration-300 hover:shadow-2xl ${
                tier.popular
                  ? "border-purple-500 border-2 shadow-xl scale-105"
                  : "hover:scale-105"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-4 py-1 text-sm">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">{tier.icon}</div>
                <CardTitle className="text-2xl font-bold mb-2">{tier.name}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  {tier.description}
                </CardDescription>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-600">/ {tier.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full py-6 text-lg font-semibold transition-all duration-200 ${
                    tier.popular
                      ? "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-purple-50">Professional</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-700">Saved Scenarios</td>
                  <td className="py-4 px-4 text-center text-gray-600">Up to 3</td>
                  <td className="py-4 px-4 text-center bg-purple-50 font-semibold">Unlimited</td>
                  <td className="py-4 px-4 text-center font-semibold">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-700">Scenario Comparisons</td>
                  <td className="py-4 px-4 text-center text-gray-600">2 at a time</td>
                  <td className="py-4 px-4 text-center bg-purple-50 font-semibold">Up to 5</td>
                  <td className="py-4 px-4 text-center font-semibold">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-700">Advanced Analytics</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center bg-purple-50"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-700">Export Reports</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center bg-purple-50"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-700">Team Collaboration</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center bg-purple-50 text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 text-gray-700">API Access</td>
                  <td className="py-4 px-4 text-center text-gray-400">—</td>
                  <td className="py-4 px-4 text-center bg-purple-50 text-gray-400">—</td>
                  <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-700">Support</td>
                  <td className="py-4 px-4 text-center text-gray-600">Email</td>
                  <td className="py-4 px-4 text-center bg-purple-50 font-semibold">Priority Email</td>
                  <td className="py-4 px-4 text-center font-semibold">Phone & Video</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-gray-600">
                Absolutely! You can upgrade or downgrade at any time. Changes take effect immediately, and we'll pro-rate any charges.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! Professional and Enterprise plans include a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and offer invoice billing for Enterprise customers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes, cancel anytime with no penalties. You'll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Make Better Staffing Decisions?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of companies using Lift Metric to optimize their ROI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold">
              Schedule a Demo
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
