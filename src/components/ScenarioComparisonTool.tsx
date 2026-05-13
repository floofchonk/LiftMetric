import React, { useState, useCallback, useMemo } from 'react';
import {
  GitCompare,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Download,
  ChevronDown,
  ChevronUp,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
  BarChart3,
  DollarSign,
  Clock,
  Percent,
  AlertCircle,
  CheckCircle,
  Star,
  ArrowRight,
  Layers,
  RefreshCw,
} from 'lucide-react';

// Types
interface ScenarioInputs {
  projectName?: string;
  budget?: number;
  timeline?: number;
  teamSize?: number;
  hourlyRate?: number;
  overheadMultiplier?: number;
  [key: string]: any;
}

interface ScenarioResults {
  totalCosts: number;
  totalRevenue?: number;
  netProfit?: number;
  savings: number;
  roi: number | { percentage: number; amount?: number };
  paybackPeriod: number;
  npv?: number;
  irr?: number;
  profitMargin?: number;
  efficiency?: number;
  [key: string]: any;
}

interface ComparisonScenario {
  id: string;
  name: string;
  description?: string;
  inputs: ScenarioInputs;
  results: ScenarioResults;
  createdAt: string;
  lastModified?: string;
  tags?: string[];
  color?: string;
  isBaseline?: boolean;
}

interface ScenarioComparisonToolProps {
  scenarios: ComparisonScenario[];
  onSaveScenario?: (scenario: ComparisonScenario) => void;
  onDeleteScenario?: (id: string) => void;
  onDuplicateScenario?: (id: string, newName?: string) => void;
  onUpdateScenario?: (id: string, updates: Partial<ComparisonScenario>) => void;
  onExportComparison?: (selectedIds: string[], format: 'pdf' | 'csv' | 'excel') => void;
}

// Helper functions
function getRoiValue(roi: number | { percentage: number } | undefined): number {
  if (roi === undefined) return 0;
  if (typeof roi === 'number') return roi;
  return roi.percentage || 0;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function calculateDifference(value1: number, value2: number): { diff: number; percent: number } {
  const diff = value1 - value2;
  const percent = value2 !== 0 ? ((value1 - value2) / Math.abs(value2)) * 100 : 0;
  return { diff, percent };
}

// Preset scenario templates
const SCENARIO_PRESETS = [
  { name: 'Aggressive Growth', description: 'High investment, fast timeline, maximum resources' },
  { name: 'Baseline', description: 'Standard approach with balanced risk/reward' },
  { name: 'Conservative', description: 'Low risk, steady growth, extended timeline' },
  { name: 'Cost-Optimized', description: 'Minimal spend, lean team, efficiency focus' },
  { name: 'Quality Focus', description: 'Premium resources, thorough testing, higher costs' },
];

const SCENARIO_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
];

