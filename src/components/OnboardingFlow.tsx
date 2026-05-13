import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Calculator, History, Save, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEntity } from '../hooks/useEntity';
import type { EntityConfig } from '../hooks/useEntity';

// Entity configuration for onboarding progress
export const onboardingProgressConfig: EntityConfig = {
  name: "OnboardingProgress",
  properties: {
    userId: { type: "string", description: "User ID" },
    currentStep: { type: "integer", description: "Current step index" },
    completedSteps: { type: "string", description: "JSON array of completed step IDs" },
    dismissed: { type: "string", description: "Whether onboarding was dismissed" },
    completed: { type: "string", description: "Whether all steps completed" },
    lastViewedAt: { type: "string", description: "Last time onboarding was viewed" },
  },
  required: ["userId"],
};

type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  icon: any;
  visual: string;
  tips: string[];
  action?: string;
};

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Lift Metric! 🎉',
    description: 'Your powerful ROI calculator and business metrics platform. Let\'s get you started with a quick tour!',
    icon: Calculator,
    visual: '🚀',
    tips: [
      'This tour takes about 2 minutes',
      'You can skip or revisit anytime from settings',
      'Track your progress as we go'
    ],
  },
  {
    id: 'basic-calculator',
    title: 'Basic Calculator Mode',
    description: 'Perform quick calculations with our intuitive basic calculator. Perfect for everyday math operations.',
    icon: Calculator,
    visual: '🧮',
    tips: [
      'Click numbers and operators to build expressions',
      'Use keyboard for faster input',
      'Press Enter or = to calculate results',
      'Clear button resets the calculator'
    ],
    action: 'Try Basic Calculator'
  },
  {
    id: 'scientific-calculator',
    title: 'Scientific Calculator Mode',
    description: 'Access advanced functions like trigonometry, logarithms, and exponentials for complex calculations.',
    icon: TrendingUp,
    visual: '🔬',
    tips: [
      'Switch to Scientific mode from the top menu',
      'Functions include sin, cos, tan, log, ln, and more',
      'Use parentheses for complex expressions',
      'Angle mode: degrees or radians'
    ],
    action: 'Try Scientific Calculator'
  },
  {
    id: 'history',
    title: 'Calculation History',
    description: 'Never lose your work! All calculations are automatically saved and easily accessible.',
    icon: History,
    visual: '📜',
    tips: [
      'View past calculations anytime',
      'Click on any history item to reuse it',
      'Search through your calculation history',
      'Export history for record-keeping'
    ],
    action: 'View History'
  },
  {
    id: 'memory',
    title: 'Memory Functions',
    description: 'Store values temporarily for use across multiple calculations without retyping.',
    icon: Save,
    visual: '💾',
    tips: [
      'M+ adds current value to memory',
      'M- subtracts from memory',
      'MR recalls stored memory value',
      'MC clears memory storage'
    ],
    action: 'Try Memory Functions'
  },
  {
    id: 'roi-calculator',
    title: 'ROI Calculator',
    description: 'Calculate return on investment with detailed breakdowns, projections, and scenario comparisons.',
    icon: TrendingUp,
    visual: '📈',
    tips: [
      'Enter project costs and expected benefits',
      'Compare different hiring models',
      'Generate professional reports',
      'Export results as PDF or Excel'
    ],
    action: 'Start ROI Analysis'
  },
  {
    id: 'dashboard',
    title: 'Your Personalized Dashboard',
    description: 'Access your activity stats, recent calculations, and personalized recommendations.',
    icon: TrendingUp,
    visual: '🎯',
    tips: [
      'View calculation streaks and stats',
      'Quick access to favorite calculations',
      'See activity heatmap over time',
      'Get smart feature suggestions'
    ],
    action: 'Visit Dashboard'
  },
  {
    id: 'complete',
    title: 'You\'re All Set! ✨',
    description: 'You now know the essentials of Lift Metric. Start calculating and exploring more features!',
    icon: Check,
    visual: '🎊',
    tips: [
      'Revisit this tour anytime from Settings',
      'Check out new features as they launch',
      'Join our community for tips and updates',
      'Contact support if you need help'
    ],
    action: 'Start Using Lift Metric'
  }
];

