import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  X, 
  SkipForward, 
  Play, 
  CheckCircle2, 
  Calculator,
  FlaskConical,
  History,
  Target,
  Sparkles,
  BookOpen,
  TrendingUp,
  PieChart,
  FileText,
  Lightbulb,
  RotateCcw
} from 'lucide-react';
import { Button } from './ui/button';

// Types
interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string;
  icon?: React.ReactNode;
  tip?: string;
  interactive?: boolean;
  highlightArea?: string;
}

interface TourModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  steps: TourStep[];
  category: 'basic' | 'advanced' | 'features';
}

// Local storage keys
const ONBOARDING_STORAGE_KEY = 'lift_metric_onboarding';
const FIRST_VISIT_KEY = 'lift_metric_first_visit';

// Tour Modules
const TOUR_MODULES: TourModule[] = [
  {
    id: 'welcome',
    name: 'Welcome Tour',
    description: 'Quick overview of Lift Metric',
    icon: <Sparkles className="w-5 h-5" />,
    duration: '2 min',
    category: 'basic',
    steps: [
      {
        id: 'welcome-1',
        title: 'Welcome to Lift Metric! 🎉',
        description: 'Your comprehensive platform for ROI calculations, financial analysis, and investment decision-making. Let\'s get you started!',
        position: 'center',
        icon: <Calculator className="w-8 h-8 text-blue-500" />,
      },
      {
        id: 'welcome-2',
        title: 'Two Powerful Modes',
        description: 'Choose between Basic Mode for quick calculations or Scientific Mode for advanced financial analysis with IRR, NPV, and sensitivity analysis.',
        position: 'center',
        icon: <Target className="w-8 h-8 text-purple-500" />,
        tip: 'Start with Basic Mode if you\'re new to ROI calculations',
      },
      {
        id: 'welcome-3',
        title: 'Save & Compare Scenarios',
        description: 'Create multiple scenarios, save your calculations, and compare different investment options side-by-side.',
        position: 'center',
        icon: <PieChart className="w-8 h-8 text-green-500" />,
      },
      {
        id: 'welcome-4',
        title: 'Export Professional Reports',
        description: 'Generate polished PDF reports, export data to CSV, and share your analysis with stakeholders.',
        position: 'center',
        icon: <FileText className="w-8 h-8 text-orange-500" />,
      },
      {
        id: 'welcome-5',
        title: 'You\'re All Set!',
        description: 'Ready to start calculating? Choose a specific tour below to learn more, or dive right in!',
        position: 'center',
        icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
      },
    ],
  },
  {
    id: 'basic-calculator',
    name: 'Basic Calculator',
    description: 'Learn ROI fundamentals',
    icon: <Calculator className="w-5 h-5" />,
    duration: '3 min',
    category: 'basic',
    steps: [
      {
        id: 'basic-1',
        title: 'Basic Calculator Overview',
        description: 'The Basic Calculator helps you quickly determine ROI, payback period, and net benefits for any project or investment.',
        position: 'center',
        icon: <Calculator className="w-8 h-8 text-blue-500" />,
      },
      {
        id: 'basic-2',
        title: 'Step 1: Project Information',
        description: 'Start by entering your project name, type, and description. This helps organize your calculations for future reference.',
        target: 'project-inputs',
        position: 'right',
        tip: 'Be specific with project names to easily find them later',
        interactive: true,
      },
      {
        id: 'basic-3',
        title: 'Step 2: Investment Costs',
        description: 'Enter your initial investment amount, including all upfront costs like equipment, software licenses, and setup fees.',
        target: 'cost-inputs',
        position: 'right',
        tip: 'Include ALL costs - hidden costs often impact ROI significantly',
        interactive: true,
      },
      {
        id: 'basic-4',
        title: 'Step 3: Expected Benefits',
        description: 'Define your expected annual benefits including revenue increases, cost savings, and productivity gains.',
        target: 'benefit-inputs',
        position: 'right',
        tip: 'Be conservative with benefit estimates for realistic projections',
        interactive: true,
      },
      {
        id: 'basic-5',
        title: 'Step 4: Time Horizon',
        description: 'Set your analysis period (typically 1-5 years). This determines how long-term benefits are calculated.',
        target: 'timeline-inputs',
        position: 'right',
        interactive: true,
      },
      {
        id: 'basic-6',
        title: 'View Your Results',
        description: 'Your ROI, payback period, and net benefit are calculated instantly. Green indicates positive returns, red indicates losses.',
        target: 'results-dashboard',
        position: 'left',
        tip: 'A good ROI is typically 15%+ annually, but varies by industry',
      },
      {
        id: 'basic-7',
        title: 'Save Your Calculation',
        description: 'Click "Save" to store your calculation for future reference. You can compare multiple saved calculations later.',
        target: 'save-button',
        position: 'bottom',
      },
      {
        id: 'basic-8',
        title: 'Basic Mode Complete! 🎉',
        description: 'You\'ve mastered the basics! Ready to explore Scientific Mode for advanced analysis?',
        position: 'center',
        icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
      },
    ],
  },
  {
    id: 'scientific-calculator',
    name: 'Scientific Mode',
    description: 'Advanced financial analysis',
    icon: <FlaskConical className="w-5 h-5" />,
    duration: '5 min',
    category: 'advanced',
    steps: [
      {
        id: 'sci-1',
        title: 'Scientific Mode Overview',
        description: 'Scientific Mode unlocks advanced financial metrics used by investment professionals and CFOs.',
        position: 'center',
        icon: <FlaskConical className="w-8 h-8 text-purple-500" />,
      },
      {
        id: 'sci-2',
        title: 'Net Present Value (NPV)',
        description: 'NPV calculates the present value of future cash flows, accounting for the time value of money. Positive NPV = good investment.',
        position: 'center',
        icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
        tip: 'NPV > 0 means the investment adds value to your organization',
      },
      {
        id: 'sci-3',
        title: 'Internal Rate of Return (IRR)',
        description: 'IRR shows the annualized return rate of your investment. Compare it to your required rate of return to make decisions.',
        position: 'center',
        icon: <Target className="w-8 h-8 text-green-500" />,
        tip: 'If IRR > your discount rate, the investment is worthwhile',
      },
      {
        id: 'sci-4',
        title: 'Discount Rate Configuration',
        description: 'Set your organization\'s discount rate (cost of capital). This affects NPV and other time-value calculations.',
        target: 'discount-rate',
        position: 'right',
        tip: 'Typical corporate discount rates range from 8-15%',
        interactive: true,
      },
      {
        id: 'sci-5',
        title: 'Sensitivity Analysis',
        description: 'Test how changes in assumptions affect your results. Identify which variables have the biggest impact on ROI.',
        target: 'sensitivity-analysis',
        position: 'right',
        tip: 'Focus on variables with highest sensitivity for risk management',
      },
      {
        id: 'sci-6',
        title: 'Scenario Comparison',
        description: 'Create multiple scenarios (best case, worst case, expected) and compare them side-by-side for better decision making.',
        target: 'scenario-comparison',
        position: 'left',
      },
      {
        id: 'sci-7',
        title: 'Advanced Metrics Dashboard',
        description: 'View all metrics at once: ROI, NPV, IRR, MIRR, Profitability Index, and Payback Period.',
        target: 'metrics-dashboard',
        position: 'top',
      },
      {
        id: 'sci-8',
        title: 'Scientific Mode Complete! 🎓',
        description: 'You\'re now equipped with professional-grade analysis tools. Use them wisely!',
        position: 'center',
        icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
      },
    ],
  },
  {
    id: 'history-exports',
    name: 'History & Exports',
    description: 'Manage calculations & reports',
    icon: <History className="w-5 h-5" />,
    duration: '3 min',
    category: 'features',
    steps: [
      {
        id: 'hist-1',
        title: 'Calculation History',
        description: 'All your calculations are automatically saved. Access them anytime from the History panel.',
        position: 'center',
        icon: <History className="w-8 h-8 text-indigo-500" />,
      },
      {
        id: 'hist-2',
        title: 'Search & Filter',
        description: 'Quickly find past calculations using search, date filters, and tags. Sort by ROI, date, or investment amount.',
        target: 'history-search',
        position: 'right',
        tip: 'Use tags to organize calculations by project or client',
      },
      {
        id: 'hist-3',
        title: 'Compare Calculations',
        description: 'Select multiple calculations to compare side-by-side. Perfect for evaluating different investment options.',
        target: 'compare-button',
        position: 'bottom',
      },
      {
        id: 'hist-4',
        title: 'Export Options',
        description: 'Export your results as PDF reports, CSV data files, or share directly with colleagues.',
        target: 'export-menu',
        position: 'left',
        tip: 'PDF reports include charts and are presentation-ready',
      },
      {
        id: 'hist-5',
        title: 'Custom Branding',
        description: 'Pro users can add custom logos and colors to exported reports for a professional look.',
        target: 'branding-settings',
        position: 'left',
      },
      {
        id: 'hist-6',
        title: 'History & Exports Complete! 📊',
        description: 'You can now efficiently manage your calculation history and create professional reports.',
        position: 'center',
        icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
      },
    ],
  },
];

