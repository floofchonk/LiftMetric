import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Shield, Lock, Eye, Database, UserX, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last Updated: December 2024</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              At Lift Metric, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our application.
            </p>
            <p>
              By using Lift Metric, you agree to the collection and use of information in accordance with
              this policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email address (for account creation and communication)</li>
                <li>Username (for account identification)</li>
                <li>Password (encrypted and securely stored)</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Usage Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Calculation history and saved scenarios</li>
                <li>Login timestamps and activity logs</li>
                <li>Feature usage and interaction patterns</li>
                <li>Device information and browser type</li>
                <li>IP address and geographic location</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cookies and similar tracking technologies</li>
                <li>Analytics data (Google Analytics 4)</li>
                <li>Error logs and performance metrics</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our service</li>
              <li>Process your transactions and manage subscriptions</li>
              <li>Send you important updates and notifications</li>
              <li>Respond to your feedback and support requests</li>
              <li>Improve our application and user experience</li>
              <li>Monitor usage patterns and detect security threats</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Stripe (payment processing), email service providers</li>
              <li><strong>Analytics Partners:</strong> Google Analytics (anonymized data)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale</li>
            </ul>
            <p className="mt-4 font-semibold">
              We NEVER sell your personal information to third parties.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted data transmission (HTTPS/SSL)</li>
              <li>Secure password hashing and storage</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure database hosting (Turso)</li>
              <li>PCI-DSS compliant payment processing</li>
            </ul>
            <p className="mt-4">
              While we strive to protect your data, no method of transmission over the internet is 100% secure.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-blue-600" />
              Your Rights and Choices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your calculation history and data</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails</li>
              <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@liftmetric.com" className="text-blue-600 hover:underline">privacy@liftmetric.com</a>
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>GDPR Compliance (EU Users)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>
              If you are located in the European Economic Area (EEA), we process your data based on:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consent:</strong> You have given explicit consent for processing</li>
              <li><strong>Contract:</strong> Processing is necessary to provide our service</li>
              <li><strong>Legal Obligation:</strong> We must comply with legal requirements</li>
              <li><strong>Legitimate Interest:</strong> For business operations and security</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication and session management</li>
              <li>User preferences and settings</li>
              <li>Analytics and performance monitoring</li>
              <li>Marketing and advertising</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings, but this may limit functionality.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              Lift Metric is not intended for users under 13 years of age. We do not knowingly collect
              information from children. If you believe we have collected data from a child, please contact
              us immediately.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              We retain your personal data for as long as your account is active or as needed to provide
              services. After account deletion, we may retain certain data for legal compliance, fraud
              prevention, and legitimate business purposes for up to 7 years.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              Your data may be transferred to and processed in countries other than your own. We ensure
              appropriate safeguards are in place for international transfers, including Standard Contractual
              Clauses (SCCs) approved by the European Commission.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes
              via email or through a prominent notice in the application. Continued use after changes
              constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p className="mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2">
              <p><strong>Email:</strong> <a href="mailto:privacy@liftmetric.com" className="text-blue-600 hover:underline">privacy@liftmetric.com</a></p>
              <p><strong>Support:</strong> <a href="mailto:support@liftmetric.com" className="text-blue-600 hover:underline">support@liftmetric.com</a></p>
              <p><strong>Data Protection Officer:</strong> <a href="mailto:dpo@liftmetric.com" className="text-blue-600 hover:underline">dpo@liftmetric.com</a></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
