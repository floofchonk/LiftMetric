import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Check, Zap, Crown, ArrowRight } from 'lucide-react';
import CheckoutFlow from './CheckoutFlow';
import PaymentSuccessPage from './PaymentSuccessPage';
import PaymentFailurePage from './PaymentFailurePage';
import { useAuth } from '../hooks/useAuth';
import type { PlanType, BillingInterval } from '../lib/paymentService';

export default function PricingWithCheckout() {
  const { currentUser } = useAuth();
  const [view, setView] = useState<'pricing' | 'checkout' | 'success' | 'failure'>('pricing');
  const [selectedPlan, setSelectedPlan] = useState<{ plan: PlanType; interval: BillingInterval } | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly');

  const handleSelectPlan = (plan: PlanType) => {
    if (!currentUser) {
      alert('Please sign in to subscribe');
      return;
    }
    setSelectedPlan({ plan, interval: billingInterval });
    setView('checkout');
  };

  const handlePaymentSuccess = () => {
    setView('success');
  };

  const handlePaymentCancel = () => {
    setView('pricing');
    setSelectedPlan(null);
  };

  const handleReturnToDashboard = () => {
    window.location.reload();
  };

  const handleRetryPayment = () => {
    setView('checkout');
  };

  if (view === 'success' && selectedPlan && currentUser) {
    return (
      <PaymentSuccessPage
        userId={String(currentUser.id)}
        userEmail={currentUser.email}
        planType={selectedPlan.plan}
        billingInterval={selectedPlan.interval}
        onReturnToDashboard={handleReturnToDashboard}
      />
    );
  }

  if (view === 'failure') {
    return (
      <PaymentFailurePage
        onRetry={handleRetryPayment}
        onCancel={handlePaymentCancel}
      />
    );
  }

  if (view === 'checkout' && selectedPlan && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
        <CheckoutFlow
          planType={selectedPlan.plan}
          billingInterval={selectedPlan.interval}
          userId={String(currentUser.id)}
          userEmail={currentUser.email}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      icon: Zap,
      color: 'blue',
      monthlyPrice: 9.99,
      annualPrice: 99.90,
      description: 'Perfect for individuals and small teams',
      features: [
        'Advanced calculator features',
        'Save up to 50 scenarios',
        'CSV export functionality',
        '90-day history',
        'Priority email support',
        'Mobile app access',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      color: 'purple',
      monthlyPrice: 29.99,
      annualPrice: 299.90,
      description: 'For professionals who need everything',
      features: [
        'All Basic features',
        'Unlimited scenarios',
        'Excel export with advanced formatting',
        'Unlimited history',
        'Sensitivity analysis & advanced charts',
        'API access',
        'Team collaboration (up to 5 users)',
        '24/7 priority support',
      ],
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock powerful features and take your calculations to the next level
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-white rounded-full p-1 shadow-md inline-flex">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                billingInterval === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                billingInterval === 'annual'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = billingInterval === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
            
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular ? 'border-2 border-purple-500 shadow-xl scale-105' : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-3 rounded-lg bg-${plan.color}-100`}>
                      <Icon className={`w-6 h-6 text-${plan.color}-600`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900">${price}</span>
                      <span className="text-gray-600">
                        /{billingInterval === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingInterval === 'annual' && (
                      <p className="text-sm text-green-600 font-medium">
                        ${(price / 12).toFixed(2)}/month billed annually
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id as PlanType)}
                    className={`w-full py-6 text-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Signals */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Secure payment processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
