import React, { useState } from 'react';
import { GitCompare, Download } from 'lucide-react';
import type { Scenario } from '../types/scenario';

interface ScenarioComparisonProps {
  scenarios: Scenario[];
}

export function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

  const toggleScenario = (id: string) => {
    setSelectedScenarios((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectedData = scenarios.filter((s) => selectedScenarios.includes(s.id));

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Compare Scenarios</h2>

      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
          Select Scenarios to Compare
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => toggleScenario(scenario.id)}
              className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 touch-manipulation ${
                selectedScenarios.includes(scenario.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedScenarios.includes(scenario.id)}
                  onChange={() => toggleScenario(scenario.id)}
                  className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 touch-manipulation"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {scenario.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {new Date(scenario.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedData.length >= 2 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Comparison Results ({selectedData.length} scenarios)
            </h3>
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg touch-manipulation"
            >
              <Download className="w-4 h-4" />
              <span>Export Comparison</span>
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-full inline-block align-middle px-4 sm:px-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Metric
                    </th>
                    {selectedData.map((scenario) => (
                      <th
                        key={scenario.id}
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="max-w-[120px] sm:max-w-none truncate">{scenario.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      Total Cost
                    </td>
                    {selectedData.map((scenario) => (
                      <td key={scenario.id} className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {scenario.results?.totalCost
                          ? `$${scenario.results.totalCost.toLocaleString()}`
                          : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      ROI %
                    </td>
                    {selectedData.map((scenario) => (
                      <td key={scenario.id} className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {scenario.results?.roi
                          ? `${scenario.results.roi.toFixed(1)}%`
                          : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      Duration
                    </td>
                    {selectedData.map((scenario) => (
                      <td key={scenario.id} className="px-3 sm:px-6 py-4 text-sm text-gray-700">
                        {scenario.results?.duration
                          ? `${scenario.results.duration} months`
                          : 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedData.length === 1 && (
        <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
          Select at least one more scenario to compare
        </div>
      )}

      {selectedData.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <GitCompare className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 text-sm sm:text-base">
            Select 2 or more scenarios above to begin comparison
          </p>
        </div>
      )}
    </div>
  );
}
