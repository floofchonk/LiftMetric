import { useCallback, useEffect, useRef } from 'react';
import { useEntity } from './useEntity';
import { analyticsEventEntityConfig } from '../entities/AnalyticsEvent';

type AnalyticsEvent = {
  id: number;
  eventType: string;
  eventName: string;
  category: string;
  userId: string;
  userPlan: string;
  metadata: string;
  value: number;
  sessionId: string;
  created_at: string;
  updated_at: string;
};

let sessionId: string | null = null;
let userId: string | null = null;

// Generate session ID on first load
if (typeof window !== 'undefined' && !sessionId) {
  sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  userId = localStorage.getItem('analytics_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_user_id', userId);
  }
}

export function useAnalytics() {
  const { create } = useEntity<AnalyticsEvent>(analyticsEventEntityConfig);
  const lastPageRef = useRef<string>('');

  const trackEvent = useCallback(async (
    eventName: string,
    category: 'engagement' | 'monetization' | 'conversion' | 'feature_usage',
    metadata?: Record<string, any>,
    value?: number
  ) => {
    try {
      const userPlan = localStorage.getItem('user_plan') || 'free';
      
      await create({
        eventType: 'event',
        eventName,
        category,
        userId: userId || 'anonymous',
        userPlan,
        metadata: metadata ? JSON.stringify(metadata) : '{}',
        value: value || 0,
        sessionId: sessionId || 'unknown',
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, [create]);

  const trackPageView = useCallback(async (pageName: string) => {
    if (lastPageRef.current === pageName) return;
    lastPageRef.current = pageName;
    
    await trackEvent('page_view', 'engagement', { page: pageName });
  }, [trackEvent]);

  const trackFeatureUse = useCallback(async (
    featureName: string,
    isPremium: boolean = false,
    metadata?: Record<string, any>
  ) => {
    await trackEvent('feature_used', 'feature_usage', {
      feature: featureName,
      isPremium,
      ...metadata,
    });
  }, [trackEvent]);

  const trackUpgradePrompt = useCallback(async (
    action: 'shown' | 'clicked' | 'dismissed',
    promptType: string,
    metadata?: Record<string, any>
  ) => {
    await trackEvent(`upgrade_prompt_${action}`, 'monetization', {
      promptType,
      ...metadata,
    });
  }, [trackEvent]);

  const trackConversion = useCallback(async (
    conversionType: string,
    fromPlan: string,
    toPlan: string,
    value?: number
  ) => {
    await trackEvent('conversion', 'conversion', {
      conversionType,
      fromPlan,
      toPlan,
    }, value);
  }, [trackEvent]);

  const trackCalculation = useCallback(async (
    calculationType: string,
    metadata?: Record<string, any>
  ) => {
    await trackEvent('calculation_performed', 'engagement', {
      calculationType,
      ...metadata,
    });
  }, [trackEvent]);

  const trackScenarioAction = useCallback(async (
    action: 'saved' | 'loaded' | 'compared' | 'deleted',
    metadata?: Record<string, any>
  ) => {
    await trackEvent(`scenario_${action}`, 'feature_usage', metadata);
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackFeatureUse,
    trackUpgradePrompt,
    trackConversion,
    trackCalculation,
    trackScenarioAction,
  };
}
