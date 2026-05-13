import React, { useState, useEffect, useCallback } from 'react';
import { Copy, BarChart3, ChevronDown, ChevronUp, GitCompare, Sparkles, Globe } from 'lucide-react';
import type { Scenario } from '../types/calculator';
import Calculator from '../components/Calculator';
import { ComparisonReport } from '../components/calculator/ComparisonReport';
import { GuestBanner } from '../components/guest/GuestBanner';
import { SignupPromptModal } from '../components/guest/SignupPromptModal';
import { VisualizationModule } from '../components/VisualizationModule';
import { ScenarioComparisonTool } from '../components/ScenarioComparisonTool';
import { MarketDataDashboard } from '../components/MarketDataDashboard';
import { GuidedTour, calculatorTourSteps, TourTriggerButton, hasTourBeenCompleted, resetTourState } from '../components/GuidedTour';
import { ScenarioSyncNotification, useScenarioSync } from '../components/ScenarioSyncNotification';
import { checkScenarioStaleness, getCurrentRateSnapshot, onMarketDataEvent } from '../lib/marketDataService';
import { 
  initGuestSession, 
  canCreateCalculation, 
  recordCalculation, 
  saveGuestScenario, 
  getGuestScenarios, 
  getGuestSessionStats, 
  shouldPromptSignup 
} from '../lib/guestAccess';


// Helper to get ROI value safely
function getRoiValue(roi: number | { percentage: number } | undefined): number {
  if (roi === undefined) return 0;
  if (typeof roi === 'number') return roi;
  return roi.percentage || 0;
}

const TOUR_ID = 'calculator-tour';

