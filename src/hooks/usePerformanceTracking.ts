// React hook for performance tracking
import { useEffect, useRef } from 'react';
import { performanceMonitor } from '../lib/performance-monitor';

export function usePerformanceTracking(pageName: string) {
  useEffect(() => {
    performanceMonitor.trackPageLoad(pageName);
  }, [pageName]);
}

export function useInteractionTracking() {
  const trackInteraction = (name: string) => {
    const startTime = performance.now();
    return () => {
      performanceMonitor.trackInteraction(name, startTime);
    };
  };

  return { trackInteraction };
}

export function useRenderTracking(componentName: string) {
  const renderStart = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    performanceMonitor.trackRender(componentName, renderTime);
  });
}

export function useApiTracking() {
  const trackApiCall = async <T,>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      performanceMonitor.trackApiCall(endpoint, startTime, true, 200);
      return result;
    } catch (error: any) {
      performanceMonitor.trackApiCall(endpoint, startTime, false, error.status || 500);
      throw error;
    }
  };

  return { trackApiCall };
}
