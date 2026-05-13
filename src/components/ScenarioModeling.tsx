import React, { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { scenarioModelEntityConfig } from "../entities/ScenarioModel";
import { 
  X, 
  Plus, 
  Save, 
  Play, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Percent, 
  BarChart3,
  Copy,
  Trash2,
  RefreshCw,
  ChevronRight,
  AlertCircle
} from "lucide-react";

type ScenarioVariable = {
  name: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  category: "financial" | "timeline" | "growth" | "risk";
};

type ScenarioModel = {
  id: number;
  name: string;
  description: string;
  variables: string; // JSON stringified ScenarioVariable[]
  results: string; // JSON stringified calculation results
  isBaseline: string;
  created_at: string;
  updated_at: string;
};

type ScenarioModelingProps = {
  onClose: () => void;
};

const ScenarioModeling: React.FC<ScenarioModelingProps> = ({ onClose }) => {
  const { items: scenarios, loading, create, update, remove } = useEntity<ScenarioModel>(scenarioModelEntityConfig);

  const [activeScenario, setActiveScenario] = useState<ScenarioModel | null>(null);
  const [variables, setVariables] = useState<ScenarioVariable[]>([
    {
      name: "interestRate",
      label: "Interest Rate",
      value: 5.0,
      min: 0,
      max: 20,
      step: 0.1,
      unit: "%",
      category: "financial"
    },
    {
      name: "investmentAmount",
      label: "Investment Amount",
      value: 100000,
      min: 10000,
      max: 1000000,
      step: 5000,
      unit: "$",
      category: "financial"
    },
    {
      name: "projectDuration",
      label: "Project Duration",
      value: 12,
      min: 1,
      max: 60,
      step: 1,
      unit: "months",
      category: "timeline"
    },
    {
      name: "marketGrowth",
      label: "Market Growth Rate",
      value: 3.5,
      min: -10,
      max: 20,
      step: 0.5,
      unit: "%",
      category: "growth"
    },
    {
      name: "riskFactor",
      label: "Risk Factor",
      value: 1.0,
      min: 0.5,
      max: 2.0,
      step: 0.1,
      unit: "x",
      category: "risk"
    },
    {
      name: "annualRevenue",
      label: "Expected Annual Revenue",
      value: 150000,
      min: 0,
      max: 5000000,
      step: 10000,
      unit: "$",
      category: "financial"
    },
    {
      name: "operatingCosts",
      label: "Annual Operating Costs",
      value: 80000,
      min: 0,
      max: 2000000,
      step: 5000,
      unit: "$",
      category: "financial"
    }
  ]);

  const [calculatedResults, setCalculatedResults] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonScenarios, setComparisonScenarios] = useState<number[]>([]);

  // Calculate scenario results in real-time
  const calculateScenario = () => {
    const vars = variables.reduce((acc, v) => ({ ...acc, [v.name]: Number(v.value) || 0 }), {} as Record<string, number>);
    
    // Calculate key metrics
    const monthlyInterestRate = (vars.interestRate || 0) / 100 / 12;
    const totalMonths = vars.projectDuration || 12;
    
    // NPV Calculation (simplified)
    const discountRate = ((vars.interestRate as number) || 0) / 100;
    const yearlyRevenue = (vars.annualRevenue || 0) - (vars.operatingCosts || 0);
    const npv = Array.from({ length: Math.ceil(totalMonths / 12) }).reduce((sum: number, _, year: number) => {
      return sum + (yearlyRevenue / Math.pow(1 + discountRate, year + 1));
    }, 0) as number - (vars.investmentAmount || 0);

    // ROI Calculation
    const totalReturn = (yearlyRevenue * (totalMonths / 12)) - vars.investmentAmount;
    const roi = (totalReturn / vars.investmentAmount) * 100;

    // Payback Period
    const monthlyReturn = yearlyRevenue / 12;
    const paybackMonths = monthlyReturn > 0 ? vars.investmentAmount / monthlyReturn : 0;

    // IRR (simplified approximation)
    const irr = ((totalReturn / vars.investmentAmount) / (totalMonths / 12)) * 100;

    // Risk-adjusted metrics
    const adjustedROI = roi / vars.riskFactor;
    const adjustedNPV = npv / vars.riskFactor;

    // Growth projections
    const yearlyGrowth = vars.marketGrowth / 100;
    const projections = Array.from({ length: 5 }).map((_, year) => ({
      year: year + 1,
      revenue: vars.annualRevenue * Math.pow(1 + yearlyGrowth, year),
      costs: vars.operatingCosts * Math.pow(1.02, year), // 2% cost inflation
      profit: (vars.annualRevenue * Math.pow(1 + yearlyGrowth, year)) - (vars.operatingCosts * Math.pow(1.02, year))
    }));

    const results = {
      npv: npv,
      roi: roi,
      paybackMonths: paybackMonths,
      irr: irr,
      adjustedROI: adjustedROI,
      adjustedNPV: adjustedNPV,
      totalInvestment: vars.investmentAmount,
      projectedRevenue: vars.annualRevenue * (totalMonths / 12),
      projectedCosts: vars.operatingCosts * (totalMonths / 12),
      netProfit: (vars.annualRevenue - vars.operatingCosts) * (totalMonths / 12),
      projections: projections,
      breakEvenMonth: paybackMonths,
      riskAdjustment: vars.riskFactor,
      marketGrowthImpact: yearlyGrowth * 100
    };

    setCalculatedResults(results);
    return results;
  };

  // Auto-calculate when variables change
  React.useEffect(() => {
    calculateScenario();
  }, [variables]);

  const handleVariableChange = (name: string, value: number) => {
    setVariables(prev => prev.map(v => v.name === name ? { ...v, value } : v));
  };

  const handleSaveScenario = async () => {
    const name = prompt("Enter scenario name:");
    if (!name) return;

    const results = calculateScenario();
    
    await create({
      name,
      description: `Custom scenario with ${variables.length} variables`,
      variables: JSON.stringify(variables),
      results: JSON.stringify(results),
      isBaseline: scenarios.length === 0 ? "true" : "false"
    });
  };

  const handleDuplicateScenario = async (scenario: ScenarioModel) => {
    await create({
      name: `${scenario.name} (Copy)`,
      description: scenario.description,
      variables: scenario.variables,
      results: scenario.results,
      isBaseline: "false"
    });
  };

  const handleLoadScenario = (scenario: ScenarioModel) => {
    setActiveScenario(scenario);
    setVariables(JSON.parse(scenario.variables));
  };

  const handleDeleteScenario = async (id: number) => {
    if (confirm("Delete this scenario?")) {
      await remove(id);
    }
  };

  const toggleComparison = (scenarioId: number) => {
    setComparisonScenarios(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId].slice(-3) // Max 3 scenarios
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "financial": return <DollarSign className="w-4 h-4" />;
      case "timeline": return <Calendar className="w-4 h-4" />;
      case "growth": return <TrendingUp className="w-4 h-4" />;
      case "risk": return <AlertCircle className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "financial": return "bg-green-100 text-green-700";
      case "timeline": return "bg-blue-100 text-blue-700";
      case "growth": return "bg-purple-100 text-purple-700";
      case "risk": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scenarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-7 h-7" />
              Advanced Scenario Modeling
            </h2>
            <p className="text-indigo-100 mt-1">Adjust variables and see instant impact on your financial projections</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar - Saved Scenarios */}
          <div className="w-80 border-r border-gray-200 overflow-y-auto bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 mb-3">Saved Scenarios ({scenarios.length})</h3>
              <button
                onClick={handleSaveScenario}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Current
              </button>
            </div>

            <div className="p-4 space-y-3">
              {scenarios.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No saved scenarios yet</p>
                </div>
              ) : (
                scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`bg-white border-2 rounded-lg p-4 transition-all duration-200 ${
                      activeScenario?.id === scenario.id
                        ? "border-indigo-500 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{scenario.name}</h4>
                        {scenario.isBaseline === "true" && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1 inline-block">
                            Baseline
                          </span>
                        )}
                      </div>
                    </div>

                    {scenario.results && (
                      <div className="text-xs space-y-1 mb-3 text-gray-600">
                        <div>ROI: {formatPercent(JSON.parse(scenario.results).roi)}</div>
                        <div>NPV: {formatCurrency(JSON.parse(scenario.results).npv)}</div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadScenario(scenario)}
                        className="flex-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium hover:bg-indigo-100 transition-all duration-200"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDuplicateScenario(scenario)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all duration-200"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteScenario(scenario.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-all duration-200"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="mt-2">
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={comparisonScenarios.includes(scenario.id)}
                          onChange={() => toggleComparison(scenario.id)}
                          className="rounded text-indigo-600"
                        />
                        Compare
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Variable Controls */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-indigo-600" />
                  Scenario Variables
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {variables.map((variable) => (
                    <div
                      key={variable.name}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${getCategoryColor(variable.category)}`}>
                            {getCategoryIcon(variable.category)}
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-900">{variable.label}</label>
                            <div className="text-xs text-gray-500 capitalize">{variable.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-indigo-600">
                            {variable.unit === "$" && "$"}
                            {variable.value.toLocaleString()}
                            {variable.unit !== "$" && variable.unit}
                          </div>
                        </div>
                      </div>

                      <input
                        type="range"
                        min={variable.min}
                        max={variable.max}
                        step={variable.step}
                        value={variable.value}
                        onChange={(e) => handleVariableChange(variable.name, parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />

                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>
                          {variable.unit === "$" && "$"}
                          {variable.min.toLocaleString()}
                          {variable.unit !== "$" && variable.unit}
                        </span>
                        <span>
                          {variable.unit === "$" && "$"}
                          {variable.max.toLocaleString()}
                          {variable.unit !== "$" && variable.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Results */}
              {calculatedResults && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Calculated Results
                    <span className="ml-auto text-sm font-normal text-gray-500 flex items-center gap-1">
                      <RefreshCw className="w-4 h-4" />
                      Updates in real-time
                    </span>
                  </h3>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                      <div className="text-sm text-green-700 font-medium mb-1">ROI</div>
                      <div className="text-2xl font-bold text-green-900">{formatPercent(calculatedResults.roi)}</div>
                      <div className="text-xs text-green-600 mt-1">Return on Investment</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                      <div className="text-sm text-blue-700 font-medium mb-1">NPV</div>
                      <div className="text-2xl font-bold text-blue-900">{formatCurrency(calculatedResults.npv)}</div>
                      <div className="text-xs text-blue-600 mt-1">Net Present Value</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                      <div className="text-sm text-purple-700 font-medium mb-1">Payback</div>
                      <div className="text-2xl font-bold text-purple-900">
                        {calculatedResults.paybackMonths.toFixed(1)}m
                      </div>
                      <div className="text-xs text-purple-600 mt-1">Months to break even</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
                      <div className="text-sm text-orange-700 font-medium mb-1">IRR</div>
                      <div className="text-2xl font-bold text-orange-900">{formatPercent(calculatedResults.irr)}</div>
                      <div className="text-xs text-orange-600 mt-1">Internal Rate of Return</div>
                    </div>
                  </div>

                  {/* Risk-Adjusted Metrics */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      Risk-Adjusted Analysis
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Adjusted ROI</div>
                        <div className="text-xl font-bold text-gray-900">{formatPercent(calculatedResults.adjustedROI)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Adjusted NPV</div>
                        <div className="text-xl font-bold text-gray-900">{formatCurrency(calculatedResults.adjustedNPV)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Risk Factor</div>
                        <div className="text-xl font-bold text-gray-900">{calculatedResults.riskAdjustment.toFixed(2)}x</div>
                      </div>
                    </div>
                  </div>

                  {/* 5-Year Projections */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      5-Year Growth Projections
                    </h4>
                    <div className="space-y-3">
                      {calculatedResults.projections.map((proj: any) => (
                        <div key={proj.year} className="flex items-center gap-4">
                          <div className="w-16 text-sm font-semibold text-gray-700">Year {proj.year}</div>
                          <div className="flex-1 bg-gray-100 rounded-lg p-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Revenue</span>
                              <span className="font-semibold text-green-700">{formatCurrency(proj.revenue)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-600">Costs</span>
                              <span className="font-semibold text-red-700">{formatCurrency(proj.costs)}</span>
                            </div>
                            <div className="flex justify-between text-sm pt-2 border-t border-gray-300">
                              <span className="text-gray-900 font-medium">Net Profit</span>
                              <span className="font-bold text-indigo-700">{formatCurrency(proj.profit)}</span>
                            </div>
                          </div>
                          <div className="w-32">
                            <div
                              className="h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                              style={{ width: `${Math.min((proj.profit / calculatedResults.totalInvestment) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario Comparison */}
              {comparisonScenarios.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Scenario Comparison ({comparisonScenarios.length} selected)
                  </h3>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Metric</th>
                            {comparisonScenarios.map((id) => {
                              const scenario = scenarios.find((s) => s.id === id);
                              return (
                                <th key={id} className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                                  {scenario?.name}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {["roi", "npv", "paybackMonths", "irr"].map((metric) => (
                            <tr key={metric}>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                                {metric === "roi" ? "ROI" : metric === "npv" ? "NPV" : metric === "irr" ? "IRR" : "Payback Period"}
                              </td>
                              {comparisonScenarios.map((id) => {
                                const scenario = scenarios.find((s) => s.id === id);
                                if (!scenario || !scenario.results) return <td key={id} className="px-4 py-3 text-center">-</td>;
                                
                                const results = JSON.parse(scenario.results);
                                const value = results[metric];
                                
                                return (
                                  <td key={id} className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                                    {metric === "npv" ? formatCurrency(value) : 
                                     metric === "paybackMonths" ? `${value.toFixed(1)}m` :
                                     formatPercent(value)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioModeling;
