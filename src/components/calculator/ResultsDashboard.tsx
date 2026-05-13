import React, { useState } from 'react';
import { TrendingUp, Download, BarChart3 } from 'lucide-react';

interface ResultsDashboardProps {
  results: any;
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  const [view, setView] = useState<'overview' | 'detailed'>('overview');

  if (!results) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-gray-500 text-center">No results to display</p>
      </div>
    );
  }

  const roi = results.roi || {};
  const timeline = Array.isArray(results.timeline) 
    ? results.timeline 
    : (results.timeline as any)?.phases || [];

  const totalCost = (roi as any)?.totalCosts || 0;
  const roiValue = typeof roi === 'number' ? roi : (roi as any)?.value || 0;
  const annualSavings = (roi as any)?.annualSavings || 0;
  const totalSavings = (roi as any)?.totalSavings || 0;

  const totalDuration = Array.isArray(results.timeline)
    ? results.timeline.reduce((sum: number, p: any) => sum + (p.duration || 0), 0)
    : (results.timeline as any)?.totalDuration || 0;

  const goLiveDate = (results.timeline as any)?.goLiveDate || new Date().toISOString();
  const meetsTarget = (results.timeline as any)?.meetsTarget !== false;

  const metrics = [
    { label: 'Total Investment', value: `$${totalCost.toLocaleString()}`, icon: '💰' },
    { label: 'Expected ROI', value: `${roiValue.toFixed(1)}%`, icon: '📈' },
    { label: 'Annual Savings', value: `$${annualSavings.toLocaleString()}`, icon: '💵' },
    { label: 'Total Savings', value: `$${totalSavings.toLocaleString()}`, icon: '🎯' },
  ];

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('overview')}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            view === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setView('detailed')}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            view === 'detailed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Detailed
        </button>
        <button className="ml-auto px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-2xl mb-2">{metric.icon}</div>
            <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline Info */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Timeline Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Phases</p>
            <p className="text-2xl font-bold text-gray-900">{timeline.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Duration</p>
            <p className="text-2xl font-bold text-gray-900">{totalDuration} months</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Target Met</p>
            <p className={`text-2xl font-bold ${meetsTarget ? 'text-green-600' : 'text-red-600'}`}>
              {meetsTarget ? '✓ Yes' : '✗ No'}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed View */}
      {view === 'detailed' && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-600">Total Project Cost</span>
              <span className="font-semibold">${totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-600">Expected ROI</span>
              <span className="font-semibold text-green-600">{roiValue.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-600">Annual Savings</span>
              <span className="font-semibold">${annualSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-600">Total Savings</span>
              <span className="font-semibold text-blue-600">${totalSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-600">Project Duration</span>
              <span className="font-semibold">{totalDuration} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Go-Live Date</span>
              <span className="font-semibold">{new Date(goLiveDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