// Onboarding State Interface
interface OnboardingState {
  hasCompletedWelcome: boolean;
  completedModules: string[];
  currentModule: string | null;
  currentStep: number;
  skippedAt: string | null;
  lastVisit: string;
  visitCount: number;
}

// Default state
const defaultOnboardingState: OnboardingState = {
  hasCompletedWelcome: false,
  completedModules: [],
  currentModule: null,
  currentStep: 0,
  skippedAt: null,
  lastVisit: new Date().toISOString(),
  visitCount: 1,
};

interface InteractiveOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
  forceShow?: boolean;
  initialModule?: string;
}

export const InteractiveOnboarding: React.FC<InteractiveOnboardingProps> = ({
  onComplete,
  onSkip,
  forceShow = false,
  initialModule,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModuleSelector, setShowModuleSelector] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(initialModule || null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>(defaultOnboardingState);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);

  // Load onboarding state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    const firstVisit = localStorage.getItem(FIRST_VISIT_KEY);

    if (savedState) {
      const parsed = JSON.parse(savedState);
      setOnboardingState({
        ...parsed,
        visitCount: parsed.visitCount + 1,
        lastVisit: new Date().toISOString(),
      });
    }

    if (!firstVisit) {
      setIsFirstTimeUser(true);
      localStorage.setItem(FIRST_VISIT_KEY, new Date().toISOString());
      // Auto-start welcome tour for first-time users
      setCurrentModuleId('welcome');
      setIsOpen(true);
    } else if (forceShow) {
      setShowModuleSelector(true);
      setIsOpen(true);
    }
  }, [forceShow]);

  // Save state to localStorage
  const saveState = useCallback((newState: Partial<OnboardingState>) => {
    const updatedState = { ...onboardingState, ...newState };
    setOnboardingState(updatedState);
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updatedState));
  }, [onboardingState]);

  // Get current module
  const currentModule = TOUR_MODULES.find(m => m.id === currentModuleId);
  const currentStep = currentModule?.steps[currentStepIndex];
  const totalSteps = currentModule?.steps.length || 0;
  const progress = totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0;

  // Navigation handlers
  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleModuleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleModuleComplete = () => {
    if (currentModuleId) {
      const newCompletedModules = [...onboardingState.completedModules];
      if (!newCompletedModules.includes(currentModuleId)) {
        newCompletedModules.push(currentModuleId);
      }

      saveState({
        completedModules: newCompletedModules,
        hasCompletedWelcome: currentModuleId === 'welcome' ? true : onboardingState.hasCompletedWelcome,
        currentModule: null,
        currentStep: 0,
      });

      setShowCompletionCelebration(true);
      setTimeout(() => {
        setShowCompletionCelebration(false);
        if (isFirstTimeUser && currentModuleId === 'welcome') {
          // Show module selector after welcome
          setShowModuleSelector(true);
          setCurrentModuleId(null);
        } else {
          handleClose();
        }
      }, 2000);
    }
  };

  const handleStartModule = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentStepIndex(0);
    setShowModuleSelector(false);
    saveState({ currentModule: moduleId, currentStep: 0 });
  };

  const handleSkip = () => {
    saveState({ skippedAt: new Date().toISOString() });
    setIsOpen(false);
    onSkip?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentModuleId(null);
    setCurrentStepIndex(0);
    setShowModuleSelector(false);
    onComplete?.();
  };

  const handleRevisitTour = () => {
    setShowModuleSelector(true);
    setIsOpen(true);
  };

  // Reset onboarding (for testing or user request)
  const handleResetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    localStorage.removeItem(FIRST_VISIT_KEY);
    setOnboardingState(defaultOnboardingState);
    setIsFirstTimeUser(true);
    setCurrentModuleId('welcome');
    setCurrentStepIndex(0);
    setShowModuleSelector(false);
    setIsOpen(true);
  };

  // Floating button to revisit tours
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
        <Button
          onClick={handleRevisitTour}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg hover:shadow-xl transition-all duration-200 border-blue-200 hover:border-blue-400"
        >
          <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-blue-700">Tutorials</span>
        </Button>
        {onboardingState.completedModules.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500 px-2">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            {onboardingState.completedModules.length}/{TOUR_MODULES.length} completed
          </div>
        )}
      </div>
    );
  }

  // Module selector view
  if (showModuleSelector && !currentModuleId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Interactive Tutorials</h2>
                <p className="text-blue-100">Choose a tutorial to learn Lift Metric features</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress summary */}
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">{onboardingState.completedModules.length}/{TOUR_MODULES.length} completed</span>
              </div>
              <button
                onClick={handleResetOnboarding}
                className="text-xs text-blue-200 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset progress
              </button>
            </div>
          </div>

          {/* Module list */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-3">
              {/* Basic tutorials */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Getting Started</h3>
                <div className="grid gap-3">
                  {TOUR_MODULES.filter(m => m.category === 'basic').map(module => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isCompleted={onboardingState.completedModules.includes(module.id)}
                      onStart={() => handleStartModule(module.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Advanced tutorials */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Advanced Analysis</h3>
                <div className="grid gap-3">
                  {TOUR_MODULES.filter(m => m.category === 'advanced').map(module => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isCompleted={onboardingState.completedModules.includes(module.id)}
                      onStart={() => handleStartModule(module.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Feature tutorials */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Features & Tools</h3>
                <div className="grid gap-3">
                  {TOUR_MODULES.filter(m => m.category === 'features').map(module => (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      isCompleted={onboardingState.completedModules.includes(module.id)}
                      onStart={() => handleStartModule(module.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-4 flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Skip all tutorials
            </button>
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Completion celebration
  if (showCompletionCelebration) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 text-center animate-bounce-in">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tutorial Complete! 🎉</h2>
          <p className="text-gray-600">You've mastered this section of Lift Metric</p>
        </div>
      </div>
    );
  }

  // Active tour step view
  if (currentModule && currentStep) {
    return (
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 pointer-events-auto"
          onClick={handleClose}
        />

        {/* Tour card */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto w-full max-w-md px-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Module name badge */}
            <div className="px-6 pt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                {currentModule.icon}
                {currentModule.name}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Step icon */}
              {currentStep.icon && (
                <div className="mb-4 flex justify-center">
                  <div className="p-4 bg-gray-50 rounded-full">
                    {currentStep.icon}
                  </div>
                </div>
              )}

              {/* Step counter */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
                <span className="text-xs text-gray-400">{progress}%</span>
              </div>

              {/* Title and description */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {currentStep.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {currentStep.description}
              </p>

              {/* Pro tip */}
              {currentStep.tip && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">{currentStep.tip}</p>
                </div>
              )}

              {/* Interactive hint */}
              {currentStep.interactive && (
                <div className="flex items-center gap-2 text-sm text-blue-600 mb-4">
                  <Play className="w-4 h-4" />
                  <span>Try it out! This step is interactive.</span>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="px-6 pb-6">
              <div className="flex gap-3">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  size="sm"
                  disabled={currentStepIndex === 0}
                  className="flex-shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="sm"
                >
                  {currentStepIndex === totalSteps - 1 ? (
                    <>
                      Complete
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Skip link */}
              <button
                onClick={handleSkip}
                className="text-xs text-gray-400 hover:text-gray-600 mt-3 w-full text-center"
              >
                Skip this tutorial
              </button>
            </div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
          {currentModule.steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStepIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 pointer-events-auto ${
                index === currentStepIndex
                  ? 'bg-white w-6'
                  : index < currentStepIndex
                  ? 'bg-white/80'
                  : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

// Module Card Component
interface ModuleCardProps {
  module: TourModule;
  isCompleted: boolean;
  onStart: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, isCompleted, onStart }) => {
  return (
    <button
      onClick={onStart}
      className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md ${
        isCompleted
          ? 'border-green-200 bg-green-50 hover:border-green-300'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <span className={isCompleted ? 'text-green-600' : 'text-gray-600'}>
              {module.icon}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">{module.name}</h4>
            <span className="text-xs text-gray-500">{module.duration}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400">{module.steps.length} steps</span>
            {isCompleted && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Completed
              </span>
            )}
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isCompleted ? 'text-green-400' : 'text-gray-400'}`} />
      </div>
    </button>
  );
};

export default InteractiveOnboarding;
