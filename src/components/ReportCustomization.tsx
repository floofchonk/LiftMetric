import React, { useState } from 'react';
import { Upload, Eye, Download } from 'lucide-react';
import type { ReportCustomization as ReportCustomizationType } from '../types/scenario';

interface ReportCustomizationProps {
  customization: ReportCustomizationType;
  onChange: (customization: ReportCustomizationType) => void;
}

export function ReportCustomization({
  customization,
  onChange,
}: ReportCustomizationProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        onChange({ ...customization, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateField = (field: keyof ReportCustomizationType, value: any) => {
    onChange({ ...customization, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Report Branding & Customization
      </h2>

      {/* Logo Upload */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Company Logo
        </h3>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-full sm:flex-1">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 hover:border-blue-500 transition-colors text-center touch-manipulation">
                <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                <p className="text-sm sm:text-base text-gray-600 mb-2">
                  Click to upload your company logo
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  PNG, JPG up to 5MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>
          {logoPreview && (
            <div className="w-full sm:w-48 p-4 border border-gray-200 rounded-lg">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Preview</p>
              <img
                src={logoPreview}
                alt="Logo preview"
                className="w-full h-auto max-h-24 object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Brand Colors */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Brand Colors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg cursor-pointer border border-gray-300 touch-manipulation"
              />
              <input
                type="text"
                value={customization.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
                placeholder="#2563eb"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg cursor-pointer border border-gray-300 touch-manipulation"
              />
              <input
                type="text"
                value={customization.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
                placeholder="#3b82f6"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Preferences */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Chart Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Default Chart Type
            </label>
            <select
              value={customization.chartType}
              onChange={(e) => updateField('chartType', e.target.value as any)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base touch-manipulation"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Sections */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Include in Report
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={customization.includeCharts}
              onChange={(e) => updateField('includeCharts', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 touch-manipulation"
            />
            <div>
              <p className="font-medium text-gray-900 text-sm sm:text-base">Visual Charts</p>
              <p className="text-xs sm:text-sm text-gray-600">Include all data visualizations</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={customization.includePhaseBreakdown}
              onChange={(e) => updateField('includePhaseBreakdown', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 touch-manipulation"
            />
            <div>
              <p className="font-medium text-gray-900 text-sm sm:text-base">Phase Breakdown</p>
              <p className="text-xs sm:text-sm text-gray-600">Detailed phase-by-phase analysis</p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer touch-manipulation">
            <input
              type="checkbox"
              checked={customization.includeRoiMetrics}
              onChange={(e) => updateField('includeRoiMetrics', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 touch-manipulation"
            />
            <div>
              <p className="font-medium text-gray-900 text-sm sm:text-base">ROI Metrics</p>
              <p className="text-xs sm:text-sm text-gray-600">Complete ROI calculations and projections</p>
            </div>
          </label>
        </div>
      </div>

      {/* Preview & Export */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation">
          <Eye className="w-5 h-5" />
          <span className="font-medium">Preview Report</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg touch-manipulation">
          <Download className="w-5 h-5" />
          <span className="font-medium">Export with Branding</span>
        </button>
      </div>
    </div>
  );
}
