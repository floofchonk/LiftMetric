import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Clock, Target, Award } from 'lucide-react';

interface ScenarioData {
  name: string;
  totalCost: number;
  totalBenefit: number;
  roi: number;
  netBenefit: number;
  paybackPeriod: number;
  efficiencyScore: number;
}

interface AdvancedMetricsProps {
  scenarios: ScenarioData[];
}

export default function AdvancedMetrics({ scenarios }: AdvancedMetricsProps) {
  const [showUpgradeHint, setShowUpgradeHint] = useState(true);

  if (scenarios.length < 2) {
    return null;
  }

  // Calculate percentage differences from baseline (first scenario)
  const baseline = scenarios[0];
  const percentageDiffs = scenarios.slice(1).map((scenario) => ({
    name: scenario.name,
    roiDiff: ((scenario.roi - baseline.roi) / Math.abs(baseline.roi)) * 100,
    costDiff: ((scenario.totalCost - baseline.totalCost) / baseline.totalCost) * 100,
    benefitDiff: ((scenario.totalBenefit - baseline.totalBenefit) / baseline.totalBenefit) * 100,
    netBenefitDiff: ((scenario.netBenefit - baseline.netBenefit) / Math.abs(baseline.netBenefit)) * 100,
  }));

  // Prepare data for ROI comparison chart
  const roiChartData = scenarios.map((s) => ({
    name: s.name.substring(0, 20),
    ROI: s.roi,
    'Net Benefit': s.netBenefit,
  }));

  // Prepare data for cost vs benefit chart
  const costBenefitData = scenarios.map((s) => ({
    name: s.name.substring(0, 20),
    Cost: s.totalCost,
    Benefit: s.totalBenefit,
  }));

  // Prepare radar chart data for overall performance
  const radarData = [
    {
      metric: 'ROI',
      ...scenarios.reduce((acc, s, idx) => {
        acc[`Scenario ${idx + 1}`] = Math.min(s.roi / 10, 100);
        return acc;
      }, {} as Record<string, number>),
    },
    {
      metric: 'Efficiency',
      ...scenarios.reduce((acc, s, idx) => {
        acc[`Scenario ${idx + 1}`] = s.efficiencyScore * 10;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      metric: 'Payback Speed',
      ...scenarios.reduce((acc, s, idx) => {
        acc[`Scenario ${idx + 1}`] = Math.max(0, 100 - s.paybackPeriod * 10);
        return acc;
      }, {} as Record<string, number>),
    },
    {
      metric: 'Net Value',
      ...scenarios.reduce((acc, s, idx) => {
        const maxBenefit = Math.max(...scenarios.map((sc) => sc.netBenefit));
        acc[`Scenario ${idx + 1}`] = (s.netBenefit / maxBenefit) * 100;
        return acc;
      }, {} as Record<string, number>),
    },
    {
      metric: 'Cost Efficiency',
      ...scenarios.reduce((acc, s, idx) => {
        const minCost = Math.min(...scenarios.map((sc) => sc.totalCost));
        acc[`Scenario ${idx + 1}`] = (minCost / s.totalCost) * 100;
        return acc;
      }, {} as Record<string, number>),
    },
  ];

  // Break-even analysis
  const breakEvenData = scenarios.map((s) => {
    const monthlyBenefit = s.totalBenefit / 12;
    const breakEvenPoint = s.totalCost / monthlyBenefit;
    return {
      name: s.name,
      breakEvenMonths: breakEvenPoint,
      paybackPeriod: s.paybackPeriod,
    };
  });

  // Find best and worst performers
  const bestROI = scenarios.reduce((prev, curr) => (curr.roi > prev.roi ? curr : prev));
  const bestValue = scenarios.reduce((prev, curr) =>
    curr.netBenefit > prev.netBenefit ? curr : prev
  );
  const fastestPayback = scenarios.reduce((prev, curr) =>
    curr.paybackPeriod < prev.paybackPeriod ? curr : prev
  );
  const mostEfficient = scenarios.reduce((prev, curr) =>
    curr.efficiencyScore > prev.efficiencyScore ? curr : prev
  );

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      {/* Key Performance Indicators */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" />
          Top Performers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Highest ROI</span>
            </div>
            <p className="text-lg font-bold text-blue-900">{bestROI.name}</p>
            <p className="text-2xl font-bold text-blue-600">{bestROI.roi.toFixed(1)}%</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Best Value</span>
            </div>
            <p className="text-lg font-bold text-green-900">{bestValue.name}</p>
            <p className="text-2xl font-bold text-green-600">
              ${bestValue.netBenefit.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Fastest Payback</span>
            </div>
            <p className="text-lg font-bold text-orange-900">{fastestPayback.name}</p>
            <p className="text-2xl font-bold text-orange-600">
              {fastestPayback.paybackPeriod.toFixed(1)} mo
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Most Efficient</span>
            </div>
            <p className="text-lg font-bold text-purple-900">{mostEfficient.name}</p>
            <p className="text-2xl font-bold text-purple-600">
              {mostEfficient.efficiencyScore.toFixed(1)}/10
            </p>
          </div>
        </div>
      </div>

      {/* Percentage Differences from Baseline */}
      {percentageDiffs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Percentage Difference from Baseline ({baseline.name})
          </h3>
          <div className="space-y-4">
            {percentageDiffs.map((diff, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                <h4 className="font-semibold text-gray-900 mb-3">{diff.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">ROI</p>
                    <div className="flex items-center justify-center gap-1">
                      {diff.roiDiff > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`font-bold ${
                          diff.roiDiff > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {diff.roiDiff > 0 ? '+' : ''}
                        {diff.roiDiff.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Cost</p>
                    <div className="flex items-center justify-center gap-1">
                      {diff.costDiff > 0 ? (
                        <TrendingUp className="w-4 h-4 text-red-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-600" />
                      )}
                      <span
                        className={`font-bold ${
                          diff.costDiff > 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {diff.costDiff > 0 ? '+' : ''}
                        {diff.costDiff.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Benefit</p>
                    <div className="flex items-center justify-center gap-1">
                      {diff.benefitDiff > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`font-bold ${
                          diff.benefitDiff > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {diff.benefitDiff > 0 ? '+' : ''}
                        {diff.benefitDiff.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Net Benefit</p>
                    <div className="flex items-center justify-center gap-1">
                      {diff.netBenefitDiff > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`font-bold ${
                          diff.netBenefitDiff > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {diff.netBenefitDiff > 0 ? '+' : ''}
                        {diff.netBenefitDiff.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROI & Net Benefit Comparison Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">ROI & Net Benefit Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roiChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'ROI') return `${value.toFixed(1)}%`;
                return `$${value.toLocaleString()}`;
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="ROI" fill="#3b82f6" name="ROI (%)" />
            <Bar yAxisId="right" dataKey="Net Benefit" fill="#10b981" name="Net Benefit ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost vs Benefit Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Cost vs Benefit Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costBenefitData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="Cost" fill="#ef4444" name="Total Cost ($)" />
            <Bar dataKey="Benefit" fill="#10b981" name="Total Benefit ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Break-Even Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Break-Even Analysis</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Scenario</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">
                  Break-Even Point
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">
                  Payback Period
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {breakEvenData.map((item, idx) => {
                const isQuick = item.breakEvenMonths < 12;
                return (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {item.breakEvenMonths.toFixed(1)} months
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      {item.paybackPeriod.toFixed(1)} months
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          isQuick
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {isQuick ? (
                          <>
                            <TrendingUp className="w-4 h-4" />
                            Fast
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            Moderate
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overall Performance Radar */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Overall Performance Radar</h3>
        <p className="text-sm text-gray-600 mb-4">
          Comprehensive view of all performance dimensions (normalized to 0-100 scale)
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            {scenarios.map((_, idx) => (
              <Radar
                key={idx}
                name={scenarios[idx].name.substring(0, 20)}
                dataKey={`Scenario ${idx + 1}`}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.3}
              />
            ))}
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Key Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <p className="text-gray-700">
              <strong>{bestROI.name}</strong> delivers the highest ROI at{' '}
              <strong className="text-blue-600">{bestROI.roi.toFixed(1)}%</strong>, making it the
              most profitable option percentage-wise.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <p className="text-gray-700">
              <strong>{bestValue.name}</strong> provides the best absolute value with a net benefit
              of <strong className="text-green-600">${bestValue.netBenefit.toLocaleString()}</strong>
              .
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
            <p className="text-gray-700">
              <strong>{fastestPayback.name}</strong> reaches break-even fastest at{' '}
              <strong className="text-orange-600">
                {fastestPayback.paybackPeriod.toFixed(1)} months
              </strong>
              , ideal for quick returns.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
            <p className="text-gray-700">
              <strong>{mostEfficient.name}</strong> scores highest in efficiency at{' '}
              <strong className="text-purple-600">
                {mostEfficient.efficiencyScore.toFixed(1)}/10
              </strong>
              , indicating optimal resource utilization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