export function ScenarioComparisonTool({
  scenarios,
  onSaveScenario,
  onDeleteScenario,
  onDuplicateScenario,
  onUpdateScenario,
  onExportComparison,
}: ScenarioComparisonToolProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioDescription, setNewScenarioDescription] = useState('');
  const [baselineId, setBaselineId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedMetrics, setExpandedMetrics] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'roi' | 'cost' | 'date'>('date');

  // Selected scenarios for comparison
  const selectedScenarios = useMemo(() => {
    return scenarios.filter((s) => selectedIds.includes(s.id));
  }, [scenarios, selectedIds]);

  // Baseline scenario
  const baseline = useMemo(() => {
    return scenarios.find((s) => s.id === baselineId) || selectedScenarios[0];
  }, [scenarios, baselineId, selectedScenarios]);

  // Sort scenarios
  const sortedScenarios = useMemo(() => {
    return [...scenarios].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'roi':
          return getRoiValue(b.results.roi) - getRoiValue(a.results.roi);
        case 'cost':
          return a.results.totalCosts - b.results.totalCosts;
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [scenarios, sortBy]);

  // Calculate winner for each metric
  const metricWinners = useMemo(() => {
    if (selectedScenarios.length < 2) return {};

    const winners: Record<string, { id: string; value: number }> = {};

    // Highest ROI wins
    let maxRoi = -Infinity;
    selectedScenarios.forEach((s) => {
      const roi = getRoiValue(s.results.roi);
      if (roi > maxRoi) {
        maxRoi = roi;
        winners.roi = { id: s.id, value: roi };
      }
    });

    // Lowest cost wins
    let minCost = Infinity;
    selectedScenarios.forEach((s) => {
      if (s.results.totalCosts < minCost) {
        minCost = s.results.totalCosts;
        winners.cost = { id: s.id, value: minCost };
      }
    });

    // Highest savings wins
    let maxSavings = -Infinity;
    selectedScenarios.forEach((s) => {
      if (s.results.savings > maxSavings) {
        maxSavings = s.results.savings;
        winners.savings = { id: s.id, value: maxSavings };
      }
    });

    // Shortest payback wins
    let minPayback = Infinity;
    selectedScenarios.forEach((s) => {
      if (s.results.paybackPeriod > 0 && s.results.paybackPeriod < minPayback) {
        minPayback = s.results.paybackPeriod;
        winners.payback = { id: s.id, value: minPayback };
      }
    });

    // Highest NPV wins
    let maxNpv = -Infinity;
    selectedScenarios.forEach((s) => {
      if (s.results.npv && s.results.npv > maxNpv) {
        maxNpv = s.results.npv;
        winners.npv = { id: s.id, value: maxNpv };
      }
    });

    return winners;
  }, [selectedScenarios]);

  // Toggle scenario selection
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 5) {
        return prev; // Max 5 scenarios
      }
      return [...prev, id];
    });
  }, []);

  // Start editing a scenario name
  const startEditing = useCallback((scenario: ComparisonScenario) => {
    setEditingId(scenario.id);
    setEditName(scenario.name);
    setEditDescription(scenario.description || '');
  }, []);

  // Save edited name
  const saveEdit = useCallback(() => {
    if (editingId && editName.trim() && onUpdateScenario) {
      onUpdateScenario(editingId, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
    }
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  }, [editingId, editName, editDescription, onUpdateScenario]);

  // Create new scenario from preset
  const createFromPreset = useCallback(
    (preset: (typeof SCENARIO_PRESETS)[0]) => {
      const newScenario: ComparisonScenario = {
        id: `scenario_${Date.now()}`,
        name: newScenarioName || preset.name,
        description: newScenarioDescription || preset.description,
        inputs: {
          projectName: newScenarioName || preset.name,
          budget: 100000,
          timeline: 12,
          teamSize: 5,
        },
        results: {
          totalCosts: 0,
          savings: 0,
          roi: 0,
          paybackPeriod: 0,
        },
        createdAt: new Date().toISOString(),
        color: SCENARIO_COLORS[scenarios.length % SCENARIO_COLORS.length],
      };

      if (onSaveScenario) {
        onSaveScenario(newScenario);
      }

      setShowCreateModal(false);
      setNewScenarioName('');
      setNewScenarioDescription('');
      setSelectedIds((prev) => [...prev, newScenario.id]);
    },
    [newScenarioName, newScenarioDescription, scenarios.length, onSaveScenario]
  );

  // Export comparison
  const handleExport = useCallback(
    (format: 'pdf' | 'csv' | 'excel') => {
      if (onExportComparison && selectedIds.length >= 2) {
        onExportComparison(selectedIds, format);
      }
    },
    [selectedIds, onExportComparison]
  );

  // Get difference indicator
  const getDifferenceIndicator = (value: number, baseline: number, isLowerBetter: boolean = false) => {
    const { diff, percent } = calculateDifference(value, baseline);
    const isPositive = isLowerBetter ? diff < 0 : diff > 0;
    const isNeutral = Math.abs(percent) < 1;

    if (isNeutral) {
      return (
        <span className="flex items-center gap-1 text-gray-500 text-xs">
          <Minus className="w-3 h-3" />
          <span>~0%</span>
        </span>
      );
    }

    return (
      <span
        className={`flex items-center gap-1 text-xs ${
          isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}
      >
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        <span>{formatPercent(percent)}</span>
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <GitCompare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Scenario Comparison Tool
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Compare up to 5 scenarios side-by-side with detailed metric analysis
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="roi">Sort by ROI</option>
              <option value="cost">Sort by Cost</option>
            </select>

            {/* Create New Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Scenario</span>
            </button>

            {/* Export Button */}
            {selectedIds.length >= 2 && (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-lg"
                  >
                    Export as Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selection Status */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {selectedIds.length} of {scenarios.length} selected
          </span>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              className="text-red-600 dark:text-red-400 hover:underline"
            >
              Clear selection
            </button>
          )}
          {selectedIds.length < scenarios.length && scenarios.length <= 5 && (
            <button
              onClick={() => setSelectedIds(scenarios.map((s) => s.id))}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Select all
            </button>
          )}
        </div>
      </div>

      {/* Scenario Selection Grid */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Select Scenarios to Compare
        </h3>

        {scenarios.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No scenarios available. Create your first scenario to get started.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Scenario
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedScenarios.map((scenario, index) => {
              const isSelected = selectedIds.includes(scenario.id);
              const isBaseline = scenario.id === baselineId;
              const scenarioColor = scenario.color || SCENARIO_COLORS[index % SCENARIO_COLORS.length];
              const roi = getRoiValue(scenario.results.roi);

              return (
                <div
                  key={scenario.id}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                  onClick={() => toggleSelection(scenario.id)}
                >
                  {/* Color indicator */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                    style={{ backgroundColor: scenarioColor }}
                  />

                  {/* Baseline badge */}
                  {isBaseline && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Baseline
                    </div>
                  )}

                  <div className="flex items-start justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelection(scenario.id);
                        }}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1 min-w-0">
                        {editingId === scenario.id ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                              autoFocus
                            />
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Description..."
                              className="w-full px-2 py-1 mt-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={saveEdit}
                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              {scenario.name}
                            </h4>
                            {scenario.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                {scenario.description}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {editingId !== scenario.id && (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => startEditing(scenario)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="Rename"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setBaselineId(scenario.id === baselineId ? null : scenario.id)}
                          className={`p-1.5 rounded ${
                            isBaseline
                              ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/30'
                              : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                          }`}
                          title="Set as baseline"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick metrics */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">ROI</p>
                      <p
                        className={`text-sm font-bold ${
                          roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {roi.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cost</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(scenario.results.totalCosts)}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {onDuplicateScenario && (
                      <button
                        onClick={() => onDuplicateScenario(scenario.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        Duplicate
                      </button>
                    )}
                    {onDeleteScenario && (
                      <button
                        onClick={() => {
                          if (confirm('Delete this scenario?')) {
                            onDeleteScenario(scenario.id);
                            setSelectedIds((prev) => prev.filter((id) => id !== scenario.id));
                          }
                        }}
                        className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Date */}
                  <p className="mt-2 text-xs text-gray-400 text-center">
                    {new Date(scenario.lastModified || scenario.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {selectedScenarios.length >= 2 && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Comparison Results
              </h3>
            </div>
            <button
              onClick={() => setExpandedMetrics(!expandedMetrics)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {expandedMetrics ? 'Collapse' : 'Expand'}
              {expandedMetrics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {viewMode === 'cards' ? (
            /* Card View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {selectedScenarios.map((scenario, index) => {
                const isBaselineScenario = scenario.id === baseline?.id;
                const roi = getRoiValue(scenario.results.roi);
                const baselineRoi = baseline ? getRoiValue(baseline.results.roi) : 0;
                const scenarioColor = scenario.color || SCENARIO_COLORS[index % SCENARIO_COLORS.length];

                return (
                  <div
                    key={scenario.id}
                    className={`rounded-xl border-2 overflow-hidden ${
                      isBaselineScenario
                        ? 'border-amber-500 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {/* Header */}
                    <div
                      className="p-4 text-white"
                      style={{ backgroundColor: scenarioColor }}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold truncate">{scenario.name}</h4>
                        {isBaselineScenario && <Star className="w-5 h-5 text-amber-300" />}
                      </div>
                      {scenario.description && (
                        <p className="text-sm opacity-80 truncate mt-1">{scenario.description}</p>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="p-4 bg-white dark:bg-gray-800 space-y-4">
                      {/* ROI */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">ROI</span>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              metricWinners.roi?.id === scenario.id
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {roi.toFixed(1)}%
                            {metricWinners.roi?.id === scenario.id && (
                              <Trophy className="w-4 h-4 inline ml-1 text-amber-500" />
                            )}
                          </p>
                          {!isBaselineScenario && baseline && (
                            getDifferenceIndicator(roi, baselineRoi)
                          )}
                        </div>
                      </div>

                      {/* Total Cost */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Cost</span>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              metricWinners.cost?.id === scenario.id
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-900 dark:text-white'
                            }`}
                          >
                            {formatCurrency(scenario.results.totalCosts)}
                            {metricWinners.cost?.id === scenario.id && (
                              <Trophy className="w-4 h-4 inline ml-1 text-amber-500" />
                            )}
                          </p>
                          {!isBaselineScenario && baseline && (
                            getDifferenceIndicator(
                              scenario.results.totalCosts,
                              baseline.results.totalCosts,
                              true
                            )
                          )}
                        </div>
                      </div>

                      {expandedMetrics && (
                        <>
                          {/* Savings */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Savings</span>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-bold ${
                                  metricWinners.savings?.id === scenario.id
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                {formatCurrency(scenario.results.savings)}
                                {metricWinners.savings?.id === scenario.id && (
                                  <Trophy className="w-4 h-4 inline ml-1 text-amber-500" />
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Payback Period */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Payback</span>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-bold ${
                                  metricWinners.payback?.id === scenario.id
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                {scenario.results.paybackPeriod} mo
                                {metricWinners.payback?.id === scenario.id && (
                                  <Trophy className="w-4 h-4 inline ml-1 text-amber-500" />
                                )}
                              </p>
                            </div>
                          </div>

                          {/* NPV if available */}
                          {scenario.results.npv !== undefined && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">NPV</span>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-bold ${
                                    metricWinners.npv?.id === scenario.id
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-gray-900 dark:text-white'
                                  }`}
                                >
                                  {formatCurrency(scenario.results.npv)}
                                  {metricWinners.npv?.id === scenario.id && (
                                    <Trophy className="w-4 h-4 inline ml-1 text-amber-500" />
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Metric
                    </th>
                    {selectedScenarios.map((scenario) => (
                      <th
                        key={scenario.id}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                scenario.color ||
                                SCENARIO_COLORS[selectedScenarios.indexOf(scenario) % SCENARIO_COLORS.length],
                            }}
                          />
                          {scenario.name}
                          {scenario.id === baselineId && <Star className="w-4 h-4 text-amber-500" />}
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Best
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* ROI Row */}
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">ROI %</td>
                    {selectedScenarios.map((scenario) => (
                      <td
                        key={scenario.id}
                        className={`px-4 py-3 ${
                          metricWinners.roi?.id === scenario.id
                            ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400'
                            : ''
                        }`}
                      >
                        {getRoiValue(scenario.results.roi).toFixed(1)}%
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </td>
                  </tr>

                  {/* Cost Row */}
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Total Cost</td>
                    {selectedScenarios.map((scenario) => (
                      <td
                        key={scenario.id}
                        className={`px-4 py-3 ${
                          metricWinners.cost?.id === scenario.id
                            ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400'
                            : ''
                        }`}
                      >
                        {formatCurrency(scenario.results.totalCosts)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </td>
                  </tr>

                  {/* Savings Row */}
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Savings</td>
                    {selectedScenarios.map((scenario) => (
                      <td
                        key={scenario.id}
                        className={`px-4 py-3 ${
                          metricWinners.savings?.id === scenario.id
                            ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400'
                            : ''
                        }`}
                      >
                        {formatCurrency(scenario.results.savings)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </td>
                  </tr>

                  {/* Payback Row */}
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      Payback Period
                    </td>
                    {selectedScenarios.map((scenario) => (
                      <td
                        key={scenario.id}
                        className={`px-4 py-3 ${
                          metricWinners.payback?.id === scenario.id
                            ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400'
                            : ''
                        }`}
                      >
                        {scenario.results.paybackPeriod} months
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Summary Panel */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Summary Analysis
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metricWinners.roi && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Percent className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Highest ROI</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {selectedScenarios.find((s) => s.id === metricWinners.roi?.id)?.name}
                    </p>
                  </div>
                </div>
              )}
              {metricWinners.cost && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lowest Cost</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {selectedScenarios.find((s) => s.id === metricWinners.cost?.id)?.name}
                    </p>
                  </div>
                </div>
              )}
              {metricWinners.payback && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fastest Payback</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {selectedScenarios.find((s) => s.id === metricWinners.payback?.id)?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty comparison state */}
      {selectedScenarios.length === 1 && (
        <div className="p-8 text-center border-t border-gray-200 dark:border-gray-700">
          <ArrowRight className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Select at least one more scenario to start comparing
          </p>
        </div>
      )}

      {selectedScenarios.length === 0 && scenarios.length > 0 && (
        <div className="p-8 text-center border-t border-gray-200 dark:border-gray-700">
          <GitCompare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Select 2 or more scenarios above to begin comparison
          </p>
        </div>
      )}

      {/* Create Scenario Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Scenario</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Custom Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scenario Name
                </label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="e.g., Aggressive Growth Q4"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newScenarioDescription}
                  onChange={(e) => setNewScenarioDescription(e.target.value)}
                  placeholder="Brief description of this scenario..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quick Start Templates
                </label>
                <div className="space-y-2">
                  {SCENARIO_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => createFromPreset(preset)}
                      className="w-full p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400">
                            {preset.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{preset.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Create blank */}
              <button
                onClick={() =>
                  createFromPreset({ name: 'Custom Scenario', description: 'Custom configuration' })
                }
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Blank Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScenarioComparisonTool;
