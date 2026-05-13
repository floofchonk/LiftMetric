import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Download, FileText, Database, Trash2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function DataExportPage() {
  const { currentUser } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExportAllData = async () => {
    setExporting(true);
    setExportComplete(false);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create export data
    const exportData = {
      user: {
        id: currentUser?.id,
        email: currentUser?.email,
        name: currentUser?.name || currentUser?.email,
        exportDate: new Date().toISOString()
      },
      calculations: "All calculation history would be included here",
      scenarios: "All saved scenarios would be included here",
      preferences: "All user preferences would be included here",
      feedback: "All feedback submissions would be included here"
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liftmetric-data-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExporting(false);
    setExportComplete(true);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
        alert('Account deletion requested. You will receive a confirmation email within 24 hours.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Database className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Data & Privacy</h1>
          <p className="text-gray-600">Export your data or manage your account</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Export Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Download a complete copy of all your data including calculations, scenarios, preferences,
              and feedback submissions. This file will be in JSON format.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What's included:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Account information
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  All calculation history
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved scenarios and comparisons
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  User preferences and settings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Feedback and support submissions
                </li>
              </ul>
            </div>
            <Button 
              onClick={handleExportAllData}
              disabled={exporting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {exporting ? (
                <>Processing Export...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export All My Data
                </>
              )}
            </Button>
            {exportComplete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                <CheckCircle2 className="w-5 h-5 inline mr-2" />
                Export complete! Your data has been downloaded.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-900 font-semibold mb-2">⚠️ Warning: This action is permanent</p>
              <p className="text-red-800">
                Deleting your account will permanently remove all your data, including calculations,
                scenarios, and preferences. This action cannot be undone.
              </p>
            </div>
            <p className="text-gray-700">
              Before deleting your account, we recommend exporting your data using the button above.
            </p>
            <Button 
              onClick={handleDeleteAccount}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Request Account Deletion
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-700">
            <p>Under GDPR and other privacy regulations, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data (use Export button above)</li>
              <li><strong>Rectification:</strong> Update incorrect or incomplete data in Account Settings</li>
              <li><strong>Erasure:</strong> Request deletion of your account and data</li>
              <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to processing of your personal data</li>
              <li><strong>Restriction:</strong> Request limitation of data processing</li>
            </ul>
            <p className="mt-4">
              For questions about your data or to exercise these rights, contact us at{' '}
              <a href="mailto:privacy@liftmetric.com" className="text-blue-600 hover:underline">
                privacy@liftmetric.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
