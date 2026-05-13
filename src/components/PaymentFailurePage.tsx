import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, ArrowLeft, Mail, HelpCircle } from 'lucide-react';
import { getPaymentErrorMessage } from '../lib/paymentService';

interface PaymentFailurePageProps {
  errorCode?: string;
  errorMessage?: string;
  onRetry: () => void;
  onCancel: () => void;
}

export default function PaymentFailurePage({ errorCode, errorMessage, onRetry, onCancel }: PaymentFailurePageProps) {
  const displayMessage = errorMessage || (errorCode ? getPaymentErrorMessage(errorCode) : 'An unexpected error occurred during payment processing.');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-12 pb-12 text-center space-y-8">
          {/* Error Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Payment Failed
            </h1>
            <p className="text-xl text-gray-600">
              We couldn't process your payment
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <p className="text-red-800 font-medium">{displayMessage}</p>
          </div>

          {/* Common Issues */}
          <div className="space-y-4 text-left">
            <h3 className="text-lg font-semibold text-gray-900 text-center">Common Issues</h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Check your card details</p>
                  <p className="text-gray-600">Verify card number, expiry date, and security code</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Ensure sufficient funds</p>
                  <p className="text-gray-600">Make sure your account has enough balance</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Contact your bank</p>
                  <p className="text-gray-600">Your bank may have declined the transaction</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Try a different payment method</p>
                  <p className="text-gray-600">Use an alternative card or payment option</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={onRetry}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg"
            >
              Try Again
            </Button>
            <Button 
              onClick={onCancel}
              variant="outline"
              className="w-full py-6 text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Plans
            </Button>
          </div>

          {/* Support */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Mail className="w-5 h-5" />
              <span className="text-sm">Need help?</span>
            </div>
            <p className="text-sm text-gray-600">
              Contact our support team at{' '}
              <a href="mailto:support@liftmetric.com" className="text-blue-600 hover:underline font-medium">
                support@liftmetric.com
              </a>
            </p>
            <p className="text-xs text-gray-500">
              We're here to help you get started with Lift Metric
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
