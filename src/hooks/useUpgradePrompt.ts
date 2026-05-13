import { useState, useCallback } from 'react';
import { premiumFeatures, isFeatureAvailable } from '../data/premiumFeatures';

interface UseUpgradePromptReturn {
  showUpgradePrompt: (featureId: string) => void;
  isPromptOpen: boolean;
  currentFeature: typeof premiumFeatures[string] | null;
  closePrompt: () => void;
  checkFeatureAccess: (featureId: string) => boolean;
}

export const useUpgradePrompt = (userPlan: 'Free' | 'Basic' | 'Pro' | 'Enterprise' = 'Free'): UseUpgradePromptReturn => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<typeof premiumFeatures[string] | null>(null);

  const showUpgradePrompt = useCallback((featureId: string) => {
    const feature = premiumFeatures[featureId];
    if (feature && !isFeatureAvailable(featureId, userPlan)) {
      setCurrentFeature(feature);
      setIsPromptOpen(true);
    }
  }, [userPlan]);

  const closePrompt = useCallback(() => {
    setIsPromptOpen(false);
    setTimeout(() => setCurrentFeature(null), 300); // Delay to allow exit animation
  }, []);

  const checkFeatureAccess = useCallback((featureId: string): boolean => {
    return isFeatureAvailable(featureId, userPlan);
  }, [userPlan]);

  return {
    showUpgradePrompt,
    isPromptOpen,
    currentFeature,
    closePrompt,
    checkFeatureAccess
  };
};
