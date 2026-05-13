import { useState } from "react";
import Calculator from "./Calculator";
import BenchmarkComparison from "./BenchmarkComparison";
import ScenarioModeling from "./ScenarioModeling";
import { generateExecutiveSummaryPDF } from "./PDFGenerator";
import { useBrandSettings } from "../hooks/useBrandSettings";

export default function CalculatorWithFeatures() {
  const [result, setResult] = useState<number | null>(null);
  const [expression, setExpression] = useState("");
  const [activeTab, setActiveTab] = useState<"calculator" | "benchmark" | "scenario">("calculator");
  const { settings: brandSettings } = useBrandSettings();

  const handleCalculation = (expr: string, res: number) => {
    setResult(res);
    setExpression(expr);
  };

  const handleExportPDF = () => {
    if (result === null) {
      alert("Please perform a calculation first");
      return;
    }

    const calculationData = {
      type: "Basic Calculation",
      expression: expression,
      result: result.toString(),
      timestamp: new Date().toISOString(),
      details: {
        calculationType: "Basic",
        performedAt: new Date().toLocaleString(),
      }
    };

    generateExecutiveSummaryPDF(calculationData, {
      companyName: brandSettings?.companyName || "Lift Metric",
      logoUrl: brandSettings?.logoUrl || "",
      primaryColor: brandSettings?.primaryColor || "#3B82F6",
      secondaryColor: brandSettings?.secondaryColor || "#8B5CF6",
    });
  };

  // Scenario modeling variables
  const scenarioVariables = [
    {
      name: "multiplier",
      label: "Calculation Multiplier",
      value: 1,
      min: 0.5,
      max: 2,
      step: 0.1,
      unit: "x"
    },
    {
      name: "offset",
      label: "Result Offset",
      value: 0,
      min: -100,
      max: 100,
      step: 5,
      unit: ""
    }
  ];

  const calculateScenario = (vars: Record<string, number>) => {
    if (result === null) return 0;
    return (result * vars.multiplier) + vars.offset;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 bg-white p-2 rounded-xl shadow-md">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "calculator"
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            🧮 Calculator
          </button>
          <button
            onClick={() => setActiveTab("benchmark")}
            disabled={result === null}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "benchmark"
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                : result === null
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            📊 Benchmark
          </button>
          <button
            onClick={() => setActiveTab("scenario")}
            disabled={result === null}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "scenario"
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md"
                : result === null
                ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            🎯 Scenarios
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === "calculator" && (
            <>
              <Calculator />
              
              {result !== null && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Result</p>
                      <p className="text-3xl font-bold text-blue-900">{result}</p>
                      {expression && (
                        <p className="text-sm text-gray-500 mt-1">{expression}</p>
                      )}
                    </div>
                    <button
                      onClick={handleExportPDF}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      📄 Export PDF
                    </button>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💡 <strong>Quick Actions:</strong> Switch to Benchmark tab to compare against industry data, or Scenarios tab to model different outcomes.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "benchmark" && result !== null && (
            <BenchmarkComparison
              currentValue={result}
              metricName="Calculation Result"
              industry="Technology"
            />
          )}

          {activeTab === "scenario" && result !== null && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-600">Scenario modeling available. Click the 📊 Scenarios button in the header.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
