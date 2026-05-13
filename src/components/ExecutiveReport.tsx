import React, { useState, useRef } from 'react';
import { useBranding } from '../hooks/useBranding';

interface CalculationResults {
  projectName?: string;
  totalInvestment: number;
  annualBenefit: number;
  netBenefit: number;
  roi: number;
  paybackPeriod: number;
  npv?: number;
  irr?: number;
  yearlyProjections?: Array<{
    year: number;
    revenue: number;
    costs: number;
    profit: number;
    cumulativeProfit: number;
  }>;
}

interface ExecutiveReportProps {
  results: CalculationResults;
  onClose: () => void;
  onExport?: (format: 'pdf' | 'png') => void;
}

export function ExecutiveReport({ results, onClose, onExport }: ExecutiveReportProps) {
  const { branding } = useBranding();
  const [notes, setNotes] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([
    'Consider phased implementation to reduce initial capital requirements',
    'Monitor key performance indicators monthly during the first year',
    'Allocate contingency budget of 10-15% for unforeseen expenses'
  ]);
  const [newRecommendation, setNewRecommendation] = useState('');
  const [showAddRecommendation, setShowAddRecommendation] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Generate yearly projections if not provided
  const projections = results.yearlyProjections || Array.from({ length: 5 }, (_, i) => {
    const year = i + 1;
    const revenue = results.annualBenefit * (1 + 0.05 * i);
    const costs = (results.totalInvestment / 5) * (1 + 0.02 * i);
    const profit = revenue - costs;
    const cumulativeProfit = profit * year - results.totalInvestment;
    return { year, revenue, costs, profit, cumulativeProfit };
  });

  // Top 3 Metrics
  const topMetrics = [
    {
      label: 'Return on Investment',
      value: formatPercent(results.roi),
      icon: '📈',
      color: results.roi >= 20 ? 'text-green-600' : results.roi >= 10 ? 'text-yellow-600' : 'text-red-600',
      bgColor: results.roi >= 20 ? 'bg-green-50 dark:bg-green-900/20' : results.roi >= 10 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20',
      description: results.roi >= 20 ? 'Excellent return' : results.roi >= 10 ? 'Good return' : 'Below target'
    },
    {
      label: 'Net Present Value',
      value: formatCurrency(results.npv || results.netBenefit),
      icon: '💰',
      color: (results.npv || results.netBenefit) > 0 ? 'text-green-600' : 'text-red-600',
      bgColor: (results.npv || results.netBenefit) > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
      description: (results.npv || results.netBenefit) > 0 ? 'Positive value creation' : 'Value destruction'
    },
    {
      label: 'Payback Period',
      value: `${results.paybackPeriod.toFixed(1)} years`,
      icon: '⏱️',
      color: results.paybackPeriod <= 2 ? 'text-green-600' : results.paybackPeriod <= 4 ? 'text-yellow-600' : 'text-red-600',
      bgColor: results.paybackPeriod <= 2 ? 'bg-green-50 dark:bg-green-900/20' : results.paybackPeriod <= 4 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20',
      description: results.paybackPeriod <= 2 ? 'Quick recovery' : results.paybackPeriod <= 4 ? 'Moderate timeline' : 'Extended recovery'
    }
  ];

  // Calculate chart dimensions
  const chartWidth = 600;
  const chartHeight = 250;
  const padding = 40;
  const maxValue = Math.max(...projections.map(p => Math.max(p.revenue, p.costs)));
  const minValue = Math.min(...projections.map(p => p.cumulativeProfit), 0);
  const valueRange = maxValue - minValue;

  const getY = (value: number) => {
    return chartHeight - padding - ((value - minValue) / valueRange) * (chartHeight - 2 * padding);
  };

  const getX = (index: number) => {
    return padding + (index / (projections.length - 1)) * (chartWidth - 2 * padding);
  };

  // Generate SVG paths
  const revenuePath = projections.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.revenue)}`
  ).join(' ');

  const costsPath = projections.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.costs)}`
  ).join(' ');

  const profitPath = projections.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.cumulativeProfit)}`
  ).join(' ');

  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setRecommendations([...recommendations, newRecommendation.trim()]);
      setNewRecommendation('');
      setShowAddRecommendation(false);
    }
  };

  const removeRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    if (onExport) {
      onExport('pdf');
    } else {
      // Fallback: Generate text-based PDF content
      const content = generateTextReport();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${results.projectName || 'Executive-Report'}-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const generateTextReport = () => {
    const divider = '═'.repeat(60);
    const subDivider = '─'.repeat(60);
    
    let report = `
