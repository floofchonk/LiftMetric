import { useState, useEffect, useCallback } from "react";
import { useEntity } from "./useEntity";
import { onboardingProgressConfig } from "../entities/OnboardingProgress";
import { hasTourBeenCompleted, resetTourState } from "../components/GuidedTour";

type OnboardingProgress = {
  id: number;
  userId: string;
  currentStep: number;
  completedSteps: string;
  skipped: string;
  completed: string;
  settings: string;
  created_at: string;
  updated_at: string;
};

const CALCULATOR_TOUR_ID = 'calculator-tour';

export function useOnboarding(userId: string) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { items: progressItems } = useEntity<OnboardingProgress>(onboardingProgressConfig);

  useEffect(() => {
    if (progressItems.length > 0 || progressItems.length === 0) {
      const userProgress = progressItems.find((p) => p.userId === userId);
      
      if (!userProgress) {
        setShouldShowOnboarding(true);
      } else if (userProgress.completed === "false" && userProgress.skipped === "false") {
        setShouldShowOnboarding(true);
      } else {
        setShouldShowOnboarding(false);
      }
      
      setIsLoading(false);
    }
  }, [progressItems, userId]);

  // Check if the guided calculator tour should show
  useEffect(() => {
    const tourCompleted = hasTourBeenCompleted(CALCULATOR_TOUR_ID);
    setShouldShowTour(!tourCompleted);
  }, []);

  const resetOnboarding = useCallback(() => {
    setShouldShowOnboarding(true);
  }, []);

  const resetGuidedTour = useCallback(() => {
    resetTourState(CALCULATOR_TOUR_ID);
    setShouldShowTour(true);
  }, []);

  const markTourComplete = useCallback(() => {
    setShouldShowTour(false);
  }, []);

  return {
    shouldShowOnboarding,
    shouldShowTour,
    isLoading,
    resetOnboarding,
    resetGuidedTour,
    markTourComplete,
    tourId: CALCULATOR_TOUR_ID,
  };
}
