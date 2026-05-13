import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Download } from 'lucide-react';

interface ComparisonReportProps {
  scenarios: any[];
  onClose?: () => void;
  onSave?: (name: string) => void;
  brandSettings?: { primaryColor?: string; secondaryColor?: string; logo?: string };
}

export function ComparisonReport({ scenarios, onClose, onSave, brandSettings }: ComparisonReportProps) {
  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <p className="text-gray-500 text-center">No scenarios to compare</p>
      </div>
    );
  }

  const data = scenarios.map((s: any) => ({
    name: s.name || 'Scenario',
    roi: typeof s.roi === 'number' ? s.roi : (s.roi as any)?.value || 0,
    totalCosts: s.totalCosts || 0,
    savings: typeof s.savings === 'number' ? s.savings : (s.savings as any)?.value || 0,
  }));

  const handleExport = () => {
    const csv = [
      ['Scenario', 'ROI (%)', 'Total Costs ($)', 'Savings ($)'],
      ...data.map(d => [d.name, d.roi, d.totalCosts, d.savings])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparison.csv';
    a.click();
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Scenario Comparison</h3>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="roi" fill="#3b82f6" name="ROI (%)" />
          <Bar yAxisId="right" dataKey="totalCosts" fill="#ef4444" name="Total Costs ($)" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((s: any, idx: number) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">{s.name || 'Scenario'}</h4>
            {s.description && <p className="text-sm text-gray-600 mb-3">{s.description}</p>}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ROI:</span>
                <span className="font-semibold text-green-600">{typeof s.roi === 'number' ? s.roi.toFixed(2) : (s.roi as any)?.value?.toFixed(2) || '0.00'}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Costs:</span>
                <span className="font-semibold">${(s.totalCosts || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Savings:</span>
                <span className="font-semibold text-blue-600">${(typeof s.savings === 'number' ? s.savings : (s.savings as any)?.value || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