type OnboardingProgress = {
  id: number;
  userId: string;
  currentStep: number;
  completedSteps: string;
  dismissed: string;
  completed: string;
  lastViewedAt: string;
  created_at: string;
  updated_at: string;
};

export default function OnboardingFlow({ onClose }: { onClose: () => void }) {
  const { currentUser } = useAuth();
  const { items: progressRecords, create, update } = useEntity<OnboardingProgress>(onboardingProgressConfig);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [progressId, setProgressId] = useState<number | null>(null);

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1;
  const progressPercent = Math.round((currentStepIndex / (ONBOARDING_STEPS.length - 1)) * 100);

  // Load existing progress
  useEffect(() => {
    if (currentUser && progressRecords.length > 0) {
      const userProgress = progressRecords.find(p => p.userId === currentUser.id.toString());
      if (userProgress) {
        setProgressId(userProgress.id);
        setCurrentStepIndex(userProgress.currentStep || 0);
        try {
          const completed = JSON.parse(userProgress.completedSteps || '[]');
          setCompletedSteps(completed);
        } catch {
          setCompletedSteps([]);
        }
      }
    }
  }, [currentUser, progressRecords]);

  // Initialize progress for new user
  useEffect(() => {
    if (currentUser && progressRecords.length === 0) {
      create({
        userId: currentUser.id.toString(),
        currentStep: 0,
        completedSteps: JSON.stringify([]),
        dismissed: 'false',
        completed: 'false',
        lastViewedAt: new Date().toISOString(),
      });
      // Progress ID will be available after create completes
    }
  }, [currentUser, progressRecords, create]);

  const saveProgress = async (stepIndex: number, completed: string[]) => {
    if (!currentUser || !progressId) return;

    await update(progressId, {
      currentStep: stepIndex,
      completedSteps: JSON.stringify(completed),
      lastViewedAt: new Date().toISOString(),
    });
  };

  const handleNext = () => {
    if (!isLastStep) {
      const newCompleted = [...completedSteps];
      if (!newCompleted.includes(currentStep.id)) {
        newCompleted.push(currentStep.id);
        setCompletedSteps(newCompleted);
      }
      
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      saveProgress(newIndex, newCompleted);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      saveProgress(newIndex, completedSteps);
    }
  };

  const handleSkip = async () => {
    if (!currentUser || !progressId) return;

    await update(progressId, {
      dismissed: 'true',
      lastViewedAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleComplete = async () => {
    if (!currentUser || !progressId) return;

    const allStepIds = ONBOARDING_STEPS.map(s => s.id);
    await update(progressId, {
      completed: 'true',
      completedSteps: JSON.stringify(allStepIds),
      currentStep: ONBOARDING_STEPS.length - 1,
      lastViewedAt: new Date().toISOString(),
    });
    onClose();
  };

  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <Icon className="w-8 h-8" />
            <h2 className="text-2xl font-bold">{currentStep.title}</h2>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-sm mt-2 text-white text-opacity-90">
            Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length} • {progressPercent}% Complete
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Visual Element */}
          <div className="text-center mb-6">
            <div className="text-8xl mb-4 animate-bounce">{currentStep.visual}</div>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-700 mb-6 text-center leading-relaxed">
            {currentStep.description}
          </p>

          {/* Tips */}
          <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">💡</span>
              Pro Tips:
            </h3>
            <ul className="space-y-2">
              {currentStep.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Completed Steps Indicator */}
          {completedSteps.length > 0 && (
            <div className="mt-6 flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              <span>You've completed {completedSteps.length} of {ONBOARDING_STEPS.length} steps</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex items-center justify-between gap-4">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <button
                onClick={handleBack}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              {isLastStep ? (
                <>
                  Complete <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  {currentStep.action || 'Next'} <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="px-6 pb-4 flex justify-center gap-2">
          {ONBOARDING_STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => {
                setCurrentStepIndex(index);
                saveProgress(index, completedSteps);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentStepIndex
                  ? 'bg-blue-600 w-8'
                  : completedSteps.includes(step.id)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
              title={step.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
