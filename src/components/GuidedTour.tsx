import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Target, BarChart3, Calculator, Lightbulb, CheckCircle2, SkipForward } from 'lucide-react';

export interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

interface GuidedTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
  tourId?: string;
}

const TOUR_STORAGE_KEY = 'lift-metric-guided-tour';

function getTourState(tourId: string): { completed: boolean; skipped: boolean; lastStep: number } {
  try {
    const stored = localStorage.getItem(`${TOUR_STORAGE_KEY}-${tourId}`);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { completed: false, skipped: false, lastStep: 0 };
}

function saveTourState(tourId: string, state: { completed: boolean; skipped: boolean; lastStep: number }) {
  try {
    localStorage.setItem(`${TOUR_STORAGE_KEY}-${tourId}`, JSON.stringify(state));
  } catch {}
}

export function resetTourState(tourId: string) {
  try {
    localStorage.removeItem(`${TOUR_STORAGE_KEY}-${tourId}`);
  } catch {}
}

export function hasTourBeenCompleted(tourId: string): boolean {
  const state = getTourState(tourId);
  return state.completed || state.skipped;
}

export function GuidedTour({ steps, isOpen, onComplete, onSkip, tourId = 'calculator-tour' }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0, arrowDir: 'top' as string });
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  const positionTooltip = useCallback(() => {
    if (!step) return;
    const target = document.querySelector(step.targetSelector);
    if (!target) {
      // If target not found, position in center
      setTargetRect(null);
      setTooltipPos({
        top: window.innerHeight / 2 - 120,
        left: window.innerWidth / 2 - 200,
        arrowDir: 'none',
      });
      return;
    }

    const rect = target.getBoundingClientRect();
    setTargetRect(rect);

    const tooltipWidth = 380;
    const tooltipHeight = 260;
    const gap = 16;
    const viewportPadding = 16;

    let top = 0;
    let left = 0;
    let arrowDir = step.position;

    switch (step.position) {
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        arrowDir = 'top';
        break;
      case 'top':
        top = rect.top - tooltipHeight - gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        arrowDir = 'bottom';
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + gap;
        arrowDir = 'left';
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - gap;
        arrowDir = 'right';
        break;
    }

    // Clamp within viewport
    if (left < viewportPadding) left = viewportPadding;
    if (left + tooltipWidth > window.innerWidth - viewportPadding) {
      left = window.innerWidth - tooltipWidth - viewportPadding;
    }
    if (top < viewportPadding) {
      top = rect.bottom + gap;
      arrowDir = 'top';
    }
    if (top + tooltipHeight > window.innerHeight - viewportPadding) {
      top = rect.top - tooltipHeight - gap;
      arrowDir = 'bottom';
    }

    setTooltipPos({ top, left, arrowDir });
  }, [step]);

  // Scroll target into view and position tooltip
  useEffect(() => {
    if (!isOpen || !step) return;

    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);

    const target = document.querySelector(step.targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Wait for scroll to finish
      setTimeout(positionTooltip, 400);
    } else {
      positionTooltip();
    }

    // Observe resize
    if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    resizeObserverRef.current = new ResizeObserver(positionTooltip);
    if (target) resizeObserverRef.current.observe(target);

    window.addEventListener('resize', positionTooltip);
    window.addEventListener('scroll', positionTooltip, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', positionTooltip);
      window.removeEventListener('scroll', positionTooltip, true);
      resizeObserverRef.current?.disconnect();
    };
  }, [isOpen, currentStep, step, positionTooltip]);

  // Save progress on step change
  useEffect(() => {
    if (isOpen) {
      saveTourState(tourId, { completed: false, skipped: false, lastStep: currentStep });
    }
  }, [currentStep, isOpen, tourId]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    setShowConfetti(true);
    saveTourState(tourId, { completed: true, skipped: false, lastStep: steps.length - 1 });
    setTimeout(() => {
      setShowConfetti(false);
      onComplete();
    }, 2000);
  };

  const handleSkip = () => {
    saveTourState(tourId, { completed: false, skipped: true, lastStep: currentStep });
    onSkip();
  };

  const handleGoToStep = (index: number) => {
    setCurrentStep(index);
  };

  if (!isOpen || !step) return null;

  // Completion celebration
  if (showConfetti) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Tour Complete! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You are now ready to make data-driven staffing decisions with Lift Metric.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['📊 ROI Analysis', '👥 Staffing Models', '📈 Visualizations'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        {/* Dark backdrop with cutout for target */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
          <defs>
            <mask id="tour-spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect
                  x={targetRect.left - 8}
                  y={targetRect.top - 8}
                  width={targetRect.width + 16}
                  height={targetRect.height + 16}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.55)"
            mask="url(#tour-spotlight-mask)"
          />
        </svg>

        {/* Spotlight ring around target */}
        {targetRect && (
          <div
            className="absolute border-2 border-blue-400 rounded-xl pointer-events-none transition-all duration-300"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
              boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.15)',
            }}
          />
        )}

        {/* Pulsing ring */}
        {targetRect && (
          <div
            className="absolute rounded-xl pointer-events-none animate-ping"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
              border: '2px solid rgba(59, 130, 246, 0.4)',
              animationDuration: '2s',
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed z-[9999] transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          width: 380,
          pointerEvents: 'auto',
        }}
      >
        {/* Arrow */}
        {tooltipPos.arrowDir !== 'none' && (
          <div
            className={`absolute w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 ${
              tooltipPos.arrowDir === 'top'
                ? '-top-2 left-1/2 -translate-x-1/2'
                : tooltipPos.arrowDir === 'bottom'
                ? '-bottom-2 left-1/2 -translate-x-1/2'
                : tooltipPos.arrowDir === 'left'
                ? '-left-2 top-1/2 -translate-y-1/2'
                : '-right-2 top-1/2 -translate-y-1/2'
            }`}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
          />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-gray-100 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Header */}
          <div className="px-5 pt-4 pb-2 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Step {currentStep + 1} of {steps.length}
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  {step.title}
                </h3>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Close tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 pb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Step dots */}
          <div className="px-5 pb-3 flex items-center justify-center gap-1.5">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleGoToStep(index)}
                className={`transition-all duration-200 rounded-full ${
                  index === currentStep
                    ? 'w-6 h-2 bg-blue-600'
                    : index < currentStep
                    ? 'w-2 h-2 bg-blue-400 hover:bg-blue-500'
                    : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
                title={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 pb-4 flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Skip tour
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isLastStep ? (
                  <>
                    Finish
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Pre-defined tour steps for the Calculator workflow
export const calculatorTourSteps: TourStep[] = [
  {
    id: 'welcome',
    targetSelector: '[data-tour="page-header"]',
    title: 'Welcome to Lift Metric',
    description: 'This is your ROI & Staffing Calculator. We will walk you through the key areas so you can start making data-driven decisions right away.',
    icon: <Sparkles className="w-5 h-5" />,
    position: 'bottom',
  },
  {
    id: 'calculator-nav',
    targetSelector: '[data-tour="calculator-nav"]',
    title: 'Navigation Tabs',
    description: 'Use these tabs to switch between the Calculator, your saved Scenarios, the Comparison view, Export options, and Branding customization.',
    icon: <Target className="w-5 h-5" />,
    position: 'bottom',
  },
  {
    id: 'create-scenario',
    targetSelector: '[data-tour="create-scenario"]',
    title: 'Create a Scenario',
    description: 'Start by creating a new scenario. Give it a name like "Aggressive Growth" or "Baseline" and configure your project parameters, team roles, and cost models.',
    icon: <Calculator className="w-5 h-5" />,
    position: 'bottom',
  },
  {
    id: 'staffing-calculator',
    targetSelector: '[data-tour="staffing-calculator"]',
    title: 'Enter Your Stats',
    description: 'This is where you input your project details — company size, industry, scope, annual volume, and current spend. These inputs drive the ROI calculation engine.',
    icon: <Calculator className="w-5 h-5" />,
    position: 'top',
  },
  {
    id: 'visualization-section',
    targetSelector: '[data-tour="visualization-toggle"]',
    title: 'Visualize Your History',
    description: 'Expand this section to see interactive charts of your past calculations. Track trends in ROI, costs, and savings over time with selectable data points.',
    icon: <BarChart3 className="w-5 h-5" />,
    position: 'bottom',
  },
  {
    id: 'comparison-tool',
    targetSelector: '[data-tour="comparison-toggle"]',
    title: 'Compare Scenarios',
    description: 'Open the Scenario Comparison Tool to view multiple scenarios side-by-side. Key differences in net profit, ROI, and payback period are highlighted automatically.',
    icon: <Lightbulb className="w-5 h-5" />,
    position: 'bottom',
  },
  {
    id: 'saved-scenarios',
    targetSelector: '[data-tour="saved-scenarios"]',
    title: 'Your Saved Scenarios',
    description: 'All your scenarios appear here. Click to load one, check the box to select it for comparison, or duplicate it to create variations without losing your work.',
    icon: <Target className="w-5 h-5" />,
    position: 'right',
  },
  {
    id: 'results-area',
    targetSelector: '[data-tour="results-area"]',
    title: 'Results & Analysis',
    description: 'After running a calculation, your results appear here with detailed breakdowns — staffing options, cost comparisons, ROI metrics, and actionable recommendations.',
    icon: <BarChart3 className="w-5 h-5" />,
    position: 'top',
  },
];

// Tour trigger button component
export function TourTriggerButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 hover:shadow-md ${className || ''}`}
    >
      <Sparkles className="w-4 h-4" />
      Take Guided Tour
    </button>
  );
}
