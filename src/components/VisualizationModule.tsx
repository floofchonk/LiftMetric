import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  Settings,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  Percent,
  Clock,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';

interface CalculationHistoryItem {
  id: string;
  name: string;
  date: string;
  totalCost: number;
  roi: number;
  savings: number;
  paybackMonths: number;
  duration?: number;
  mode?: string;
}

interface ChartDataPoint {
  name: string;
  date: string;
  [key: string]: string | number;
}

interface AxisConfig {
  xAxisLabel: string;
  yAxisLabel: string;
  yAxisKey: 'totalCost' | 'roi' | 'savings' | 'paybackMonths' | 'duration';
}

interface VisualizationModuleProps {
  calculationHistory?: CalculationHistoryItem[];
  onExport?: (data: ChartDataPoint[]) => void;
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
];

const METRIC_OPTIONS = [
  { key: 'totalCost', label: 'Total Cost', icon: DollarSign, format: 'currency' },
  { key: 'roi', label: 'ROI %', icon: Percent, format: 'percent' },
  { key: 'savings', label: 'Cost Savings', icon: TrendingUp, format: 'currency' },
  { key: 'paybackMonths', label: 'Payback Period', icon: Clock, format: 'months' },
  { key: 'duration', label: 'Duration', icon: Calendar, format: 'weeks' },
] as const;

// Sample data for demonstration
const SAMPLE_HISTORY: CalculationHistoryItem[] = [
  { id: '1', name: 'Q1 Planning', date: '2024-01-15', totalCost: 450000, roi: 125, savings: 180000, paybackMonths: 8, duration: 24, mode: 'staffing' },
  { id: '2', name: 'Cloud Migration', date: '2024-02-01', totalCost: 320000, roi: 210, savings: 290000, paybackMonths: 5, duration: 16, mode: 'roi' },
  { id: '3', name: 'Team Expansion', date: '2024-02-20', totalCost: 580000, roi: 95, savings: 120000, paybackMonths: 12, duration: 32, mode: 'staffing' },
  { id: '4', name: 'Automation Project', date: '2024-03-05', totalCost: 275000, roi: 340, savings: 420000, paybackMonths: 3, duration: 12, mode: 'roi' },
  { id: '5', name: 'Platform Upgrade', date: '2024-03-18', totalCost: 410000, roi: 180, savings: 310000, paybackMonths: 6, duration: 20, mode: 'staffing' },
  { id: '6', name: 'Security Overhaul', date: '2024-04-02', totalCost: 195000, roi: 150, savings: 145000, paybackMonths: 7, duration: 10, mode: 'roi' },
];

