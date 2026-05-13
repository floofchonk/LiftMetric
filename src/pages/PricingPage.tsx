import { useNavigate } from 'react-router-dom';
import FeatureComparisonTable from '../components/FeatureComparisonTable';

const PricingPage = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: 'free' | 'basic' | 'pro') => {
    if (plan === 'free') {
      navigate('/signup');
    } else {
      navigate('/checkout', { state: { selectedPlan: plan } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your needs. All plans include a 14-day free trial.
        </p>
      </div>

      {/* Feature Comparison Table */}
      <FeatureComparisonTable onSelectPlan={handleSelectPlan} />

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Can I change plans at any time?
            </h3>
            <p className="text-gray-600">
              Yes! You can upgrade, downgrade, or cancel your subscription at any time from your account settings.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              What happens when I reach my calculation limit?
            </h3>
            <p className="text-gray-600">
              You'll receive a notification when you're approaching your limit. You can upgrade to continue or wait until your monthly limit resets.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Is there a free trial?
            </h3>
            <p className="text-gray-600">
              Yes! All paid plans include a 14-day free trial with full access to all features. No credit card required to start.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Do you offer refunds?
            </h3>
            <p className="text-gray-600">
              We offer a 30-day money-back guarantee. If you're not satisfied with Lift Metric, contact us for a full refund.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-xl p-8 shadow-md text-center">
          <p className="text-gray-600 mb-4">
            Trusted by teams at leading companies
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            <div className="text-2xl font-bold text-gray-400">Company A</div>
            <div className="text-2xl font-bold text-gray-400">Company B</div>
            <div className="text-2xl font-bold text-gray-400">Company C</div>
            <div className="text-2xl font-bold text-gray-400">Company D</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
