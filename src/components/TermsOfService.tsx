import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, AlertCircle, Scale, Shield } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last Updated: December 2024</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              By accessing or using Lift Metric, you agree to be bound by these Terms of Service and all
              applicable laws and regulations. If you do not agree with any of these terms, you are
              prohibited from using or accessing this application.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Use License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Permission is granted to temporarily access and use Lift Metric for personal or business purposes,
              subject to the following restrictions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must not modify or copy the application materials</li>
              <li>You must not use the materials for commercial purposes without proper subscription</li>
              <li>You must not attempt to reverse engineer any software contained in Lift Metric</li>
              <li>You must not remove any copyright or proprietary notations</li>
              <li>You must not transfer the materials to another person or mirror on any other server</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>To use certain features, you must register for an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Not share your account credentials with others</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Subscription and Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">Subscription Plans</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free Plan: Basic features with limitations</li>
                <li>Pro Plan: Advanced features and increased limits</li>
                <li>Enterprise Plan: Full access with priority support</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Billing Terms</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscriptions are billed monthly or annually in advance</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
                <li>Failed payments may result in service suspension</li>
                <li>You can cancel your subscription at any time</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Conduct</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful code, viruses, or malware</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for illegal or fraudulent purposes</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Create multiple accounts to circumvent limitations</li>
              <li>Use automated scripts or bots without permission</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              All content, features, and functionality of Lift Metric are owned by us and protected by
              international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You retain ownership of any calculations, data, or content you create using our service.
              We claim no intellectual property rights over your user-generated content.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Lift Metric is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either
              express or implied, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Implied warranties of merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy or reliability of calculations</li>
              <li>Uninterrupted or error-free service</li>
            </ul>
            <p className="mt-4 font-semibold text-red-600">
              Calculations provided by Lift Metric are for informational purposes only. Always verify
              critical calculations independently. We are not liable for decisions made based on our
              calculations.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              To the maximum extent permitted by law, Lift Metric and its affiliates shall not be liable for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Service interruptions or security breaches</li>
              <li>Errors or inaccuracies in calculations</li>
              <li>Actions of third-party service providers</li>
            </ul>
            <p className="mt-4">
              Our total liability shall not exceed the amount paid by you in the 12 months preceding
              the claim, or $100, whichever is greater.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data and Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              Your use of Lift Metric is also governed by our Privacy Policy. By using our service, you
              consent to our collection and use of personal data as outlined in the Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Modifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>We reserve the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or discontinue any feature at any time</li>
              <li>Change pricing and subscription plans with notice</li>
              <li>Update these Terms of Service periodically</li>
              <li>Suspend or terminate accounts that violate these terms</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              We may terminate or suspend your account immediately, without prior notice, for conduct that
              we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
            <p>
              You may terminate your account at any time through the account settings. Upon termination,
              your right to use the service will immediately cease.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" />
              Governing Law
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
              in which our company is registered, without regard to conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dispute Resolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              Any disputes arising from these Terms or your use of Lift Metric shall be resolved through:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Good faith negotiation between the parties</li>
              <li>Mediation if negotiation fails</li>
              <li>Binding arbitration in accordance with applicable rules</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Severability</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall
              be limited or eliminated to the minimum extent necessary, and the remaining provisions shall
              remain in full force and effect.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p className="mb-4">
              Questions about these Terms of Service should be sent to:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> <a href="mailto:legal@liftmetric.com" className="text-blue-600 hover:underline">legal@liftmetric.com</a></p>
              <p><strong>Support:</strong> <a href="mailto:support@liftmetric.com" className="text-blue-600 hover:underline">support@liftmetric.com</a></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