export function VisualizationModule({ calculationHistory, onExport }: VisualizationModuleProps) {
  const history = calculationHistory?.length ? calculationHistory : SAMPLE_HISTORY;
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [axisConfig, setAxisConfig] = useState<AxisConfig>({
    xAxisLabel: 'Calculation Date',
    yAxisLabel: 'Total Cost ($)',
    yAxisKey: 'totalCost',
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [secondaryMetric, setSecondaryMetric] = useState<typeof axisConfig.yAxisKey | null>(null);

  // Toggle selection of a history item
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  // Select all items
  const selectAll = () => {
    setSelectedItems(history.map(item => item.id));
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedItems([]);
  };

  // Generate chart data from selected items
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const selectedHistory = history.filter(item => selectedItems.includes(item.id));
    
    return selectedHistory
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => ({
        name: item.name,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: item.date,
        totalCost: item.totalCost,
        roi: item.roi,
        savings: item.savings,
        paybackMonths: item.paybackMonths,
        duration: item.duration || 0,
      }));
  }, [history, selectedItems]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;
    
    const values = chartData.map(d => d[axisConfig.yAxisKey] as number);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { sum, avg, min, max, count: values.length };
  }, [chartData, axisConfig.yAxisKey]);

  // Format value based on metric type
  const formatValue = (value: number, metricKey: string) => {
    const metric = METRIC_OPTIONS.find(m => m.key === metricKey);
    if (!metric) return value.toString();
    
    switch (metric.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
      case 'percent':
        return `${value.toFixed(1)}%`;
      case 'months':
        return `${value} mo`;
      case 'weeks':
        return `${value} wks`;
      default:
        return value.toString();
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatValue(entry.value, entry.dataKey)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle metric change
  const handleMetricChange = (metricKey: typeof axisConfig.yAxisKey) => {
    const metric = METRIC_OPTIONS.find(m => m.key === metricKey);
    if (metric) {
      setAxisConfig(prev => ({
        ...prev,
        yAxisKey: metricKey,
        yAxisLabel: metric.label,
      }));
    }
  };

  // Export chart data
  const handleExport = () => {
    if (onExport) {
      onExport(chartData);
    } else {
      // Default export as CSV
      const headers = ['Name', 'Date', 'Total Cost', 'ROI %', 'Savings', 'Payback (months)', 'Duration (weeks)'];
      const rows = chartData.map(d => [
        d.name,
        d.date,
        d.totalCost,
        d.roi,
        d.savings,
        d.paybackMonths,
        d.duration,
      ]);
      
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'calculation-history.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Calculation History Visualization
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select calculations to visualize trends over time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleExport}
              disabled={chartData.length === 0}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Metric (Y-Axis)
                </label>
                <div className="flex flex-wrap gap-2">
                  {METRIC_OPTIONS.map(metric => {
                    const Icon = metric.icon;
                    return (
                      <button
                        key={metric.key}
                        onClick={() => handleMetricChange(metric.key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          axisConfig.yAxisKey === metric.key
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {metric.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Compare With (Secondary Metric)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSecondaryMetric(null)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      secondaryMetric === null
                        ? 'bg-gray-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    None
                  </button>
                  {METRIC_OPTIONS.filter(m => m.key !== axisConfig.yAxisKey).map(metric => {
                    const Icon = metric.icon;
                    return (
                      <button
                        key={metric.key}
                        onClick={() => setSecondaryMetric(metric.key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          secondaryMetric === metric.key
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {metric.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  X-Axis Label
                </label>
                <input
                  type="text"
                  value={axisConfig.xAxisLabel}
                  onChange={(e) => setAxisConfig(prev => ({ ...prev, xAxisLabel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Y-Axis Label
                </label>
                <input
                  type="text"
                  value={axisConfig.yAxisLabel}
                  onChange={(e) => setAxisConfig(prev => ({ ...prev, yAxisLabel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* History Selection Panel */}
        <div className={`border-r border-gray-200 dark:border-gray-700 ${showHistory ? '' : 'hidden lg:block'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Select Data Points
              </h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="lg:hidden p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="flex-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {selectedItems.length} of {history.length} selected
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {history.map((item, index) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelection(item.id)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: isSelected ? COLORS[index % COLORS.length] : '#d1d5db' }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-5">
                        {new Date(item.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                      <div className="flex gap-3 mt-2 ml-5 text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Cost: <span className="font-medium text-gray-900 dark:text-white">
                            {formatValue(item.totalCost, 'totalCost')}
                          </span>
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ROI: <span className="font-medium text-green-600 dark:text-green-400">
                            {formatValue(item.roi, 'roi')}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-2 p-6">
          {/* Mobile toggle for history */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="lg:hidden mb-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400"
          >
            <Filter className="w-4 h-4" />
            {showHistory ? 'Hide' : 'Show'} Selection Panel
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {chartData.length === 0 ? (
            /* Empty State */
            <div className="h-80 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Data Selected
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-4">
                Select one or more calculations from the list to visualize their trends over time.
              </p>
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Select All Data Points
              </button>
            </div>
          ) : (
            <>
              {/* Statistics Bar */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Average</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatValue(stats.avg, axisConfig.yAxisKey)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Minimum</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatValue(stats.min, axisConfig.yAxisKey)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Maximum</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatValue(stats.max, axisConfig.yAxisKey)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Data Points</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {stats.count}
                    </p>
                  </div>
                </div>
              )}

              {/* Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      label={{
                        value: axisConfig.xAxisLabel,
                        position: 'bottom',
                        offset: 10,
                        style: { fill: '#6b7280', fontSize: 12 }
                      }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#3b82f6"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => {
                        if (axisConfig.yAxisKey === 'totalCost' || axisConfig.yAxisKey === 'savings') {
                          return `$${(value / 1000).toFixed(0)}k`;
                        }
                        return value.toString();
                      }}
                      label={{
                        value: axisConfig.yAxisLabel,
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: '#3b82f6', fontSize: 12 }
                      }}
                    />
                    {secondaryMetric && (
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#10b981"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(value) => {
                          if (secondaryMetric === 'totalCost' || secondaryMetric === 'savings') {
                            return `$${(value / 1000).toFixed(0)}k`;
                          }
                          return value.toString();
                        }}
                        label={{
                          value: METRIC_OPTIONS.find(m => m.key === secondaryMetric)?.label || '',
                          angle: 90,
                          position: 'insideRight',
                          style: { fill: '#10b981', fontSize: 12 }
                        }}
                      />
                    )}
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {stats && (
                      <ReferenceLine
                        y={stats.avg}
                        yAxisId="left"
                        stroke="#9ca3af"
                        strokeDasharray="5 5"
                        label={{
                          value: 'Avg',
                          position: 'right',
                          fill: '#9ca3af',
                          fontSize: 10
                        }}
                      />
                    )}
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey={axisConfig.yAxisKey}
                      name={axisConfig.yAxisLabel}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    {secondaryMetric && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey={secondaryMetric}
                        name={METRIC_OPTIONS.find(m => m.key === secondaryMetric)?.label || ''}
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                        strokeDasharray="5 5"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Data Table */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Selected Data Points</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/50">
                        <th className="text-left px-3 py-2 text-gray-600 dark:text-gray-400 font-medium">Name</th>
                        <th className="text-left px-3 py-2 text-gray-600 dark:text-gray-400 font-medium">Date</th>
                        <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-400 font-medium">Total Cost</th>
                        <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-400 font-medium">ROI</th>
                        <th className="text-right px-3 py-2 text-gray-600 dark:text-gray-400 font-medium">Savings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {chartData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{row.name}</td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{row.date}</td>
                          <td className="px-3 py-2 text-right text-gray-900 dark:text-white">
                            {formatValue(row.totalCost as number, 'totalCost')}
                          </td>
                          <td className="px-3 py-2 text-right text-green-600 dark:text-green-400">
                            {formatValue(row.roi as number, 'roi')}
                          </td>
                          <td className="px-3 py-2 text-right text-blue-600 dark:text-blue-400">
                            {formatValue(row.savings as number, 'savings')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisualizationModule;
