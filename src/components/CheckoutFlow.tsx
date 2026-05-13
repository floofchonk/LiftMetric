import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../lib/stripeConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle2, CreditCard, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { createCheckoutSession, formatAmount, type PlanType, type BillingInterval } from '../lib/paymentService';
import { useEntity } from '../hooks/useEntity';
import { paymentTransactionEntityConfig } from '../entities/PaymentTransaction';
import { toast } from 'sonner';

const stripePromise = getStripe();

interface CheckoutFlowProps {
  planType: PlanType;
  billingInterval: BillingInterval;
  userId: string;
  userEmail: string;
  onSuccess: () => void;
  onCancel: () => void;
}

type PaymentTransaction = {
  id: number;
  userId: string;
  stripePaymentIntentId: string;
  stripeCustomerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  paymentMethod: string;
  planType: string;
  billingInterval: string;
  errorMessage: string;
  metadata: string;
  created_at: string;
  updated_at: string;
};

export default function CheckoutFlow({ planType, billingInterval, userId, userEmail, onSuccess, onCancel }: CheckoutFlowProps) {
  const [step, setStep] = useState<'review' | 'processing' | 'success' | 'error'>('review');
  const [errorMessage, setErrorMessage] = useState('');
  const { create } = useEntity<PaymentTransaction>(paymentTransactionEntityConfig);

  const amount = planType === 'basic' 
    ? (billingInterval === 'monthly' ? 999 : 9990)
    : (billingInterval === 'monthly' ? 2999 : 29990);

  const handleProceedToPayment = async () => {
    setStep('processing');
    
    try {
      // Create payment transaction record
      const transaction = await create({
        userId: String(userId),
        stripePaymentIntentId: `pi_demo_${Date.now()}`,
        stripeCustomerId: `cus_demo_${userId}`,
        amount,
        currency: 'usd',
        status: 'processing',
        paymentMethod: 'card',
        planType,
        billingInterval,
        errorMessage: '',
        metadata: JSON.stringify({ email: userEmail }),
      });

      // In production, this would redirect to Stripe Checkout
      const session = await createCheckoutSession({
        planType,
        billingInterval,
        userId,
        userEmail,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/canceled`,
      });

      // Simulate successful payment after 2 seconds
      setTimeout(() => {
        setStep('success');
        toast.success('Payment successful!');
        setTimeout(() => onSuccess(), 2000);
      }, 2000);

    } catch (error) {
      setStep('error');
      const message = error instanceof Error ? error.message : 'Payment failed';
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const handleRetry = () => {
    setStep('review');
    setErrorMessage('');
  };

  if (step === 'processing') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6 pb-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h3 className="text-xl font-semibold">Processing Your Payment</h3>
            <p className="text-gray-600">Please wait while we securely process your payment...</p>
            <p className="text-sm text-gray-500">Do not close this window</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'success') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6 pb-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600">Payment Successful!</h3>
            <p className="text-gray-600">
              Thank you for subscribing to Lift Metric {planType === 'basic' ? 'Basic' : 'Pro'}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                A confirmation email has been sent to <strong>{userEmail}</strong>
              </p>
            </div>
            <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'error') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6 pb-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-red-600">Payment Failed</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRetry} variant="default">
                Try Again
              </Button>
              <Button onClick={onCancel} variant="outline">
                Cancel
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Need help? <a href="mailto:support@liftmetric.com" className="text-blue-600 hover:underline">Contact Support</a>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <Button onClick={onCancel} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Review Your Order
            </CardTitle>
            <CardDescription>
              Review your subscription details before completing payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium">
                    {planType === 'basic' ? 'Basic' : 'Pro'} Plan
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing</span>
                  <span className="font-medium capitalize">{billingInterval}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{userEmail}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatAmount(amount)}
                      <span className="text-sm text-gray-600 font-normal">
                        /{billingInterval === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Secure Payment Processing
                </p>
                <p className="text-xs text-blue-700">
                  Your payment information is encrypted and processed securely by Stripe. 
                  We never store your card details on our servers.
                </p>
              </div>
            </div>

            {/* What You Get */}
            <div className="space-y-3">
              <h4 className="font-semibold">What's Included:</h4>
              <ul className="space-y-2">
                {planType === 'basic' ? (
                  <>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Advanced calculator features
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Save up to 50 scenarios
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      CSV export functionality
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Priority email support
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      All Basic features
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Unlimited scenarios
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Excel export with advanced formatting
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Sensitivity analysis & advanced charts
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      24/7 priority support
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg"
              >
                <Lock className="w-5 h-5 mr-2" />
                Complete Secure Payment
              </Button>
              <p className="text-xs text-center text-gray-500">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy. 
                {billingInterval === 'annual' && ' Your subscription will auto-renew annually.'}
                {billingInterval === 'monthly' && ' Your subscription will auto-renew monthly.'}
              </p>
            </div>

            {/* Money Back Guarantee */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                🛡️ <strong>30-Day Money-Back Guarantee</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Not satisfied? Get a full refund within 30 days, no questions asked.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Elements>
  );
}
