import React, { useState } from 'react';
import { Download, Trash2, Calendar, DollarSign, TrendingUp, FileText, Search, Filter } from 'lucide-react';
import { ExportModal } from './ExportModal';
import { exportHistoryToCSV, exportHistoryToPDF, generateSampleHistory } from '../utils/exportUtils';
import type { CalculationResults, ProjectInputs } from '../types/calculator';

interface CalculationHistoryItem {
  id: string;
  timestamp: Date;
  projectName: string;
  inputs: ProjectInputs;
  results: CalculationResults;
  notes?: string;
}

interface ExportOption {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

export function CalculationHistory() {
  const [history] = useState<CalculationHistoryItem[]>(generateSampleHistory());
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'roi' | 'investment'>('date');

  const handleExport = (format: 'csv' | 'pdf', options: ExportOption[]) => {
    if (format === 'csv') {
      exportHistoryToCSV(history, options);
    } else {
      exportHistoryToPDF(history, options);
    }
  };

  const filteredHistory = history
    .filter(item => 
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return b.timestamp.getTime() - a.timestamp.getTime();
      if (sortBy === 'roi') return b.results.roi.percentage - a.results.roi.percentage;
      if (sortBy === 'investment') return (b.inputs.initialInvestment || 0) - (a.inputs.initialInvestment || 0);
      return 0;
    });

  const totalCalculations = history.length;
  const avgROI = history.reduce((sum, item) => sum + item.results.roi.percentage, 0) / totalCalculations;
  const totalInvestment = history.reduce((sum, item) => sum + (item.inputs.initialInvestment || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calculation History</h1>
          <p className="text-gray-600 mt-1">Review and export your past ROI calculations</p>
        </div>
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Download className="w-5 h-5" />
          Export History
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90 mb-1">Total Calculations</div>
              <div className="text-3xl font-bold">{totalCalculations}</div>
            </div>
            <FileText className="w-12 h-12 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90 mb-1">Average ROI</div>
              <div className="text-3xl font-bold">{avgROI.toFixed(1)}%</div>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90 mb-1">Total Investment</div>
              <div className="text-3xl font-bold">${(totalInvestment / 1000).toFixed(0)}k</div>
            </div>
            <DollarSign className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'roi' | 'investment')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="roi">Sort by ROI</option>
              <option value="investment">Sort by Investment</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No calculations found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Start creating calculations to see your history'}
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.projectName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {item.timestamp.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${item.inputs.initialInvestment?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">ROI</div>
                      <div className="text-lg font-bold text-green-600">
                        {item.results.roi.percentage.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">ROI Amount</div>
                      <div className="text-lg font-bold text-gray-900">
                        ${item.results.roi.amount.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Payback Period</div>
                      <div className="text-lg font-bold text-gray-900">
                        {(item.results.roi.amount / 12).toFixed(1)} mo
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Duration</div>
                      <div className="text-lg font-bold text-gray-900">
                        {item.inputs.projectDuration} months
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">Notes</div>
                      <div className="text-sm text-gray-900">{item.notes}</div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="w-4 h-4" />
                    View
                  </button>
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        exportType="history"
        title="Export Calculation History"
      />
    </div>
  );
}
