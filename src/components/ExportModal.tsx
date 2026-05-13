import React, { useState } from 'react';
import { X, Download, FileText, Calendar, CheckSquare } from 'lucide-react';

interface ExportOption {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'pdf', options: ExportOption[]) => void;
  exportType: 'results' | 'history';
  title?: string;
}

export function ExportModal({ isOpen, onClose, onExport, exportType, title }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf'>('pdf');
  const [exportOptions, setExportOptions] = useState<ExportOption[]>(
    exportType === 'results'
      ? [
          { id: 'inputs', label: 'Input Values', description: 'All calculation inputs and parameters', checked: true },
          { id: 'summary', label: 'Executive Summary', description: 'Key metrics and recommendations', checked: true },
          { id: 'charts', label: 'Visual Charts', description: 'ROI charts and graphs', checked: true },
          { id: 'breakdown', label: 'Detailed Breakdown', description: 'Cost analysis and timeline details', checked: true },
          { id: 'timeline', label: 'Project Timeline', description: 'Phase breakdown and milestones', checked: true },
          { id: 'scenarios', label: 'Scenario Comparisons', description: 'All saved scenario data', checked: false },
        ]
      : [
          { id: 'timestamps', label: 'Timestamps', description: 'Date and time of each calculation', checked: true },
          { id: 'inputs', label: 'Input Parameters', description: 'All input values used', checked: true },
          { id: 'results', label: 'Calculation Results', description: 'ROI, NPV, payback period', checked: true },
          { id: 'metadata', label: 'Metadata', description: 'Project names, tags, notes', checked: true },
        ]
  );

  if (!isOpen) return null;

  const handleToggleOption = (id: string) => {
    setExportOptions(prev =>
      prev.map(opt => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    );
  };

  const handleSelectAll = () => {
    const allChecked = exportOptions.every(opt => opt.checked);
    setExportOptions(prev => prev.map(opt => ({ ...opt, checked: !allChecked })));
  };

  const handleExport = () => {
    const selectedOptions = exportOptions.filter(opt => opt.checked);
    if (selectedOptions.length === 0) {
      alert('Please select at least one export option');
      return;
    }
    onExport(selectedFormat, selectedOptions);
    onClose();
  };

  const selectedCount = exportOptions.filter(opt => opt.checked).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {title || `Export ${exportType === 'results' ? 'Results' : 'History'}`}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Choose format and select data to include
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedFormat('pdf')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedFormat === 'pdf'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-6 h-6 ${selectedFormat === 'pdf' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">PDF Document</div>
                    <div className="text-xs text-gray-600">Professional report format</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setSelectedFormat('csv')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedFormat === 'csv'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Download className={`w-6 h-6 ${selectedFormat === 'csv' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">CSV Spreadsheet</div>
                    <div className="text-xs text-gray-600">Excel-compatible data</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-900">
                Include in Export ({selectedCount} selected)
              </label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {exportOptions.every(opt => opt.checked) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="space-y-2">
              {exportOptions.map(option => (
                <label
                  key={option.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    option.checked
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={() => handleToggleOption(option.id)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                  {option.checked && (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Format-specific info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-blue-600 mt-0.5">
                {selectedFormat === 'pdf' ? <FileText className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-semibold text-blue-900 text-sm">
                  {selectedFormat === 'pdf' ? 'PDF Export Features' : 'CSV Export Features'}
                </div>
                <div className="text-sm text-blue-800 mt-1">
                  {selectedFormat === 'pdf' ? (
                    <ul className="space-y-1">
                      <li>• Professional formatting with charts and graphs</li>
                      <li>• Custom branding (logo and colors)</li>
                      <li>• Ready for presentations and reports</li>
                    </ul>
                  ) : (
                    <ul className="space-y-1">
                      <li>• Compatible with Excel, Google Sheets</li>
                      <li>• Easy data manipulation and analysis</li>
                      <li>• Machine-readable format for integrations</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedCount === 0 && 'Select at least one option'}
            {selectedCount > 0 && `${selectedCount} section${selectedCount > 1 ? 's' : ''} selected`}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={selectedCount === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export {selectedFormat.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
