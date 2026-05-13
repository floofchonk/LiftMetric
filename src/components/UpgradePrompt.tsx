import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, Crown, Lightbulb } from 'lucide-react';
import { FeatureSuggestionForm } from './FeatureSuggestionForm';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature: {
    name: string;
    description: string;
    requiredPlan: 'Basic' | 'Pro' | 'Enterprise';
    benefits: string[];
  };
  userTier?: string;
  position?: 'center' | 'bottom' | 'tooltip';
  style?: React.CSSProperties;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  isOpen,
  onClose,
  feature,
  userTier = 'Free',
  position = 'center',
  style = {}
}) => {
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);

  if (!isOpen) return null;

  const planColors = {
    Basic: 'from-blue-500 to-blue-600',
    Pro: 'from-purple-500 to-purple-600',
    Enterprise: 'from-amber-500 to-amber-600'
  };

  const planPrices = {
    Basic: '$9',
    Pro: '$29',
    Enterprise: '$99'
  };

  const handleUpgrade = () => {
    window.location.href = `/subscribe?plan=${feature.requiredPlan.toLowerCase()}`;
  };

  const positionClasses = {
    center: 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm',
    bottom: 'fixed bottom-4 right-4 z-50 max-w-md',
    tooltip: 'absolute z-50 max-w-sm'
  };

  const containerClasses = {
    center: 'bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4 transform transition-all',
    bottom: 'bg-white rounded-2xl shadow-2xl p-6 transform transition-all',
    tooltip: 'bg-white rounded-xl shadow-xl p-4 transform transition-all'
  };

  return (
    <>
      <div className={positionClasses[position]} style={style}>
        <div className={`${containerClasses[position]} animate-scale-in`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${planColors[feature.requiredPlan]} mb-4`}>
            <Crown className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Unlock {feature.name}
          </h3>
          <p className="text-gray-600 mb-4">
            {feature.description}
          </p>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-gray-900">What you'll get:</span>
            </div>
            <ul className="space-y-2">
              {feature.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Available in</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${planColors[feature.requiredPlan]}`}>
              {feature.requiredPlan} Plan
            </span>
            <span className="text-lg font-bold text-gray-900">
              {planPrices[feature.requiredPlan]}/month
            </span>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={handleUpgrade}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${planColors[feature.requiredPlan]} text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          <button
            onClick={() => setShowSuggestionForm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
          >
            <Lightbulb className="w-4 h-4" />
            This feature should be free? Tell us!
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            ✨ 14-day free trial • Cancel anytime • No credit card required
          </p>
        </div>
      </div>

      <FeatureSuggestionForm
        isOpen={showSuggestionForm}
        onClose={() => setShowSuggestionForm(false)}
        userTier={userTier}
      />
    </>
  );
};

export default UpgradePrompt;
