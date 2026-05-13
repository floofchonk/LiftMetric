import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Download, TrendingUp, DollarSign, Calendar, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useBranding } from '../hooks/useBranding';

type ChartType = 'line' | 'bar' | 'area' | 'pie';
type MetricType = 'npv' | 'irr' | 'roi' | 'payback' | 'cashflow';

interface DataVisualizationProps {
  initialInvestment?: number;
  onClose?: () => void;
}

export default function DataVisualization({ initialInvestment = 100000, onClose }: DataVisualizationProps) {
  const { branding: brandSettings } = useBranding();
  
  // User-adjustable parameters
  const [investment, setInvestment] = useState(initialInvestment);
  const [discountRate, setDiscountRate] = useState(10);
  const [projectionYears, setProjectionYears] = useState(5);
  const [annualRevenue, setAnnualRevenue] = useState(50000);
  const [revenueGrowth, setRevenueGrowth] = useState(15);
  const [operatingCosts, setOperatingCosts] = useState(20000);
  const [costInflation, setCostInflation] = useState(3);
  
  // Visualization settings
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('roi');
  const [showComparison, setShowComparison] = useState(false);

  // Calculate financial metrics
  const financialData = useMemo(() => {
    const years = [];
    let cumulativeRevenue = 0;
    let cumulativeCosts = investment;
    let currentRevenue = annualRevenue;
    let currentCosts = operatingCosts;

    for (let year = 1; year <= projectionYears; year++) {
      const revenue = currentRevenue;
      const costs = currentCosts;
      const profit = revenue - costs;
      const cashFlow = year === 1 ? profit - investment : profit;
      
      cumulativeRevenue += revenue;
      cumulativeCosts += costs;
      
      const roi = ((cumulativeRevenue - cumulativeCosts) / investment) * 100;
      
      // NPV calculation
      const npv = cashFlow / Math.pow(1 + discountRate / 100, year);
      
      // IRR approximation (simplified)
      const irr = ((revenue / investment) - 1) * 100;
      
      // Payback period
      const paybackPeriod = investment / (revenue - costs);

      years.push({
        year: `Year ${year}`,
        yearNum: year,
        revenue,
        costs,
        profit,
        cashFlow,
        roi: parseFloat(roi.toFixed(2)),
        npv: parseFloat(npv.toFixed(2)),
        irr: parseFloat(irr.toFixed(2)),
        payback: parseFloat(paybackPeriod.toFixed(2)),
        cumulativeProfit: cumulativeRevenue - cumulativeCosts,
      });

      // Apply growth rates for next year
      currentRevenue *= (1 + revenueGrowth / 100);
      currentCosts *= (1 + costInflation / 100);
    }

    return years;
  }, [investment, discountRate, projectionYears, annualRevenue, revenueGrowth, operatingCosts, costInflation]);

  // Summary metrics
  const summaryMetrics = useMemo(() => {
    const totalRevenue = financialData.reduce((sum, year) => sum + year.revenue, 0);
    const totalCosts = financialData.reduce((sum, year) => sum + year.costs, 0) + investment;
    const totalProfit = totalRevenue - totalCosts;
    const avgROI = financialData.reduce((sum, year) => sum + year.roi, 0) / financialData.length;
    const totalNPV = financialData.reduce((sum, year) => sum + year.npv, 0) - investment;
    const avgIRR = financialData.reduce((sum, year) => sum + year.irr, 0) / financialData.length;
    const paybackPeriod = financialData[0]?.payback || 0;

    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      avgROI,
      totalNPV,
      avgIRR,
      paybackPeriod,
    };
  }, [financialData, investment]);

  // Prepare data for different chart types
  const getChartData = () => {
    switch (selectedMetric) {
      case 'npv':
        return financialData.map(d => ({ name: d.year, value: d.npv, NPV: d.npv }));
      case 'irr':
        return financialData.map(d => ({ name: d.year, value: d.irr, IRR: d.irr }));
      case 'roi':
        return financialData.map(d => ({ name: d.year, value: d.roi, ROI: d.roi }));
      case 'payback':
        return financialData.map(d => ({ name: d.year, value: d.payback, 'Payback Period': d.payback }));
      case 'cashflow':
        return financialData.map(d => ({ 
          name: d.year, 
          Revenue: d.revenue, 
          Costs: d.costs, 
          Profit: d.profit,
          'Cash Flow': d.cashFlow 
        }));
      default:
        return financialData;
    }
  };

  // Pie chart data for cost breakdown
  const pieData = [
    { name: 'Initial Investment', value: investment, color: '#3b82f6' },
    { name: 'Operating Costs', value: operatingCosts * projectionYears, color: '#ef4444' },
    { name: 'Revenue', value: annualRevenue * projectionYears, color: '#10b981' },
  ];

  const COLORS = [brandSettings.primaryColor || '#3b82f6', brandSettings.secondaryColor || '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  // Export chart as image
  const exportChart = async (format: 'png' | 'jpg' = 'png') => {
    const chartElement = document.getElementById('data-visualization-chart');
    if (!chartElement) return;

    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `financial-visualization-${selectedMetric}-${Date.now()}.${format}`;
      link.href = canvas.toDataURL(`image/${format}`);
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Export data as CSV
  const exportCSV = () => {
    const headers = ['Year', 'Revenue', 'Costs', 'Profit', 'Cash Flow', 'ROI (%)', 'NPV', 'IRR (%)', 'Payback Period'];
    const rows = financialData.map(d => [
      d.year,
      d.revenue.toFixed(2),
      d.costs.toFixed(2),
      d.profit.toFixed(2),
      d.cashFlow.toFixed(2),
      d.roi.toFixed(2),
      d.npv.toFixed(2),
      d.irr.toFixed(2),
      d.payback.toFixed(2),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `financial-data-${Date.now()}.csv`;
    link.click();
  };

  const renderChart = () => {
    const data = getChartData();

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
            <Legend />
            {selectedMetric === 'cashflow' ? (
              <>
                <Line type="monotone" dataKey="Revenue" stroke={COLORS[0]} strokeWidth={2} />
                <Line type="monotone" dataKey="Costs" stroke={COLORS[1]} strokeWidth={2} />
                <Line type="monotone" dataKey="Profit" stroke={COLORS[2]} strokeWidth={2} />
              </>
            ) : (
              <Line 
                type="monotone" 
                dataKey={selectedMetric.toUpperCase()} 
                stroke={COLORS[0]} 
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
            <Legend />
            {selectedMetric === 'cashflow' ? (
              <>
                <Bar dataKey="Revenue" fill={COLORS[0]} />
                <Bar dataKey="Costs" fill={COLORS[1]} />
                <Bar dataKey="Profit" fill={COLORS[2]} />
              </>
            ) : (
              <Bar dataKey={selectedMetric.toUpperCase()} fill={COLORS[0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
            <Legend />
            {selectedMetric === 'cashflow' ? (
              <>
                <Area type="monotone" dataKey="Revenue" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} />
                <Area type="monotone" dataKey="Costs" stackId="2" stroke={COLORS[1]} fill={COLORS[1]} />
              </>
            ) : (
              <Area 
                type="monotone" 
                dataKey={selectedMetric.toUpperCase()} 
                stroke={COLORS[0]} 
                fill={COLORS[0]}
                fillOpacity={0.6}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Interactive Data Visualization</h1>
                <p className="text-gray-600">Real-time financial metrics analysis</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            )}
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Average ROI</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{summaryMetrics.avgROI.toFixed(2)}%</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Total NPV</span>
              </div>
              <p className="text-2xl font-bold text-green-600">${summaryMetrics.totalNPV.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Average IRR</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{summaryMetrics.avgIRR.toFixed(2)}%</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Payback Period</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{summaryMetrics.paybackPeriod.toFixed(1)} years</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parameter Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Adjust Parameters</h2>
              
              <div className="space-y-4">
                {/* Investment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Investment: ${investment.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={investment}
                    onChange={(e) => setInvestment(Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$10K</span>
                    <span>$1M</span>
                  </div>
                </div>

                {/* Discount Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Rate: {discountRate}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1%</span>
                    <span>30%</span>
                  </div>
                </div>

                {/* Projection Years */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projection Years: {projectionYears}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={projectionYears}
                    onChange={(e) => setProjectionYears(Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 yr</span>
                    <span>10 yrs</span>
                  </div>
                </div>

                {/* Annual Revenue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Revenue: ${annualRevenue.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={annualRevenue}
                    onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$10K</span>
                    <span>$500K</span>
                  </div>
                </div>

                {/* Revenue Growth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revenue Growth: {revenueGrowth}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={revenueGrowth}
                    onChange={(e) => setRevenueGrowth(Number(e.target.value))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Operating Costs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Costs: ${operatingCosts.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={operatingCosts}
                    onChange={(e) => setOperatingCosts(Number(e.target.value))}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$5K</span>
                    <span>$200K</span>
                  </div>
                </div>

                {/* Cost Inflation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Inflation: {costInflation}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={costInflation}
                    onChange={(e) => setCostInflation(Number(e.target.value))}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => exportChart('png')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Download className="w-5 h-5" />
                  Export as PNG
                </button>
                <button
                  onClick={exportCSV}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Download className="w-5 h-5" />
                  Export as CSV
                </button>
              </div>
            </div>
          </div>

          {/* Chart Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Chart Controls */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Visualization</h2>
                
                {/* Metric Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Metric</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { value: 'roi', label: 'ROI' },
                      { value: 'npv', label: 'NPV' },
                      { value: 'irr', label: 'IRR' },
                      { value: 'payback', label: 'Payback' },
                      { value: 'cashflow', label: 'Cash Flow' },
                    ].map((metric) => (
                      <button
                        key={metric.value}
                        onClick={() => setSelectedMetric(metric.value as MetricType)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          selectedMetric === metric.value
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {metric.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'line', label: 'Line', icon: LineChartIcon },
                      { value: 'bar', label: 'Bar', icon: BarChart3 },
                      { value: 'area', label: 'Area', icon: Activity },
                      { value: 'pie', label: 'Pie', icon: PieChartIcon },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => setChartType(type.value as ChartType)}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            chartType === type.value
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div id="data-visualization-chart" className="bg-white p-4 rounded-lg">
                {renderChart()}
              </div>

              {/* Data Table */}
              <div className="mt-6 overflow-x-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Detailed Data</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Year</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Revenue</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Costs</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Profit</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">ROI %</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">NPV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{row.year}</td>
                        <td className="px-4 py-2 text-right text-green-600">${row.revenue.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-red-600">${row.costs.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right text-blue-600">${row.profit.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right font-semibold text-gray-900">{row.roi}%</td>
                        <td className="px-4 py-2 text-right text-purple-600">${row.npv.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2 text-right text-green-600">${summaryMetrics.totalRevenue.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-red-600">${summaryMetrics.totalCosts.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-blue-600">${summaryMetrics.totalProfit.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">{summaryMetrics.avgROI.toFixed(2)}%</td>
                      <td className="px-4 py-2 text-right text-purple-600">${summaryMetrics.totalNPV.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
