import { Check, X, Crown, Zap, Users, TrendingUp } from "lucide-react";

interface Feature {
  name: string;
  description?: string;
  free: boolean | string;
  basic: boolean | string;
  pro: boolean | string;
  category: string;
}

interface FeatureComparisonTableProps {
  onSelectPlan?: (plan: 'free' | 'basic' | 'pro') => void;
}

const FeatureComparisonTable = ({ onSelectPlan }: FeatureComparisonTableProps) => {
  const features: Feature[] = [
    // Usage Limits
    {
      name: "Calculations per month",
      category: "Usage Limits",
      free: "5",
      basic: "50",
      pro: "Unlimited"
    },
    {
      name: "Saved scenarios",
      category: "Usage Limits",
      free: "1",
      basic: "10",
      pro: "Unlimited"
    },
    {
      name: "History retention",
      category: "Usage Limits",
      free: "14 days",
      basic: "90 days",
      pro: "Unlimited"
    },
    {
      name: "Staffing options comparison",
      category: "Usage Limits",
      free: "2",
      basic: "4",
      pro: "Unlimited"
    },
    
    // Core Features
    {
      name: "Basic ROI calculator",
      description: "Standard cost-benefit calculations",
      category: "Core Features",
      free: true,
      basic: true,
      pro: true
    },
    {
      name: "ROI calendar",
      category: "Core Features",
      free: "Basic",
      basic: "Advanced",
      pro: "Advanced"
    },
    {
      name: "Percentage calculations",
      category: "Core Features",
      free: true,
      basic: true,
      pro: true
    },
    {
      name: "Memory functions",
      category: "Core Features",
      free: true,
      basic: true,
      pro: true
    },
    
    // Advanced Features
    {
      name: "Sensitivity analysis",
      description: "Test different scenarios and variables",
      category: "Advanced Features",
      free: false,
      basic: true,
      pro: true
    },
    {
      name: "Historical trend analysis",
      description: "Track ROI changes over time",
      category: "Advanced Features",
      free: false,
      basic: false,
      pro: true
    },
    {
      name: "Custom calculation templates",
      description: "Create reusable calculation templates",
      category: "Advanced Features",
      free: false,
      basic: false,
      pro: true
    },
    {
      name: "Advanced statistical operations",
      category: "Advanced Features",
      free: false,
      basic: true,
      pro: true
    },
    
    // Export & Integration
    {
      name: "PDF export",
      category: "Export & Integration",
      free: true,
      basic: true,
      pro: true
    },
    {
      name: "Excel & CSV export",
      category: "Export & Integration",
      free: false,
      basic: true,
      pro: true
    },
    {
      name: "API access",
      description: "Integrate with your own systems",
      category: "Export & Integration",
      free: false,
      basic: false,
      pro: true
    },
    {
      name: "Automated reports",
      category: "Export & Integration",
      free: false,
      basic: false,
      pro: true
    },
    
    // Collaboration
    {
      name: "Team collaboration",
      category: "Collaboration",
      free: false,
      basic: false,
      pro: "Up to 5 users"
    },
    {
      name: "Shared workspaces",
      category: "Collaboration",
      free: false,
      basic: false,
      pro: true
    },
    {
      name: "Comment & annotations",
      category: "Collaboration",
      free: false,
      basic: false,
      pro: true
    },
    
    // Support
    {
      name: "Email support",
      category: "Support",
      free: true,
      basic: "Priority",
      pro: "Priority"
    },
    {
      name: "Phone support",
      category: "Support",
      free: false,
      basic: false,
      pro: true
    },
    {
      name: "Dedicated account manager",
      category: "Support",
      free: false,
      basic: false,
      pro: true
    }
  ];

  const categories = Array.from(new Set(features.map(f => f.category)));

  const renderFeatureValue = (value: boolean | string, plan: 'free' | 'basic' | 'pro') => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    
    const colors = {
      free: 'text-gray-700',
      basic: 'text-blue-700',
      pro: 'text-purple-700'
    };
    
    return (
      <span className={`text-sm font-medium ${colors[plan]}`}>
        {value}
      </span>
    );
  };

  const planIcons = {
    free: Zap,
    basic: TrendingUp,
    pro: Crown
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Feature Comparison
        </h2>
        <p className="text-xl text-gray-600">
          Choose the plan that fits your needs
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Plan Headers */}
        <div className="grid grid-cols-5 gap-4 bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
          <div className="font-semibold text-gray-900 text-lg">Features</div>
          
          {/* Free Plan Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <Zap className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Free</h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">$0</p>
            <p className="text-sm text-gray-600 mb-4">per month</p>
            <button
              onClick={() => onSelectPlan?.('free')}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Get Started
            </button>
          </div>

          {/* Basic Plan Header */}
          <div className="text-center relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Basic</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">$29</p>
            <p className="text-sm text-gray-600 mb-4">per month</p>
            <button
              onClick={() => onSelectPlan?.('basic')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Free Trial
            </button>
          </div>

          {/* Pro Plan Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
              <Crown className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Pro</h3>
            <p className="text-3xl font-bold text-purple-600 mb-2">$99</p>
            <p className="text-sm text-gray-600 mb-4">per month</p>
            <button
              onClick={() => onSelectPlan?.('pro')}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Free Trial
            </button>
          </div>
        </div>

        {/* Feature Rows by Category */}
        {categories.map((category, catIndex) => (
          <div key={category}>
            {/* Category Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                {category === 'Usage Limits' && <Zap className="w-4 h-4 text-blue-600" />}
                {category === 'Core Features' && <Check className="w-4 h-4 text-green-600" />}
                {category === 'Advanced Features' && <TrendingUp className="w-4 h-4 text-purple-600" />}
                {category === 'Export & Integration' && <Users className="w-4 h-4 text-orange-600" />}
                {category === 'Collaboration' && <Users className="w-4 h-4 text-pink-600" />}
                {category === 'Support' && <Check className="w-4 h-4 text-blue-600" />}
                {category}
              </h4>
            </div>

            {/* Feature Rows */}
            {features
              .filter(f => f.category === category)
              .map((feature, index) => (
                <div
                  key={`${category}-${index}`}
                  className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div>
                    <p className="font-medium text-gray-900">{feature.name}</p>
                    {feature.description && (
                      <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    {renderFeatureValue(feature.free, 'free')}
                  </div>
                  <div className="flex items-center justify-center">
                    {renderFeatureValue(feature.basic, 'basic')}
                  </div>
                  <div className="flex items-center justify-center">
                    {renderFeatureValue(feature.pro, 'pro')}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Need a custom plan for your organization?
        </p>
        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
          Contact Sales
        </button>
      </div>
    </div>
  );
};

export default FeatureComparisonTable;
