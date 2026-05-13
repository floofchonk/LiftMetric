import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Smartphone, Monitor, FileText, Tag, Image as ImageIcon, Globe } from "lucide-react";

export default function AppStoreAssets() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Smartphone className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">App Store Ready</h1>
          <p className="text-gray-600">Complete metadata and assets guide</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              App Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Short Description (80 characters)</h3>
              <p className="bg-gray-100 p-3 rounded-lg text-gray-800">
                Professional business calculators with analytics, export, and team collaboration
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Full Description</h3>
              <div className="bg-gray-100 p-4 rounded-lg text-gray-800 space-y-2">
                <p className="font-semibold">
                  Lift Metric - The Ultimate Business Calculator Platform
                </p>
                <p>
                  Make data-driven decisions with confidence using our comprehensive suite of professional 
                  calculators and analytics tools.
                </p>
                <p className="font-semibold mt-4">KEY FEATURES:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Advanced ROI Calculator with scenario planning</li>
                  <li>Staffing & Resource Calculator for project planning</li>
                  <li>Scientific Calculator with 30+ functions</li>
                  <li>Real-time Analytics Dashboard</li>
                  <li>Export to PDF, CSV, and PNG formats</li>
                  <li>Social sharing to LinkedIn and X</li>
                  <li>Team collaboration and scenario comparison</li>
                  <li>Marketing analytics and user acquisition tracking</li>
                </ul>
                <p className="font-semibold mt-4">PERFECT FOR:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>CFOs and Finance Teams</li>
                  <li>Project Managers</li>
                  <li>Data Analysts</li>
                  <li>Business Consultants</li>
                  <li>Operations Managers</li>
                </ul>
                <p className="mt-4">
                  <strong>Security & Privacy:</strong> Enterprise-grade encryption, GDPR compliant, 
                  and bank-level security. Your data is always protected.
                </p>
                <p className="mt-4">
                  Start with our free plan or upgrade to Pro for unlimited calculations and advanced features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Keywords & Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Primary Category</h3>
              <p className="bg-blue-100 p-3 rounded-lg text-blue-900 font-semibold">
                Business & Productivity
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Secondary Category</h3>
              <p className="bg-blue-100 p-3 rounded-lg text-blue-900 font-semibold">
                Finance & Analytics
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Keywords (for ASO - App Store Optimization)</h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              Screenshot Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-900 font-semibold mb-2">📸 Screenshot Specifications</p>
              <ul className="text-yellow-800 space-y-2">
                <li><strong>Mobile (iPhone):</strong> 1242x2688px (iPhone 13 Pro Max)</li>
                <li><strong>Mobile (Android):</strong> 1080x1920px minimum</li>
                <li><strong>Tablet (iPad):</strong> 2048x2732px (iPad Pro 12.9")</li>
                <li><strong>Desktop (Web):</strong> 1920x1080px minimum</li>
                <li><strong>Format:</strong> PNG or JPEG</li>
                <li><strong>Count:</strong> 3-8 screenshots recommended</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Recommended Screenshot Order</h3>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Hero/Landing Page - Show main value proposition</li>
                <li>ROI Calculator - Primary feature showcase</li>
                <li>Analytics Dashboard - Real-time insights</li>
                <li>Scientific Calculator - Advanced features</li>
                <li>Export Options - PDF, CSV, PNG capabilities</li>
                <li>Social Sharing - LinkedIn/X integration</li>
                <li>Pricing Plans - Clear tier comparison</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-600" />
              App Icon & Branding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">App Icon Specifications</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>iOS:</strong> 1024x1024px PNG (no transparency)</li>
                <li><strong>Android:</strong> 512x512px PNG (can have transparency)</li>
                <li><strong>Web:</strong> Multiple sizes (16x16, 32x32, 192x192, 512x512)</li>
                <li><strong>Design:</strong> Simple, recognizable, works at small sizes</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-blue-900 font-semibold mb-2">🎨 Brand Colors</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <div className="w-full h-20 bg-blue-600 rounded-lg mb-2"></div>
                  <p className="text-sm text-gray-700">Primary Blue</p>
                  <p className="text-xs text-gray-500">#2563EB</p>
                </div>
                <div>
                  <div className="w-full h-20 bg-indigo-600 rounded-lg mb-2"></div>
                  <p className="text-sm text-gray-700">Secondary Indigo</p>
                  <p className="text-xs text-gray-500">#4F46E5</p>
                </div>
                <div>
                  <div className="w-full h-20 bg-gray-900 rounded-lg mb-2"></div>
                  <p className="text-sm text-gray-700">Text Dark</p>
                  <p className="text-xs text-gray-500">#111827</p>
                </div>
                <div>
                  <div className="w-full h-20 bg-white border-2 border-gray-300 rounded-lg mb-2"></div>
                  <p className="text-sm text-gray-700">Background</p>
                  <p className="text-xs text-gray-500">#FFFFFF</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Localization & Markets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Supported Languages</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>English (Primary)</li>
                <li>Spanish (Ready for translation)</li>
                <li>French (Ready for translation)</li>
                <li>German (Ready for translation)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Target Markets</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>United States</li>
                <li>United Kingdom</li>
                <li>Canada</li>
                <li>European Union</li>
                <li>Australia</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Age Rating</h3>
              <p className="bg-green-100 p-3 rounded-lg text-green-900 font-semibold">
                4+ / Everyone - No objectionable content
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const keywords = [
  "business calculator",
  "ROI calculator",
  "financial calculator",
  "project calculator",
  "analytics dashboard",
  "business metrics",
  "staffing calculator",
  "scientific calculator",
  "productivity tools",
  "business intelligence",
  "data export",
  "scenario planning",
  "team collaboration",
  "financial planning",
  "project management"
];
