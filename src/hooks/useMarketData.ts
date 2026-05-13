import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  MarketRate,
  MarketDataState,
  RateOverride,
  UserRatePreferences,
  ScenarioRateSnapshot,
} from '../types/market-data';
import {
  DEFAULT_MARKET_RATES,
  DEFAULT_USER_RATE_PREFERENCES,
} from '../types/market-data';

const STORAGE_KEY_RATES = 'lift-metric-market-rates';
const STORAGE_KEY_PREFS = 'lift-metric-rate-preferences';
const STORAGE_KEY_CACHE = 'lift-metric-rate-cache';
const STALE_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

// Simulated live data fetcher with realistic variance
function simulateLiveRates(baseRates: MarketRate[]): MarketRate[] {
  return baseRates.map(rate => {
    // Small random variance to simulate live updates (-0.15 to +0.15)
    const variance = (Math.random() - 0.5) * 0.3;
    const newValue = Math.max(0.01, parseFloat((rate.value + variance).toFixed(2)));
    const changePct = rate.value !== 0 ? ((newValue - rate.value) / rate.value) * 100 : 0;

    return {
      ...rate,
      previousValue: rate.value,
      value: newValue,
      changePercent: parseFloat(changePct.toFixed(2)),
      lastUpdated: new Date().toISOString(),
    };
  });
}

export function useMarketData() {
  const defaultRates = DEFAULT_MARKET_RATES;
  const defaultPrefs = DEFAULT_USER_RATE_PREFERENCES;

  const [state, setState] = useState<MarketDataState>(() => {
    const cached = loadFromStorage<{ rates: MarketRate[]; lastFetched: string } | null>(STORAGE_KEY_CACHE, null);
    if (cached && cached.rates.length > 0) {
      const isStale = Date.now() - new Date(cached.lastFetched).getTime() > STALE_THRESHOLD_MS;
      return {
        rates: cached.rates,
        lastFetched: cached.lastFetched,
        isLoading: false,
        error: null,
        isStale,
        source: isStale ? 'cached' : 'live',
      };
    }
    return {
      rates: defaultRates,
      lastFetched: null,
      isLoading: false,
      error: null,
      isStale: true,
      source: 'fallback' as const,
    };
  });

  const [preferences, setPreferences] = useState<UserRatePreferences>(() =>
    loadFromStorage(STORAGE_KEY_PREFS, defaultPrefs)
  );

  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Save preferences when they change
  useEffect(() => {
    saveToStorage(STORAGE_KEY_PREFS, preferences);
  }, [preferences]);

  // Save cache when rates change
  useEffect(() => {
    if (state.lastFetched) {
      saveToStorage(STORAGE_KEY_CACHE, { rates: state.rates, lastFetched: state.lastFetched });
    }
  }, [state.rates, state.lastFetched]);

  const fetchRates = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call with network delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

      // Simulate occasional API failure (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('Market data API temporarily unavailable');
      }

      const newRates = simulateLiveRates(state.rates.length > 0 ? state.rates : defaultRates);
      const now = new Date().toISOString();

      setState({
        rates: newRates,
        lastFetched: now,
        isLoading: false,
        error: null,
        isStale: false,
        source: 'live',
      });

      return newRates;
    } catch (err: any) {
      // Fall back to cached/default data
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to fetch market data',
        isStale: true,
        source: prev.lastFetched ? 'cached' : 'fallback',
      }));
      return null;
    }
  }, [state.rates, defaultRates]);

  // Auto-refresh based on user preference
  useEffect(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    if (preferences.useLiveRates && preferences.refreshIntervalMinutes > 0) {
      refreshTimerRef.current = setInterval(
        fetchRates,
        preferences.refreshIntervalMinutes * 60 * 1000
      );
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [preferences.useLiveRates, preferences.refreshIntervalMinutes, fetchRates]);

  // Get effective rate (considering overrides)
  const getEffectiveRate = useCallback(
    (rateId: string): number => {
      if (!preferences.useLiveRates) {
        const override = preferences.overrides.find(o => o.rateId === rateId);
        if (override) return override.manualValue;
      } else {
        const override = preferences.overrides.find(o => o.rateId === rateId);
        if (override) return override.manualValue;
      }
      const rate = state.rates.find(r => r.id === rateId);
      return rate?.value ?? 0;
    },
    [state.rates, preferences]
  );

  // Set a manual override
  const setOverride = useCallback(
    (rateId: string, value: number, reason?: string) => {
      setPreferences(prev => {
        const existing = prev.overrides.filter(o => o.rateId !== rateId);
        return {
          ...prev,
          overrides: [
            ...existing,
            { rateId, manualValue: value, reason, setAt: new Date().toISOString() },
          ],
        };
      });
    },
    []
  );

  // Remove an override
  const removeOverride = useCallback((rateId: string) => {
    setPreferences(prev => ({
      ...prev,
      overrides: prev.overrides.filter(o => o.rateId !== rateId),
    }));
  }, []);

  // Toggle live vs manual mode
  const toggleLiveRates = useCallback((enabled: boolean) => {
    setPreferences(prev => ({ ...prev, useLiveRates: enabled }));
  }, []);

  // Update auto-refresh interval
  const setRefreshInterval = useCallback((minutes: number) => {
    setPreferences(prev => ({ ...prev, refreshIntervalMinutes: minutes }));
  }, []);

  // Toggle auto-update scenarios
  const toggleAutoUpdateScenarios = useCallback((enabled: boolean) => {
    setPreferences(prev => ({ ...prev, autoUpdateScenarios: enabled }));
  }, []);

  // Check if a scenario's rates are outdated
  const checkScenarioRates = useCallback(
    (scenarioId: string, scenarioName: string, ratesAtCreation: { rateId: string; value: number }[]): ScenarioRateSnapshot => {
      const outdatedRates = ratesAtCreation
        .map(snap => {
          const current = state.rates.find(r => r.id === snap.rateId);
          if (!current) return null;
          const changePct = snap.value !== 0 ? ((current.value - snap.value) / snap.value) * 100 : 0;
          if (Math.abs(changePct) > 0.5) {
            return {
              rateId: snap.rateId,
              oldValue: snap.value,
              newValue: current.value,
              changePct: parseFloat(changePct.toFixed(2)),
            };
          }
          return null;
        })
        .filter(Boolean) as ScenarioRateSnapshot['outdatedRates'];

      return {
        scenarioId,
        scenarioName,
        ratesAtCreation,
        createdAt: new Date().toISOString(),
        isOutdated: outdatedRates.length > 0,
        outdatedRates,
      };
    },
    [state.rates]
  );

  // Get current rate snapshot for saving with a scenario
  const getCurrentRateSnapshot = useCallback((): { rateId: string; value: number }[] => {
    return state.rates.map(r => ({
      rateId: r.id,
      value: getEffectiveRate(r.id),
    }));
  }, [state.rates, getEffectiveRate]);

  return {
    // State
    rates: state.rates,
    lastFetched: state.lastFetched,
    isLoading: state.isLoading,
    error: state.error,
    isStale: state.isStale,
    source: state.source,
    preferences,

    // Actions
    fetchRates,
    getEffectiveRate,
    setOverride,
    removeOverride,
    toggleLiveRates,
    setRefreshInterval,
    toggleAutoUpdateScenarios,
    checkScenarioRates,
    getCurrentRateSnapshot,
  };
}
