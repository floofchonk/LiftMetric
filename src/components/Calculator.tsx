import React, { useState } from 'react';
import { Calculator as CalcIcon, GitCompare, Palette, Save, Bell, X, Menu, Download } from 'lucide-react';
import SocialShareButton from './SocialShareButton';
import { useScenarios } from '../hooks/useScenarios';
import { ScenarioManager } from './ScenarioManager';
import { AlertsManager, Alert } from './calculator/AlertsManager';
import { ScenarioComparison } from './ScenarioComparison';
import { ReportCustomization } from './ReportCustomization';
import StaffingCalculator from './StaffingCalculator';
import type { ReportCustomization as ReportCustomizationType } from '../types/scenario';
import { ExportCalculationsModal } from './ExportCalculationsModal';
import { useEntity } from '../hooks/useEntity';
import { calculationHistoryEntityConfig } from '../entities/CalculationHistory';

type View = 'calculator' | 'scenarios' | 'compare' | 'customize' | 'alerts' | 'export';

export default function Calculator() {
  const [view, setView] = useState<View>('calculator');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const { items: calculations } = useEntity(calculationHistoryEntityConfig);
  const [showAlerts, setShowAlerts] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('roi-alerts');
    return saved ? JSON.parse(saved) : [];
  });
  const [reportCustomization, setReportCustomization] = useState<ReportCustomizationType>({
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    chartType: 'bar',
    includeCharts: true,
    includePhaseBreakdown: true,
    includeRoiMetrics: true,
  });

  const {
    scenarios,
    activeScenarioId,
    activeScenario,
    setActiveScenarioId,
    createScenario,
    duplicateScenario,
    updateScenario,
    deleteScenario,
  } = useScenarios();

  const handleSaveAlerts = (newAlerts: Alert[]) => {
    setAlerts(newAlerts);
    localStorage.setItem('roi-alerts', JSON.stringify(newAlerts));
  };

  const navItems = [
    { id: 'calculator' as View, icon: CalcIcon, label: 'Calculator' },
    { id: 'scenarios' as View, icon: Save, label: `Scenarios (${scenarios.length})` },
    { id: 'compare' as View, icon: GitCompare, label: 'Compare' },
    { id: 'export' as View, icon: Download, label: 'Export' },
    { id: 'customize' as View, icon: Palette, label: 'Branding' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile-friendly Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                Lift Metric
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                ROI & Staffing Model Calculator
              </p>
            </div>
            <button
              onClick={() => setShowAlerts(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg touch-manipulation flex-shrink-0"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline font-medium">
                Alerts
              </span>
              {alerts.filter(a => a.enabled).length > 0 && (
                <span className="px-2 py-0.5 bg-white text-blue-600 rounded-full text-xs font-bold">
                  {alerts.filter(a => a.enabled).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden w-full bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-between touch-manipulation"
        >
          <span className="font-medium text-gray-900">Menu</span>
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Desktop Navigation */}
        <div data-tour="calculator-nav" className="hidden lg:block bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 touch-manipulation ${
                    view === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white rounded-lg shadow-md p-4 mb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 touch-manipulation ${
                    view === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {view === 'calculator' && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
              ROI Calculator
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Configure your project parameters, staffing models, and calculate ROI with detailed breakdowns.
            </p>
            {activeScenario ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-blue-900 text-sm sm:text-base">
                      Active Scenario
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-700 truncate">
                      {activeScenario.name}
                    </p>
                  </div>
                </div>
                <StaffingCalculator />
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <CalcIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  No Active Scenario
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Create a scenario to start calculating
                </p>
                <button
                  onClick={() => {
                    const name = prompt('Enter scenario name:');
                    if (name?.trim()) {
                      createScenario({
                        name: name.trim(),
                        projectInputs: {},
                        tshirtSizes: [],
                        roles: [],
                        locations: [],
                        costModels: {},
                        roiInputs: {},
                      });
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg touch-manipulation"
                >
                  Create Scenario
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'scenarios' && (
          <ScenarioManager
            scenarios={scenarios}
            activeScenarioId={activeScenarioId}
            onSelectScenario={setActiveScenarioId}
            onDuplicateScenario={duplicateScenario}
            onDeleteScenario={deleteScenario}
            onCreateScenario={() => createScenario({ 
              name: 'New Scenario',
              projectInputs: {},
              tshirtSizes: [],
              roles: [],
              locations: [],
              costModels: {},
              roiInputs: {}
            })}
            onRenameScenario={(id, name) => updateScenario(id, { name })}
          />
        )}

        {view === 'compare' && (
          <ScenarioComparison scenarios={scenarios} />
        )}

        {view === 'customize' && (
          <ReportCustomization
            customization={reportCustomization}
            onChange={setReportCustomization}
          />
        )}

        {view === 'export' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Export Calculations</h2>
            <p className="text-gray-600 mb-6">Select calculations from your history to export as PDF, CSV, or PNG.</p>
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Open Export Manager
            </button>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportCalculationsModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        calculations={calculations}
      />

      {/* Alerts Modal - Mobile Optimized */}
      {showAlerts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Alert Management</h2>
                <button
                  onClick={() => setShowAlerts(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <AlertsManager
                scenarios={scenarios}
                alerts={alerts}
                onSaveAlerts={handleSaveAlerts}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
