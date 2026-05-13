import { useState, useEffect } from "react";
import { useEntity } from "../hooks/useEntity";
import { benchmarkDataEntityConfig } from "../entities/BenchmarkData";

type BenchmarkData = {
  id: number;
  industry: string;
  metric: string;
  value: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  sampleSize: number;
  description: string;
  created_at: string;
  updated_at: string;
};

type ComparisonProps = {
  currentValue: number;
  metricName: string;
  industry?: string;
};

export default function BenchmarkComparison({ currentValue, metricName, industry = "Technology" }: ComparisonProps) {
  const { items: benchmarks, loading } = useEntity<BenchmarkData>(benchmarkDataEntityConfig);
  const [selectedIndustry, setSelectedIndustry] = useState(industry);
  const [showPercentiles, setShowPercentiles] = useState(true);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  // Get relevant benchmark for current metric and industry
  const relevantBenchmark = benchmarks.find(
    b => b.industry === selectedIndustry && b.metric === metricName
  );

  // Calculate where current value falls
  const getPerformanceLevel = (value: number, benchmark?: BenchmarkData): string => {
    if (!benchmark) return "No Data";
    if (value >= benchmark.percentile75) return "Top Performer";
    if (value >= benchmark.percentile50) return "Above Average";
    if (value >= benchmark.percentile25) return "Below Average";
    return "Needs Improvement";
  };

  const performanceLevel = getPerformanceLevel(currentValue, relevantBenchmark);
  
  // Get unique industries from benchmarks
  const industries = [...new Set(benchmarks.map(b => b.industry))];

  // Seed some sample data if none exists
  useEffect(() => {
    if (benchmarks.length === 0) {
      // Sample data would be created here in production
    }
  }, [benchmarks]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📊</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Benchmark Comparison</h2>
            <p className="text-gray-600">Compare your results against industry data</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("chart")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              viewMode === "chart"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📈 Chart
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              viewMode === "table"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📋 Table
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {/* Industry Selector */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Industry
          </label>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {industries.length > 0 ? (
              industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))
            ) : (
              <>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
              </>
            )}
          </select>
        </div>

        {/* Toggle Percentiles */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPercentiles}
              onChange={(e) => setShowPercentiles(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Show Percentiles</span>
          </label>
        </div>
      </div>

      {/* Current Value Display */}
      <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Your Current Result</p>
            <p className="text-3xl font-bold text-blue-900">{currentValue.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Performance Level</p>
            <span className={`inline-block px-4 py-2 rounded-full font-semibold ${
              performanceLevel === "Top Performer" ? "bg-green-100 text-green-800" :
              performanceLevel === "Above Average" ? "bg-blue-100 text-blue-800" :
              performanceLevel === "Below Average" ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }`}>
              {performanceLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Benchmark Visualization */}
      {viewMode === "chart" ? (
        <div className="space-y-6">
          {relevantBenchmark ? (
            <>
              {/* Visual Bar Chart */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Industry Benchmark Range</h3>
                
                {/* Percentile Bars */}
                {showPercentiles && (
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">25th Percentile</span>
                        <span className="font-semibold">{relevantBenchmark.percentile25.toFixed(2)}</span>
                      </div>
                      <div className="h-8 bg-gray-200 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-red-400 transition-all duration-500"
                          style={{ width: `${(relevantBenchmark.percentile25 / Math.max(currentValue, relevantBenchmark.percentile75 * 1.2)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">50th Percentile (Median)</span>
                        <span className="font-semibold">{relevantBenchmark.percentile50.toFixed(2)}</span>
                      </div>
                      <div className="h-8 bg-gray-200 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-yellow-400 transition-all duration-500"
                          style={{ width: `${(relevantBenchmark.percentile50 / Math.max(currentValue, relevantBenchmark.percentile75 * 1.2)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">75th Percentile</span>
                        <span className="font-semibold">{relevantBenchmark.percentile75.toFixed(2)}</span>
                      </div>
                      <div className="h-8 bg-gray-200 rounded-lg overflow-hidden relative">
                        <div 
                          className="h-full bg-green-400 transition-all duration-500"
                          style={{ width: `${(relevantBenchmark.percentile75 / Math.max(currentValue, relevantBenchmark.percentile75 * 1.2)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Your Result */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-900 font-semibold">Your Result</span>
                    <span className="font-bold text-blue-900">{currentValue.toFixed(2)}</span>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 shadow-lg"
                      style={{ width: `${(currentValue / Math.max(currentValue, relevantBenchmark.percentile75 * 1.2)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Benchmark Info */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Benchmark Details:</strong> {relevantBenchmark.description}
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Based on {relevantBenchmark.sampleSize} companies in the {selectedIndustry} industry
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📊</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Benchmark Data Available</h3>
              <p className="text-gray-600">
                Benchmark data for {metricName} in {selectedIndustry} industry is not available yet.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Contact support to request benchmark data for your industry.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Metric</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Your Value</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">25th %</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">50th %</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">75th %</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {relevantBenchmark ? (
                <tr className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{metricName}</td>
                  <td className="px-4 py-3 text-sm font-bold text-blue-900 text-right">{currentValue.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{relevantBenchmark.percentile25.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{relevantBenchmark.percentile50.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{relevantBenchmark.percentile75.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      performanceLevel === "Top Performer" ? "bg-green-100 text-green-800" :
                      performanceLevel === "Above Average" ? "bg-blue-100 text-blue-800" :
                      performanceLevel === "Below Average" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {performanceLevel}
                    </span>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No benchmark data available for this metric
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