${divider}
                    EXECUTIVE SUMMARY REPORT
${divider}

Project: ${results.projectName || 'ROI Analysis'}
Generated: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
${branding.companyName ? `Company: ${branding.companyName}` : ''}

${subDivider}
                        KEY METRICS
${subDivider}

  📈 Return on Investment (ROI)
     ${formatPercent(results.roi)}
     ${topMetrics[0].description}

  💰 Net Present Value (NPV)
     ${formatCurrency(results.npv || results.netBenefit)}
     ${topMetrics[1].description}

  ⏱️ Payback Period
     ${results.paybackPeriod.toFixed(1)} years
     ${topMetrics[2].description}

${subDivider}
                     FINANCIAL OVERVIEW
${subDivider}

  Total Investment:      ${formatCurrency(results.totalInvestment)}
  Annual Benefit:        ${formatCurrency(results.annualBenefit)}
  Net Benefit:           ${formatCurrency(results.netBenefit)}
  ${results.irr ? `Internal Rate of Return: ${formatPercent(results.irr)}` : ''}

${subDivider}
                    5-YEAR PROJECTIONS
${subDivider}

  Year    Revenue         Costs           Profit          Cumulative
  ${subDivider}
${projections.map(p => 
  `  ${p.year}       ${formatCurrency(p.revenue).padEnd(15)} ${formatCurrency(p.costs).padEnd(15)} ${formatCurrency(p.profit).padEnd(15)} ${formatCurrency(p.cumulativeProfit)}`
).join('\n')}

${subDivider}
                      RECOMMENDATIONS
${subDivider}