export function CalculatorPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [isGuest, setIsGuest] = useState(true);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [showComparisonTool, setShowComparisonTool] = useState(false);
  const [showMarketData, setShowMarketData] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [brandSettings, setBrandSettings] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    logo: undefined as string | undefined,
  });

  const guestStats = getGuestSessionStats();
  const currentScenario = scenarios.find((s) => s.id === currentScenarioId);

  // Scenario sync with live market data
  const handleScenarioUpdated = useCallback((scenarioId: string, newRates: { rateId: string; value: number }[]) => {
    setScenarios((prev) =>
      prev.map((s) =>
        s.id === scenarioId
          ? { ...s, ratesAtCreation: newRates, lastModified: new Date().toISOString() } as any
          : s
      )
    );
  }, []);

  const scenarioSyncData = scenarios
    .filter((s) => (s as any).ratesAtCreation)
    .map((s) => ({
      id: s.id,
      name: s.name,
      ratesAtCreation: (s as any).ratesAtCreation as { rateId: string; value: number }[],
    }));

  const scenarioSync = useScenarioSync({
    scenarios: scenarioSyncData,
    checkStaleness: checkScenarioStaleness,
    getCurrentRateSnapshot,
    onScenarioUpdated: handleScenarioUpdated,
    autoSyncEnabled: false,
  });

  // Listen for market data rate updates to re-check staleness
  useEffect(() => {
    const unsub = onMarketDataEvent('rates-updated', () => {
      scenarioSync.resetDismissed();
      scenarioSync.checkAllScenarios();
    });
    return unsub;
  }, [scenarioSync.resetDismissed, scenarioSync.checkAllScenarios]);

  // Auto-show tour for first-time visitors
  useEffect(() => {
    const tourSeen = hasTourBeenCompleted(TOUR_ID);
    if (!tourSeen) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setShowGuidedTour(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isGuest) {
      initGuestSession();
      const guestScenarios = getGuestScenarios();
      setScenarios(guestScenarios);
    }
  }, [isGuest]);

  useEffect(() => {
    if (isGuest && shouldPromptSignup() && !showSignupPrompt) {
      setShowSignupPrompt(true);
    }
  }, [scenarios.length, isGuest, showSignupPrompt]);

  const handleSaveScenario = (scenario: Scenario) => {
    if (isGuest) {
      const { allowed, message } = canCreateCalculation();
      if (!allowed) {
        setShowSignupPrompt(true);
        return;
      }
      recordCalculation();
      saveGuestScenario(scenario);
    }

    setScenarios((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === scenario.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = scenario;
        return updated;
      }
      return [...prev, scenario];
    });
  };

  const handleDuplicateScenario = (scenarioId: string, newName?: string) => {
    if (isGuest) {
      const { allowed } = canCreateCalculation();
      if (!allowed) {
        setShowSignupPrompt(true);
        return;
      }
    }

    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;

    const duplicate: Scenario = {
      ...scenario,
      id: `scenario_${Date.now()}`,
      name: newName || `${scenario.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };

    if (isGuest) {
      recordCalculation();
      saveGuestScenario(duplicate);
    }

    setScenarios((prev) => [...prev, duplicate]);
    setCurrentScenarioId(duplicate.id);
  };

  const handleDeleteScenario = (scenarioId: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== scenarioId));
    if (currentScenarioId === scenarioId) {
      setCurrentScenarioId(null);
    }
    setSelectedForComparison((prev) => prev.filter((id) => id !== scenarioId));
  };

  const handleUpdateScenario = (scenarioId: string, updates: Partial<Scenario>) => {
    setScenarios((prev) =>
      prev.map((s) =>
        s.id === scenarioId
          ? { ...s, ...updates, lastModified: new Date().toISOString() }
          : s
      )
    );
  };

  const handleToggleComparison = (scenarioId: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(scenarioId)) {
        return prev.filter((id) => id !== scenarioId);
      }
      if (prev.length >= 5) {
        return prev;
      }
      return [...prev, scenarioId];
    });
  };

  const handleStartComparison = () => {
    if (selectedForComparison.length < 2) {
      alert('Please select at least 2 scenarios to compare');
      return;
    }
    setCompareMode(true);
  };

  const handleExportComparison = (selectedIds: string[], format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting ${selectedIds.length} scenarios as ${format}`);
    alert(`Comparison exported as ${format.toUpperCase()}!`);
  };

  const handleTourComplete = () => {
    setShowGuidedTour(false);
  };

  const handleTourSkip = () => {
    setShowGuidedTour(false);
  };

  const handleRestartTour = () => {
    resetTourState(TOUR_ID);
    setShowGuidedTour(true);
  };

  // Transform scenarios to visualization format
  const visualizationHistory = scenarios.map((scenario) => ({
    id: scenario.id,
    name: scenario.name,
    date: scenario.createdAt,
    totalCost: scenario.results?.totalCosts || 0,
    roi: getRoiValue(scenario.results?.roi),
    savings: scenario.results?.costSavings || scenario.results?.totalSavings || 0,
    paybackMonths: scenario.results?.paybackPeriod || 0,
    duration: Array.isArray(scenario.results?.timeline) ? scenario.results.timeline.length : (scenario.results?.timeline as any)?.phases?.length || 0,
    mode: scenario.mode,
  }));

  // Transform scenarios for comparison tool
  const comparisonScenarios = scenarios.map((scenario, index) => ({
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    inputs: scenario.inputs || {},
    results: {
      totalCosts: scenario.results?.totalCosts || 0,
      totalRevenue: scenario.results?.totalRevenue || 0,
      netProfit: scenario.results?.netProfit || 0,
      savings: scenario.results?.costSavings || scenario.results?.totalSavings || 0,
      roi: getRoiValue(scenario.results?.roi),
      paybackPeriod: scenario.results?.paybackPeriod || 0,
      npv: scenario.results?.npv,
      irr: scenario.results?.irr,
    },
    createdAt: scenario.createdAt,
    lastModified: scenario.lastModified,
    tags: scenario.tags,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5],
  }));

  const selectedScenarios = scenarios.filter((s) => selectedForComparison.includes(s.id));

  if (compareMode && selectedScenarios.length >= 2) {
    return (
      <ComparisonReport
        scenarios={selectedScenarios}
        onClose={() => {
          setCompareMode(false);
          setSelectedForComparison([]);
        }}
        onSave={(name: string) => {
          console.log('Saving comparison report:', name);
          alert(`Comparison report "${name}" saved successfully!`);
        }}
        brandSettings={brandSettings as any}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Guided Tour */}
      <GuidedTour
        steps={calculatorTourSteps}
        isOpen={showGuidedTour}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
        tourId={TOUR_ID}
      />

      {isGuest && <GuestBanner />}
      
      {/* Scenario Sync Notification */}
      <ScenarioSyncNotification
        staleScenarios={scenarioSync.staleScenarios}
        onUpdateScenario={scenarioSync.handleUpdateScenario}
        onUpdateAll={() => scenarioSync.handleUpdateAll()}
        onDismiss={scenarioSync.handleDismiss}
        onDismissAll={scenarioSync.handleDismissAll}
        isUpdating={scenarioSync.isUpdating}
        updatingIds={scenarioSync.updatingIds}
        autoSyncEnabled={scenarioSync.autoSyncEnabled}
        onToggleAutoSync={scenarioSync.setAutoSyncEnabled}
      />

      <SignupPromptModal
        isOpen={showSignupPrompt}
        onClose={() => setShowSignupPrompt(false)}
        calculationsUsed={guestStats.calculationsUsed}
        scenariosCount={guestStats.scenariosCount}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header — tour target */}
        <div data-tour="page-header" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                ROI & Staffing Calculator
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Calculate ROI, compare staffing models, and export professional reports
              </p>
            </div>
            <TourTriggerButton onClick={handleRestartTour} />
          </div>
        </div>

        {/* Visualization Toggle Section — tour target */}
        <div className="mb-6" data-tour="visualization-toggle">
          <button
            onClick={() => setShowVisualization(!showVisualization)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Calculation History Visualization
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View trends and compare historical calculations
                </p>
              </div>
            </div>
            {showVisualization ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {showVisualization && (
            <div className="mt-4">
              <VisualizationModule calculationHistory={visualizationHistory} />
            </div>
          )}
        </div>

        {/* Market Data Dashboard Toggle */}
        <div className="mb-6" data-tour="market-data-toggle">
          <button
            onClick={() => setShowMarketData(!showMarketData)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Live Market Data & Rates
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View live interest rates, inflation data, and set manual overrides for NPV calculations
                </p>
              </div>
            </div>
            {showMarketData ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {showMarketData && (
            <div className="mt-4">
              <MarketDataDashboard
                scenarios={scenarios.filter(s => (s as any).ratesAtCreation).map(s => ({
                  id: s.id,
                  name: s.name,
                  ratesAtCreation: (s as any).ratesAtCreation,
                }))}
                onUpdateAllScenarios={(scenarioId) => {
                  const newRates = getCurrentRateSnapshot();
                  handleScenarioUpdated(scenarioId, newRates);
                  if (isGuest) {
                    const updated = scenarios.find(s => s.id === scenarioId);
                    if (updated) saveGuestScenario({ ...updated, ratesAtCreation: newRates } as any);
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Scenario Comparison Tool Toggle — tour target */}
        <div className="mb-6" data-tour="comparison-toggle">
          <button
            onClick={() => setShowComparisonTool(!showComparisonTool)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <GitCompare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Scenario Comparison Tool
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Compare scenarios side-by-side with detailed metric analysis
                </p>
              </div>
            </div>
            {showComparisonTool ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {showComparisonTool && (
            <div className="mt-4">
              <ScenarioComparisonTool
                scenarios={comparisonScenarios}
                onSaveScenario={(scenario) => {
                  const newScenario: Scenario = {
                    id: scenario.id,
                    name: scenario.name,
                    description: scenario.description,
                    inputs: scenario.inputs as any,
                    results: scenario.results as any,
                    createdAt: scenario.createdAt,
                    lastModified: scenario.lastModified,
                    tags: scenario.tags,
                  };
                  handleSaveScenario(newScenario);
                }}
                onDeleteScenario={handleDeleteScenario}
                onDuplicateScenario={handleDuplicateScenario}
                onUpdateScenario={handleUpdateScenario as any}
                onExportComparison={handleExportComparison}
              />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Saved Scenarios sidebar — tour target */}
          <div className="lg:col-span-1" data-tour="saved-scenarios">
            {scenarios.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Scenarios</h3>
                  {scenarios.length >= 2 && selectedForComparison.length > 0 && (
                    <button
                      onClick={handleStartComparison}
                      disabled={selectedForComparison.length < 2}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Compare {selectedForComparison.length}
                    </button>
                  )}
                </div>
                <div className="grid gap-3">
                  {scenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        currentScenarioId === scenario.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : selectedForComparison.includes(scenario.id)
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => setCurrentScenarioId(scenario.id)}
                        >
                          <h4 className="font-semibold text-gray-900 dark:text-white">{scenario.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{scenario.description || 'No description'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {scenario.mode ? scenario.mode.charAt(0).toUpperCase() + scenario.mode.slice(1) : 'Standard'} Mode
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {scenarios.length >= 2 && (
                            <input
                              type="checkbox"
                              checked={selectedForComparison.includes(scenario.id)}
                              onChange={() => handleToggleComparison(scenario.id)}
                              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateScenario(scenario.id);
                            }}
                            className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state for saved scenarios — still a tour target */}
            {scenarios.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">No Scenarios Yet</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create your first scenario to start comparing staffing models.
                </p>
              </div>
            )}
          </div>

          {/* Main calculator / results area — tour targets */}
          <div className="lg:col-span-2" data-tour="results-area">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow" data-tour="staffing-calculator">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Scenario Calculator</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Configure your calculation scenario below.</p>
              
              {/* Calculator area */}
              <div data-tour="create-scenario" className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Start a new calculation or select a saved scenario to edit
                </p>
                <button
                  onClick={() => {
                    const newScenario: Scenario = {
                      id: `scenario_${Date.now()}`,
                      name: `New Scenario ${scenarios.length + 1}`,
                      inputs: {
                        companySize: 'medium',
                        industry: 'technology',
                        projectScope: 'medium',
                        annualVolume: '1000000',
                        currentSpend: '500000',
                      },
                      results: {
      totalRevenue: 0,
        totalCosts: 0,
        netProfit: 0,
        roi: { percentage: 0, amount: 0 },
        timeline: [],
        options: [],
        recommendations: [],
        bestOption: '',
        paybackPeriod: 0,
      },
                      createdAt: new Date().toISOString(),
                    };
                    handleSaveScenario(newScenario);
                    setCurrentScenarioId(newScenario.id);
                  }}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create New Scenario
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
