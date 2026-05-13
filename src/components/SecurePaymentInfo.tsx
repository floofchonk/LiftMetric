import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, Lock, CreditCard, Check } from 'lucide-react';

export default function SecurePaymentInfo() {
  return (
    <div className="space-y-6">
      {/* Security Badges */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-100">
          <CardContent className="pt-6 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">PCI Compliant</h3>
            <p className="text-sm text-gray-600">Industry-standard security protocols</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-100">
          <CardContent className="pt-6 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">256-bit SSL</h3>
            <p className="text-sm text-gray-600">Bank-level encryption</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-purple-100">
          <CardContent className="pt-6 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Powered by Stripe</h3>
            <p className="text-sm text-gray-600">Trusted by millions worldwide</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Your Security is Our Priority
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            We take payment security seriously. All payment processing is handled by Stripe, 
            a PCI Service Provider Level 1 certified payment processor—the highest level of certification available.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">No Card Data Storage</p>
                <p className="text-sm text-gray-600">
                  We never store your credit card information on our servers. All card details are 
                  securely transmitted directly to Stripe.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">End-to-End Encryption</p>
                <p className="text-sm text-gray-600">
                  All payment data is encrypted using 256-bit SSL encryption during transmission 
                  and storage.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Fraud Detection</p>
                <p className="text-sm text-gray-600">
                  Advanced machine learning algorithms monitor transactions in real-time to 
                  prevent fraudulent activity.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">3D Secure Authentication</p>
                <p className="text-sm text-gray-600">
                  Additional verification layer for supported cards to protect against unauthorized use.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-900">
              <strong>Questions about security?</strong> Contact us at{' '}
              <a href="mailto:security@liftmetric.com" className="text-blue-600 hover:underline font-medium">
                security@liftmetric.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Accepted Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Accepted Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Visa</div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Mastercard</div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">American Express</div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Discover</div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Apple Pay</div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-semibold text-gray-700">Google Pay</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
