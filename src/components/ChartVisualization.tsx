import { useState, useEffect } from 'react';
import { Line, Bar, Pie, Area, Scatter } from 'recharts';
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useEntity } from '../hooks/useEntity';
import { chartConfigEntityConfig } from '../entities/ChartConfig';

type ChartConfig = {
  id: number;
  name: string;
  description: string;
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  dataSource: string;
  xAxisKey: string;
  yAxisKey: string;
  title: string;
  colors: string;
  showGrid: string;
  showLegend: string;
  enableZoom: string;
  enableAnimation: string;
  created_at: string;
  updated_at: string;
};

type DataPoint = {
  name?: string;
  value?: number;
  [key: string]: string | number;
};

export function ChartVisualization() {
  const {
    items: charts,
    loading,
    error,
    create,
    update,
    remove,
  } = useEntity<ChartConfig>(chartConfigEntityConfig);

  const [selectedChart, setSelectedChart] = useState<ChartConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    chartType: 'line' as 'line' | 'bar' | 'pie' | 'area' | 'scatter',
    dataSource: 'npv',
    xAxisKey: 'period',
    yAxisKey: 'value',
    title: '',
    colors: '#3b82f6,#8b5cf6,#ec4899,#10b981,#f59e0b',
    showGrid: 'true',
    showLegend: 'true',
    enableZoom: 'true',
    enableAnimation: 'true',
  });

  // Sample data generators for different financial metrics
  const generateSampleData = (dataSource: string): DataPoint[] => {
    switch (dataSource) {
      case 'npv':
        return [
          { period: 'Year 1', value: 50000, npv: 45454 },
          { period: 'Year 2', value: 75000, npv: 61983 },
          { period: 'Year 3', value: 100000, npv: 75131 },
          { period: 'Year 4', value: 125000, npv: 85356 },
          { period: 'Year 5', value: 150000, npv: 93141 },
        ];
      case 'irr':
        return [
          { scenario: 'Pessimistic', irr: 8.5, roi: 42 },
          { scenario: 'Realistic', irr: 12.3, roi: 68 },
          { scenario: 'Optimistic', irr: 18.7, roi: 95 },
        ];
      case 'cashflow':
        return [
          { month: 'Jan', inflow: 120000, outflow: 80000, net: 40000 },
          { month: 'Feb', inflow: 135000, outflow: 85000, net: 50000 },
          { month: 'Mar', inflow: 150000, outflow: 90000, net: 60000 },
          { month: 'Apr', inflow: 140000, outflow: 88000, net: 52000 },
          { month: 'May', inflow: 160000, outflow: 95000, net: 65000 },
          { month: 'Jun', inflow: 175000, outflow: 100000, net: 75000 },
        ];
      case 'roi':
        return [
          { quarter: 'Q1', roi: 15.2, target: 12 },
          { quarter: 'Q2', roi: 18.5, target: 15 },
          { quarter: 'Q3', roi: 22.3, target: 18 },
          { quarter: 'Q4', roi: 25.7, target: 20 },
        ];
      case 'breakdown':
        return [
          { name: 'Labor Costs', value: 450000 },
          { name: 'Materials', value: 280000 },
          { name: 'Overhead', value: 120000 },
          { name: 'Marketing', value: 80000 },
          { name: 'Operations', value: 70000 },
        ];
      case 'revenue':
        return [
          { month: 'Jan', revenue: 250000, expenses: 180000, profit: 70000 },
          { month: 'Feb', revenue: 275000, expenses: 190000, profit: 85000 },
          { month: 'Mar', revenue: 310000, expenses: 200000, profit: 110000 },
          { month: 'Apr', revenue: 295000, expenses: 195000, profit: 100000 },
          { month: 'May', revenue: 340000, expenses: 210000, profit: 130000 },
          { month: 'Jun', revenue: 380000, expenses: 220000, profit: 160000 },
        ];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (selectedChart) {
      const data = generateSampleData(selectedChart.dataSource);
      setChartData(data);
    }
  }, [selectedChart]);

  const handleCreateChart = async () => {
    if (!formData.name || !formData.title) {
      alert('Please provide a chart name and title');
      return;
    }

    await create(formData);
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      chartType: 'line',
      dataSource: 'npv',
      xAxisKey: 'period',
      yAxisKey: 'value',
      title: '',
      colors: '#3b82f6,#8b5cf6,#ec4899,#10b981,#f59e0b',
      showGrid: 'true',
      showLegend: 'true',
      enableZoom: 'true',
      enableAnimation: 'true',
    });
  };

  const handleDeleteChart = async (id: number) => {
    if (confirm('Are you sure you want to delete this chart?')) {
      await remove(id);
      if (selectedChart?.id === id) {
        setSelectedChart(null);
      }
    }
  };

  const renderChart = () => {
    if (!selectedChart || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Select a chart to visualize data</p>
        </div>
      );
    }

    const colors = selectedChart.colors.split(',');
    const showGrid = selectedChart.showGrid === 'true';
    const showLegend = selectedChart.showLegend === 'true';
    const enableAnimation = selectedChart.enableAnimation === 'true';

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    switch (selectedChart.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={selectedChart.xAxisKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {Object.keys(chartData[0])
                .filter((key) => key !== selectedChart.xAxisKey && typeof chartData[0][key] === 'number')
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={enableAnimation}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={selectedChart.xAxisKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {Object.keys(chartData[0])
                .filter((key) => key !== selectedChart.xAxisKey && typeof chartData[0][key] === 'number')
                .map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[index % colors.length]}
                    isAnimationActive={enableAnimation}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={(entry) => `${entry.name}: ${entry.value.toLocaleString()}`}
                isAnimationActive={enableAnimation}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={selectedChart.xAxisKey} />
              <YAxis />
              <Tooltip />
              {showLegend && <Legend />}
              {Object.keys(chartData[0])
                .filter((key) => key !== selectedChart.xAxisKey && typeof chartData[0][key] === 'number')
                .map((key, index) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.6}
                    isAnimationActive={enableAnimation}
                  />
                ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={selectedChart.xAxisKey} type="category" />
              <YAxis dataKey={selectedChart.yAxisKey} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              {showLegend && <Legend />}
              <Scatter
                name="Data Points"
                data={chartData}
                fill={colors[0]}
                isAnimationActive={enableAnimation}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading charts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading charts: {String(error)}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                📊 Chart Visualizations
              </h1>
              <p className="text-gray-600 mt-2">
                Create interactive charts from your financial data
              </p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              ➕ Create Chart
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-600 text-sm font-semibold">Total Charts</p>
              <p className="text-2xl font-bold text-blue-900">{charts.length}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-indigo-600 text-sm font-semibold">Active Visualizations</p>
              <p className="text-2xl font-bold text-indigo-900">{selectedChart ? 1 : 0}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-600 text-sm font-semibold">Data Points</p>
              <p className="text-2xl font-bold text-purple-900">{chartData.length}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Library */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Chart Library</h2>
            <div className="space-y-3">
              {charts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No charts yet. Create your first chart!
                </p>
              ) : (
                charts.map((chart) => (
                  <div
                    key={chart.id}
                    onClick={() => setSelectedChart(chart)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedChart?.id === chart.id
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{chart.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{chart.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {chart.chartType}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            {chart.dataSource}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChart(chart.id);
                        }}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chart Display */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            {selectedChart ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedChart.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedChart.description}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  {renderChart()}
                </div>
                {/* Data Table */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Data Table</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {chartData.length > 0 &&
                            Object.keys(chartData[0]).map((key) => (
                              <th
                                key={key}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {chartData.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-4 py-3 text-sm text-gray-900">
                                {typeof value === 'number' ? value.toLocaleString() : value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-6xl mb-4">📊</p>
                  <p className="text-xl font-semibold text-gray-700">Select a chart to visualize</p>
                  <p className="text-gray-500 mt-2">Choose from your chart library or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Chart Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
              <h2 className="text-2xl font-bold">📊 Create New Chart</h2>
              <p className="text-blue-100 mt-1">Configure your chart visualization</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Chart Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chart Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Financial Chart"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Brief description of what this chart shows..."
                />
              </div>

              {/* Chart Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chart Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Net Present Value Analysis"
                />
              </div>

              {/* Chart Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chart Type
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['line', 'bar', 'pie', 'area', 'scatter'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, chartType: type })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                        formData.chartType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Source */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data Source
                </label>
                <select
                  value={formData.dataSource}
                  onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="npv">Net Present Value (NPV)</option>
                  <option value="irr">Internal Rate of Return (IRR)</option>
                  <option value="cashflow">Cash Flow Projections</option>
                  <option value="roi">Return on Investment (ROI)</option>
                  <option value="breakdown">Cost Breakdown</option>
                  <option value="revenue">Revenue vs Expenses</option>
                </select>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color Palette (comma-separated hex codes)
                </label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#3b82f6,#8b5cf6,#ec4899"
                />
                <div className="flex gap-2 mt-2">
                  {formData.colors.split(',').map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: color.trim() }}
                    />
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.showGrid === 'true'}
                    onChange={(e) =>
                      setFormData({ ...formData, showGrid: e.target.checked ? 'true' : 'false' })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Show Grid</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.showLegend === 'true'}
                    onChange={(e) =>
                      setFormData({ ...formData, showLegend: e.target.checked ? 'true' : 'false' })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Show Legend</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.enableZoom === 'true'}
                    onChange={(e) =>
                      setFormData({ ...formData, enableZoom: e.target.checked ? 'true' : 'false' })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Enable Zoom</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.enableAnimation === 'true'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enableAnimation: e.target.checked ? 'true' : 'false',
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Enable Animation</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChart}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                Create Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
