import { Zap, TrendingUp, Users, FileText, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const premiumFeatures = [
  {
    icon: Zap,
    title: "Unlimited Calculations",
    description:
      "Run as many ROI calculations as you need without restrictions. Perfect for agencies, consultants, and businesses analyzing multiple projects simultaneously.",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics & Forecasting",
    description:
      "Unlock powerful trend analysis, sensitivity testing, and predictive forecasting. Make data-driven decisions with confidence using historical insights and projections.",
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: FileText,
    title: "Professional Reports & Exports",
    description:
      "Generate comprehensive PDF reports with charts and insights. Export to Excel/CSV for further analysis. Impress clients with beautifully formatted documentation.",
    gradient: "from-green-500 to-emerald-600",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share scenarios, collaborate in real-time, and manage team permissions. Perfect for departments and organizations that need coordinated ROI analysis.",
    gradient: "from-purple-500 to-violet-600",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: BarChart3,
    title: "API Access & Integrations",
    description:
      "Connect to Salesforce, HubSpot, QuickBooks, and more. Automate data imports and sync calculations with your existing tools for seamless workflows.",
    gradient: "from-pink-500 to-rose-600",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];

export default function PremiumFeatures() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Zap className="w-4 h-4" />
            Premium Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Unlock Your Full Potential
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take your ROI analysis to the next level with powerful features
            designed for professionals and teams
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {premiumFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-gray-100 bg-white"
              >
                {/* Icon */}
                <div
                  className={`${feature.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md`}
                >
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Gradient Bar */}
                <div
                  className={`h-1 w-16 bg-gradient-to-r ${feature.gradient} rounded-full`}
                ></div>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Supercharge Your ROI Analysis?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who trust Lift Metric for
              data-driven decision making
            </p>

            {/* Pricing Cards Preview */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white">
                <div className="text-2xl font-bold">$29/mo</div>
                <div className="text-sm text-blue-100">Basic Plan</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-lg p-4 text-white transform scale-105">
                <div className="text-xs font-semibold text-yellow-300 mb-1">
                  MOST POPULAR
                </div>
                <div className="text-2xl font-bold">$99/mo</div>
                <div className="text-sm text-blue-100">Pro Plan</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-white">
                <div className="text-2xl font-bold">Custom</div>
                <div className="text-sm text-blue-100">Enterprise</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                View All Plans & Pricing
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-6 text-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Start Free Trial
              </Button>
            </div>

            {/* Trust Badge */}
            <p className="text-blue-100 text-sm mt-6">
              ✓ No credit card required • ✓ Cancel anytime • ✓ 14-day money-back guarantee
            </p>
          </div>
        </div>

        {/* Feature Comparison Teaser */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Compare all features across plans
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all duration-200"
          >
            View detailed feature comparison
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
