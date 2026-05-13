import { useState } from 'react';
import { FileText, Download, Link2, Palette, Upload, X } from 'lucide-react';

interface ROIData {
  initialInvestment: number;
  totalReturn: number;
  timePeriod: number;
  additionalCosts: number;
  roi: number;
  netProfit: number;
  annualizedROI: number;
  breakEvenMonths: number;
}

interface ReportGeneratorProps {
  roiData: ROIData;
  isOpen: boolean;
  onClose: () => void;
  isPremium?: boolean;
}

interface ReportCustomization {
  companyName: string;
  companyLogo: string | null;
  primaryColor: string;
  secondaryColor: string;
  includeCharts: boolean;
  includeAssumptions: boolean;
  includeRecommendations: boolean;
}

export default function ReportGenerator({ roiData, isOpen, onClose, isPremium = false }: ReportGeneratorProps) {
  const [customization, setCustomization] = useState<ReportCustomization>({
    companyName: 'Your Company',
    companyLogo: null,
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    includeCharts: true,
    includeAssumptions: true,
    includeRecommendations: true,
  });

  const [shareableLink, setShareableLink] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomization({ ...customization, companyLogo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateShareableLink = () => {
    setIsGenerating(true);
    // Simulate link generation
    setTimeout(() => {
      const linkId = Math.random().toString(36).substring(7);
      const link = `${window.location.origin}/report/${linkId}`;
      setShareableLink(link);
      setIsGenerating(false);
    }, 1000);
  };

  const downloadPDF = () => {
    setIsGenerating(true);
    // Simulate PDF generation
    setTimeout(() => {
      // Create a simple HTML report
      const reportHTML = generateReportHTML();
      
      // In a real implementation, you would use a library like jsPDF or html2pdf
      // For now, we'll create a downloadable HTML file
      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ROI_Report_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsGenerating(false);
    }, 1000);
  };

  const generateReportHTML = () => {
    const roiColor = roiData.roi >= 0 ? '#10b981' : '#ef4444';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROI Report - ${customization.companyName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #f9fafb;
            padding: 40px 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, ${customization.primaryColor}, ${customization.secondaryColor});
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header img {
            max-width: 150px;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }
        .header p {
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .metric-card {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        .metric-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        .metric-value {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
        }
        .metric-value.positive { color: #10b981; }
        .metric-value.negative { color: #ef4444; }
        .roi-highlight {
            background: linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}20);
            border: 2px solid ${customization.primaryColor};
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 40px;
        }
        .roi-highlight h2 {
            font-size: 18px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        .roi-highlight .value {
            font-size: 48px;
            font-weight: bold;
            color: ${roiColor};
        }
        .section {
            margin-bottom: 30px;
        }
        .section h3 {
            font-size: 20px;
            margin-bottom: 15px;
            color: ${customization.primaryColor};
            border-bottom: 2px solid ${customization.primaryColor};
            padding-bottom: 8px;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
        }
        .data-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        .data-table td:first-child {
            font-weight: 600;
            color: #4b5563;
        }
        .data-table td:last-child {
            text-align: right;
            font-weight: 600;
        }
        .recommendations {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
        }
        .recommendations h4 {
            color: #92400e;
            margin-bottom: 10px;
        }
        .recommendations ul {
            list-style-position: inside;
            color: #78350f;
        }
        .footer {
            background: #f9fafb;
            padding: 20px 40px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
        @media print {
            body { padding: 0; background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            ${customization.companyLogo ? `<img src="${customization.companyLogo}" alt="${customization.companyName}">` : ''}
            <h1>ROI Analysis Report</h1>
            <p>${customization.companyName}</p>
            <p>Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        <div class="content">
            <div class="roi-highlight">
                <h2>Return on Investment</h2>
                <div class="value">${roiData.roi.toFixed(2)}%</div>
            </div>
            
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-label">Net Profit</div>
                    <div class="metric-value ${roiData.netProfit >= 0 ? 'positive' : 'negative'}">
                        $${Math.abs(roiData.netProfit).toLocaleString()}
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Annualized ROI</div>
                    <div class="metric-value">${roiData.annualizedROI.toFixed(2)}%</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Break-Even Point</div>
                    <div class="metric-value">${roiData.breakEvenMonths.toFixed(1)} months</div>
                </div>
            </div>
            
            ${customization.includeAssumptions ? `
            <div class="section">
                <h3>Investment Summary</h3>
                <table class="data-table">
                    <tr>
                        <td>Initial Investment</td>
                        <td>$${roiData.initialInvestment.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Total Return Amount</td>
                        <td>$${roiData.totalReturn.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Additional Costs</td>
                        <td>$${roiData.additionalCosts.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Time Period</td>
                        <td>${roiData.timePeriod} months</td>
                    </tr>
                    <tr style="background: #f9fafb;">
                        <td><strong>Net Profit</strong></td>
                        <td><strong style="color: ${roiData.netProfit >= 0 ? '#10b981' : '#ef4444'}">
                            $${roiData.netProfit.toLocaleString()}
                        </strong></td>
                    </tr>
                </table>
            </div>
            ` : ''}
            
            ${customization.includeRecommendations ? `
            <div class="section">
                <h3>Analysis & Recommendations</h3>
                <div class="recommendations">
                    <h4>Key Insights:</h4>
                    <ul>
                        ${roiData.roi > 50 ? '<li>Excellent ROI performance - significantly above industry average</li>' : ''}
                        ${roiData.roi > 0 && roiData.roi <= 50 ? '<li>Positive ROI - investment is generating returns</li>' : ''}
                        ${roiData.roi < 0 ? '<li>Negative ROI - investment has not yet recovered costs</li>' : ''}
                        ${roiData.breakEvenMonths < 12 ? '<li>Quick break-even period indicates strong investment performance</li>' : ''}
                        ${roiData.breakEvenMonths >= 12 ? '<li>Break-even period suggests long-term investment strategy</li>' : ''}
                        ${roiData.annualizedROI > 20 ? '<li>Strong annualized returns demonstrate sustainable growth</li>' : ''}
                    </ul>
                </div>
            </div>
            ` : ''}
            
            <div class="section">
                <h3>Calculation Methodology</h3>
                <p style="color: #6b7280; line-height: 1.8;">
                    ROI is calculated as: ((Total Return - Initial Investment - Additional Costs) / (Initial Investment + Additional Costs)) × 100.
                    Annualized ROI adjusts the return to a 12-month period for comparison purposes.
                    Break-even point represents when cumulative returns equal total investment costs.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p>This report was generated by Lift Metric ROI Calculator</p>
            <p>© ${new Date().getFullYear()} ${customization.companyName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Generate ROI Report</h2>
              <p className="text-blue-100 text-sm">Create a professional, shareable report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Preview ROI Metrics */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Report Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{roiData.roi.toFixed(2)}%</div>
                <div className="text-sm text-gray-600">ROI</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${roiData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(roiData.netProfit).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Net Profit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{roiData.annualizedROI.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Annual ROI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{roiData.breakEvenMonths.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Break-even (mo)</div>
              </div>
            </div>
          </div>

          {/* Customization Options - Premium Feature */}
          {isPremium && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Customize Report</h3>
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  PREMIUM
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={customization.companyName}
                    onChange={(e) => setCustomization({ ...customization, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Company"
                  />
                </div>

                {/* Company Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-700"
                    >
                      <Upload className="w-4 h-4" />
                      {customization.companyLogo ? 'Change Logo' : 'Upload Logo'}
                    </label>
                    {customization.companyLogo && (
                      <img src={customization.companyLogo} alt="Logo preview" className="h-10 w-10 object-contain" />
                    )}
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customization.primaryColor}
                      onChange={(e) => setCustomization({ ...customization, primaryColor: e.target.value })}
                      className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customization.primaryColor}
                      onChange={(e) => setCustomization({ ...customization, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customization.secondaryColor}
                      onChange={(e) => setCustomization({ ...customization, secondaryColor: e.target.value })}
                      className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customization.secondaryColor}
                      onChange={(e) => setCustomization({ ...customization, secondaryColor: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Report Options */}
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.includeCharts}
                    onChange={(e) => setCustomization({ ...customization, includeCharts: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Charts & Visualizations</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.includeAssumptions}
                    onChange={(e) => setCustomization({ ...customization, includeAssumptions: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Investment Summary</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customization.includeRecommendations}
                    onChange={(e) => setCustomization({ ...customization, includeRecommendations: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Include Analysis & Recommendations</span>
                </label>
              </div>
            </div>
          )}

          {/* Free Tier Upgrade Prompt */}
          {!isPremium && (
            <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-3">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Unlock Report Customization</h4>
                  <p className="text-gray-600 mb-3">
                    Upgrade to a paid plan to customize reports with your company logo, brand colors, and choose which sections to include.
                  </p>
                  <a
                    href="/pricing"
                    className="inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 font-semibold"
                  >
                    View Premium Plans
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Export Options</h3>

            {/* Download PDF */}
            <button
              onClick={downloadPDF}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generating Report...' : 'Download as PDF'}
            </button>

            {/* Generate Shareable Link */}
            <div>
              <button
                onClick={generateShareableLink}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Link2 className="w-5 h-5" />
                {isGenerating ? 'Generating Link...' : 'Generate Shareable Link'}
              </button>

              {shareableLink && (
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Your shareable link:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={shareableLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(shareableLink)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Anyone with this link can view your ROI report
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Report Features */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Your report includes:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✓ Executive summary with key ROI metrics</li>
              <li>✓ Detailed investment breakdown and calculations</li>
              <li>✓ Visual charts and data visualizations</li>
              <li>✓ Break-even analysis and projections</li>
              <li>✓ Professional formatting for presentations</li>
              {isPremium && <li>✓ Custom branding with your logo and colors</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