${recommendations.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

${notes ? `
${subDivider}
                     ADDITIONAL NOTES
${subDivider}

${notes}
` : ''}

${divider}
                      END OF REPORT
${divider}
`;
    
    return report;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto print:max-h-none print:overflow-visible print:shadow-none">
        {/* Header */}
        <div 
          className="sticky top-0 z-10 px-8 py-6 border-b border-gray-200 dark:border-slate-700 print:static"
          style={{ 
            background: `linear-gradient(135deg, ${branding.primaryColor || '#3B82F6'}, ${branding.secondaryColor || '#8B5CF6'})` 
          }}
        >
          <div className="flex items-center justify-between">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                {branding.logoUrl && (
                  <img src={branding.logoUrl} alt="Logo" className="h-10 w-auto" />
                )}
                <h1 className="text-2xl font-bold">Executive Summary Report</h1>
              </div>
              <p className="text-white/80">
                {results.projectName || 'ROI Analysis'} • Generated {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <span>🖨️</span> Print
              </button>
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <span>📄</span> Export
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div ref={reportRef} className="p-8 space-y-8">
          {/* Top 3 Metrics */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Key Performance Indicators
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topMetrics.map((metric, index) => (
                <div
                  key={index}
                  className={`${metric.bgColor} rounded-xl p-6 border-2 border-transparent hover:border-current transition-all duration-300 transform hover:scale-105`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{metric.icon}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${metric.bgColor} ${metric.color}`}>
                      {metric.description}
                    </span>
                  </div>
                  <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Financial Overview */}
          <section className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💼</span> Financial Overview
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Investment</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(results.totalInvestment)}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Annual Benefit</div>
                <div className="text-xl font-bold text-green-600">
                  {formatCurrency(results.annualBenefit)}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Net Benefit</div>
                <div className={`text-xl font-bold ${results.netBenefit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.netBenefit)}
                </div>
              </div>
              {results.irr && (
                <div className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Internal Rate of Return</div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatPercent(results.irr)}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Chart Visualization */}
          <section className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> 5-Year Financial Projection
            </h2>
            
            {/* Legend */}
            <div className="flex flex-wrap gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Costs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Cumulative Profit</span>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-3xl mx-auto">
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = padding + ratio * (chartHeight - 2 * padding);
                  const value = maxValue - ratio * valueRange;
                  return (
                    <g key={i}>
                      <line
                        x1={padding}
                        y1={y}
                        x2={chartWidth - padding}
                        y2={y}
                        stroke="currentColor"
                        strokeOpacity={0.1}
                        strokeDasharray="4"
                      />
                      <text
                        x={padding - 5}
                        y={y}
                        textAnchor="end"
                        dominantBaseline="middle"
                        className="text-xs fill-gray-500"
                      >
                        {formatCurrency(value)}
                      </text>
                    </g>
                  );
                })}

                {/* Zero line */}
                <line
                  x1={padding}
                  y1={getY(0)}
                  x2={chartWidth - padding}
                  y2={getY(0)}
                  stroke="currentColor"
                  strokeOpacity={0.3}
                  strokeWidth={2}
                />

                {/* Revenue line */}
                <path
                  d={revenuePath}
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Costs line */}
                <path
                  d={costsPath}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Cumulative Profit line */}
                <path
                  d={profitPath}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="8 4"
                />

                {/* Data points */}
                {projections.map((p, i) => (
                  <g key={i}>
                    <circle cx={getX(i)} cy={getY(p.revenue)} r={5} fill="#22C55E" />
                    <circle cx={getX(i)} cy={getY(p.costs)} r={5} fill="#EF4444" />
                    <circle cx={getX(i)} cy={getY(p.cumulativeProfit)} r={5} fill="#3B82F6" />
                    <text
                      x={getX(i)}
                      y={chartHeight - 10}
                      textAnchor="middle"
                      className="text-xs fill-gray-600 dark:fill-gray-400"
                    >
                      Year {p.year}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Data Table */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-600">
                    <th className="text-left py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">Year</th>
                    <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">Revenue</th>
                    <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">Costs</th>
                    <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">Profit</th>
                    <th className="text-right py-2 px-3 text-gray-600 dark:text-gray-400 font-medium">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {projections.map((p) => (
                    <tr key={p.year} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">Year {p.year}</td>
                      <td className="py-2 px-3 text-right text-green-600">{formatCurrency(p.revenue)}</td>
                      <td className="py-2 px-3 text-right text-red-600">{formatCurrency(p.costs)}</td>
                      <td className={`py-2 px-3 text-right font-medium ${p.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(p.profit)}
                      </td>
                      <td className={`py-2 px-3 text-right font-medium ${p.cumulativeProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {formatCurrency(p.cumulativeProfit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recommendations */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-2xl">💡</span> Recommendations
              </h2>
              <button
                onClick={() => setShowAddRecommendation(!showAddRecommendation)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 print:hidden"
              >
                <span>➕</span> Add Recommendation
              </button>
            </div>

            {showAddRecommendation && (
              <div className="mb-4 flex gap-2 print:hidden">
                <input
                  type="text"
                  value={newRecommendation}
                  onChange={(e) => setNewRecommendation(e.target.value)}
                  placeholder="Enter a new recommendation..."
                  className="flex-1 px-4 py-2 border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && addRecommendation()}
                />
                <button
                  onClick={addRecommendation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            )}

            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-gray-700 dark:text-gray-300">{rec}</span>
                  <button
                    onClick={() => removeRecommendation(index)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity print:hidden"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Notes Section */}
          <section className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📝</span> Additional Notes
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes, context, or observations for stakeholders..."
              rows={4}
              className="w-full px-4 py-3 border border-amber-200 dark:border-amber-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500 outline-none resize-none print:border-none print:bg-transparent"
            />
            {notes && (
              <div className="hidden print:block mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {notes}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="pt-6 border-t border-gray-200 dark:border-slate-700 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Generated by {branding.companyName || 'Lift Metric'} • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="mt-1 text-xs">
              This report is for informational purposes only. Actual results may vary.
            </p>
          </footer>
        </div>

        {/* Sticky Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-8 py-4 flex items-center justify-between print:hidden">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">{recommendations.length}</span> recommendations • 
            <span className="font-medium text-gray-900 dark:text-white ml-1">{notes.length}</span> chars in notes
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
            >
              <span>🖨️</span> Print Report
            </button>
            <button
              onClick={handleExportPDF}
              className="px-6 py-2 text-white rounded-lg transition-all duration-200 flex items-center gap-2 hover:shadow-lg transform hover:scale-105"
              style={{ backgroundColor: branding.primaryColor || '#3B82F6' }}
            >
              <span>📄</span> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutiveReport;
